# AGENTS.md - Guide for AI Agents Contributing to terminal-ui

This file provides instructions for AI agents (like OpenClaw) to contribute to this repository.

---

## 🎯 Project Overview

**Repository:** `OpenKnots/terminal-ui`  
**Purpose:** React component library for building terminal-style UIs in the browser  
**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4  
**Package Manager:** `pnpm` (required)

---

## 📦 What This Project Does

Provides React components that render CLI/terminal aesthetics:

```tsx
<Terminal title="demo" prompt="user@host">
  <TerminalCommand>npm install</TerminalCommand>
  <TerminalOutput type="success">✓ Installed</TerminalOutput>
</Terminal>
```

**Use cases:**
- AI agent interfaces (OpenClaw dashboards)
- Interactive CLI tutorials
- Developer tools
- Retro terminal UIs

---

## 🤖 How Agents Can Contribute

### Good PR Topics

✅ **Add color themes** (easiest)  
✅ **Create new components** (progress bars, tables, trees)  
✅ **Improve accessibility** (ARIA labels, keyboard nav)  
✅ **Add JSDoc comments**  
✅ **Fix bugs** (mobile scrolling, rendering issues)  
✅ **Add examples** to playground  
✅ **Improve documentation**  

❌ **Don't:**
- Change core architecture without discussion
- Add heavy dependencies (keep it lightweight)
- Break existing components
- Remove TypeScript types

---

## 📁 Repository Structure

```
terminal-ui/
├── app/
│   ├── page.tsx              # Landing page
│   ├── playground/           # Component examples
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles + themes
├── components/
│   └── terminal.tsx          # Core components
├── public/                   # Static assets
├── .github/
│   ├── ISSUE_TEMPLATE/       # Issue templates
│   └── STARTER_ISSUES.md     # Pre-written issues to implement
└── docs/                     # (Future) API documentation
```

**Key files:**
- `components/terminal.tsx` - All terminal components exported here
- `app/globals.css` - Theme definitions (`:root`, `[data-theme="..."]`)
- `app/playground/page.tsx` - Live examples of all components

---

## 🎨 Adding a Color Theme

**File to edit:** `app/globals.css`

**What to do:**

1. Find the `:root` block (lines ~10-30)
2. Add your theme below it:

```css
[data-theme="dracula"] {
  --term-bg: #282a36;
  --term-bg-light: #343746;
  --term-fg: #f8f8f2;
  --term-fg-dim: #6272a4;
  --term-green: #50fa7b;
  --term-blue: #8be9fd;
  --term-yellow: #f1fa8c;
  --term-red: #ff5555;
  --term-purple: #bd93f9;
  --term-cyan: #8be9fd;
}
```

**Required variables:**
- `--term-bg` (main background)
- `--term-bg-light` (elevated background)
- `--term-fg` (main text)
- `--term-fg-dim` (secondary text)
- `--term-green`, `--term-blue`, `--term-yellow`, `--term-red`, `--term-purple`, `--term-cyan`

**Testing:**
```bash
# Add data-theme attribute to <html> in app/layout.tsx temporarily:
<html lang="en" data-theme="dracula">

# Then run:
pnpm run dev
```

**PR checklist:**
- [ ] All 11 CSS variables defined
- [ ] Colors follow the official theme spec (include link in PR)
- [ ] Screenshot of theme in action attached to PR
- [ ] Build passes (`pnpm run build`)

---

## 📦 Creating a Component

**Example: TerminalProgress**

### 1. Create Component File

**File:** `components/terminal-progress.tsx`

```tsx
'use client'

interface TerminalProgressProps {
  percent: number
  label?: string
  width?: number
  filled?: string
  empty?: string
}

/**
 * Displays a terminal-style progress bar
 * @param percent - Progress percentage (0-100)
 * @param label - Optional label text
 * @param width - Progress bar width in characters (default: 20)
 * @param filled - Character for filled portion (default: '█')
 * @param empty - Character for empty portion (default: '░')
 * @example
 * ```tsx
 * <TerminalProgress percent={75} label="Installing..." />
 * // Output: Installing... [███████████████░░░░░] 75%
 * ```
 */
export function TerminalProgress({
  percent,
  label,
  width = 20,
  filled = '█',
  empty = '░',
}: TerminalProgressProps) {
  const clampedPercent = Math.max(0, Math.min(100, percent))
  const filledCount = Math.round((clampedPercent / 100) * width)
  const emptyCount = width - filledCount
  
  const bar = filled.repeat(filledCount) + empty.repeat(emptyCount)
  
  return (
    <div className="flex items-center gap-2 text-[var(--term-fg)] font-mono text-sm">
      {label && <span className="text-[var(--term-fg-dim)]">{label}</span>}
      <span className="text-[var(--term-green)]">[{bar}]</span>
      <span className="text-[var(--term-fg-dim)]">{clampedPercent}%</span>
    </div>
  )
}
```

