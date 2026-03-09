'use client'

import { useState } from 'react'

export interface TerminalJsonProps {
  /** JSON object or array to display */
  data: any
  /** Initially collapsed depth (default: null = all expanded) */
  collapsedDepth?: number | null
  /** Show line numbers (default: false) */
  showLineNumbers?: boolean
  /** Enable copying individual values (default: false) */
  copyable?: boolean
  /** Color variant for values (default: 'blue') */
  variant?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'cyan'
  /** Additional CSS classes */
  className?: string
}

/**
 * Pretty-print and collapse/expand JSON objects with syntax highlighting.
 * Recursively renders nested objects and arrays with terminal-style colors.
 *
 * @param data - JSON object or array to display
 * @param collapsedDepth - Depth at which to initially collapse (null = all expanded)
 * @param showLineNumbers - Display line numbers (default: false)
 * @param copyable - Enable copy buttons for individual values (default: false)
 * @param variant - Color variant for highlighted elements
 * @param className - Additional classes applied to the root element
 *
 * @example
 * ```tsx
 * <TerminalJson
 *   data={{
 *     name: "Alice",
 *     age: 30,
 *     settings: { theme: "dark", notifications: true }
 *   }}
 * />
 *
 * <TerminalJson
 *   data={apiResponse}
 *   collapsedDepth={2}
 *   showLineNumbers
 * />
 * ```
 */
export function TerminalJson({
  data,
  collapsedDepth = null,
  showLineNumbers = false,
  copyable = false,
  variant = 'blue',
  className = '',
}: TerminalJsonProps) {
  return (
    <div className={`font-mono text-sm ${className}`.trim()}>
      <JsonNode
        data={data}
        depth={0}
        collapsedDepth={collapsedDepth}
        showLineNumbers={showLineNumbers}
        copyable={copyable}
        variant={variant}
      />
    </div>
  )
}

interface JsonNodeProps {
  data: any
  depth: number
  collapsedDepth: number | null
  showLineNumbers: boolean
  copyable: boolean
  variant: string
  path?: string
}

function JsonNode({
  data,
  depth,
  collapsedDepth,
  showLineNumbers,
  copyable,
  variant,
  path = '',
}: JsonNodeProps) {
  const shouldStartCollapsed = collapsedDepth !== null && depth >= collapsedDepth
  const [collapsed, setCollapsed] = useState(shouldStartCollapsed)

  const indent = '  '.repeat(depth)
  const type = getType(data)

  // Primitive values
  if (type === 'null' || type === 'boolean' || type === 'number' || type === 'string') {
    return (
      <span>
        <span style={{ color: getColor(type) }}>{formatValue(data, type)}</span>
      </span>
    )
  }

  // Arrays
  if (type === 'array') {
    const arr = data as any[]
    if (arr.length === 0) {
      return <span className="text-[var(--term-fg-dim)]">[]</span>
    }

    return (
      <span>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-[var(--term-fg)] hover:text-[var(--term-blue)] transition-colors"
        >
          {collapsed ? '▶' : '▼'}
        </button>
        <span className="text-[var(--term-fg-dim)]"> [</span>
        {collapsed ? (
          <span className="text-[var(--term-fg-dim)]">...{arr.length} items]</span>
        ) : (
          <>
            <div>
              {arr.map((item, i) => (
                <div key={i} className="ml-4">
                  <JsonNode
                    data={item}
                    depth={depth + 1}
                    collapsedDepth={collapsedDepth}
                    showLineNumbers={showLineNumbers}
                    copyable={copyable}
                    variant={variant}
                    path={`${path}[${i}]`}
                  />
                  {i < arr.length - 1 && <span className="text-[var(--term-fg-dim)]">,</span>}
                </div>
              ))}
            </div>
            <span className="text-[var(--term-fg-dim)]">]</span>
          </>
        )}
      </span>
    )
  }

  // Objects
  if (type === 'object') {
    const keys = Object.keys(data)
    if (keys.length === 0) {
      return <span className="text-[var(--term-fg-dim)]">{'{}'}</span>
    }

    return (
      <span>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-[var(--term-fg)] hover:text-[var(--term-blue)] transition-colors"
        >
          {collapsed ? '▶' : '▼'}
        </button>
        <span className="text-[var(--term-fg-dim)]"> {'{'}</span>
        {collapsed ? (
          <span className="text-[var(--term-fg-dim)]">...{keys.length} keys{'}'}</span>
        ) : (
          <>
            <div>
              {keys.map((key, i) => (
                <div key={key} className="ml-4">
                  <span style={{ color: 'var(--term-cyan)' }}>"{key}"</span>
                  <span className="text-[var(--term-fg-dim)]">: </span>
                  <JsonNode
                    data={data[key]}
                    depth={depth + 1}
                    collapsedDepth={collapsedDepth}
                    showLineNumbers={showLineNumbers}
                    copyable={copyable}
                    variant={variant}
                    path={`${path}.${key}`}
                  />
                  {i < keys.length - 1 && <span className="text-[var(--term-fg-dim)]">,</span>}
                </div>
              ))}
            </div>
            <span className="text-[var(--term-fg-dim)]">{'}'}</span>
          </>
        )}
      </span>
    )
  }

  return <span className="text-[var(--term-fg-dim)]">undefined</span>
}

function getType(value: any): string {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  return typeof value
}

function getColor(type: string): string {
  switch (type) {
    case 'string':
      return 'var(--term-green)'
    case 'number':
      return 'var(--term-yellow)'
    case 'boolean':
      return 'var(--term-purple)'
    case 'null':
      return 'var(--term-fg-dim)'
    default:
      return 'var(--term-fg)'
  }
}

function formatValue(value: any, type: string): string {
  if (type === 'string') return `"${value}"`
  if (type === 'null') return 'null'
  return String(value)
}
