'use client'

import { ReactNode } from 'react'

/**
 * TerminalProgress — ASCII-style progress bar component.
 *
 * Displays a terminal-style progress indicator using Unicode block characters,
 * commonly used for showing installation, download, or processing progress.
 *
 * @param percent - Progress percentage (0–100), will be clamped to valid range
 * @param label - Optional label text or ReactNode displayed before the bar
 * @param width - Progress bar width in characters (default: 20)
 * @param filled - Character for filled portion (default: '█')
 * @param empty - Character for empty portion (default: '░')
 * @param showPercent - Whether to show percentage text (default: true)
 * @param variant - Color variant for the filled portion (default: 'green')
 *
 * @param percent - Progress percentage (0-100), values are clamped.
 * @param label - Optional label shown before the bar.
 * @param width - Character width of the bar.
 * @param filled - Character used for completed progress.
 * @param empty - Character used for remaining progress.
 * @param showPercent - Toggle percentage text visibility.
 * @param variant - Color variant for the completed section.
 *
 * @example
 * ```tsx
 * <TerminalProgress percent={75} label="Installing..." />
 * // Output: Installing... [███████████████░░░░░] 75%
 *
 * <TerminalProgress percent={100} label="Done" filled="=" empty="-" width={30} />
 * <TerminalProgress percent={50} showPercent={false} />
 * <TerminalProgress percent={30} variant="blue" label="Downloading..." />
 * ```
 */

export interface TerminalProgressProps {
  /** Progress percentage (0–100). Values outside this range are clamped. */
  percent: number
  /** Optional label displayed before the bar. */
  label?: string | ReactNode
  /** Character width of the bar (default: 20). */
  width?: number
  /** Character used for the filled portion (default: '█'). */
  filled?: string
  /** Character used for the empty portion (default: '░'). */
  empty?: string
  /** Whether to display the percentage number (default: true). */
  showPercent?: boolean
  /** Color variant for the filled portion. */
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

export function TerminalProgress({
  percent,
  label,
  width = 20,
  filled = '█',
  empty = '░',
  showPercent = true,
  variant = 'green',
}: TerminalProgressProps) {
  const safeWidth = Math.max(1, Math.floor(width))
  const filledChar = filled.slice(0, 1) || '█'
  const emptyChar = empty.slice(0, 1) || '░'
  const clamped = Math.max(0, Math.min(100, percent))
  const filledCount = Math.round((clamped / 100) * safeWidth)
  const emptyCount = safeWidth - filledCount
  const color = variantColors[variant] ?? variantColors.green

  return (
    <div
      role="progressbar"
      aria-label={typeof label === 'string' ? label : 'Terminal progress'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className="mb-1 flex items-center gap-2 font-mono text-sm"
    >
      {label && (
        <span className="text-[var(--term-fg-dim)] flex-shrink-0">{label}</span>
      )}
      <span className="flex-shrink-0">
        <span className="text-[var(--term-fg-dim)]">[</span>
        <span style={{ color }}>{filledChar.repeat(filledCount)}</span>
        <span className="text-[var(--term-fg-dim)]">{emptyChar.repeat(emptyCount)}</span>
        <span className="text-[var(--term-fg-dim)]">]</span>
      </span>
      {showPercent && (
        <span className="text-[var(--term-fg)] tabular-nums w-[3ch] text-right">
          {clamped}%
        </span>
      )}
    </div>
  )
}
