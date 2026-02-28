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

/**
 * Context passed to TerminalTree render-prop callbacks.
 * Provides all metadata needed to render or customise a single tree row.
 */
export interface TreeRenderContext {
  /** The tree node data */
  node: TreeNode
  /** Stable path-based ID for this node (e.g. "root-0-child-1") */
  nodeId: string
  /** Nesting depth — 0 is root */
  depth: number
  /** True if this node is the last sibling in its parent */
  isLast: boolean
  /** True if this node has any children */
  hasChildren: boolean
  /** True if this node is currently expanded */
  isExpanded: boolean
  /** Whether the tree allows expand/collapse globally */
  expandable: boolean
  /** Passthrough of node.icon */
  icon: string | undefined
  /** Passthrough of node.style */
  style: TreeNode['style']
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
  /**
   * Custom icon renderer per node.
   * Return a ReactNode to override, or undefined/null to fall back to node.icon.
   * @param ctx - Render context for this node
   */
  renderIcon?: (ctx: TreeRenderContext) => ReactNode
  /**
   * Custom label renderer per node.
   * Return a ReactNode to override, or undefined/null to fall back to node.label.
   * @param ctx - Render context for this node
   */
  renderLabel?: (ctx: TreeRenderContext) => ReactNode
  /**
   * Full row content override — replaces the default expand-button + icon + label.
   * The structural tree connector is always rendered before this.
   * When provided, renderIcon and renderLabel are ignored for this node.
   * @param ctx - Render context for this node
   */
  renderRow?: (ctx: TreeRenderContext) => ReactNode
  /**
   * Callback fired when a node is expanded or collapsed.
   * @param nodeId - Stable path-based ID of the toggled node
   * @param expanded - New expansion state (true = now expanded)
   */
  onToggle?: (nodeId: string, expanded: boolean) => void
}

const DEFAULT_LINES = {
  vertical: '│',
  horizontal: '─',
  corner: '└',
  tee: '├',
}

// ─── Visible-only rendering pipeline ────────────────────────────

/** A single entry in the flattened visible-node list. */
interface VisibleNode {
  node: TreeNode
  nodeId: string
  depth: number
  isLast: boolean
  hasChildren: boolean
  isExpanded: boolean
  ancestorIsLast: boolean[]
}

/**
 * Builds the flat list of nodes that should currently be mounted in the DOM.
 * Nodes whose parent is collapsed are excluded entirely — not just hidden.
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

// ─── Memoized TreeRow ───────────────────────────────────────────

interface TreeRowProps {
  entry: VisibleNode
  expandable: boolean
  lines: typeof DEFAULT_LINES
  onToggle: (id: string) => void
  renderIcon?: (ctx: TreeRenderContext) => ReactNode
  renderLabel?: (ctx: TreeRenderContext) => ReactNode
  renderRow?: (ctx: TreeRenderContext) => ReactNode
}

const TreeRow = memo(function TreeRow({
  entry,
  expandable,
  lines: l,
  onToggle,
  renderIcon: renderIconProp,
  renderLabel: renderLabelProp,
  renderRow: renderRowProp,
}: TreeRowProps) {
  const { node, nodeId, depth, isLast, hasChildren, isExpanded, ancestorIsLast } = entry
  const colorClass = NODE_STYLE_MAP[node.style ?? ''] ?? 'text-[var(--term-fg)]'

  const ctx: TreeRenderContext = {
    node, nodeId, depth, isLast, hasChildren, isExpanded, expandable,
    icon: node.icon,
    style: node.style,
  }

  const rowContent = renderRowProp
    ? renderRowProp(ctx)
    : (
      <>
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
        {renderIconProp
          ? renderIconProp(ctx)
          : node.icon && <span className="w-4 shrink-0">{node.icon}</span>}
        {renderLabelProp ? renderLabelProp(ctx) : <span>{node.label}</span>}
      </>
    )

  return (
    <div
      role="treeitem"
      aria-expanded={hasChildren && expandable ? isExpanded : undefined}
      aria-level={depth + 1}
      className={`flex items-center gap-1 font-mono text-sm ${colorClass}`}
    >
      {ancestorIsLast.map((ancIsLast, i) => (
        <span key={i} className="text-[var(--term-fg-dim)] w-4 shrink-0 select-none">
          {ancIsLast ? ' ' : l.vertical}
        </span>
      ))}

      <span className="text-[var(--term-fg-dim)] w-8 shrink-0 select-none">
        {depth > 0 && (isLast ? l.corner : l.tee)}
        {l.horizontal.repeat(2)}
      </span>

      {rowContent}
    </div>
  )
})

// ─── TerminalTree ───────────────────────────────────────────────

/**
 * Displays hierarchical data as a tree with expandable nodes.
 *
 * Only visible nodes are mounted in the DOM — collapsed branches are not rendered,
 * making this efficient for large or deeply nested trees.
 *
 * Supports render-prop callbacks for custom icons, labels, and full row overrides,
 * while remaining backward compatible with node.icon / node.label.
 */
export function TerminalTree({
  nodes,
  expandable = true,
  lines = DEFAULT_LINES,
  renderIcon,
  renderLabel,
  renderRow,
  onToggle,
}: TerminalTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    () => buildInitialExpanded(nodes),
  )

  const l = { ...DEFAULT_LINES, ...lines }

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      const willExpand = !next.has(nodeId)
      if (willExpand) {
        next.add(nodeId)
      } else {
        next.delete(nodeId)
      }
      onToggle?.(nodeId, willExpand)
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
          renderIcon={renderIcon}
          renderLabel={renderLabel}
          renderRow={renderRow}
        />
      ))}
    </div>
  )
}
