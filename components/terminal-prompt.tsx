'use client'

import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react'

interface TerminalPromptProps {
  onCommand: (cmd: string) => void
  history?: string[]
  prompt?: string
  placeholder?: string
  autoFocus?: boolean
}

/**
 * Interactive terminal command input with history navigation.
 * @param onCommand - Callback fired with the trimmed command string when the user submits
 * @param history - Array of previous commands to navigate with ArrowUp / ArrowDown
 * @param prompt - Prompt symbol displayed before the input (default: '$')
 * @param placeholder - Placeholder text shown when the input is empty
 * @param autoFocus - Whether to focus the input on mount (default: true)
 * @example
 * ```tsx
 * const [history, setHistory] = useState<string[]>([])
 *
 * <TerminalPrompt
 *   history={history}
 *   onCommand={(cmd) => {
 *     setHistory((h) => [...h, cmd])
 *     console.log('Command:', cmd)
 *   }}
 * />
 * ```
 */
export function TerminalPrompt({
  onCommand,
  history = [],
  prompt = '$',
  placeholder = 'Type a command...',
  autoFocus = true,
}: TerminalPromptProps) {
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(idx)
      setInput(history[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const idx = historyIndex + 1
      if (idx >= history.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(idx)
        setInput(history[idx])
      }
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const cmd = input.trim()
    if (!cmd) return
    onCommand(cmd)
    setInput('')
    setHistoryIndex(-1)
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 font-mono text-sm bg-[var(--term-bg)] px-3 py-2 rounded-md border border-[var(--glass-border)]"
    >
      <span className="text-[var(--term-green)] select-none shrink-0">{prompt}</span>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent text-[var(--term-fg)] outline-none placeholder:text-[var(--term-fg-dim)] caret-[var(--term-green)]"
          autoComplete="off"
          spellCheck={false}
          aria-label="Terminal command input"
        />
      </div>
    </form>
  )
}
