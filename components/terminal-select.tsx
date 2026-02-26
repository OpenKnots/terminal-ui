'use client'

import { useState, useCallback } from 'react'

/**
 * TerminalSelect — keyboard-driven selection list in terminal style.
 *
 * Arrow keys to navigate, Enter to select. Pure React, zero dependencies.
 *
 * @example
 * ```tsx
 * <TerminalSelect
 *   label="Choose a framework:"
 *   options={['React', 'Vue', 'Svelte', 'Angular']}
 *   onSelect={(value) => console.log(value)}
 * />
 * ```
 *
 * Renders:
 * ```
 * Choose a framework:
 *   ❯ React
 *     Vue
 *     Svelte
 *     Angular
 * ```
 */

interface TerminalSelectProps {
  /** Prompt label above the options. */
  label?: string
  /** List of selectable options. */
  options: string[]
  /** Called when user presses Enter on an option. */
  onSelect?: (value: string, index: number) => void
  /** Default selected index (default: 0). */
  defaultIndex?: number
  /** Color for the active cursor (default: 'green'). */
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

export function TerminalSelect({
  label,
  options,
  onSelect,
  defaultIndex = 0,
  variant = 'green',
}: TerminalSelectProps) {
  const [active, setActive] = useState(Math.min(defaultIndex, options.length - 1))
  const [selected, setSelected] = useState<number | null>(null)

  const color = variantColors[variant]

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (selected !== null) return

      switch (e.key) {
        case 'ArrowUp':
        case 'k':
          e.preventDefault()
          setActive((prev) => (prev > 0 ? prev - 1 : options.length - 1))
          break
        case 'ArrowDown':
        case 'j':
          e.preventDefault()
          setActive((prev) => (prev < options.length - 1 ? prev + 1 : 0))
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          setSelected(active)
          onSelect?.(options[active], active)
          break
      }
    },
    [active, options, onSelect, selected],
  )

  if (options.length === 0) return null

  return (
    <div
      className="font-mono text-sm mb-2 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="listbox"
      aria-label={label}
      aria-activedescendant={`opt-${active}`}
    >
      {label && (
        <div className="text-[var(--term-fg)] mb-1">{label}</div>
      )}
      {options.map((opt, i) => {
        const isActive = i === active
        const isSelected = i === selected

        return (
          <div
            key={i}
            id={`opt-${i}`}
            role="option"
            aria-selected={isActive}
            className="flex items-center"
          >
            <span
              className="w-6 text-right mr-1"
              style={{ color: isActive ? color : 'transparent' }}
            >
              {isSelected ? '✓' : '❯'}
            </span>
            <span
              style={{ color: isActive ? color : undefined }}
              className={isActive ? 'font-bold' : 'text-[var(--term-fg-dim)]'}
            >
              {opt}
            </span>
          </div>
        )
      })}
      {selected === null && (
        <div className="text-[var(--term-fg-dim)] mt-1 text-xs">
          ↑↓ navigate · enter select
        </div>
      )}
    </div>
  )
}
