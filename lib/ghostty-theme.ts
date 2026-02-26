/**
 * Parse Ghostty terminal theme files into CSS custom properties.
 *
 * Ghostty themes use a simple `key = value` format with 16-color palette,
 * background, foreground, cursor, and selection colors. This parser converts
 * them to CSS variables compatible with terminal-ui's theming system.
 *
 * @see https://ghostty.org/docs/config/reference
 * @see https://github.com/mbadolato/iTerm2-Color-Schemes/tree/master/ghostty
 *
 * @example
 * ```ts
 * const theme = parseGhosttyTheme(`
 *   background = #282a36
 *   foreground = #f8f8f2
 *   palette = 0=#21222c
 *   palette = 1=#ff5555
 *   palette = 2=#50fa7b
 * `)
 *
 * // Apply to a terminal element
 * applyGhosttyTheme(element, theme)
 * ```
 */

export interface GhosttyTheme {
  background: string
  foreground: string
  cursor?: string
  cursorText?: string
  selectionBackground?: string
  selectionForeground?: string
  /** 16-color palette (indices 0-15) */
  palette: Record<number, string>
}

/** Standard ANSI color names mapped to palette indices */
const ANSI_NAMES = [
  'black', 'red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'white',
  'bright-black', 'bright-red', 'bright-green', 'bright-yellow',
  'bright-blue', 'bright-purple', 'bright-cyan', 'bright-white',
] as const

/**
 * Parse a Ghostty theme file string into a structured theme object.
 * Lines are `key = value` format. Comments start with `#` at line start.
 */
export function parseGhosttyTheme(input: string): GhosttyTheme {
  const theme: GhosttyTheme = {
    background: '#282c34',
    foreground: '#ffffff',
    palette: {},
  }

  for (const raw of input.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue

    const eqIndex = line.indexOf('=')
    if (eqIndex === -1) continue

    const key = line.slice(0, eqIndex).trim()
    const value = line.slice(eqIndex + 1).trim()

    switch (key) {
      case 'background':
        theme.background = normalizeHex(value)
        break
      case 'foreground':
        theme.foreground = normalizeHex(value)
        break
      case 'cursor-color':
        theme.cursor = normalizeHex(value)
        break
      case 'cursor-text':
        theme.cursorText = normalizeHex(value)
        break
      case 'selection-background':
        theme.selectionBackground = normalizeHex(value)
        break
      case 'selection-foreground':
        theme.selectionForeground = normalizeHex(value)
        break
      case 'palette': {
        const palEq = value.indexOf('=')
        if (palEq !== -1) {
          const idx = parseInt(value.slice(0, palEq), 10)
          const color = normalizeHex(value.slice(palEq + 1).trim())
          if (idx >= 0 && idx <= 15) {
            theme.palette[idx] = color
          }
        }
        break
      }
    }
  }

  return theme
}

/** Ensure hex color has # prefix */
function normalizeHex(value: string): string {
  const v = value.trim()
  return v.startsWith('#') ? v : `#${v}`
}

/**
 * Convert a GhosttyTheme to terminal-ui CSS custom properties.
 *
 * Maps Ghostty's 16-color palette to terminal-ui's semantic color vars:
 * - palette[1] (red)    → --term-red
 * - palette[2] (green)  → --term-green
 * - palette[3] (yellow) → --term-yellow
 * - palette[4] (blue)   → --term-blue
 * - palette[5] (purple) → --term-purple
 * - palette[6] (cyan)   → --term-cyan
 */
export function ghosttyThemeToCSSVars(theme: GhosttyTheme): Record<string, string> {
  const vars: Record<string, string> = {
    '--term-bg': theme.background,
    '--term-fg': theme.foreground,
    '--term-fg-dim': mixColor(theme.foreground, theme.background, 0.5),
  }

  // Map palette colors to semantic names
  const semanticMap: Record<number, string> = {
    1: '--term-red',
    2: '--term-green',
    3: '--term-yellow',
    4: '--term-blue',
    5: '--term-purple',
    6: '--term-cyan',
  }

  for (const [idx, varName] of Object.entries(semanticMap)) {
    const color = theme.palette[Number(idx)]
    if (color) {
      vars[varName] = color
    }
  }

  // Selection and cursor
  if (theme.selectionBackground) {
    vars['--term-selection-bg'] = theme.selectionBackground
  }
  if (theme.selectionForeground) {
    vars['--term-selection-fg'] = theme.selectionForeground
  }
  if (theme.cursor) {
    vars['--term-cursor'] = theme.cursor
  }

  // Glass/panel backgrounds derived from bg
  vars['--term-bg-panel'] = mixColor(theme.background, theme.foreground, 0.05)
  vars['--glass-bg'] = `${theme.background}33`
  vars['--glass-border'] = `${theme.foreground}22`

  return vars
}

