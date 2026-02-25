'use client'

import { ReactNode } from 'react'

export interface TerminalTableColumn {
  /**
   * Column header text
   */
  header: string | ReactNode
  /**
   * Column width in characters
   */
  width?: number
  /**
   * Text alignment (default: 'left')
   */
  align?: 'left' | 'center' | 'right'
}

export interface TerminalTableRow {
  /**
   * Array of cell values
   */
  cells: (string | ReactNode)[]
  /**
   * Optional row styling
   */
  style?: 'normal' | 'success' | 'error' | 'info' | 'warning'
}

export interface TerminalTableProps {
  /**
   * Column definitions
   */
  columns: TerminalTableColumn[]
  /**
   * Table rows
   */
  rows: TerminalTableRow[]
  /**
   * Whether to show borders (default: true)
   */
  bordered?: boolean
  /**
   * Whether to show header (default: true)
   */
  showHeader?: boolean
  /**
   * Custom border characters
   */
  borders?: {
    topLeft?: string
    topRight?: string
    bottomLeft?: string
    bottomRight?: string
    horizontal?: string
    vertical?: string
    cross?: string
    topT?: string
    bottomT?: string
    leftT?: string
    rightT?: string
  }
}

const DEFAULT_BORDERS = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
  cross: '┼',
  topT: '┬',
  bottomT: '┴',
  leftT: '├',
  rightT: '┤',
}

/**
 * Displays a terminal-style table with box-drawing characters.
 * Renders structured data in a formatted table with customizable columns, rows, and styling.
 * Supports Unicode box-drawing characters for professional terminal output.
 *
 * @param columns - Array of column definitions with headers and widths
 * @param rows - Array of row data with cell values
 * @param bordered - Whether to show table borders (default: true)
 * @param showHeader - Whether to show header row (default: true)
 * @param borders - Custom border characters for box drawing
 *
 * @example
 * ```tsx
 * <TerminalTable
 *   columns={[
 *     { header: 'Name', width: 15 },
 *     { header: 'Status', width: 10, align: 'center' },
 *     { header: 'Size', width: 8, align: 'right' }
 *   ]}
 *   rows={[
 *     { cells: ['file.txt', 'Ready', '2.5 MB'] },
 *     { cells: ['image.png', 'Processing', '4.2 MB'], style: 'info' },
 *     { cells: ['data.json', 'Complete', '1.1 MB'], style: 'success' }
 *   ]}
 * />
 * ```
 */
export function TerminalTable({
  columns,
  rows,
  bordered = true,
  showHeader = true,
  borders = DEFAULT_BORDERS,
}: TerminalTableProps) {
  const b = { ...DEFAULT_BORDERS, ...borders }

  // Calculate column widths
  const colWidths = columns.map((col) => col.width || 15)
  const totalWidth = colWidths.reduce((a, b) => a + b, 0) + columns.length + 1

  // Pad content to column width
  const padContent = (content: string, width: number, align: 'left' | 'center' | 'right' = 'left'): string => {
    const str = String(content).substring(0, width)
    const padding = width - str.length

    if (align === 'center') {
      const left = Math.floor(padding / 2)
      const right = padding - left
      return ' '.repeat(left) + str + ' '.repeat(right)
    } else if (align === 'right') {
      return ' '.repeat(padding) + str
    }
    return str + ' '.repeat(padding)
  }

  // Get row styling classes
  const getRowStyle = (style?: string) => {
    switch (style) {
      case 'success':
        return 'text-[var(--term-green)]'
      case 'error':
        return 'text-[var(--term-red)]'
      case 'info':
        return 'text-[var(--term-blue)]'
      case 'warning':
        return 'text-[var(--term-yellow)]'
      default:
        return 'text-[var(--term-fg)]'
    }
  }

  // Build separator line
  const buildSeparator = (left: string, mid: string, right: string, cross: string) => {
    const segments = colWidths.map((w) => b.horizontal.repeat(w + 2))
    return left + segments.join(cross) + right
  }

  return (
    <div className="font-mono text-sm text-[var(--term-fg)] space-y-0">
      {/* Top border */}
      {bordered && (
        <div className="text-[var(--term-fg-dim)]">
          {buildSeparator(b.topLeft, b.horizontal, b.topRight, b.topT)}
        </div>
      )}

      {/* Header */}
      {showHeader && (
        <>
          <div className="flex text-[var(--term-fg-dim)] font-bold">
            {bordered && <span>{b.vertical}</span>}
            {columns.map((col, i) => (
              <span key={i}>
                {' '}
                {padContent(String(col.header), colWidths[i], col.align)}
                {' '}
                {bordered && <span>{b.vertical}</span>}
              </span>
            ))}
          </div>

          {/* Header separator */}
          {bordered && (
            <div className="text-[var(--term-fg-dim)]">
              {buildSeparator(b.leftT, b.horizontal, b.rightT, b.cross)}
            </div>
          )}
        </>
      )}

      {/* Rows */}
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className={getRowStyle(row.style)}>
          <div className="flex">
            {bordered && <span className="text-[var(--term-fg-dim)]">{b.vertical}</span>}
            {row.cells.map((cell, cellIdx) => (
              <span key={cellIdx}>
                {' '}
                {padContent(String(cell), colWidths[cellIdx], columns[cellIdx]?.align)}
                {' '}
                {bordered && <span className="text-[var(--term-fg-dim)]">{b.vertical}</span>}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom border */}
      {bordered && (
        <div className="text-[var(--term-fg-dim)]">
          {buildSeparator(b.bottomLeft, b.horizontal, b.bottomRight, b.bottomT)}
        </div>
      )}
    </div>
  )
}
