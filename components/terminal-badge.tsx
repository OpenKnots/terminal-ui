'use client'

import { ReactNode } from 'react'

export interface TerminalBadgeProps {
  /** Badge content, such as status text or version. */
  children: ReactNode
  /** Visual style variant (default: 'neutral'). */
  variant?: 'neutral' | 'success' | 'error' | 'warning' | 'info'
  /** Additional classes for layout tweaks. */
  className?: string
}

const variantClasses: Record<NonNullable<TerminalBadgeProps['variant']>, string> = {
  neutral:
    'border-[var(--glass-border)] text-[var(--term-fg)] bg-[rgba(255,255,255,0.04)]',
  success:
    'border-[var(--term-green)]/40 text-[var(--term-green)] bg-[color-mix(in_oklab,var(--term-green)_12%,transparent)]',
  error:
    'border-[var(--term-red)]/40 text-[var(--term-red)] bg-[color-mix(in_oklab,var(--term-red)_12%,transparent)]',
  warning:
    'border-[var(--term-yellow)]/40 text-[var(--term-yellow)] bg-[color-mix(in_oklab,var(--term-yellow)_12%,transparent)]',
  info:
    'border-[var(--term-blue)]/40 text-[var(--term-blue)] bg-[color-mix(in_oklab,var(--term-blue)_12%,transparent)]',
}

/**
 * Displays a compact terminal-style status badge.
 *
 * @param children - Badge label, status text, or short metadata
 * @param variant - Visual variant for semantic color
 * @param className - Additional classes applied to the badge root
 *
 * @example
 * ```tsx
 * <TerminalBadge variant="success">v1.2.0</TerminalBadge>
 * <TerminalBadge variant="error">EXIT 1</TerminalBadge>
 * ```
 */
export function TerminalBadge({
  children,
  variant = 'neutral',
  className = '',
}: TerminalBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs leading-none ${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
