'use client'

import { useState, type ReactNode } from 'react'

export interface TerminalAccordionProps {
  /** The title of the accordion header */
  title: string | ReactNode
  /** The content to display when expanded */
  children: ReactNode
  /** Whether the accordion is expanded by default (default: false) */
  defaultExpanded?: boolean
  /** Additional classes applied to the root element */
  className?: string
}

/**
 * An expandable section for long content or details.
 * 
 * @param title - The header text or element
 * @param children - The content inside the accordion
 * @param defaultExpanded - Initial expanded state
 * @param className - Additional classes
 * 
 * @example
 * ```tsx
 * <TerminalAccordion title="Show Details">
 *   <TerminalOutput>Detailed logs...</TerminalOutput>
 * </TerminalAccordion>
 * ```
 */
export function TerminalAccordion({
  title,
  children,
  defaultExpanded = false,
  className = '',
}: TerminalAccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className={`flex flex-col font-mono text-sm ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex items-center gap-2 hover:bg-[rgba(255,255,255,0.04)] px-1 py-0.5 -mx-1 rounded text-left transition-colors text-[var(--term-fg)] focus:outline-none focus:ring-1 focus:ring-[var(--term-blue)]/50"
      >
        <span className="text-[var(--term-blue)] w-3 flex justify-center shrink-0">
          {expanded ? '▼' : '▶'}
        </span>
        <span className="flex-1">{title}</span>
      </button>
      {expanded && (
        <div className="pl-4 mt-1 border-l-2 border-[rgba(255,255,255,0.1)] ml-[5px] py-1 text-[var(--term-fg-dim)]">
          {children}
        </div>
      )}
    </div>
  )
}
