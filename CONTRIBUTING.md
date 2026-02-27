# Contributing to terminal-ui

Thanks for your interest! This repo is designed to be beginner-friendly and great for practicing PRs.

## 🎯 How to Contribute

### 1. Find an Issue

Browse [Issues](https://github.com/OpenKnots/terminal-ui/issues) and look for:
- `good-first-issue` - Perfect for beginners
- `help-wanted` - We need help here
- `component` - Add a new component
- `theme` - Add a color scheme
- `docs` - Improve documentation

### 2. Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/terminal-ui.git
cd terminal-ui
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the playground.

### 3. Create a Branch

```bash
git checkout -b feat/my-awesome-feature
# or
git checkout -b fix/that-annoying-bug
```

**Branch naming:**
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `style/` - Visual changes
- `refactor/` - Code improvements

### 4. Make Your Changes

**Adding a Component:**
```bash
# Create component file
touch components/terminal-progress.tsx

# Add to exports
# Update components/index.ts

# Add example
# Update app/playground/page.tsx
```

**Component Template:**
```tsx
'use client'

import { ReactNode } from 'react'

interface TerminalProgressProps {
  percent: number
  label?: string
}

export function TerminalProgress({ percent, label }: TerminalProgressProps) {
  return (
    <div className="terminal-progress">
      <div className="terminal-progress-bar" style={{ width: `${percent}%` }} />
      {label && <span>{label}</span>}
    </div>
  )
}
```

### 5. Test Locally

```bash
# Build and check for errors
pnpm run build

# Format code
pnpm run format

# Run lint
pnpm run lint
```

### PR Quality Expectations

Before opening a PR, make sure your description is reviewer-friendly:

- **Lead with impact**: what user/developer problem did you solve?
- **List concrete changes**: 2-5 bullets is usually perfect
- **Include validation commands**: paste exactly what you ran
- **Add screenshots for UI changes**: before/after if possible
- **Call out follow-ups**: mention intentionally deferred work

Recommended structure:

```markdown
## Summary
## Problem / Motivation
## Changes
## Validation
## Screenshots (if UI)
## Follow-ups
```

### 6. Commit

```bash
git add .
git commit -m "feat: add terminal progress bar component"
```

**Commit message format:**
```
<type>: <description>

[optional body]
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting, styling
- `refactor:` - Code restructuring
- `test:` - Add tests
- `chore:` - Maintenance

### 7. Push & PR

```bash
git push origin feat/my-awesome-feature
```

Then open a PR on GitHub!

**PR Title Format:**
```
feat: add progress bar component
fix: terminal prompt cursor position
docs: improve installation guide
```

**PR Description Template:**
```markdown
## What does this PR do?

Adds a new `TerminalProgress` component for showing progress bars.

## Screenshots

[Add screenshot if UI change]

## Checklist

- [x] Component is documented
- [x] Example added to playground
- [x] Code is formatted
- [x] Build passes
```

## 🎨 Style Guide

- **Use TypeScript** - Type everything
- **Follow existing patterns** - Check similar components
- **Keep it simple** - One component, one purpose
- **Make it accessible** - ARIA labels, keyboard nav
- **Mobile-friendly** - Test on small screens

## 📦 Component Guidelines

**Every component should:**
1. Export a named function (not default)
2. Have TypeScript props interface
3. Include JSDoc comments
4. Work with keyboard navigation
5. Have a playground example

**Example:**
```tsx
/**
 * Displays a terminal-style progress bar
 * @param percent - Progress percentage (0-100)
 * @param label - Optional label text
 */
export function TerminalProgress({ percent, label }: TerminalProgressProps) {
  // ...
}
```

## 🐛 Reporting Bugs

Found a bug? [Open an issue](https://github.com/OpenKnots/terminal-ui/issues/new)!

Include:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser)

## 💡 Suggesting Features

Have an idea? [Open an issue](https://github.com/OpenKnots/terminal-ui/issues/new)!

Describe:
- What problem does it solve?
- What would the API look like?
- Any examples or mockups?

## ❓ Need Help?

- 💬 [Open a discussion](https://github.com/OpenKnots/terminal-ui/discussions)
- 🐦 Tweet [@OpenKnots](https://twitter.com/OpenKnot)

## 🎉 Recognition

All contributors will be added to the README! We appreciate every PR.

---

**Pro Tip:** This repo is perfect for testing [code-flow](https://github.com/OpenKnots/code-flow), our maintainer console. Contributors can use it to learn the PR workflow!
