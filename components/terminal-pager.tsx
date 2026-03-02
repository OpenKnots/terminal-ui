'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface TerminalPagerProps {
  /** Content to paginate (string or array of lines) */
  content: string | string[]
  /** Lines per page (default: 10) */
  pageSize?: number
  /** Callback when pager is exited */
  onExit?: () => void
  /** Show controls hint (default: true) */
  showControls?: boolean
  /** Color variant (default: 'blue') */
  variant?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'cyan'
  /** Additional CSS classes */
  className?: string
}

const variantColors: Record<string, string> = {
  green: 'var(--term-green)',
  blue: 'var(--term-blue)',
  yellow: 'var(--term-yellow)',
  red: 'var(--term-red)',
  purple: 'var(--term-purple)',
  cyan: 'var(--term-cyan)',
}

/**
 * Navigate through long output with keyboard controls (like `less` or `more`).
 * Displays content page-by-page with progress indicator.
 *
 * @param content - Content to paginate (string or array of lines)
 * @param pageSize - Number of lines per page (default: 10)
 * @param onExit - Callback when user exits (q or Esc key)
 * @param showControls - Display keyboard controls hint (default: true)
 * @param variant - Color for progress indicator
 * @param className - Additional classes applied to the root element
 *
 * @example
 * ```tsx
 * <TerminalPager
 *   content={longLogContent}
 *   pageSize={15}
 *   onExit={() => console.log('Pager closed')}
 * />
 *
 * <TerminalPager
 *   content={['Line 1', 'Line 2', 'Line 3', ...]}
 *   variant="green"
 * />
 * ```
 */
export function TerminalPager({
  content,
  pageSize = 10,
  onExit,
  showControls = true,
  variant = 'blue',
  className = '',
}: TerminalPagerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const color = variantColors[variant]

  // Convert content to lines array
  const lines = typeof content === 'string' ? content.split('\n') : content
  const totalPages = Math.max(1, Math.ceil(lines.length / pageSize))
  const progress = Math.round(((currentPage + 1) / totalPages) * 100)

  // Get current page lines
  const startLine = currentPage * pageSize
  const endLine = Math.min(startLine + pageSize, lines.length)
  const currentLines = lines.slice(startLine, endLine)

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
  }, [totalPages])

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }, [])

  const goToFirstPage = useCallback(() => {
    setCurrentPage(0)
  }, [])

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages - 1)
  }, [totalPages])

  const handleExit = useCallback(() => {
    onExit?.()
  }, [onExit])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'Enter':
        case 'j':
        case 'ArrowDown':
          e.preventDefault()
          goToNextPage()
          break
        case 'b':
        case 'k':
        case 'ArrowUp':
          e.preventDefault()
          goToPrevPage()
          break
        case 'g':
          e.preventDefault()
          goToFirstPage()
          break
        case 'G':
          e.preventDefault()
          goToLastPage()
          break
        case 'q':
        case 'Escape':
          e.preventDefault()
          handleExit()
          break
      }
    },
    [goToNextPage, goToPrevPage, goToFirstPage, goToLastPage, handleExit],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Focus container on mount for keyboard events
    container.focus()

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={`flex flex-col font-mono text-sm outline-none ${className}`.trim()}
      role="region"
      aria-label="Paginated content"
    >
      {/* Content */}
      <div className="flex flex-col">
        {currentLines.map((line, i) => (
          <div key={startLine + i} className="text-[var(--term-fg)]">
            {line}
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      {totalPages > 1 && (
        <div
          className="mt-2 flex items-center gap-2 border-t border-[var(--glass-border)] pt-2"
          style={{ color }}
        >
          <span className="font-bold">-- More --</span>
          <span className="text-[var(--term-fg-dim)]">
            ({progress}% · {currentPage + 1}/{totalPages})
          </span>
        </div>
      )}

      {/* Controls hint */}
      {showControls && (
        <div className="mt-1 text-xs text-[var(--term-fg-dim)]">
          {totalPages > 1 ? (
            <>
              <span className="opacity-70">
                Space/↓: next · b/↑: back · g: first · G: last · q: quit
              </span>
            </>
          ) : (
            <span className="opacity-70">q: quit</span>
          )}
        </div>
      )}
    </div>
  )
}