### 2. Export from Main File

**File:** `components/terminal.tsx`

Add export at the bottom:

```tsx
export { TerminalProgress } from './terminal-progress'
```

### 3. Add Example to Playground

**File:** `app/playground/page.tsx`

Add a new section:

```tsx
<section>
  <h2 className="text-2xl font-semibold mb-4">Progress Bars</h2>
  <Terminal title="progress.sh">
    <TerminalCommand>npm install heavy-package</TerminalCommand>
    <TerminalProgress percent={45} label="Installing dependencies..." />
    <TerminalProgress percent={100} label="Complete" />
  </Terminal>
</section>
```

### 4. Component Requirements

**Must have:**
- ✅ TypeScript props interface
- ✅ JSDoc comments with `@param` and `@example`
- ✅ Exported from `components/terminal.tsx`
- ✅ Example in playground
- ✅ Uses CSS variables (`var(--term-*)` for colors)
- ✅ `'use client'` directive (if uses hooks/state)
- ✅ Responsive (works on mobile)

**Nice to have:**
- Accessibility (ARIA labels if interactive)
- Keyboard navigation support
- Animation (use Tailwind `transition-*`)

---

## 🛠️ Development Workflow

### Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/terminal-ui.git
cd terminal-ui

# Install dependencies (must use pnpm)
pnpm install

# Start dev server
pnpm run dev
# → http://localhost:3000
```

### Making Changes

```bash
# Create feature branch
git checkout -b feat/your-feature

# Make changes...
# Test at http://localhost:3000

# Check build passes
pnpm run build

# Commit
git add .
git commit -m "feat: add dracula theme"

# Push
git push origin feat/your-feature
```

### PR Title Format

Use conventional commits:

- `feat: add Nord color theme`
- `fix: mobile scrolling on iOS`
- `docs: add JSDoc to Terminal component`
- `refactor: simplify TerminalOutput logic`
- `test: add tests for TerminalProgress`
- `chore: update dependencies`

---

## 🧪 Testing

**Manual testing:**

```bash
pnpm run dev
# Visit http://localhost:3000
# Navigate to /playground
# Test your component
```

**Build test:**

```bash
pnpm run build
# Must complete without errors
```

**Type check:**

```bash
pnpm run build
# TypeScript errors will show during build
```

---

## 📋 PR Checklist

Before opening a PR, ensure:

- [ ] Code follows existing style (functional components, TypeScript)
- [ ] Component has JSDoc comments
- [ ] Example added to playground (if new component)
- [ ] Build passes (`pnpm run build`)
- [ ] No console errors/warnings
- [ ] Works on mobile (test responsive mode)
- [ ] No new dependencies added (unless discussed in issue)
- [ ] Screenshot included (if visual change)
- [ ] References issue number (`Closes #123`)

---

## 🎯 Good PR Examples

### ✅ Good: Color Theme

```markdown
## What does this PR do?

Adds the Nord color theme.

Closes #3

## Type of Change

- [x] 🎨 New theme

## Screenshots

[Screenshot of Nord theme]

## Checklist

- [x] All CSS variables defined
- [x] Colors match https://www.nordtheme.com/
- [x] Build passes
- [x] Tested locally
```

### ✅ Good: New Component

```markdown
## What does this PR do?

Adds `TerminalProgress` component for displaying progress bars.

Closes #2

## Type of Change

- [x] 📦 New component

## Example Usage

```tsx
<TerminalProgress percent={75} label="Installing..." />
```

## Screenshots

[Screenshot showing progress bar at 0%, 50%, 100%]

## Checklist

- [x] TypeScript interface defined
- [x] JSDoc comments added
- [x] Exported from components/terminal.tsx
- [x] Example in playground
- [x] Build passes
```

### ❌ Bad: Unclear Purpose

```markdown
## What does this PR do?

Updates stuff

## Changes

Changed some files
```

**Why bad:**
- No issue reference
- Unclear what changed
- No testing evidence
- No checklist

---

## 🚫 What to Avoid

**Don't:**

1. **Add heavy dependencies**
   ```json
   // ❌ Bad
   "dependencies": {
     "lodash": "^4.0.0",
     "moment": "^2.0.0"
   }
   ```

2. **Change file structure without discussion**
   ```
   ❌ Don't rename components/ to src/
   ❌ Don't move app/ to pages/
   ```

3. **Remove TypeScript types**
   ```tsx
   // ❌ Bad
   export function Terminal(props: any) { }
   
   // ✅ Good
   export function Terminal({ title, children }: TerminalProps) { }
   ```

