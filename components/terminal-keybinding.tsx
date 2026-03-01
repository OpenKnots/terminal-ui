'use client'

import { ReactNode } from 'react'

export interface TerminalKeybindingProps {
  /** Keyboard shortcut (e.g., 'Ctrl+C', 'Alt+Tab', '↑') */
  keys: string
  /** Optional description of the action */
  description?: string
  /** Variant color (default: 'neutral') */
  variant?: 'neutral' | 'success' | 'error' | 'warning' | 'info'
  /** Additional CSS classes */
  className?: string
}

const variantClasses: Record<NonNullable<TerminalKeybindingProps['variant']>, string> = {
  neutral: 'border-[var(--glass-border)] text-[var(--term-fg)]',
  success: 'border-[var(--term-green)]/40 text-[var(--term-green)]',
  error: 'border-[var(--term-red)]/40 text-[var(--term-red)]',
  warning: 'border-[var(--term-yellow)]/40 text-[var(--term-yellow)]',
  info: 'border-[var(--term-blue)]/40 text-[var(--term-blue)]',
}

// Special key mappings for consistent display
const KEY_DISPLAY_MAP: Record<string, string> = {
  // Modifiers
  ctrl: 'Ctrl',
  control: 'Ctrl',
  cmd: 'Cmd',
  command: 'Cmd',
  meta: 'Meta',
  alt: 'Alt',
  option: 'Alt',
  shift: 'Shift',
  // Special keys
  enter: 'Enter',
  return: 'Enter',
  esc: 'Esc',
  escape: 'Esc',
  tab: 'Tab',
  space: 'Space',
  backspace: 'Backspace',
  delete: 'Del',
  // Arrow keys (support both symbols and names)
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
  arrowup: '↑',
  arrowdown: '↓',
  arrowleft: '←',
  arrowright: '→',
}

/**
 * Displays keyboard shortcuts in terminal-style format.
 * Parses key combinations and renders them as styled badges.
 *
 * @param keys - Keyboard shortcut string (e.g., 'Ctrl+C', 'Alt+Tab', '↑')
 * @param description - Optional description of what the shortcut does
 * @param variant - Visual variant for semantic color
 * @param className - Additional classes applied to the root element
 *
 * @example
 * ```tsx
 * <TerminalKeybinding keys="Ctrl+C" description="Copy" />
 * <TerminalKeybinding keys="Alt+Tab" variant="info" />
 * <TerminalKeybinding keys="↑" description="Previous command" />
 * <TerminalKeybinding keys="Cmd+Shift+P" description="Command palette" />
 * ```
 */
export function TerminalKeybinding({
  keys,
  description,
  variant = 'neutral',
  className = '',
}: TerminalKeybindingProps) {
  // Parse the keys string (split by + or -)
  const keyParts = keys
    .split(/[\+\-]/)
    .map((k) => k.trim())
    .filter(Boolean)
    .map((k) => {
      const lower = k.toLowerCase()
      return KEY_DISPLAY_MAP[lower] || k
    })

  const variantClass = variantClasses[variant]

  return (
    <div className={`inline-flex items-center gap-2 ${className}`.trim()}>
      {/* Key badges */}
      <span className="inline-flex items-center gap-1">
        {keyParts.map((key, i) => (
          <span key={i} className="inline-flex items-center">
            {i > 0 && (
              <span className="text-[var(--term-fg-dim)] mx-0.5 text-xs">+</span>
            )}
            <kbd
              className={`inline-flex items-center justify-center rounded border px-2 py-0.5 font-mono text-xs leading-none min-w-[1.5rem] bg-[var(--glass-bg)] ${variantClass}`.trim()}
            >
              {key}
            </kbd>
          </span>
        ))}
      </span>

      {/* Optional description */}
      {description && (
        <span className="text-sm text-[var(--term-fg-dim)]">{description}</span>
      )}
    </div>
  )
}
