'use client'

import { useState, useCallback, useMemo } from 'react'

/**
 * Represents a single autocomplete suggestion
 */
export interface AutocompleteSuggestion {
  label: string
  description?: string
  type: 'command' | 'flag' | 'file' | 'path'
  icon?: string
}

/**
 * Props for the TerminalAutocomplete component
 */
export interface TerminalAutocompleteProps {
  suggestions: AutocompleteSuggestion[]
  selectedIndex?: number
  onSelect?: (suggestion: AutocompleteSuggestion) => void
  className?: string
}

/**
 * TerminalAutocomplete Component
 * 
 * Displays a list of autocomplete suggestions for terminal commands.
 * Features:
 * - Keyboard navigation (arrow keys)
 * - Visual highlighting of selected suggestion
 * - Type indicators (command, flag, file, path)
 * - Optional descriptions for each suggestion
 * 
 * @example
 * ```tsx
 * const suggestions = [
 *   { label: 'ls', description: 'List files', type: 'command' },
 *   { label: '-la', description: 'Long format', type: 'flag' },
 * ]
 * 
 * <TerminalAutocomplete
 *   suggestions={suggestions}
 *   selectedIndex={0}
 *   onSelect={(s) => console.log(s.label)}
 * />
 * ```
 */
export function TerminalAutocomplete({
  suggestions,
  selectedIndex = 0,
  onSelect,
  className = '',
}: TerminalAutocompleteProps) {
  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      command: '⚙️',
      flag: '🚩',
      file: '📄',
      path: '📁',
    }
    return icons[type] || '•'
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      command: 'text-[var(--term-blue)]',
      flag: 'text-[var(--term-yellow)]',
      file: 'text-[var(--term-green)]',
      path: 'text-[var(--term-cyan)]',
    }
    return colors[type] || 'text-[var(--term-fg-dim)]'
  }

  if (suggestions.length === 0) {
    return null
  }

  return (
    <div
      className={`border border-[var(--glass-border)] rounded bg-[var(--term-bg-light)] mt-1 max-h-48 overflow-y-auto ${className}`}
      role="listbox"
      aria-label="Autocomplete suggestions"
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={`${suggestion.type}-${suggestion.label}`}
          role="option"
          aria-selected={index === selectedIndex}
          className={`px-3 py-2 cursor-pointer transition-colors ${
            index === selectedIndex
              ? 'bg-[var(--term-blue)] bg-opacity-30'
              : 'hover:bg-[var(--term-bg-dark)]'
          }`}
          onClick={() => onSelect?.(suggestion)}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
            <div className="flex-1">
              <div className={`font-mono text-sm ${getTypeColor(suggestion.type)}`}>
                {suggestion.label}
              </div>
              {suggestion.description && (
                <div className="text-xs text-[var(--term-fg-dim)] mt-0.5">
                  {suggestion.description}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Hook for managing autocomplete state and logic
 * 
 * @example
 * ```tsx
 * const { suggestions, selectedIndex, handleKeyDown } = useAutocomplete(
 *   availableSuggestions,
 *   (selected) => console.log(selected)
 * )
 * ```
 */
export function useAutocomplete(
  allSuggestions: AutocompleteSuggestion[],
  onSelect?: (suggestion: AutocompleteSuggestion) => void,
) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || allSuggestions.length === 0) return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : allSuggestions.length - 1,
          )
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < allSuggestions.length - 1 ? prev + 1 : 0,
          )
          break
        case 'Enter':
        case 'Tab':
          e.preventDefault()
          onSelect?.(allSuggestions[selectedIndex])
          setIsOpen(false)
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          break
      }
    },
    [isOpen, allSuggestions, selectedIndex, onSelect],
  )

  return {
    suggestions: allSuggestions,
    selectedIndex,
    isOpen,
    setIsOpen,
    handleKeyDown,
    selectSuggestion: (suggestion: AutocompleteSuggestion) => {
      onSelect?.(suggestion)
      setIsOpen(false)
    },
  }
}

/**
 * Predefined command suggestions for the terminal
 */
export const COMMON_COMMANDS: AutocompleteSuggestion[] = [
  { label: 'ls', description: 'List directory contents', type: 'command' },
  { label: 'cd', description: 'Change directory', type: 'command' },
  { label: 'pwd', description: 'Print working directory', type: 'command' },
  { label: 'cat', description: 'Display file contents', type: 'command' },
  { label: 'echo', description: 'Print text', type: 'command' },
  { label: 'mkdir', description: 'Create directory', type: 'command' },
  { label: 'rm', description: 'Remove files', type: 'command' },
  { label: 'cp', description: 'Copy files', type: 'command' },
  { label: 'mv', description: 'Move files', type: 'command' },
  { label: 'grep', description: 'Search text', type: 'command' },
  { label: 'find', description: 'Find files', type: 'command' },
  { label: 'git', description: 'Version control', type: 'command' },
  { label: 'npm', description: 'Node package manager', type: 'command' },
  { label: 'docker', description: 'Container management', type: 'command' },
]

/**
 * Common command flags
 */
export const COMMON_FLAGS: AutocompleteSuggestion[] = [
  { label: '-a', description: 'All files', type: 'flag' },
  { label: '-l', description: 'Long format', type: 'flag' },
  { label: '-r', description: 'Recursive', type: 'flag' },
  { label: '-f', description: 'Force', type: 'flag' },
  { label: '-v', description: 'Verbose', type: 'flag' },
  { label: '--help', description: 'Show help', type: 'flag' },
  { label: '--version', description: 'Show version', type: 'flag' },
]

/**
 * Filter suggestions based on input text
 */
export function filterSuggestions(
  input: string,
  suggestions: AutocompleteSuggestion[],
): AutocompleteSuggestion[] {
  if (!input) return suggestions

  const lowerInput = input.toLowerCase()
  return suggestions.filter((s) =>
    s.label.toLowerCase().startsWith(lowerInput),
  )
}
