'use client'

/**
 * TerminalProgress — ASCII-style progress bar component.
 *
 * Renders a terminal-style progress indicator like:
 *   Installing... [████████░░░░░░░░░░░░] 40%
 *
 * @example
 * ```tsx
 * <TerminalProgress percent={75} label="Downloading..." />
 * <TerminalProgress percent={100} label="Done" filled="=" empty="-" width={30} />
 * <TerminalProgress percent={50} showPercent={false} />
 * ```
 */

interface TerminalProgressProps {
  /** Progress percentage (0–100). Values outside this range are clamped. */
  percent: number
  /** Optional label displayed before the bar. */
  label?: string
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
  const clamped = Math.max(0, Math.min(100, percent))
  const filledCount = Math.round((clamped / 100) * width)
  const emptyCount = width - filledCount

  const bar = filled.repeat(filledCount) + empty.repeat(emptyCount)
  const color = variantColors[variant] ?? variantColors.green

  return (
    <div className="flex items-center gap-2 font-mono text-sm mb-1">
      {label && (
        <span className="text-[var(--term-fg-dim)]">{label}</span>
      )}
      <span>
        <span className="text-[var(--term-fg-dim)]">[</span>
        <span style={{ color }}>{filled.repeat(filledCount)}</span>
        <span className="text-[var(--term-fg-dim)]">{empty.repeat(emptyCount)}</span>
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
