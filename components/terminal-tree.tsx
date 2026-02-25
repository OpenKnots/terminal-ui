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

export interface TerminalTreeProps {
  /**
   * Root nodes to display
   */
  nodes: TreeNode[]
  /**
   * Whether nodes are expandable
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

/**
 * Displays hierarchical data as a tree structure with expandable nodes.
 * Renders directory-like structures or nested data using Unicode box-drawing characters
 * with interactive expand/collapse functionality.
 *
 * @param nodes - Array of root tree nodes with optional children
 * @param expandable - Whether nodes can be expanded/collapsed (default: true)
 * @param lines - Custom line characters for tree drawing
 *
 * @example
 * ```tsx
 * <TerminalTree
 *   nodes={[
 *     {
 *       label: 'src/',
 *       icon: '📁',
 *       children: [
 *         { label: 'components/', icon: '📁', children: [
 *           { label: 'Button.tsx', icon: '📄' }
 *         ]},
 *         { label: 'utils.ts', icon: '📄' }
 *       ]
 *     }
 *   ]}
 *   expandable={true}
 * />
 * ```
 */
export function TerminalTree({
  nodes,
  expandable = true,
  lines = DEFAULT_LINES,
}: TerminalTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(
      nodes
        .flatMap(flattenNodes)
        .filter((node) => node.expanded)
        .map((_, idx) => `node-${idx}`)
    )
  )

  const l = { ...DEFAULT_LINES, ...lines }

  function flattenNodes(node: TreeNode, index: number = 0): TreeNode[] {
    return [node, ...(node.children || []).flatMap((child, i) => flattenNodes(child, i))]
  }

  const getNodeStyle = (style?: string) => {
    switch (style) {
      case 'success':
        return 'text-[var(--term-green)]'
      case 'error':
        return 'text-[var(--term-red)]'
      case 'info':
        return 'text-[var(--term-blue)]'
      case 'warning':
        return 'text-[var(--term-yellow)]'
      default:
        return 'text-[var(--term-fg)]'
    }
  }

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const renderNode = (node: TreeNode, nodeId: string, depth: number = 0, isLast: boolean = true) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes.has(nodeId)
    const prefix = depth === 0 ? '' : isLast ? '  ' : `${l.vertical} `

    return (
      <div key={nodeId}>
        <div className={`flex items-center gap-1 font-mono text-sm ${getNodeStyle(node.style)}`}>
          <span className="text-[var(--term-fg-dim)] w-8">
            {depth > 0 && (isLast ? l.corner : l.tee)}
            {l.horizontal.repeat(2)}
          </span>
          {hasChildren && expandable && (
            <button
              onClick={() => toggleNode(nodeId)}
              className="text-[var(--term-blue)] hover:text-[var(--term-cyan)] cursor-pointer w-4"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}
          {node.icon && <span className="w-4">{node.icon}</span>}
          <span>{node.label}</span>
        </div>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child, idx) => {
              const childId = `${nodeId}-child-${idx}`
              const isLastChild = idx === node.children!.length - 1
              return (
                <div key={childId} className="flex">
                  <span className={`text-[var(--term-fg-dim)] ${isLast ? '' : l.vertical}`}>
                    {depth === 0 ? '' : isLast ? ' ' : l.vertical}
                  </span>
                  <div className="flex-1">
                    {renderNode(child, childId, depth + 1, isLastChild)}
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
    <div className="space-y-0 font-mono text-sm text-[var(--term-fg)]">
      {nodes.map((node, idx) => renderNode(node, `root-${idx}`, 0, idx === nodes.length - 1))}
    </div>
  )
}
