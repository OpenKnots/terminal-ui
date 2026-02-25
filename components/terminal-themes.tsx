'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export const THEMES = [
  { id: 'default', name: 'Default', accent: '#10b981' },
  { id: 'dracula', name: 'Dracula', accent: '#bd93f9' },
  { id: 'nord', name: 'Nord', accent: '#81a1c1' },
  { id: 'monokai', name: 'Monokai', accent: '#a6e22e' },
  { id: 'github-dark', name: 'GitHub Dark', accent: '#58a6ff' },
  { id: 'solarized-dark', name: 'Solarized Dark', accent: '#268bd2' },
  { id: 'one-dark', name: 'One Dark', accent: '#61afef' },
  { id: 'gruvbox', name: 'Gruvbox', accent: '#b8bb26' },
  { id: 'catppuccin-mocha', name: 'Catppuccin Mocha', accent: '#cba6f7' },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'default',
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>('default')

  useEffect(() => {
    const stored = localStorage.getItem('terminal-theme') as ThemeId | null
    if (stored && THEMES.some((t) => t.id === stored)) {
      setThemeState(stored)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'default') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', theme)
    }
  }, [theme])

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id)
    localStorage.setItem('terminal-theme', id)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
