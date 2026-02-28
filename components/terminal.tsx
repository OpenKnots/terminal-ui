'use client'

import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy, Minimize2, Maximize2, X } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-typescript'

interface TerminalProps {
  children: ReactNode
  title?: string
  prompt?: string
  className?: string
}

const TerminalPromptContext = createContext('$')

/**
 * Displays a terminal window with macOS-style chrome and content area.
 * Renders a terminal emulator UI with title bar, window controls, and monospace content.
 * 
 * @param children - Terminal content (TerminalCommand, TerminalOutput, TerminalSpinner components)
 * @param title - Window title shown in the chrome (default: 'Terminal')
 * @param prompt - Command prompt symbol (default: '$')
 * @param className - Additional CSS classes to apply to the container
 * 
 * @example
 * ```tsx
 * <Terminal title="my-app" prompt="user@host">
 *   <TerminalCommand>npm install</TerminalCommand>
 *   <TerminalOutput type="success">✓ Installed</TerminalOutput>
 * </Terminal>
 * ```
 */
export function Terminal({ children, title = 'Terminal', prompt = '$', className = '' }: TerminalProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  async function handleCopy() {
    const text = contentRef.current?.innerText.trim()
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore clipboard errors in unsupported environments.
    }
  }

  return (
    <div className={`flex flex-col bg-[var(--term-bg-light)] border border-[var(--glass-border)] rounded-lg overflow-hidden ${className}`}>
      {/* Window Chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--glass-border)] bg-[rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <div className="w-3 h-3 rounded-full bg-[#eab308]" />
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
        </div>
        <div className="text-xs text-[var(--term-fg-dim)] font-mono">
          {title}
        </div>
        <button
          type="button"
          aria-label={copied ? 'Copied terminal content' : 'Copy terminal content'}
          onClick={handleCopy}
          className="inline-flex h-6 w-6 items-center justify-center rounded border border-[var(--glass-border)] text-[var(--term-fg-dim)] transition-colors hover:text-[var(--term-fg)] hover:bg-[var(--glass-bg)]"
        >
          {copied ? <Check size={12} className="text-[var(--term-green)]" /> : <Copy size={12} />}
        </button>
      </div>
      
      {/* Terminal Content */}
      <div ref={contentRef} className="terminal-scroll min-h-0 flex-1 overflow-auto p-4 font-mono text-sm">
        <TerminalPromptContext.Provider value={prompt}>{children}</TerminalPromptContext.Provider>
      </div>
    </div>
  )
}

interface TerminalCommandProps {
  children: ReactNode
  prompt?: string
}

/**
 * Displays a command line in the terminal with a prompt symbol.
 * Renders text with a leading prompt indicator (typically '$' or '#').
 * Inherits prompt from parent Terminal component via context if not specified.
 * 
 * @param children - The command text to display
 * @param prompt - The prompt symbol to display before the command (inherited from Terminal if omitted)
 * 
 * @example
 * ```tsx
 * <TerminalCommand prompt="user@host:~$">ls -la</TerminalCommand>
 * // Renders: user@host:~$ ls -la
 * ```
 */
export function TerminalCommand({ children, prompt }: TerminalCommandProps) {
  const inheritedPrompt = useContext(TerminalPromptContext)

  return (
    <div className="flex items-start gap-2 mb-1">
      <span className="text-[var(--term-green)] select-none">{prompt ?? inheritedPrompt}</span>
      <span className="flex-1">{children}</span>
    </div>
  )
}

interface TerminalOutputProps {
  children: ReactNode
  type?: 'normal' | 'success' | 'error' | 'info' | 'warning'
  /** Enable character-by-character typing animation (string children only). */
  animate?: boolean
  /** Milliseconds between each character when animating (default: 35, min: 10). */
  delay?: number
  /** Language for Prism.js syntax highlighting (e.g. 'json', 'typescript'). */
  language?: string
}

