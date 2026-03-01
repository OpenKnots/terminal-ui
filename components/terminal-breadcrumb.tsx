'use client'

import { ReactNode } from 'react'

export interface BreadcrumbItem {
  /** Display label */
  label: string
  /** Optional path/href for navigation */
  path?: string
}

export interface TerminalBreadcrumbProps {
  /** Breadcrumb items (auto-parsed if `path` string provided) */
  items?: BreadcrumbItem[]
  /** Full path string (alternative to items array) */
  path?: string
  /** Separator character (default: '/') */
  separator?: string | ReactNode
  /** Callback when item is clicked */
  onNavigate?: (path: string, index: number) => void
  /** Color variant (default: 'blue') */
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
 * Display file paths and navigation breadcrumbs in terminal style.
 * Supports both manual items array and automatic path parsing.
 *
 * @param items - Array of breadcrumb items (label + optional path)
 * @param path - Full path string to auto-parse (e.g., '~/projects/app/src')
 * @param separator - Separator character or element (default: '/')
 * @param onNavigate - Callback when a breadcrumb is clicked
 * @param variant - Color variant for current/hover state
 * @param className - Additional classes applied to the root element
 *
 * @example
 * ```tsx
 * // Auto-parse from path string
 * <TerminalBreadcrumb path="~/projects/terminal-ui/components" />
 *
 * // Manual items with navigation
 * <TerminalBreadcrumb
 *   items={[
 *     { label: '~', path: '/home' },
 *     { label: 'projects', path: '/home/projects' },
 *     { label: 'app', path: '/home/projects/app' },
 *   ]}
 *   onNavigate={(path) => console.log(path)}
 * />
 *
 * // Custom separator
 * <TerminalBreadcrumb path="~/src/components" separator=" > " />
 * ```
 */
export function TerminalBreadcrumb({
  items: providedItems,
  path,
  separator = '/',
  onNavigate,
  variant = 'blue',
  className = '',
}: TerminalBreadcrumbProps) {
  const color = variantColors[variant]

  // Parse items from path string if provided
  const items: BreadcrumbItem[] = providedItems || parsePath(path || '')

  if (items.length === 0) return null

  const handleClick = (item: BreadcrumbItem, index: number) => {
    if (item.path && onNavigate) {
      onNavigate(item.path, index)
    }
  }

  return (
    <nav
      className={`inline-flex items-center font-mono text-sm ${className}`.trim()}
      aria-label="Breadcrumb"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        const isClickable = !isLast && item.path && onNavigate

        return (
          <span key={i} className="inline-flex items-center">
            {isClickable ? (
              <button
                type="button"
                onClick={() => handleClick(item, i)}
                className="text-[var(--term-fg-dim)] hover:underline transition-colors"
                style={{
                  color: isLast ? color : undefined,
                }}
              >
                {item.label}
              </button>
            ) : (
              <span
                className={isLast ? '' : 'text-[var(--term-fg-dim)]'}
                style={{
                  color: isLast ? color : undefined,
                }}
              >
                {item.label}
              </span>
            )}

            {!isLast && (
              <span className="mx-1 text-[var(--term-fg-dim)]">
                {separator}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}

/**
 * Parse a path string into breadcrumb items.
 * Handles Unix (~, /) and Windows (C:\) paths.
 */
function parsePath(pathStr: string): BreadcrumbItem[] {
  if (!pathStr) return []

  // Normalize separators (support both / and \)
  const normalized = pathStr.replace(/\\/g, '/')

  // Split by / and filter empty segments
  const segments = normalized.split('/').filter(Boolean)

  // Handle absolute paths
  if (pathStr.startsWith('/')) {
    segments.unshift('/')
  }

  return segments.map((label) => ({ label }))
}
