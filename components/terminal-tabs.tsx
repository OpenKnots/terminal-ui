'use client'

import { useCallback } from 'react'

/**
 * TerminalTabs — tab bar for switching between terminal sessions.
 *
 * Keyboard: ←→ to navigate, Enter to select, Ctrl+W to close (if closable).
 *
 * @example
 * ```tsx
 * <TerminalTabs
 *   tabs={[
 *     { id: '1', label: 'server.ts' },
 *     { id: '2', label: 'client.ts' },
 *     { id: '3', label: '~ bash', icon: '⚡' },
 *   ]}
 *   activeId="1"
 *   onSelect={(id) => setActive(id)}
 *   onClose={(id) => removeTab(id)}
 * />
 * ```
 */

interface Tab {
  /** Unique tab identifier. */
  id: string
  /** Display label. */
  label: string
  /** Optional icon/emoji before the label. */
  icon?: string
  /** Whether the tab shows an activity indicator. */
  active?: boolean
}

interface TerminalTabsProps {
  /** Tab definitions. */
  tabs: Tab[]
  /** Currently selected tab ID. */
  activeId: string
  /** Called when a tab is clicked. */
  onSelect?: (id: string) => void
  /** Called when a tab's close button is clicked. Omit to hide close buttons. */
  onClose?: (id: string) => void
  /** Called when the "+" button is clicked. Omit to hide the add button. */
  onAdd?: () => void
  /** Color for the active tab indicator (default: 'green'). */
  variant?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'cyan'
}

const variantColors: Record<string, string> = {
  green: 'var(--term-green)',
  blue: 'var(--term-blue)',
  yellow: 'var(--term-yellow)',
  red: 'var(--term-red)',
  purple: 'var(--term-purple)',
  cyan: 'var(--term-cyan)',
}

export function TerminalTabs({
  tabs,
  activeId,
  onSelect,
  onClose,
  onAdd,
  variant = 'green',
}: TerminalTabsProps) {
  const color = variantColors[variant]

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = tabs.findIndex((t) => t.id === activeId)
      if (currentIndex === -1) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          if (currentIndex > 0) onSelect?.(tabs[currentIndex - 1].id)
          break
        case 'ArrowRight':
          e.preventDefault()
          if (currentIndex < tabs.length - 1) onSelect?.(tabs[currentIndex + 1].id)
          break
      }
    },
    [tabs, activeId, onSelect],
  )

  if (tabs.length === 0) return null

  return (
    <div
      className="font-mono text-xs flex items-center border-b border-[var(--glass-border)] bg-[var(--term-bg-panel,var(--term-bg))] overflow-x-auto"
      role="tablist"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect?.(tab.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 border-r border-[var(--glass-border)]
              transition-colors whitespace-nowrap relative
              ${isActive
                ? 'text-[var(--term-fg)] bg-[var(--term-bg)]'
                : 'text-[var(--term-fg-dim)] hover:text-[var(--term-fg)] hover:bg-[var(--glass-bg)]'
              }
            `}
          >
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: color }}
              />
            )}
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.active && !isActive && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
            )}
            {onClose && (
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  onClose(tab.id)
                }}
                className="ml-1 opacity-0 group-hover:opacity-100 hover:text-[var(--term-red)] cursor-pointer"
                style={{ opacity: isActive ? 0.6 : undefined }}
                aria-label={`Close ${tab.label}`}
              >
                ×
              </span>
            )}
          </button>
        )
      })}
      {onAdd && (
        <button
          onClick={onAdd}
          className="px-2 py-1.5 text-[var(--term-fg-dim)] hover:text-[var(--term-fg)] hover:bg-[var(--glass-bg)]"
          aria-label="New tab"
        >
          +
        </button>
      )}
    </div>
  )
}
