'use client'

import { Fragment } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

export interface TerminalBreadcrumbsProps {
  /** Array of breadcrumb segments */
  items: BreadcrumbItem[]
  /** Separator string between items (default: '/') */
  separator?: string
  /** Additional classes applied to the root element */
  className?: string
}

/**
 * Displays a directory path or navigation trail in a terminal style.
 * 
 * @param items - Array of breadcrumb segments
 * @param separator - Separator string between items (default: '/')
 * @param className - Additional classes applied to the root element
 * 
 * @example
 * ```tsx
 * <TerminalBreadcrumbs items={[
 *   { label: '~' },
 *   { label: 'projects' },
 *   { label: 'terminal-ui', active: true }
 * ]} />
 * ```
 */
export function TerminalBreadcrumbs({
  items,
  separator = '/',
  className = '',
}: TerminalBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 font-mono text-sm ${className}`.trim()}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const active = item.active ?? isLast

        const content = (
          <span className={`transition-colors ${active ? 'text-[var(--term-blue)] font-bold' : 'text-[var(--term-fg)] hover:text-[var(--term-cyan)]'}`}>
            {item.label}
          </span>
        )

        return (
          <Fragment key={index}>
            {item.href && !active ? (
              <a href={item.href} className="outline-none focus-visible:ring-1 focus-visible:ring-[var(--term-blue)] rounded">
                {content}
              </a>
            ) : (
              <span className="outline-none">
                {content}
              </span>
            )}
            
            {!isLast && (
              <span className="text-[var(--term-fg-dim)] select-none" aria-hidden>
                {separator}
              </span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
