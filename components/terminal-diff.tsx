import { Fragment } from 'react'

export interface TerminalDiffProps {
  /** Original text content (left side / removed lines). */
  before: string
  /** Updated text content (right side / added lines). */
  after: string
  /** Display mode for rendering the diff (default: 'unified'). */
  mode?: 'unified' | 'split'
  /** Optional className for layout customization. */
  className?: string
}

interface DiffRow {
  before?: string
  after?: string
}

function toLines(content: string) {
  return content.replace(/\r\n/g, '\n').split('\n')
}

function buildRows(before: string, after: string): DiffRow[] {
  const beforeLines = toLines(before)
  const afterLines = toLines(after)
  const max = Math.max(beforeLines.length, afterLines.length)
  const rows: DiffRow[] = []

  for (let index = 0; index < max; index += 1) {
    rows.push({
      before: beforeLines[index],
      after: afterLines[index],
    })
  }

  return rows
}

/**
 * Displays a lightweight terminal-style text diff.
 *
 * @param before - Original text input
 * @param after - Updated text input
 * @param mode - Diff presentation mode (`unified` or `split`)
 * @param className - Optional wrapper class names
 *
 * @example
 * ```tsx
 * <TerminalDiff before="const x = 1" after="const x = 2" mode="unified" />
 * <TerminalDiff before={oldConfig} after={newConfig} mode="split" />
 * ```
 */
export function TerminalDiff({
  before,
  after,
  mode = 'unified',
  className = '',
}: TerminalDiffProps) {
  const rows = buildRows(before, after)

  if (mode === 'split') {
    return (
      <div className={`overflow-auto rounded border border-[var(--glass-border)] ${className}`.trim()}>
        <div className="grid min-w-[560px] grid-cols-2 divide-x divide-[var(--glass-border)] text-sm">
          {rows.map((row, index) => {
            const unchanged = row.before === row.after
            const leftClass = unchanged
              ? 'text-[var(--term-fg-dim)]'
              : 'bg-[color-mix(in_oklab,var(--term-red)_10%,transparent)] text-[var(--term-red)]'
            const rightClass = unchanged
              ? 'text-[var(--term-fg-dim)]'
              : 'bg-[color-mix(in_oklab,var(--term-green)_10%,transparent)] text-[var(--term-green)]'

            return (
              <Fragment key={`split-${index}`}>
                <div className={`flex gap-2 px-3 py-1.5 font-mono ${leftClass}`.trim()}>
                  <span className="select-none">{unchanged ? ' ' : '-'}</span>
                  <span className="whitespace-pre-wrap break-all">{row.before ?? ''}</span>
                </div>
                <div className={`flex gap-2 px-3 py-1.5 font-mono ${rightClass}`.trim()}>
                  <span className="select-none">{unchanged ? ' ' : '+'}</span>
                  <span className="whitespace-pre-wrap break-all">{row.after ?? ''}</span>
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={`overflow-auto rounded border border-[var(--glass-border)] text-sm ${className}`.trim()}>
      <div className="min-w-[320px]">
        {rows.map((row, index) => {
          if (row.before === row.after) {
            return (
              <div
                key={`unified-context-${index}`}
                className="flex gap-2 px-3 py-1.5 font-mono text-[var(--term-fg-dim)]"
              >
                <span className="select-none"> </span>
                <span className="whitespace-pre-wrap break-all">{row.before ?? ''}</span>
              </div>
            )
          }

          return (
            <Fragment key={`unified-change-${index}`}>
              {row.before !== undefined && (
                <div className="flex gap-2 px-3 py-1.5 font-mono text-[var(--term-red)] bg-[color-mix(in_oklab,var(--term-red)_10%,transparent)]">
                  <span className="select-none">-</span>
                  <span className="whitespace-pre-wrap break-all">{row.before}</span>
                </div>
              )}
              {row.after !== undefined && (
                <div className="flex gap-2 px-3 py-1.5 font-mono text-[var(--term-green)] bg-[color-mix(in_oklab,var(--term-green)_10%,transparent)]">
                  <span className="select-none">+</span>
                  <span className="whitespace-pre-wrap break-all">{row.after}</span>
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
