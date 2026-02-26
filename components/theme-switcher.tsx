'use client'

import { useEffect, useMemo, useState } from 'react'

const THEME_OPTIONS = [
  { id: 'dracula', name: 'Dracula' },
  { id: 'nord', name: 'Nord' },
  { id: 'monokai', name: 'Monokai' },
  { id: 'github-dark', name: 'GitHub Dark' },
  { id: 'solarized-dark', name: 'Solarized Dark' },
  { id: 'one-dark', name: 'One Dark' },
  { id: 'gruvbox', name: 'Gruvbox' },
] as const

type ThemeId = (typeof THEME_OPTIONS)[number]['id']

interface ThemeSwitcherProps {
  className?: string
}

/**
 * Provides a simple UI for switching terminal themes.
 *
 * @param className - Optional classes for wrapper layout
 *
 * @example
 * ```tsx
 * <ThemeSwitcher />
 * ```
 */
export function ThemeSwitcher({ className = '' }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<ThemeId>('dracula')
  const validThemeIds = useMemo(() => new Set(THEME_OPTIONS.map((option) => option.id)), [])

  useEffect(() => {
    const savedTheme = localStorage.getItem('terminal-theme')
    const attrTheme = document.documentElement.getAttribute('data-theme')
    const initialTheme = [savedTheme, attrTheme].find(
      (value): value is ThemeId => !!value && validThemeIds.has(value as ThemeId),
    )

    if (initialTheme) {
      setTheme(initialTheme)
    }
  }, [validThemeIds])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('terminal-theme', theme)
  }, [theme])

  return (
    <label className={`inline-flex items-center gap-2 text-sm font-mono text-[var(--term-fg-dim)] ${className}`.trim()}>
      <span>Theme</span>
      <select
        value={theme}
        onChange={(event) => setTheme(event.target.value as ThemeId)}
        className="rounded border border-[var(--glass-border)] bg-[var(--term-bg-light)] px-2 py-1 text-[var(--term-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--term-blue)]"
      >
        {THEME_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  )
}
