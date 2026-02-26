'use client'

import { useState, useCallback, useRef } from 'react'

/**
 * TerminalSplit — resizable split pane layout for terminal UIs.
 *
 * Drag the divider to resize. Supports horizontal and vertical splits.
 *
 * @example
 * ```tsx
 * <TerminalSplit direction="horizontal" defaultRatio={0.5}>
 *   <Terminal title="server.ts">
 *     <TerminalOutput>listening on :3000</TerminalOutput>
 *   </Terminal>
 *   <Terminal title="client.ts">
 *     <TerminalOutput>connected</TerminalOutput>
 *   </Terminal>
 * </TerminalSplit>
 * ```
 */

interface TerminalSplitProps {
  /** Split direction (default: 'horizontal' = side by side). */
  direction?: 'horizontal' | 'vertical'
  /** Initial split ratio 0-1 (default: 0.5). */
  defaultRatio?: number
  /** Minimum pane size as ratio (default: 0.15). */
  minRatio?: number
  /** First pane content. */
  children: [React.ReactNode, React.ReactNode]
}

export function TerminalSplit({
  direction = 'horizontal',
  defaultRatio = 0.5,
  minRatio = 0.15,
  children,
}: TerminalSplitProps) {
  const [ratio, setRatio] = useState(defaultRatio)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragging.current = true

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current || !containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()

        let newRatio: number
        if (direction === 'horizontal') {
          newRatio = (ev.clientX - rect.left) / rect.width
        } else {
          newRatio = (ev.clientY - rect.top) / rect.height
        }

        setRatio(Math.max(minRatio, Math.min(1 - minRatio, newRatio)))
      }

      const onUp = () => {
        dragging.current = false
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
      }

      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    },
    [direction, minRatio],
  )

  const isHorizontal = direction === 'horizontal'
  const firstSize = `${ratio * 100}%`
  const secondSize = `${(1 - ratio) * 100}%`

  return (
    <div
      ref={containerRef}
      className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} h-full w-full`}
      style={{ minHeight: 0 }}
    >
      <div
        className="overflow-auto"
        style={{
          [isHorizontal ? 'width' : 'height']: firstSize,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {children[0]}
      </div>

      <div
        onMouseDown={handleMouseDown}
        className={`
          flex-shrink-0 bg-[var(--glass-border)]
          hover:bg-[var(--term-blue)] active:bg-[var(--term-blue)]
          transition-colors
          ${isHorizontal
            ? 'w-[3px] cursor-col-resize'
            : 'h-[3px] cursor-row-resize'
          }
        `}
        role="separator"
        aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(ratio * 100)}
      />

      <div
        className="overflow-auto"
        style={{
          [isHorizontal ? 'width' : 'height']: secondSize,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        {children[1]}
      </div>
    </div>
  )
}
