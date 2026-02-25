# 🖥️ terminal-ui — Step-by-Step Implementation Breakdown

> React component library for building terminal-style UIs in the browser  
> Stack: Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui  
> Repo: https://github.com/OpenKnots/terminal-ui

---

## Step 1 — Project Scaffolding
Initialized a Next.js 16 project with TypeScript and Tailwind CSS 4. Configured `pnpm` as the required package manager. Added shadcn/ui for accessible primitives (resizable panels, context menus, command palette dialog, dropdowns, tooltips, badges, scroll areas).

## Step 2 — Design System (CSS Variables)
Defined a full set of CSS custom properties in `globals.css` under `:root`:
- **Backgrounds:** `--term-bg`, `--term-bg-light`, `--term-bg-panel`
- **Text:** `--term-fg`, `--term-fg-dim`
- **Semantic colors:** `--term-green` (success), `--term-red` (error), `--term-blue` (info), `--term-yellow` (warning), `--term-purple`, `--term-cyan`, `--term-orange`, `--term-pink`
- **Glass effects:** `--glass-bg`, `--glass-border` for frosted UI surfaces

All components reference these variables via Tailwind arbitrary values (`text-[var(--term-green)]`), so theming is fully centralized.

## Step 3 — Theme Engine
Built `terminal-themes.tsx` with a React Context + Provider pattern:
- Defined 5 themes: **Default**, **Dracula**, **Nord**, **Monokai**, **GitHub Dark**
- Each theme overrides the CSS variables via `[data-theme="..."]` selectors in CSS
- `ThemeProvider` reads/writes `localStorage` and sets `data-theme` on `<html>`
- `useTheme()` hook exposes `theme` and `setTheme()` to any component
- Themes are switchable via context menu, command palette, header dropdown, or the `theme` command

## Step 4 — Core Display Components (`terminal.tsx`)
Created 4 foundational components for static/declarative terminal UIs:
- **`Terminal`** — Container with macOS-style traffic light chrome (red/yellow/green dots), title bar, monospace content area
- **`TerminalCommand`** — Renders a command line with a colored `$` prompt
- **`TerminalOutput`** — Renders output with 5 style variants (normal, success, error, info, warning)
- **`TerminalSpinner`** — Animated loading indicator with optional label

## Step 5 — Interactive Terminal Pane (`terminal-pane.tsx`)
Built a fully interactive shell emulator:
- **Prompt rendering:** `guest@openknots:~$` with color-coded segments (user=green, host=purple, cwd=cyan)
- **Simulated filesystem:** In-memory `FS` object with directories and file contents
- **13 built-in commands:** `help`, `about`, `echo`, `date`, `whoami`, `pwd`, `ls`, `cat`, `cd`, `neofetch`, `theme`, `split`, `tab`, `clear`
- **Command history:** Arrow up/down to navigate previous commands
- **Blinking cursor:** Pure CSS block cursor that tracks input position
- **Auto-scroll:** Scrolls to latest output on each new line

## Step 6 — Terminal App Shell (`terminal-app.tsx`)
Orchestrated the full terminal experience:
- **Tab management:** Add, close, and switch between tabs (state-managed array of `Tab` objects, each containing pane IDs)
- **Split panes:** Horizontal splits using `react-resizable-panels` with draggable handles
- **Focused pane tracking:** Visual ring highlight on the active pane
- **Keyboard shortcuts:** `Ctrl+T` (new tab), `Ctrl+D` (split pane)
- **Right-click context menu:** Paste, Split Pane, New Tab, Close Pane, Theme submenu with color swatches

## Step 7 — Terminal Header (`terminal-header.tsx`)
Built the top bar:
- macOS traffic light buttons (close/minimize/maximize)
- Scrollable tab strip with active indicator (green underline), close buttons on hover
- `+` button with tooltip for new tab
- Theme dropdown (palette icon + chevron) showing all themes with active checkmark

## Step 8 — Status Bar (`terminal-status-bar.tsx`)
Added a bottom bar showing:
- Shell type with green status dot (`zsh`)
- Current directory
- Active theme name (as a badge)
- Pane count and tab count

## Step 9 — Command Palette (`command-palette.tsx`)
Integrated `cmdk` (via shadcn's `CommandDialog`):
- Toggle with `Ctrl+K`
- Searchable command list: New Tab, Split Pane, Clear Terminal
- Theme switching group with all 5 themes
- Navigation: Home and Playground links
- Fuzzy search with "No results found" empty state

## Step 10 — Landing Page (`app/page.tsx`)
Designed a clean landing page:
- Hero section with logo, title, description
- CTA buttons: "Open Playground" (green) + "GitHub" (outline)
- Keyboard shortcut hints (`Ctrl+K`, `Ctrl+T`, `Ctrl+D`)
- **Live interactive demo** — embedded `<TerminalApp>` at 480px height
- Quick Start section with install command

## Step 11 — Playground Page
Created `/playground` with live examples of all components for testing and demonstration.

## Step 12 — Polish & UX
- Custom scrollbar styling (thin, translucent)
- Blue text selection highlight
- Glassmorphic borders throughout
- Responsive layout (works on mobile)
- ARIA labels on interactive elements
- JetBrains Mono / SF Mono / Menlo font stack

---

### Architecture Overview
