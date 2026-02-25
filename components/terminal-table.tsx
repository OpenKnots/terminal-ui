'use client'

/**
 * TerminalTable — renders tabular data with box-drawing characters.
 *
 * Automatically calculates column widths from headers and cell content.
 *
 * @example
 * ```tsx
 * <TerminalTable
 *   headers={['Name', 'Version', 'Size']}
 *   rows={[
 *     ['react', '18.2.0', '142 kB'],
 *     ['next', '14.0.0', '540 kB'],
 *   ]}
 * />
 * ```
 *
 * Renders:
 * ```
 * ┌─────────┬─────────┬─────────┐
 * │ Name    │ Version │ Size    │
 * ├─────────┼─────────┼─────────┤
 * │ react   │ 18.2.0  │ 142 kB  │
 * │ next    │ 14.0.0  │ 540 kB  │
 * └─────────┴─────────┴─────────┘
 * ```
 */

export type ColumnAlign = 'left' | 'right' | 'center'

interface TerminalTableProps {
  /** Column header labels. */
  headers: string[]
  /** Row data — each row is an array of cell strings. */
  rows: string[][]
  /** Per-column alignment (default: 'left' for all). */
  align?: ColumnAlign[]
  /** Whether to highlight the header row (default: true). */
  highlightHeader?: boolean
  /** Whether to stripe alternate rows (default: false). */
  striped?: boolean
}

/** Pad a string to a given width with a specific alignment. */
function padCell(text: string, width: number, alignment: ColumnAlign): string {
  const len = text.length
  if (len >= width) return text.slice(0, width)

  switch (alignment) {
    case 'right':
      return ' '.repeat(width - len) + text
    case 'center': {
      const left = Math.floor((width - len) / 2)
      const right = width - len - left
      return ' '.repeat(left) + text + ' '.repeat(right)
    }
    default:
      return text + ' '.repeat(width - len)
  }
}

/** Calculate the width for each column based on headers and all row data. */
function calcWidths(headers: string[], rows: string[][]): number[] {
  const colCount = headers.length
  const widths = headers.map((h) => h.length)

  for (const row of rows) {
    for (let i = 0; i < colCount; i++) {
      const cell = row[i] ?? ''
      if (cell.length > widths[i]) {
        widths[i] = cell.length
      }
    }
  }

  return widths
}

// Box-drawing characters
const BOX = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
  tDown: '┬',
  tUp: '┴',
  tRight: '├',
  tLeft: '┤',
  cross: '┼',
} as const

function buildHorizontalLine(
  widths: number[],
  left: string,
  mid: string,
  right: string,
): string {
  return (
    left +
    widths.map((w) => BOX.horizontal.repeat(w + 2)).join(mid) +
    right
  )
}

function buildRow(
  cells: string[],
  widths: number[],
  aligns: ColumnAlign[],
): string {
  const padded = widths.map((w, i) => {
    const text = cells[i] ?? ''
    const align = aligns[i] ?? 'left'
    return ' ' + padCell(text, w, align) + ' '
  })
  return BOX.vertical + padded.join(BOX.vertical) + BOX.vertical
}

export function TerminalTable({
  headers,
  rows,
  align = [],
  highlightHeader = true,
  striped = false,
}: TerminalTableProps) {
  if (headers.length === 0) return null

  const widths = calcWidths(headers, rows)
  const aligns = headers.map((_, i) => align[i] ?? 'left')

  const topLine = buildHorizontalLine(widths, BOX.topLeft, BOX.tDown, BOX.topRight)
  const headerSep = buildHorizontalLine(widths, BOX.tRight, BOX.cross, BOX.tLeft)
  const bottomLine = buildHorizontalLine(widths, BOX.bottomLeft, BOX.tUp, BOX.bottomRight)
  const headerRow = buildRow(headers, widths, aligns)

  return (
    <div className="font-mono text-sm mb-2 overflow-x-auto">
      <div className="text-[var(--term-fg-dim)]">{topLine}</div>
      <div className={highlightHeader ? 'text-[var(--term-fg)] font-bold' : 'text-[var(--term-fg)]'}>
        {headerRow}
      </div>
      <div className="text-[var(--term-fg-dim)]">{headerSep}</div>
      {rows.map((row, i) => (
        <div
          key={i}
          className={
            striped && i % 2 === 1
              ? 'text-[var(--term-fg)] bg-[var(--glass-bg)]'
              : 'text-[var(--term-fg)]'
          }
        >
          {buildRow(row, widths, aligns)}
        </div>
      ))}
      <div className="text-[var(--term-fg-dim)]">{bottomLine}</div>
    </div>
  )
}
