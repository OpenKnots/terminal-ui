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
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha' },
] as const

type ThemeId = (typeof THEME_OPTIONS)[number]['id']

interface ThemeSwitcherProps {
  className?: string
}

/**
 * Dropdown for switching terminal color themes at runtime.
 * Persists selection to localStorage and applies via data-theme attribute.
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
  const validThemeIds = useMemo(() => new Set(THEME_OPTIONS.map((o) => o.id)), [])

  useEffect(() => {
    const saved = localStorage.getItem('terminal-theme')
    const attr = document.documentElement.getAttribute('data-theme')
    const initial = [saved, attr].find(
      (v): v is ThemeId => !!v && validThemeIds.has(v as ThemeId),
    )
    if (initial) setTheme(initial)
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
        onChange={(e) => setTheme(e.target.value as ThemeId)}
        className="rounded border border-[var(--glass-border)] bg-[var(--term-bg-light)] px-2 py-1 text-[var(--term-fg)] focus:outline-none focus:ring-2 focus:ring-[var(--term-blue)]"
      >
        {THEME_OPTIONS.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    </label>
  )
}