/**
 * Displays output text with semantic coloring based on message type.
 * Uses theme colors to indicate success (green), error (red), info (blue), or warning (yellow).
 * Supports optional typing animation for string children and Prism.js syntax highlighting.
 * 
 * @param children - The output text to display
 * @param type - The type of output message (default: 'normal')
 * @param animate - Enable typing animation (default: false)
 * @param delay - Milliseconds per character when animating (default: 35)
 * @param language - Language for syntax highlighting (e.g. 'json', 'typescript')
 * 
 * @example
 * ```tsx
 * <TerminalOutput type="success">Build completed successfully</TerminalOutput>
 * <TerminalOutput language="json">{"key": "value"}</TerminalOutput>
 * ```
 */
export function TerminalOutput({
  children,
  type = 'normal',
  animate = false,
  delay = 35,
  language,
}: TerminalOutputProps) {
  const [typedText, setTypedText] = useState('')

  const colors = {
    normal: 'text-[var(--term-fg-dim)]',
    success: 'text-[var(--term-green)]',
    error: 'text-[var(--term-red)]',
    info: 'text-[var(--term-blue)]',
    warning: 'text-[var(--term-yellow)]',
  }

  const textContent = useMemo(() => {
    if (typeof children === 'string' || typeof children === 'number') {
      return String(children)
    }
    return null
  }, [children])

  const highlightedHtml = useMemo(() => {
    if (!language || textContent === null) return null

    const normalizedLanguage = language.toLowerCase()
    const grammar = Prism.languages[normalizedLanguage]
    if (!grammar) return null

    return Prism.highlight(textContent, grammar, normalizedLanguage)
  }, [language, textContent])

  useEffect(() => {
    if (!animate || textContent === null) {
      setTypedText(textContent ?? '')
      return
    }

    setTypedText('')
    let index = 0
    const tickDelay = Math.max(10, delay)
    const timer = window.setInterval(() => {
      index += 1
      setTypedText(textContent.slice(0, index))
      if (index >= textContent.length) {
        window.clearInterval(timer)
      }
    }, tickDelay)

    return () => {
      window.clearInterval(timer)
    }
  }, [animate, delay, textContent])

  return (
    <div className={`mb-1 whitespace-pre-wrap ${colors[type]}`}>
      {highlightedHtml ? (
        <code className="terminal-code" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
      ) : animate && textContent !== null ? typedText : children}
    </div>
  )
}

interface TerminalSpinnerProps {
  text?: string
}

/**
 * Displays an animated spinner with optional text for loading states.
 * Uses Unicode braille characters for smooth animation.
 * 
 * @param text - Optional text to display next to the spinner
 * 
 * @example
 * ```tsx
 * <TerminalSpinner text="Installing dependencies..." />
 * // Renders: ⠋ Installing dependencies...
 * ```
 */
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] as const

export function TerminalSpinner({ text }: TerminalSpinnerProps) {
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % SPINNER_FRAMES.length)
    }, 80)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-2 text-[var(--term-blue)]">
      <span>{SPINNER_FRAMES[frameIndex]}</span>
      {text && <span>{text}</span>}
    </div>
  )
}

export { TerminalProgress } from './terminal-progress'
export { TerminalPrompt } from './terminal-prompt'
export { TerminalTree } from './terminal-tree'
export type { TreeNode, TreeRenderContext, TerminalTreeProps } from './terminal-tree'
export { TerminalLog } from './terminal-log'
export { TerminalTable, type ColumnAlign } from './terminal-table'
export { TerminalBarChart, TerminalSparkline, type BarChartVariant } from './terminal-chart'
export { TerminalSelect } from './terminal-select'
export { TerminalAlert } from './terminal-alert'
export { TerminalTabs } from './terminal-tabs'
export { TerminalSplit } from './terminal-split'
export { TerminalDiff } from './terminal-diff'
export { TerminalAutocomplete, useAutocomplete, COMMON_COMMANDS, COMMON_FLAGS, filterSuggestions, type TerminalAutocompleteProps, type AutocompleteSuggestion } from './terminal-autocomplete'
export { TerminalGhosttyTheme, GhosttyThemePicker } from './terminal-ghostty'
export { ThemeSwitcher } from './theme-switcher'
export { TerminalBadge } from './terminal-badge'
export { TerminalCheckbox, TerminalRadio } from './terminal-checkbox'
