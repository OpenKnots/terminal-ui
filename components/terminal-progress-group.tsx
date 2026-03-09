'use client'

import { useState } from 'react'
import { TerminalProgress } from './terminal-progress'

export interface ProgressItem {
  /** Label for this step */
  label: string
  /** Progress percentage (0-100) */
  percent: number
  /** Variant color */
  variant?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'cyan'
  /** Step status (determines icon) */
  status?: 'pending' | 'active' | 'complete' | 'error'
}

export interface TerminalProgressGroupProps {
  /** Array of progress items */
  items: ProgressItem[]
  /** Show overall progress (default: true) */
  showTotal?: boolean
  /** Collapsible (default: false) */
  collapsible?: boolean
  /** Title for the progress group */
  title?: string
  /** Additional CSS classes */
  className?: string
}

const statusIcons: Record<NonNullable<ProgressItem['status']>, string> = {
  pending: '○',
  active: '⟳',
  complete: '✓',
  error: '✗',
}

const statusColors: Record<NonNullable<ProgressItem['status']>, string> = {
  pending: 'var(--term-fg-dim)',
  active: 'var(--term-blue)',
  complete: 'var(--term-green)',
  error: 'var(--term-red)',
}

/**
 * Display multiple related progress bars for multi-step tasks.
 * Calculates and shows overall progress with optional collapsible details.
 *
 * @param items - Array of progress items with labels, percentages, and status
 * @param showTotal - Display overall progress bar at top (default: true)
 * @param collapsible - Allow expanding/collapsing details (default: false)
 * @param title - Optional title for the progress group
 * @param className - Additional classes applied to the root element
 *
 * @example
 * ```tsx
 * <TerminalProgressGroup
 *   title="Build Pipeline"
 *   items={[
 *     { label: 'Compile TypeScript', percent: 100, status: 'complete' },
 *     { label: 'Bundle assets', percent: 80, status: 'active', variant: 'blue' },
 *     { label: 'Deploy to prod', percent: 0, status: 'pending' },
 *   ]}
 * />
 * ```
 */
export function TerminalProgressGroup({
  items,
  showTotal = true,
  collapsible = false,
  title,
  className = '',
}: TerminalProgressGroupProps) {
  const [expanded, setExpanded] = useState(!collapsible)

  // Calculate overall progress (average)
  const totalPercent = items.length > 0
    ? Math.round(items.reduce((sum, item) => sum + item.percent, 0) / items.length)
    : 0

  // Determine overall variant based on status
  const hasError = items.some((item) => item.status === 'error')
  const allComplete = items.every((item) => item.status === 'complete' || item.percent === 100)
  const overallVariant = hasError ? 'red' : allComplete ? 'green' : 'blue'

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      {/* Title */}
      {title && (
        <div className="text-[var(--term-fg)] font-mono text-sm font-semibold">
          {title}
        </div>
      )}

      {/* Overall progress */}
      {showTotal && (
        <div className="flex items-center gap-2">
          {collapsible && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-[var(--term-fg-dim)] hover:text-[var(--term-fg)] transition-colors"
              aria-label={expanded ? 'Collapse details' : 'Expand details'}
            >
              {expanded ? '▼' : '▶'}
            </button>
          )}
          <div className="flex-1">
            <TerminalProgress
              label="Overall Progress"
              percent={totalPercent}
              variant={overallVariant}
              width={30}
            />
          </div>
        </div>
      )}

      {/* Individual progress items */}
      {expanded && items.length > 0 && (
        <div className="flex flex-col gap-1 ml-4 border-l-2 border-[var(--glass-border)] pl-3">
          {items.map((item, i) => {
            const status = item.status || (item.percent === 100 ? 'complete' : item.percent > 0 ? 'active' : 'pending')
            const icon = statusIcons[status]
            const iconColor = statusColors[status]
            const variant = item.variant || (status === 'error' ? 'red' : status === 'complete' ? 'green' : 'blue')

            return (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="flex-shrink-0 w-4 text-center font-mono"
                  style={{ color: iconColor }}
                >
                  {icon}
                </span>
                <div className="flex-1">
                  <TerminalProgress
                    label={item.label}
                    percent={item.percent}
                    variant={variant}
                    width={20}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
