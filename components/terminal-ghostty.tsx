'use client'

import { useEffect, useRef, useState } from 'react'
import {
  GHOSTTY_THEMES,
  applyGhosttyTheme,
  parseGhosttyTheme,
  type GhosttyTheme,
} from '@/lib/ghostty-theme'

/**
 * TerminalGhosttyTheme — load Ghostty terminal themes into terminal-ui.
 *
 * Supports built-in themes (Dracula, Nord, Catppuccin Mocha, Solarized Dark)
 * and custom Ghostty theme file contents.
 *
 * @example
 * ```tsx
 * // Built-in theme
 * <TerminalGhosttyTheme theme="dracula">
 *   <Terminal title="my-app">
 *     <TerminalOutput>Hello Ghostty!</TerminalOutput>
 *   </Terminal>
 * </TerminalGhosttyTheme>
 *
 * // Custom theme string
 * <TerminalGhosttyTheme raw={customThemeString}>
 *   <Terminal title="custom">...</Terminal>
 * </TerminalGhosttyTheme>
 * ```
 */

type BuiltinTheme = keyof typeof GHOSTTY_THEMES

interface TerminalGhosttyThemeProps {
  /** Built-in Ghostty theme name. */
  theme?: BuiltinTheme
  /** Raw Ghostty theme file content (overrides `theme` prop). */
  raw?: string
  /** Child components to render with the theme applied. */
  children: React.ReactNode
}

export function TerminalGhosttyTheme({
  theme = 'dracula',
  raw,
  children,
}: TerminalGhosttyThemeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const source = raw ?? GHOSTTY_THEMES[theme]
    const parsed = parseGhosttyTheme(source)
    applyGhosttyTheme(containerRef.current, parsed)
  }, [theme, raw])

  return <div ref={containerRef}>{children}</div>
}

/**
 * GhosttyThemePicker — interactive Ghostty theme selector.
 *
 * Shows a grid of theme previews. Clicking a theme applies it.
 *
 * @example
 * ```tsx
 * <GhosttyThemePicker onSelect={(name, theme) => console.log(name, theme)} />
 * ```
 */

interface GhosttyThemePickerProps {
  /** Called when user selects a theme. */
  onSelect?: (name: string, theme: GhosttyTheme) => void
  /** Currently active theme name. */
  active?: string
}

export function GhosttyThemePicker({ onSelect, active }: GhosttyThemePickerProps) {
  const themes = Object.entries(GHOSTTY_THEMES)

  return (
    <div className="font-mono text-sm mb-2">
      <div className="text-[var(--term-fg)] font-bold mb-2">
        👻 Ghostty Themes
      </div>
      <div className="grid grid-cols-2 gap-2">
        {themes.map(([name, source]) => {
          const parsed = parseGhosttyTheme(source)
          const isActive = name === active

          return (
            <button
              key={name}
              onClick={() => onSelect?.(name, parsed)}
              className={`
                text-left rounded p-2 border transition-all
                ${isActive
                  ? 'border-[var(--term-blue)] ring-1 ring-[var(--term-blue)]/50'
                  : 'border-[var(--glass-border)] hover:border-[var(--term-fg-dim)]'
                }
              `}
              style={{ backgroundColor: parsed.background }}
            >
              <div
                className="text-xs font-bold mb-1"
                style={{ color: parsed.foreground }}
              >
                {name}
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: parsed.palette[i] ?? '#888' }}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
