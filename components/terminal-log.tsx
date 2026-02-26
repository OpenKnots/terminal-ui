'use client'

import { useEffect, useMemo, useRef } from 'react'

export interface TerminalLogProps {
  /** Log lines displayed in the terminal stream. */
  lines: string[]
  /** Maximum number of lines rendered (default: 200). */
  maxLines?: number
  /** Auto-scroll to the newest line when new logs arrive (default: false). */
  autoScroll?: boolean
  /** Optional className for custom layout adjustments. */
  className?: string
}

/**
 * Displays a terminal-style scrolling log buffer.
 *
 * @param lines - Current log lines to render
 * @param maxLines - Maximum number of visible lines kept in view
 * @param autoScroll - Whether to stick to the latest line on updates
 * @param className - Additional wrapper classes
 *
 * @example
 * ```tsx
 * <TerminalLog lines={streamingLogs} maxLines={100} autoScroll />
 * ```
 */
export function TerminalLog({
  lines,
  maxLines = 200,
  autoScroll = false,
  className = '',
}: TerminalLogProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const safeMaxLines = Math.max(1, Math.floor(maxLines))

  const visibleLines = useMemo(
    () => lines.slice(Math.max(0, lines.length - safeMaxLines)),
    [lines, safeMaxLines],
  )

  useEffect(() => {
    if (!autoScroll || !containerRef.current) {
      return
    }

    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [autoScroll, visibleLines])

  return (
    <div
      ref={containerRef}
      className={`max-h-64 overflow-auto rounded border border-[var(--glass-border)] bg-[var(--term-bg)]/40 p-3 font-mono text-sm ${className}`.trim()}
      role="log"
      aria-live={autoScroll ? 'polite' : 'off'}
      aria-relevant="additions text"
    >
      {visibleLines.map((line, index) => (
        <div key={`${index}-${line}`} className="whitespace-pre-wrap break-all text-[var(--term-fg-dim)]">
          {line}
        </div>
      ))}
    </div>
  )
}
