'use client'

import { useState } from 'react'

/**
 * TerminalAlert — dismissable notice block with terminal styling.
 *
 * @example
 * ```tsx
 * <TerminalAlert variant="warning" title="Deprecation Notice">
 *   react-scripts will be removed in v6. Migrate to Vite.
 * </TerminalAlert>
 * ```
 *
 * Renders:
 * ```
 * ⚠ Deprecation Notice
 * │ react-scripts will be removed in v6. Migrate to Vite.
 * ```
 */

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface TerminalAlertProps {
  /** Alert type (default: 'info'). */
  variant?: AlertVariant
  /** Optional bold title. */
  title?: string
  /** Alert body text. */
  children: React.ReactNode
  /** Whether the alert can be dismissed (default: false). */
  dismissable?: boolean
  /** Called when dismissed. */
  onDismiss?: () => void
}

const config: Record<AlertVariant, { icon: string; color: string }> = {
  info: { icon: 'ℹ', color: 'var(--term-blue)' },
  success: { icon: '✓', color: 'var(--term-green)' },
  warning: { icon: '⚠', color: 'var(--term-yellow)' },
  error: { icon: '✗', color: 'var(--term-red)' },
}

export function TerminalAlert({
  variant = 'info',
  title,
  children,
  dismissable = false,
  onDismiss,
}: TerminalAlertProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const { icon, color } = config[variant]

  const dismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  return (
    <div className="font-mono text-sm mb-2" role="alert">
      <div className="flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        {title && (
          <span style={{ color }} className="font-bold">
            {title}
          </span>
        )}
        {dismissable && (
          <button
            onClick={dismiss}
            className="ml-auto text-[var(--term-fg-dim)] hover:text-[var(--term-fg)] text-xs"
            aria-label="Dismiss alert"
          >
            [×]
          </button>
        )}
      </div>
      <div className="flex">
        <span style={{ color }} className="mr-2">│</span>
        <span className="text-[var(--term-fg-dim)]">{children}</span>
      </div>
    </div>
  )
}
