'use client'

import { cn } from '@/lib/utils'

interface KeyProps {
  /** The key label (e.g. 'Ctrl', 'K', '⌘', '↑'). */
  children: string
  /** Visual size variant. */
  size?: 'sm' | 'md'
}

/**
 * Renders a single keyboard key cap.
 *
 * @param children - Key label text
 * @param size - Size variant (default: 'md')
 *
 * @example
 * ```tsx
 * <Key>Ctrl</Key>
 * <Key size="sm">K</Key>
 * ```
 */
export function Key({ children, size = 'md' }: KeyProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded border',
        'border-[var(--glass-border)] bg-[var(--term-bg-panel)]',
        'font-mono text-[var(--term-fg)] leading-none select-none',
        size === 'sm' ? 'min-w-5 px-1 py-0.5 text-[10px]' : 'min-w-6 px-1.5 py-1 text-xs',
      )}
    >
      {children}
    </kbd>
  )
}

interface ShortcutProps {
  /** Key combination, e.g. ['Ctrl', 'K'] or ['⌘', 'Shift', 'P']. */
  keys: string[]
  /** Description shown beside the shortcut. */
  label?: string
  /** Size variant passed to each Key. */
  size?: 'sm' | 'md'
}

/**
 * Displays a keyboard shortcut as styled key caps joined by `+`.
 *
 * @param keys - Array of key labels forming the shortcut
 * @param label - Optional description text
 * @param size - Key size variant (default: 'md')
 *
 * @example
 * ```tsx
 * <Shortcut keys={['Ctrl', 'K']} label="Command palette" />
 * <Shortcut keys={['⌘', 'Shift', 'P']} />
 * ```
 */
export function Shortcut({ keys, label, size = 'md' }: ShortcutProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((key, i) => (
        <span key={i} className="inline-flex items-center gap-0.5">
          {i > 0 && (
            <span className="text-[var(--term-fg-dim)] text-xs mx-0.5">+</span>
          )}
          <Key size={size}>{key}</Key>
        </span>
      ))}
      {label && (
        <span className="ml-2 text-sm text-[var(--term-fg-dim)]">{label}</span>
      )}
    </span>
  )
}

interface ShortcutEntry {
  /** Key combination. */
  keys: string[]
  /** Description of the action. */
  label: string
}

interface TerminalKeyboardProps {
  /** Title shown above the shortcut list. */
  title?: string
  /** Array of shortcut definitions. */
  shortcuts: ShortcutEntry[]
  /** Number of columns (default: 1). */
  columns?: 1 | 2
  /** Additional CSS classes. */
  className?: string
}

/**
 * Displays a terminal-style keyboard shortcut guide.
 * Renders a list of key combinations with descriptions in a compact,
 * monospace-friendly layout.
 *
 * @param title - Optional heading above the shortcuts
 * @param shortcuts - Array of `{ keys, label }` entries
 * @param columns - Column layout (default: 1)
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <TerminalKeyboard
 *   title="Shortcuts"
 *   shortcuts={[
 *     { keys: ['Ctrl', 'K'], label: 'Command palette' },
 *     { keys: ['↑', '↓'], label: 'Navigate history' },
 *     { keys: ['Ctrl', 'C'], label: 'Cancel command' },
 *   ]}
 * />
 * ```
 */
export function TerminalKeyboard({
  title,
  shortcuts,
  columns = 1,
  className,
}: TerminalKeyboardProps) {
  return (
    <div
      className={cn(
        'rounded border border-[var(--glass-border)] bg-[var(--term-bg-panel)] p-3 font-mono text-sm',
        className,
      )}
    >
      {title && (
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--term-fg-dim)]">
          {title}
        </div>
      )}
      <div
        className={cn(
          'grid gap-y-1.5 gap-x-6',
          columns === 2 ? 'grid-cols-2' : 'grid-cols-1',
        )}
      >
        {shortcuts.map((entry, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-sm text-[var(--term-fg-dim)] truncate">
              {entry.label}
            </span>
            <Shortcut keys={entry.keys} size="sm" />
          </div>
        ))}
      </div>
    </div>
  )
}
