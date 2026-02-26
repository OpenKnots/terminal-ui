'use client'

/**
 * TerminalChart — ASCII bar chart and sparkline components for terminal UIs.
 *
 * @example
 * ```tsx
 * // Horizontal bar chart
 * <TerminalBarChart
 *   data={[
 *     { label: 'React', value: 142 },
 *     { label: 'Next.js', value: 540 },
 *     { label: 'TypeScript', value: 38 },
 *   ]}
 * />
 *
 * // Sparkline
 * <TerminalSparkline data={[3, 7, 2, 9, 4, 8, 1, 6, 5]} />
 * ```
 */

// ─── Bar Chart ───

export type BarChartVariant = 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'cyan'

interface BarChartItem {
  /** Row label. */
  label: string
  /** Numeric value for the bar. */
  value: number
}

interface TerminalBarChartProps {
  /** Data items to chart. */
  data: BarChartItem[]
  /** Maximum bar width in characters (default: 30). */
  barWidth?: number
  /** Bar fill character (default: '█'). */
  filled?: string
  /** Whether to show numeric values after bars (default: true). */
  showValues?: boolean
  /** Color variant for bars (default: 'green'). */
  variant?: BarChartVariant
  /** Optional title above the chart. */
  title?: string
  /** Optional unit suffix for values (e.g. 'kB', 'ms'). */
  unit?: string
}

const variantColors: Record<BarChartVariant, string> = {
  green: 'var(--term-green)',
  blue: 'var(--term-blue)',
  yellow: 'var(--term-yellow)',
  red: 'var(--term-red)',
  purple: 'var(--term-purple)',
  cyan: 'var(--term-cyan)',
}

export function TerminalBarChart({
  data,
  barWidth = 30,
  filled = '█',
  showValues = true,
  variant = 'green',
  title,
  unit = '',
}: TerminalBarChartProps) {
  if (data.length === 0) return null

  const safeWidth = Math.max(1, Math.round(barWidth))
  const maxValue = Math.max(...data.map((d) => d.value), 1)
  const maxLabel = Math.max(...data.map((d) => d.label.length), 1)
  const color = variantColors[variant]

  return (
    <div className="font-mono text-sm mb-2">
      {title && (
        <div className="text-[var(--term-fg)] font-bold mb-1">{title}</div>
      )}
      {data.map((item, i) => {
        const safeValue = Number.isFinite(item.value) ? Math.max(0, item.value) : 0
        const width = Math.round((safeValue / maxValue) * safeWidth)
        const bar = filled.repeat(width)
        const pad = ' '.repeat(maxLabel - item.label.length)

        return (
          <div key={i} className="flex items-center gap-1">
            <span className="text-[var(--term-fg-dim)]">
              {pad}{item.label}
            </span>
            <span className="text-[var(--term-fg-dim)]"> │</span>
            <span style={{ color }}>{bar}</span>
            {showValues && (
              <span className="text-[var(--term-fg-dim)] ml-1">
                {safeValue}{unit}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Sparkline ───

const SPARK_CHARS = '▁▂▃▄▅▆▇█'

interface TerminalSparklineProps {
  /** Numeric data points. */
  data: number[]
  /** Color variant (default: 'green'). */
  variant?: BarChartVariant
  /** Optional label before the sparkline. */
  label?: string
  /** Whether to show min/max values (default: true). */
  showRange?: boolean
}

export function TerminalSparkline({
  data,
  variant = 'green',
  label,
  showRange = true,
}: TerminalSparklineProps) {
  if (data.length === 0) return null

  const safeData = data.map((d) => (Number.isFinite(d) ? d : 0))
  const min = Math.min(...safeData)
  const max = Math.max(...safeData)
  const range = max - min || 1
  const color = variantColors[variant]

  const sparkline = safeData
    .map((v) => {
      const index = Math.round(((v - min) / range) * (SPARK_CHARS.length - 1))
      return SPARK_CHARS[index]
    })
    .join('')

  return (
    <div className="font-mono text-sm mb-1 flex items-center gap-2">
      {label && (
        <span className="text-[var(--term-fg-dim)]">{label}</span>
      )}
      <span style={{ color }}>{sparkline}</span>
      {showRange && (
        <span className="text-[var(--term-fg-dim)]">
          {min}–{max}
        </span>
      )}
    </div>
  )
}
