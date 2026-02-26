'use client'

import { memo, useState } from 'react'
import type { ReactNode } from 'react'

export interface TreeNode {
  /**
   * Node label/name
   */
  label: string | ReactNode
  /**
   * Child nodes
   */
  children?: TreeNode[]
  /**
   * Optional icon or prefix
   */
  icon?: string
  /**
   * Node styling
   */
  style?: 'normal' | 'success' | 'error' | 'info' | 'warning'
  /**
   * Whether node is expanded by default
   */
  expanded?: boolean
}

export interface TerminalTreeProps {
  /**
   * Root nodes to display
   */
  nodes: TreeNode[]
  /**
   * Whether nodes are expandable (default: true)
   */
  expandable?: boolean
  /**
   * Tree line characters
   */
  lines?: {
    vertical?: string
    horizontal?: string
    corner?: string
    tee?: string
  }
}

const DEFAULT_LINES = {
  vertical: '│',
  horizontal: '─',
  corner: '└',
  tee: '├',
}

/** A single entry in the flattened visible-node list. */
interface VisibleNode {
  node: TreeNode
  /** Stable path-based ID — e.g. "root-0-child-1-child-2" */
  nodeId: string
  depth: number
  isLast: boolean
  hasChildren: boolean
  isExpanded: boolean
  /** Ancestor "is-last" flags, used to draw vertical continuations per depth */
  ancestorIsLast: boolean[]
}

/**
 * Builds the flat list of nodes that should currently be mounted in the DOM.
 * Nodes whose parent is collapsed are excluded entirely — they are not just hidden.
 *
 * @param nodes - Root node array to flatten
 * @param expanded - Set of currently expanded node IDs
 * @param parentId - ID prefix for the current level
 * @param depth - Current nesting depth (0 = root)
 * @param ancestorIsLast - Stack of isLast flags from parent levels for line drawing
 */
function buildVisibleNodes(
  nodes: TreeNode[],
  expanded: Set<string>,
  parentId = '',
  depth = 0,
  ancestorIsLast: boolean[] = [],
): VisibleNode[] {
  const result: VisibleNode[] = []

  nodes.forEach((node, idx) => {
    const nodeId = parentId ? `${parentId}-child-${idx}` : `root-${idx}`
    const isLast = idx === nodes.length - 1
    const hasChildren = !!(node.children && node.children.length > 0)
    const isExpanded = expanded.has(nodeId)

    result.push({ node, nodeId, depth, isLast, hasChildren, isExpanded, ancestorIsLast })

    // Only recurse — and mount children — when expanded
    if (hasChildren && isExpanded) {
      result.push(
        ...buildVisibleNodes(
          node.children!,
          expanded,
          nodeId,
          depth + 1,
          [...ancestorIsLast, isLast],
        ),
      )
    }
  })

  return result
}

/** Builds the initial expanded Set using stable path-based IDs. */
function buildInitialExpanded(nodes: TreeNode[], parentId = ''): Set<string> {
  const set = new Set<string>()
  nodes.forEach((node, idx) => {
    const nodeId = parentId ? `${parentId}-child-${idx}` : `root-${idx}`
    if (node.expanded) set.add(nodeId)
    if (node.children?.length) {
      buildInitialExpanded(node.children, nodeId).forEach((id) => set.add(id))
    }
  })
  return set
}

const NODE_STYLE_MAP: Record<string, string> = {
  success: 'text-[var(--term-green)]',
  error: 'text-[var(--term-red)]',
  info: 'text-[var(--term-blue)]',
  warning: 'text-[var(--term-yellow)]',
}

interface TreeRowProps {
  entry: VisibleNode
  expandable: boolean
  lines: typeof DEFAULT_LINES
  onToggle: (id: string) => void
}

/** Renders a single visible tree row. Memoised to prevent unnecessary re-renders. */
const TreeRow = memo(function TreeRow({ entry, expandable, lines: l, onToggle }: TreeRowProps) {
  const { node, nodeId, depth, isLast, hasChildren, isExpanded, ancestorIsLast } = entry
  const colorClass = NODE_STYLE_MAP[node.style ?? ''] ?? 'text-[var(--term-fg)]'

  return (
    <div
      role="treeitem"
      aria-expanded={hasChildren && expandable ? isExpanded : undefined}
      aria-level={depth + 1}
      className={`flex items-center gap-1 font-mono text-sm ${colorClass}`}
    >
      {/* Vertical continuation lines from ancestor levels */}
      {ancestorIsLast.map((ancIsLast, i) => (
        <span key={i} className="text-[var(--term-fg-dim)] w-4 shrink-0 select-none">
          {ancIsLast ? ' ' : l.vertical}
        </span>
      ))}

      {/* Connector for current level */}
      <span className="text-[var(--term-fg-dim)] w-8 shrink-0 select-none">
        {depth > 0 && (isLast ? l.corner : l.tee)}
        {l.horizontal.repeat(2)}
      </span>

      {/* Expand / collapse toggle or spacer */}
      {hasChildren && expandable ? (
        <button
          onClick={() => onToggle(nodeId)}
          className="text-[var(--term-blue)] hover:text-[var(--term-cyan)] cursor-pointer w-4 shrink-0"
          aria-label={isExpanded ? 'Collapse node' : 'Expand node'}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      ) : (
        <span className="w-4 shrink-0" />
      )}

      {node.icon && <span className="w-4 shrink-0">{node.icon}</span>}
      <span>{node.label}</span>
    </div>
  )
})

/**
 * Displays hierarchical data as a tree structure with expandable nodes.
 * Renders directory-like structures or nested data using Unicode box-drawing characters
 * with interactive expand/collapse functionality.
 *
 * Only visible nodes are mounted in the DOM — collapsed branches are not rendered at all,
 * making this efficient for large or deeply nested trees.
 *
 * Uses stable path-based node IDs (e.g. `root-0-child-1`) so that initial expansion state
 * from `node.expanded` is always applied correctly.
 *
 * @param nodes - Array of root tree nodes with optional children
 * @param expandable - Whether nodes can be expanded/collapsed (default: true)
 * @param lines - Custom tree line characters
 *
 * @example
 * ```tsx
 * <TerminalTree
 *   nodes={[
 *     {
 *       label: 'src/',
 *       icon: '📁',
 *       expanded: true,
 *       children: [
 *         { label: 'components/', icon: '📁', children: [
 *           { label: 'Button.tsx', icon: '📄' }
 *         ]},
 *         { label: 'utils.ts', icon: '📄' }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */
export function TerminalTree({
  nodes,
  expandable = true,
  lines = DEFAULT_LINES,
}: TerminalTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    () => buildInitialExpanded(nodes),
  )

  const l = { ...DEFAULT_LINES, ...lines }

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const visibleNodes = buildVisibleNodes(nodes, expandedNodes)

  return (
    <div role="tree" className="space-y-0 font-mono text-sm text-[var(--term-fg)]">
      {visibleNodes.map((entry) => (
        <TreeRow
          key={entry.nodeId}
          entry={entry}
          expandable={expandable}
          lines={l}
          onToggle={toggleNode}
        />
      ))}
    </div>
  )
}
