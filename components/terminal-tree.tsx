'use client'

import { ReactNode, useState } from 'react'

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
   * @example
   * ```tsx
   * renderIcon={({ hasChildren }) => hasChildren ? '📂' : '📄'}
   * ```
   */
  renderIcon?: (ctx: TreeRenderContext) => ReactNode
  /**
   * Custom label renderer per node.
   * Return a ReactNode to override, or undefined/null to fall back to node.label.
   * @param ctx - Render context for this node
   * @example
   * ```tsx
   * renderLabel={({ node, depth }) => (
   *   <span style={{ fontWeight: depth === 0 ? 'bold' : 'normal' }}>{node.label}</span>
   * )}
   * ```
   */
  renderLabel?: (ctx: TreeRenderContext) => ReactNode
  /**
   * Full row content override — replaces the default expand-button + icon + label.
   * The structural tree connector (└── / ├──) is always rendered before this.
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

/**
 * Displays hierarchical data as a tree structure with expandable nodes.
 * Renders directory-like structures or nested data using Unicode box-drawing characters
 * with interactive expand/collapse functionality.
 *
 * Supports render-prop callbacks for custom icons, labels, and full row overrides,
 * while remaining fully backward compatible with the existing node.icon / node.label API.
 *
 * @param nodes - Array of root tree nodes with optional children
 * @param expandable - Whether nodes can be expanded/collapsed (default: true)
 * @param lines - Custom tree line characters
 * @param renderIcon - Custom icon renderer; falls back to node.icon
 * @param renderLabel - Custom label renderer; falls back to node.label
 * @param renderRow - Full row content override; skips renderIcon/renderLabel
 * @param onToggle - Callback fired when a node is toggled
 *
 * @example
 * ```tsx
 * // Default usage — icon and label on each node
 * <TerminalTree
 *   nodes={[
 *     { label: 'src/', icon: '📁', children: [
 *       { label: 'index.ts', icon: '📄' }
 *     ]}
 *   ]}
 * />
 *
 * // Custom icon per node type
 * <TerminalTree
 *   nodes={fileNodes}
 *   renderIcon={({ hasChildren, isExpanded }) =>
 *     hasChildren ? (isExpanded ? '📂' : '📁') : '📄'
 *   }
 * />
 *
 * // Custom label formatting
 * <TerminalTree
 *   nodes={depNodes}
 *   renderLabel={({ node, depth }) => (
 *     <span className={depth === 0 ? 'font-bold' : ''}>
 *       {node.label}
 *     </span>
 *   )}
 * />
 * ```
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
  // Build initial expanded set using stable path-based IDs
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    function collect(node: TreeNode, id: string) {
      if (node.expanded) initial.add(id)
      node.children?.forEach((child, i) => collect(child, `${id}-child-${i}`))
    }
    nodes.forEach((node, i) => collect(node, `root-${i}`))
    return initial
  })

  const l = { ...DEFAULT_LINES, ...lines }

  const getNodeStyle = (style?: string) => {
    switch (style) {
      case 'success': return 'text-[var(--term-green)]'
      case 'error': return 'text-[var(--term-red)]'
      case 'info': return 'text-[var(--term-blue)]'
      case 'warning': return 'text-[var(--term-yellow)]'
      default: return 'text-[var(--term-fg)]'
    }
  }

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    const willExpand = !newExpanded.has(nodeId)
    if (willExpand) {
      newExpanded.add(nodeId)
    } else {
      newExpanded.delete(nodeId)
    }
    setExpandedNodes(newExpanded)
    onToggle?.(nodeId, willExpand)
  }

  const renderNodeRow = (node: TreeNode, nodeId: string, depth: number, isLast: boolean) => {
    const hasChildren = !!(node.children && node.children.length > 0)
    const isExpanded = expandedNodes.has(nodeId)

    const ctx: TreeRenderContext = {
      node,
      nodeId,
      depth,
      isLast,
      hasChildren,
      isExpanded,
      expandable,
      icon: node.icon,
      style: node.style,
    }

    const defaultIcon = node.icon ? <span className="w-4">{node.icon}</span> : null
    const defaultLabel = <span>{node.label}</span>

    const rowContent = renderRow
      ? renderRow(ctx)
      : (
        <>
          {/* Expand/collapse toggle or spacer */}
          {hasChildren && expandable ? (
            <button
              onClick={() => toggleNode(nodeId)}
              className="text-[var(--term-blue)] hover:text-[var(--term-cyan)] cursor-pointer w-4"
              aria-label={isExpanded ? 'Collapse node' : 'Expand node'}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          ) : (
            <span className="w-4" />
          )}
          {/* Icon — render-prop takes priority over node.icon */}
          {renderIcon ? renderIcon(ctx) : defaultIcon}
          {/* Label — render-prop takes priority over node.label */}
          {renderLabel ? renderLabel(ctx) : defaultLabel}
        </>
      )

    return (
      <div key={nodeId}>
        <div
          role="treeitem"
          aria-expanded={hasChildren && expandable ? isExpanded : undefined}
          className={`flex items-center gap-1 font-mono text-sm ${getNodeStyle(node.style)}`}
        >
          {/* Structural tree connector — always rendered */}
          <span className="text-[var(--term-fg-dim)] w-8">
            {depth > 0 && (isLast ? l.corner : l.tee)}
            {l.horizontal.repeat(2)}
          </span>
          {rowContent}
        </div>

        {/* Children — only mounted when expanded */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child, idx) => {
              const childId = `${nodeId}-child-${idx}`
              const isLastChild = idx === node.children!.length - 1
              return (
                <div key={childId} className="flex">
                  <span className="text-[var(--term-fg-dim)]">
                    {depth === 0 ? '' : isLast ? ' ' : l.vertical}
                  </span>
                  <div className="flex-1">
                    {renderNodeRow(child, childId, depth + 1, isLastChild)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div role="tree" className="space-y-0 font-mono text-sm text-[var(--term-fg)]">
      {nodes.map((node, idx) =>
        renderNodeRow(node, `root-${idx}`, 0, idx === nodes.length - 1)
      )}
    </div>
  )
}