/**
 * Apply a Ghostty theme to a DOM element by setting CSS custom properties.
 */
export function applyGhosttyTheme(element: HTMLElement, theme: GhosttyTheme): void {
  const vars = ghosttyThemeToCSSVars(theme)
  for (const [key, value] of Object.entries(vars)) {
    element.style.setProperty(key, value)
  }
}

/**
 * Simple hex color mixing (no dependencies).
 * Returns a hex color that is `ratio` between color1 and color2.
 */
function mixColor(hex1: string, hex2: string, ratio: number): string {
  const r1 = parseInt(hex1.slice(1, 3), 16) || 0
  const g1 = parseInt(hex1.slice(3, 5), 16) || 0
  const b1 = parseInt(hex1.slice(5, 7), 16) || 0
  const r2 = parseInt(hex2.slice(1, 3), 16) || 0
  const g2 = parseInt(hex2.slice(3, 5), 16) || 0
  const b2 = parseInt(hex2.slice(5, 7), 16) || 0

  const r = Math.round(r1 + (r2 - r1) * ratio)
  const g = Math.round(g1 + (g2 - g1) * ratio)
  const b = Math.round(b1 + (b2 - b1) * ratio)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/** Get the ANSI color name for a palette index (0-15) */
export function paletteIndexToName(index: number): string | undefined {
  return ANSI_NAMES[index]
}

/** Built-in Ghostty themes ported for terminal-ui */
export const GHOSTTY_THEMES = {
  dracula: `
palette = 0=#21222c
palette = 1=#ff5555
palette = 2=#50fa7b
palette = 3=#f1fa8c
palette = 4=#bd93f9
palette = 5=#ff79c6
palette = 6=#8be9fd
palette = 7=#f8f8f2
palette = 8=#6272a4
palette = 9=#ff6e6e
palette = 10=#69ff94
palette = 11=#ffffa5
palette = 12=#d6acff
palette = 13=#ff92df
palette = 14=#a4ffff
palette = 15=#ffffff
background = #282a36
foreground = #f8f8f2
cursor-color = #f8f8f2
selection-background = #44475a
selection-foreground = #ffffff`,

  nord: `
palette = 0=#3b4252
palette = 1=#bf616a
palette = 2=#a3be8c
palette = 3=#ebcb8b
palette = 4=#81a1c1
palette = 5=#b48ead
palette = 6=#88c0d0
palette = 7=#e5e9f0
palette = 8=#596377
palette = 9=#bf616a
palette = 10=#a3be8c
palette = 11=#ebcb8b
palette = 12=#81a1c1
palette = 13=#b48ead
palette = 14=#8fbcbb
palette = 15=#eceff4
background = #2e3440
foreground = #d8dee9
cursor-color = #eceff4
selection-background = #eceff4
selection-foreground = #4c566a`,

  'catppuccin-mocha': `
palette = 0=#45475a
palette = 1=#f38ba8
palette = 2=#a6e3a1
palette = 3=#f9e2af
palette = 4=#89b4fa
palette = 5=#f5c2e7
palette = 6=#94e2d5
palette = 7=#a6adc8
palette = 8=#585b70
palette = 9=#f37799
palette = 10=#89d88b
palette = 11=#ebd391
palette = 12=#74a8fc
palette = 13=#f2aede
palette = 14=#6bd7ca
palette = 15=#bac2de
background = #1e1e2e
foreground = #cdd6f4
cursor-color = #f5e0dc
selection-background = #585b70
selection-foreground = #cdd6f4`,

  'solarized-dark': `
palette = 0=#002831
palette = 1=#d11c24
palette = 2=#6cbe6c
palette = 3=#a57706
palette = 4=#2176c7
palette = 5=#c61c6f
palette = 6=#259286
palette = 7=#eae3cb
palette = 8=#006488
palette = 9=#f5163b
palette = 10=#51ef84
palette = 11=#b27e28
palette = 12=#178ec8
palette = 13=#e24d8e
palette = 14=#00b39e
palette = 15=#fcf4dc
background = #001e27
foreground = #9cc2c3
cursor-color = #f34b00
selection-background = #003748
selection-foreground = #7a8f8e`,
} as const
