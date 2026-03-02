'use client'

import { ReactNode, useEffect, useState } from 'react'
import { X } from 'lucide-react'

export interface TerminalNotificationProps {
  /** Notification message */
  message: string | ReactNode
  /** Notification type */
  variant?: 'neutral' | 'success' | 'error' | 'warning' | 'info'
  /** Auto-dismiss duration in ms (default: 5000, 0 = no auto-dismiss) */
  duration?: number
  /** Callback when notification is dismissed */
  onDismiss?: () => void
  /** Position on screen (default: 'top-right') */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** Show close button (default: true) */
  closable?: boolean
  /** Additional CSS classes */
  className?: string
}

const variantConfig: Record<
  NonNullable<TerminalNotificationProps['variant']>,
  { icon: string; borderColor: string; bgColor: string }
> = {
  neutral: {
    icon: 'ℹ',
    borderColor: 'var(--glass-border)',
    bgColor: 'var(--term-bg-panel)',
  },
  success: {
    icon: '✓',
    borderColor: 'var(--term-green)',
    bgColor: 'color-mix(in oklab, var(--term-green) 8%, var(--term-bg-panel))',
  },
  error: {
    icon: '✗',
    borderColor: 'var(--term-red)',
    bgColor: 'color-mix(in oklab, var(--term-red) 8%, var(--term-bg-panel))',
  },
  warning: {
    icon: '⚠',
    borderColor: 'var(--term-yellow)',
    bgColor: 'color-mix(in oklab, var(--term-yellow) 8%, var(--term-bg-panel))',
  },
  info: {
    icon: 'ℹ',
    borderColor: 'var(--term-blue)',
    bgColor: 'color-mix(in oklab, var(--term-blue) 8%, var(--term-bg-panel))',
  },
}

const positionClasses: Record<NonNullable<TerminalNotificationProps['position']>, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
}

/**
 * Toast-style notification component with auto-dismiss and animations.
 * Displays temporary alerts in terminal aesthetic.
 *
 * @param message - Notification message content
 * @param variant - Notification type (neutral, success, error, warning, info)
 * @param duration - Auto-dismiss time in ms (0 = no auto-dismiss, default: 5000)
 * @param onDismiss - Callback when notification is dismissed
 * @param position - Screen position (default: 'top-right')
 * @param closable - Show close button (default: true)
 * @param className - Additional classes applied to the root element
 *
 * @example
 * ```tsx
 * <TerminalNotification
 *   message="Build successful!"
 *   variant="success"
 *   duration={3000}
 *   onDismiss={() => console.log('dismissed')}
 * />
 *
 * <TerminalNotification
 *   message="Error: Connection failed"
 *   variant="error"
 *   duration={0}
 *   position="bottom-right"
 * />
 * ```
 */
export function TerminalNotification({
  message,
  variant = 'neutral',
  duration = 5000,
  onDismiss,
  position = 'top-right',
  closable = true,
  className = '',
}: TerminalNotificationProps) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  const config = variantConfig[variant]
  const positionClass = positionClasses[position]

  useEffect(() => {
    if (duration <= 0) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, duration - elapsed)
      const percentRemaining = (remaining / duration) * 100
      setProgress(percentRemaining)

      if (remaining === 0) {
        clearInterval(interval)
        handleDismiss()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [duration])

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(() => {
      onDismiss?.()
    }, 200) // Wait for fade-out animation
  }

  if (!visible) return null

  return (
    <div
      className={`fixed ${positionClass} z-50 animate-in fade-in slide-in-from-top-2 ${
        visible ? '' : 'animate-out fade-out'
      } ${className}`.trim()}
      role="alert"
      aria-live="polite"
    >
      <div
        className="flex min-w-[280px] max-w-[400px] items-start gap-3 rounded-lg border p-4 font-mono text-sm shadow-lg backdrop-blur-sm"
        style={{
          borderColor: config.borderColor,
          backgroundColor: config.bgColor,
        }}
      >
        {/* Icon */}
        <span className="flex-shrink-0 text-lg" style={{ color: config.borderColor }}>
          {config.icon}
        </span>

        {/* Message */}
        <div className="flex-1 text-[var(--term-fg)]">{message}</div>

        {/* Close button */}
        {closable && (
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-shrink-0 text-[var(--term-fg-dim)] hover:text-[var(--term-fg)] transition-colors"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--glass-bg)]">
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: config.borderColor,
            }}
          />
        </div>
      )}
    </div>
  )
}