4. **Use inline styles** (use Tailwind)
   ```tsx
   // ❌ Bad
   <div style={{ color: 'red' }}>
   
   // ✅ Good
   <div className="text-[var(--term-red)]">
   ```

5. **Break existing components**
   - Don't change prop names without discussion
   - Don't remove exports
   - Don't change behavior drastically

---

## 🎨 Styling Guidelines

**Use CSS variables:**

```tsx
// ✅ Good
<div className="bg-[var(--term-bg)] text-[var(--term-fg)]">

// ❌ Bad
<div className="bg-black text-white">
```

**Use Tailwind classes:**

```tsx
// ✅ Good
<div className="flex items-center gap-2 px-4 py-2 rounded-lg">

// ❌ Bad (custom CSS)
<div style={{ display: 'flex', padding: '8px 16px' }}>
```

**Color palette:**

- Background: `var(--term-bg)`, `var(--term-bg-light)`
- Text: `var(--term-fg)`, `var(--term-fg-dim)`
- Success: `var(--term-green)`
- Error: `var(--term-red)`
- Info: `var(--term-blue)`
- Warning: `var(--term-yellow)`

---

## 📚 Component Guidelines

**Component Structure:**

```tsx
'use client' // If using hooks/state

import { ReactNode } from 'react'

interface MyComponentProps {
  // Props with types
  children?: ReactNode
  title: string
  optional?: boolean
}

/**
 * Brief description
 * @param title - What this param does
 * @example
 * ```tsx
 * <MyComponent title="Example" />
 * ```
 */
export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div className="component-classes">
      {/* Component content */}
    </div>
  )
}
```

**Naming:**
- Components: `PascalCase` (TerminalProgress)
- Files: `kebab-case` (terminal-progress.tsx)
- Props: `camelCase` (fontSize, isActive)

---

## 🔍 Finding Issues to Work On

**Check these labels:**

1. **`good-first-issue`** - Easiest, perfect for agents
2. **`help-wanted`** - Need community help
3. **`theme`** - Color theme additions (very easy)
4. **`component`** - New React components
5. **`docs`** - Documentation improvements
6. **`bug`** - Bug fixes

**Browse:**
- https://github.com/OpenKnots/terminal-ui/issues?q=is%3Aissue+is%3Aopen+label%3A%22good-first-issue%22

**Pre-written issues:**
- See `.github/STARTER_ISSUES.md` for 12 ready-to-implement issues

---

## 🤝 Working with Maintainers

**Before starting:**
1. Comment on the issue: "I'd like to work on this"
2. Wait for assignment (or proceed if labeled `good-first-issue`)

**During development:**
- Ask questions in the issue if stuck
- Share progress if taking >3 days
- Request feedback on approach if unsure

**After PR:**
- Respond to review comments promptly
- Make requested changes
- Ask for clarification if feedback is unclear

---

## 📊 Success Metrics

**Your PR is more likely to be merged if:**

✅ Follows the checklist above  
✅ Includes tests/examples  
✅ Has clear commit messages  
✅ Includes screenshot (for visual changes)  
✅ Addresses a specific issue  
✅ Doesn't add unnecessary dependencies  
✅ Maintains TypeScript strict mode  

---

## 🎯 Quick Reference

| Task | Time | Difficulty |
|------|------|------------|
| Add color theme | 5 min | ⭐ Easy |
| Add JSDoc comments | 10 min | ⭐ Easy |
| Create TerminalProgress | 15 min | ⭐⭐ Medium |
| Create TerminalTree | 30 min | ⭐⭐ Medium |
| Create TerminalTable | 60 min | ⭐⭐⭐ Hard |
| Fix mobile scrolling | 20 min | ⭐⭐ Medium |
| Add copy button | 15 min | ⭐ Easy |

---

## 🐛 Common Issues

**Problem:** `pnpm: command not found`  
**Solution:** Install pnpm: `npm install -g pnpm`

**Problem:** Build fails with "Cannot find module"  
**Solution:** Run `pnpm install` again

**Problem:** Changes not showing in browser  
**Solution:** Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

**Problem:** TypeScript errors about missing types  
**Solution:** Restart TypeScript server in your editor

---

## 📞 Getting Help

**Stuck?**
- Comment on the issue
- Open a [Discussion](https://github.com/OpenKnots/terminal-ui/discussions)
- Check existing PRs for examples

**Found a bug in these instructions?**
- Open an issue or PR to fix AGENTS.md

---

## 🎉 Recognition

All contributors are added to the README! Your agent's work will be credited.

---

**Ready to contribute?** 

1. Find an issue: https://github.com/OpenKnots/terminal-ui/issues
2. Follow this guide
3. Open a PR
4. Get merged! 🚀

---

_Last updated: 2026-02-25_  
_Maintained by: @BunsDev
