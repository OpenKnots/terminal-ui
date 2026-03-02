'use client'

import ReactMarkdown from 'react-markdown'
import { Components } from 'react-markdown'

export interface TerminalMarkdownProps {
  /** Markdown content string */
  content: string
  /** Enable syntax highlighting for code blocks (default: true) */
  highlightCode?: boolean
  /** Color variant for links/emphasis (default: 'blue') */
  variant?: 'green' | 'blue' | 'yellow' | 'red' | 'purple' | 'cyan'
  /** Additional CSS classes */
  className?: string
}

const variantColors: Record<string, string> = {
  green: 'var(--term-green)',
  blue: 'var(--term-blue)',
  yellow: 'var(--term-yellow)',
  red: 'var(--term-red)',
  purple: 'var(--term-purple)',
  cyan: 'var(--term-cyan)',
}

/**
 * Render Markdown content in terminal-styled output.
 * Maps Markdown elements to terminal components with syntax highlighting.
 *
 * @param content - Markdown content string
 * @param highlightCode - Enable syntax highlighting for code blocks (default: true)
 * @param variant - Color variant for links and emphasis (default: 'blue')
 * @param className - Additional classes applied to the root element
 *
 * @example
 * ```tsx
 * <TerminalMarkdown
 *   content={`
 * # Terminal UI
 * 
 * A **React** component library for building terminal-style interfaces.
 * 
 * ## Features
 * - Syntax highlighting
 * - Command output
 * - Progress bars
 * 
 * \`\`\`bash
 * npm install terminal-ui
 * \`\`\`
 *   `}
 * />
 * ```
 */
export function TerminalMarkdown({
  content,
  highlightCode = true,
  variant = 'blue',
  className = '',
}: TerminalMarkdownProps) {
  const color = variantColors[variant]

  const components: Components = {
    // Headings
    h1: ({ children }) => (
      <h1
        className="mb-3 mt-4 text-2xl font-bold"
        style={{ color: 'var(--term-green)' }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className="mb-2 mt-3 text-xl font-semibold"
        style={{ color: 'var(--term-blue)' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="mb-2 mt-3 text-lg font-semibold"
        style={{ color: 'var(--term-cyan)' }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mb-1 mt-2 font-semibold text-[var(--term-fg)]">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="mb-1 mt-2 font-semibold text-[var(--term-fg)]">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="mb-1 mt-2 font-semibold text-[var(--term-fg-dim)]">{children}</h6>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p className="mb-2 text-[var(--term-fg)] leading-relaxed">{children}</p>
    ),

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        className="underline transition-colors hover:opacity-80"
        style={{ color }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),

    // Emphasis
    strong: ({ children }) => (
      <strong className="font-bold text-[var(--term-fg)]">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-[var(--term-fg)]">{children}</em>
    ),

    // Code (inline)
    code: ({ children, className }) => {
      const isBlock = className?.includes('language-')
      if (isBlock) {
        // Block code is handled by pre > code
        return <code className={className}>{children}</code>
      }
      // Inline code
      return (
        <code className="rounded bg-[var(--glass-bg)] px-1.5 py-0.5 font-mono text-sm text-[var(--term-green)]">
          {children}
        </code>
      )
    },

    // Code blocks
    pre: ({ children }) => (
      <pre className="mb-3 overflow-x-auto rounded border border-[var(--glass-border)] bg-[var(--term-bg-light)] p-3 font-mono text-sm">
        {children}
      </pre>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="mb-2 ml-4 list-none space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-2 ml-4 list-decimal space-y-1 text-[var(--term-fg)]">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-[var(--term-fg)]">
        <span className="mr-2 text-[var(--term-green)]">•</span>
        {children}
      </li>
    ),

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="my-2 border-l-4 border-[var(--term-blue)] bg-[var(--glass-bg)] py-1 pl-4 pr-2 italic text-[var(--term-fg-dim)]">
        {children}
      </blockquote>
    ),

    // Horizontal rule
    hr: () => (
      <hr className="my-4 border-t border-[var(--glass-border)]" />
    ),

    // Table
    table: ({ children }) => (
      <div className="mb-3 overflow-x-auto">
        <table className="min-w-full border-collapse border border-[var(--glass-border)] font-mono text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-[var(--glass-bg)]">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-[var(--glass-border)]">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border border-[var(--glass-border)] px-3 py-2 text-left font-semibold text-[var(--term-fg)]">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-[var(--glass-border)] px-3 py-2 text-[var(--term-fg)]">
        {children}
      </td>
    ),
  }

  return (
    <div className={`font-sans text-sm ${className}`.trim()}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  )
}
