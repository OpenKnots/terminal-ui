'use client'

import { KeyboardEvent, ReactNode, useMemo, useRef, useState } from 'react'

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

interface VisibleTreeNode {
  node: TreeNode
  nodeId: string
  parentId: string | null
  depth: number
  isLast: boolean
  ancestorsLast: boolean[]
  hasChildren: boolean
  isExpanded: boolean
}

function getNodeId(parentId: string | null, index: number) {
  return parentId ? `${parentId}-child-${index}` : `root-${index}`
}

function buildInitialExpanded(nodes: TreeNode[], parentId: string | null = null, expanded = new Set<string>()) {
  nodes.forEach((node, index) => {
    const nodeId = getNodeId(parentId, index)

    if (node.expanded) {
      expanded.add(nodeId)
    }

    if (node.children?.length) {
      buildInitialExpanded(node.children, nodeId, expanded)
    }
  })

  return expanded
}

function buildVisibleNodes(
  nodes: TreeNode[],
  expandedNodes: Set<string>,
  parentId: string | null = null,
  depth: number = 0,
  ancestorsLast: boolean[] = [],
): VisibleTreeNode[] {
  const visible: VisibleTreeNode[] = []

  nodes.forEach((node, index) => {
    const nodeId = getNodeId(parentId, index)
    const isLast = index === nodes.length - 1
    const hasChildren = Boolean(node.children && node.children.length > 0)
    const isExpanded = expandedNodes.has(nodeId)

    visible.push({
      node,
      nodeId,
      parentId,
      depth,
      isLast,
      ancestorsLast,
      hasChildren,
      isExpanded,
    })

    if (hasChildren && isExpanded) {
      visible.push(
        ...buildVisibleNodes(
          node.children!,
          expandedNodes,
          nodeId,
          depth + 1,
          [...ancestorsLast, isLast],
        ),
      )
    }
  })

  return visible
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
    () => buildInitialExpanded(nodes),
  )
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null)
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const l = { ...DEFAULT_LINES, ...lines }
  const visibleNodes = useMemo(
    () => buildVisibleNodes(nodes, expandedNodes),
    [nodes, expandedNodes],
  )

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

  const toggleNode = (nodeId: string, forceExpand?: boolean) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      const shouldExpand = forceExpand ?? !next.has(nodeId)

      if (shouldExpand) {
        next.add(nodeId)
      } else {
        next.delete(nodeId)
      }

      return next
    })
  }

  const focusNode = (nodeId: string) => {
    setFocusedNodeId(nodeId)

    const row = rowRefs.current[nodeId]
    if (row) {
      row.focus()
      return
    }

    window.requestAnimationFrame(() => {
      rowRefs.current[nodeId]?.focus()
    })
  }

  const activeNodeId =
    focusedNodeId && visibleNodes.some((entry) => entry.nodeId === focusedNodeId)
      ? focusedNodeId
      : visibleNodes[0]?.nodeId ?? null

  const handleKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    entry: VisibleTreeNode,
    index: number,
  ) => {
    const previous = visibleNodes[index - 1]
    const next = visibleNodes[index + 1]

    switch (event.key) {
      case 'ArrowDown': {
        if (next) {
          event.preventDefault()
          focusNode(next.nodeId)
        }
        break
      }
      case 'ArrowUp': {
        if (previous) {
          event.preventDefault()
          focusNode(previous.nodeId)
        }
        break
      }
      case 'ArrowRight': {
        if (!entry.hasChildren || !expandable) {
          break
        }

        event.preventDefault()
        if (!entry.isExpanded) {
          toggleNode(entry.nodeId, true)
          break
        }

        const firstChild = visibleNodes[index + 1]
        if (firstChild && firstChild.parentId === entry.nodeId) {
          focusNode(firstChild.nodeId)
        }
        break
      }
      case 'ArrowLeft': {
        if (!expandable) {
          break
        }

        if (entry.hasChildren && entry.isExpanded) {
          event.preventDefault()
          toggleNode(entry.nodeId, false)
          break
        }

        if (entry.parentId) {
          event.preventDefault()
          focusNode(entry.parentId)
        }
        break
      }
      case 'Enter':
      case ' ': {
        if (entry.hasChildren && expandable) {
          event.preventDefault()
          toggleNode(entry.nodeId)
        }
        break
      }
      default:
        break
    }
  }

  const renderNode = (entry: VisibleTreeNode, index: number) => {
    const { node, nodeId, depth, isLast, ancestorsLast, hasChildren, isExpanded } = entry
    return (
      <div key={nodeId}>
        <div
          ref={(element) => {
            rowRefs.current[nodeId] = element
          }}
          role="treeitem"
          aria-level={depth + 1}
          aria-expanded={hasChildren ? isExpanded : undefined}
          tabIndex={activeNodeId === nodeId ? 0 : -1}
          onFocus={() => setFocusedNodeId(nodeId)}
          onKeyDown={(event) => handleKeyDown(event, entry, index)}
          className={`flex items-center gap-1 rounded px-1 font-mono text-sm outline-none transition-colors ${getNodeStyle(node.style)} ${
            activeNodeId === nodeId
              ? 'bg-[rgba(255,255,255,0.04)] ring-1 ring-[var(--term-blue)]/50'
              : ''
          }`}
        >
          {ancestorsLast.map((ancestorIsLast, ancestorIndex) => (
            <span
              key={`${nodeId}-ancestor-${ancestorIndex}`}
              className="w-4 text-[var(--term-fg-dim)]"
            >
              {ancestorIsLast ? ' ' : l.vertical}
            </span>
          ))}
          <span className="text-[var(--term-fg-dim)] w-8">
            {depth > 0 && (isLast ? l.corner : l.tee)}
            {l.horizontal.repeat(2)}
          </span>
          {hasChildren && expandable && (
            <button
              type="button"
              tabIndex={-1}
              aria-hidden
              onClick={(event) => {
                event.stopPropagation()
                toggleNode(nodeId)
                focusNode(nodeId)
              }}
              className="text-[var(--term-blue)] hover:text-[var(--term-cyan)] cursor-pointer w-4"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}
          {node.icon && <span className="w-4">{node.icon}</span>}
          <span>{node.label}</span>
        </div>
      </div>
    )
  }

  return (
    <div role="tree" aria-label="Terminal tree" className="space-y-0 font-mono text-sm text-[var(--term-fg)]">
      {visibleNodes.map((entry, index) => renderNode(entry, index))}
    </div>
  )
}
