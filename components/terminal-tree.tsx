'use client'

import { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

export interface TreeNode {
  label: string | ReactNode
  children?: TreeNode[]
  icon?: string
  style?: 'normal' | 'success' | 'error' | 'info' | 'warning'
  expanded?: boolean
}

/**
 * Context passed to TerminalTree render-prop callbacks.
 */
export interface TreeRenderContext {
  node: TreeNode
  nodeId: string
  depth: number
  isLast: boolean
  hasChildren: boolean
  isExpanded: boolean
  expandable: boolean
  isFocused: boolean
  icon: string | undefined
  style: TreeNode['style']
}

export interface TerminalTreeProps {
  nodes: TreeNode[]
  expandable?: boolean
  lines?: {
    vertical?: string
    horizontal?: string
    corner?: string
    tee?: string
  }
  renderIcon?: (ctx: TreeRenderContext) => ReactNode
  renderLabel?: (ctx: TreeRenderContext) => ReactNode
  renderRow?: (ctx: TreeRenderContext) => ReactNode
  onToggle?: (nodeId: string, expanded: boolean) => void
}

const DEFAULT_LINES = {
  vertical: '│',
  horizontal: '─',
  corner: '└',
  tee: '├',
}

// ─── Visible-only rendering pipeline ────────────────────────────

interface VisibleNode {
  node: TreeNode
  nodeId: string
  parentId: string | null
  depth: number
  isLast: boolean
  hasChildren: boolean
  isExpanded: boolean
  ancestorIsLast: boolean[]
}

function buildVisibleNodes(
  nodes: TreeNode[],
  expanded: Set<string>,
  parentId: string | null = null,
  depth = 0,
  ancestorIsLast: boolean[] = [],
): VisibleNode[] {
  const result: VisibleNode[] = []

  nodes.forEach((node, idx) => {
    const nodeId = parentId !== null ? `${parentId}-child-${idx}` : `root-${idx}`
    const isLast = idx === nodes.length - 1
    const hasChildren = !!(node.children && node.children.length > 0)
    const isExpanded = expanded.has(nodeId)

    result.push({ node, nodeId, parentId, depth, isLast, hasChildren, isExpanded, ancestorIsLast })

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

function buildInitialExpanded(nodes: TreeNode[], parentId: string | null = null): Set<string> {
  const set = new Set<string>()
  nodes.forEach((node, idx) => {
    const nodeId = parentId !== null ? `${parentId}-child-${idx}` : `root-${idx}`
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
  isFocused: boolean
  rowRef?: (el: HTMLDivElement | null) => void
  lines: typeof DEFAULT_LINES
  onToggle: (id: string) => void
  onFocus: (id: string) => void
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>, entry: VisibleNode, index: number) => void
  index: number
  renderIcon?: (ctx: TreeRenderContext) => ReactNode
  renderLabel?: (ctx: TreeRenderContext) => ReactNode
  renderRow?: (ctx: TreeRenderContext) => ReactNode
}

const TreeRow = memo(function TreeRow({
  entry,
  expandable,
  isFocused,
  rowRef,
  lines: l,
  onToggle,
  onFocus,
  onKeyDown,
  index,
  renderIcon: renderIconProp,
  renderLabel: renderLabelProp,
  renderRow: renderRowProp,
}: TreeRowProps) {
  const { node, nodeId, depth, isLast, hasChildren, isExpanded, ancestorIsLast } = entry
  const colorClass = NODE_STYLE_MAP[node.style ?? ''] ?? 'text-[var(--term-fg)]'

  const ctx: TreeRenderContext = {
    node, nodeId, depth, isLast, hasChildren, isExpanded, expandable, isFocused,
    icon: node.icon,
    style: node.style,
  }

  const rowContent = renderRowProp
    ? renderRowProp(ctx)
    : (
      <>
        {hasChildren && expandable ? (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={(e) => {
              e.stopPropagation()
              onToggle(nodeId)
            }}
            className="text-[var(--term-blue)] hover:text-[var(--term-cyan)] cursor-pointer w-4 shrink-0"
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
      ref={rowRef}
      role="treeitem"
      aria-expanded={hasChildren && expandable ? isExpanded : undefined}
      aria-level={depth + 1}
      tabIndex={isFocused ? 0 : -1}
      onFocus={() => onFocus(nodeId)}
      onKeyDown={(e) => onKeyDown(e, entry, index)}
      className={`flex items-center gap-1 rounded px-1 font-mono text-sm outline-none transition-colors ${colorClass} ${
        isFocused ? 'bg-[rgba(255,255,255,0.04)] ring-1 ring-[var(--term-blue)]/50' : ''
      }`}
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
 * Displays hierarchical data as a tree with expandable nodes and keyboard navigation.
 *
 * Only visible nodes are mounted in the DOM — collapsed branches are not rendered.
 * Supports ARIA tree keyboard interactions: Arrow keys, Enter, Space.
 * Supports render-prop callbacks for custom icons, labels, and full row overrides.
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
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null)
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const l = { ...DEFAULT_LINES, ...lines }

  const visibleNodes = useMemo(
    () => buildVisibleNodes(nodes, expandedNodes),
    [nodes, expandedNodes],
  )

  const toggleNode = useCallback((nodeId: string, forceExpand?: boolean) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      const willExpand = forceExpand ?? !next.has(nodeId)
      if (willExpand) {
        next.add(nodeId)
      } else {
        next.delete(nodeId)
      }
      onToggle?.(nodeId, willExpand)
      return next
    })
  }, [onToggle])

  const focusNode = useCallback((nodeId: string) => {
    setFocusedNodeId(nodeId)
    const row = rowRefs.current[nodeId]
    if (row) {
      row.focus()
    } else {
      requestAnimationFrame(() => rowRefs.current[nodeId]?.focus())
    }
  }, [])

  const activeNodeId =
    focusedNodeId && visibleNodes.some((e) => e.nodeId === focusedNodeId)
      ? focusedNodeId
      : visibleNodes[0]?.nodeId ?? null

  const handleKeyDown = useCallback((
    event: KeyboardEvent<HTMLDivElement>,
    entry: VisibleNode,
    index: number,
  ) => {
    switch (event.key) {
      case 'ArrowDown': {
        const next = visibleNodes[index + 1]
        if (next) { event.preventDefault(); focusNode(next.nodeId) }
        break
      }
      case 'ArrowUp': {
        const prev = visibleNodes[index - 1]
        if (prev) { event.preventDefault(); focusNode(prev.nodeId) }
        break
      }
      case 'ArrowRight': {
        if (!entry.hasChildren || !expandable) break
        event.preventDefault()
        if (!entry.isExpanded) {
          toggleNode(entry.nodeId, true)
        } else {
          const firstChild = visibleNodes[index + 1]
          if (firstChild?.parentId === entry.nodeId) focusNode(firstChild.nodeId)
        }
        break
      }
      case 'ArrowLeft': {
        if (!expandable) break
        if (entry.hasChildren && entry.isExpanded) {
          event.preventDefault()
          toggleNode(entry.nodeId, false)
        } else if (entry.parentId) {
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
    }
  }, [visibleNodes, expandable, toggleNode, focusNode])

  return (
    <div role="tree" aria-label="Terminal tree" className="space-y-0 font-mono text-sm text-[var(--term-fg)]">
      {visibleNodes.map((entry, index) => (
        <TreeRow
          key={entry.nodeId}
          rowRef={(el: HTMLDivElement | null) => { rowRefs.current[entry.nodeId] = el }}
          entry={entry}
          expandable={expandable}
          isFocused={activeNodeId === entry.nodeId}
          lines={l}
          onToggle={toggleNode}
          onFocus={setFocusedNodeId}
          onKeyDown={handleKeyDown}
          index={index}
          renderIcon={renderIcon}
          renderLabel={renderLabel}
          renderRow={renderRow}
        />
      ))}
    </div>
  )
}
