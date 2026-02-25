'use client'

import { ReactNode } from 'react'

export interface TerminalProgressProps {
  /**
   * Progress percentage (0-100)
   */
  percent: number
  /**
   * Optional label text to display before the progress bar
   */
  label?: string | ReactNode
  /**
   * Width of the progress bar in characters (default: 20)
   */
  width?: number
  /**
   * Character to use for filled portion (default: '█')
   */
  filled?: string
  /**
   * Character to use for empty portion (default: '░')
   */
  empty?: string
  /**
   * Whether to show the percentage text (default: true)
   */
  showPercent?: boolean
}

/**
 * Displays a terminal-style progress bar with optional label and percentage.
 * Renders a visual progress indicator using Unicode block characters, commonly used
 * for showing installation, download, or processing progress in terminal applications.
 * 
 * @param percent - Progress percentage (0-100), will be clamped to valid range
 * @param label - Optional label text displayed before the progress bar
 * @param width - Progress bar width in characters (default: 20)
 * @param filled - Character for filled portion (default: '█')
 * @param empty - Character for empty portion (default: '░')
 * @param showPercent - Whether to show percentage text (default: true)
 * 
 * @example
 * ```tsx
 * <TerminalProgress percent={75} label="Installing..." />
 * // Output: Installing... [███████████████░░░░░] 75%
 * 
 * <TerminalProgress percent={45} label="Downloading" width={30} />
 * // Output: Downloading [█████████████░░░░░░░░░░░░░░░░░░] 45%
 * 
 * <TerminalProgress percent={100} showPercent={false} />
 * // Output: [████████████████████]
 * ```
 */
export function TerminalProgress({
  percent,
  label,
  width = 20,
  filled = '█',
  empty = '░',
  showPercent = true,
}: TerminalProgressProps) {
  // Clamp percentage to 0-100 range
  const clampedPercent = Math.max(0, Math.min(100, percent))
  
  // Calculate filled and empty segments
  const filledCount = Math.round((clampedPercent / 100) * width)
  const emptyCount = width - filledCount
  
  // Build the progress bar string
  const bar = filled.repeat(filledCount) + empty.repeat(emptyCount)
  
  return (
    <div className="flex items-center gap-2 text-[var(--term-fg)] font-mono text-sm">
      {label && (
        <span className="text-[var(--term-fg-dim)] flex-shrink-0">
          {label}
        </span>
      )}
      <span className="text-[var(--term-green)] flex-shrink-0">
        [{bar}]
      </span>
      {showPercent && (
        <span className="text-[var(--term-fg-dim)] flex-shrink-0 min-w-[4ch]">
          {clampedPercent}%
        </span>
      )}
    </div>
  )
}
