'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'

export interface TerminalPromptProps {
  /**
   * Prompt symbol (default: '$')
   */
  prompt?: string
  /**
   * Placeholder text for input
   */
  placeholder?: string
  /**
   * List of available commands for autocomplete
   */
  commands?: string[]
  /**
   * Callback when command is submitted
   */
  onSubmit?: (command: string) => void
  /**
   * Whether to show command history
   */
  showHistory?: boolean
  /**
   * Maximum history items to keep
   */
  maxHistory?: number
  /**
   * Custom prefix before prompt (e.g., 'user@host:~')
   */
  prefix?: string | ReactNode
}

/**
 * Interactive terminal prompt component with command history and autocomplete.
 * Provides a terminal-like input experience with keyboard navigation through history,
 * command autocomplete suggestions, and visual feedback.
 *
 * @param prompt - Prompt symbol displayed before input (default: '$')
 * @param placeholder - Placeholder text shown when input is empty
 * @param commands - Array of available commands for autocomplete
 * @param onSubmit - Callback function triggered when command is submitted
 * @param showHistory - Whether to display command history (default: true)
 * @param maxHistory - Maximum number of history items to retain (default: 50)
 * @param prefix - Custom prefix text before the prompt (e.g., 'user@host:~')
 *
 * @example
 * ```tsx
 * <TerminalPrompt
 *   prefix="user@host:~"
 *   prompt="$"
 *   commands={['ls', 'cd', 'pwd', 'echo', 'cat']}
 *   onSubmit={(cmd) => console.log('Executed:', cmd)}
 *   showHistory={true}
 * />
 * ```
 */
export function TerminalPrompt({
  prompt = '$',
  placeholder = 'Enter command...',
  commands = [],
  onSubmit,
  showHistory = true,
  maxHistory = 50,
  prefix,
}: TerminalPromptProps) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update suggestions based on input
  useEffect(() => {
    if (input.trim() && commands.length > 0) {
      const matches = commands.filter((cmd) => cmd.toLowerCase().startsWith(input.toLowerCase()))
      setSuggestions(matches)
      setSelectedSuggestion(-1)
    } else {
      setSuggestions([])
    }
  }, [input, commands])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedSuggestion >= 0) {
        // Use selected suggestion
        const selected = suggestions[selectedSuggestion]
        setInput(selected)
        setSuggestions([])
        setSelectedSuggestion(-1)
        if (onSubmit) onSubmit(selected)
        if (showHistory) {
          setHistory([selected, ...history.slice(0, maxHistory - 1)])
          setHistoryIndex(-1)
        }
      } else if (input.trim()) {
        // Submit current input
        if (onSubmit) onSubmit(input)
        if (showHistory) {
          setHistory([input, ...history.slice(0, maxHistory - 1)])
          setHistoryIndex(-1)
        }
        setInput('')
        setSuggestions([])
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (suggestions.length > 0) {
        // Navigate suggestions
        setSelectedSuggestion(Math.max(-1, selectedSuggestion - 1))
      } else if (showHistory && history.length > 0) {
        // Navigate history
        const newIndex = Math.min(history.length - 1, historyIndex + 1)
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (suggestions.length > 0) {
        // Navigate suggestions
        setSelectedSuggestion(Math.min(suggestions.length - 1, selectedSuggestion + 1))
      } else if (showHistory && historyIndex >= 0) {
        // Navigate history
        const newIndex = historyIndex - 1
        if (newIndex < 0) {
          setHistoryIndex(-1)
          setInput('')
        } else {
          setHistoryIndex(newIndex)
          setInput(history[newIndex])
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestions.length > 0) {
        // Auto-complete with first suggestion
        setInput(suggestions[0])
        setSuggestions([])
      }
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setSelectedSuggestion(-1)
    }
  }

  return (
    <div className="space-y-1">
      {/* Prompt line */}
      <div className="flex items-center gap-1 text-[var(--term-fg)] font-mono text-sm">
        {prefix && <span className="text-[var(--term-fg-dim)]">{prefix}</span>}
        <span className="text-[var(--term-green)]">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-[var(--term-fg)] placeholder-[var(--term-fg-dim)]"
          autoFocus
        />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="ml-4 space-y-0 text-[var(--term-blue)] font-mono text-sm">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className={`px-2 ${
                idx === selectedSuggestion
                  ? 'bg-[var(--term-blue)] text-[var(--term-bg)]'
                  : 'text-[var(--term-blue)]'
              }`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
