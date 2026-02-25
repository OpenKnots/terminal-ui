# Project Context - terminal-ui

**Last Updated:** 2026-02-25 07:32 AM CT

This file provides context for AI agents and contributors about the terminal-ui project.

---

## 🎯 Project Overview

**Repository:** OpenKnots/terminal-ui  
**Created:** 2026-02-25  
**Purpose:** React component library for building terminal-style UIs in the browser  
**Status:** Ready to launch (not yet pushed to GitHub)

**Location:** `~/Documents/GitHub/OpenKnots/terminal-ui`

---

## 🏗️ Tech Stack

- **Framework:** Next.js 16
- **React:** 19.2.4
- **TypeScript:** 5.9.3
- **Styling:** Tailwind CSS 4.2.1
- **Icons:** lucide-react
- **Package Manager:** pnpm (required, never use npm)

---

## 📦 What's Built

### Core Components

1. **Terminal** - Main window with traffic light chrome
2. **TerminalCommand** - Render commands with prompt
3. **TerminalOutput** - Format output (success, error, info, warning, normal)
4. **TerminalSpinner** - Loading indicator

### Pages

- **Landing page** (`app/page.tsx`) - Hero, demo, features
- **Playground** (`app/playground/page.tsx`) - Interactive examples

### Theming

- Default dark theme in `:root`
- CSS variables for all colors (`--term-bg`, `--term-fg`, etc.)
- Ready for additional themes (Dracula, Nord, Monokai, etc.)

---

## 📚 Documentation Complete

All documentation is written and ready:

1. **README.md** - Project overview, quick start, features
2. **CONTRIBUTING.md** - Human contributor guide
3. **AGENTS.md** - AI agent contribution guide (13KB, comprehensive)
4. **OPENCLAW_USAGE.md** - How to use with OpenClaw
5. **GOOD_FIRST_ISSUES.md** - 20+ future PR ideas
6. **LAUNCH_CHECKLIST.md** - Deployment guide
7. **DISCORD_ANNOUNCEMENT.md** - Community announcement templates
8. **.github/SETUP.md** - GitHub repository setup
9. **.github/STARTER_ISSUES.md** - 12 pre-written issues

---

## 🎯 Ready-to-Go Issues

**12 starter issues prepared:**

### Themes (⭐ Easy - 5 min each)
1. Add Dracula theme
2. Add Nord theme
3. Add Monokai theme
4. Add GitHub Dark theme

### Components (⭐⭐ Medium to ⭐⭐⭐ Hard)
5. Create TerminalProgress (progress bars)
6. Create TerminalTable (data tables)
7. Create TerminalTree (file trees)
8. Create TerminalPrompt (interactive input)

### Documentation (⭐ Easy)
9. Add JSDoc comments to all components
10. Add screenshots to README

### Bugs (⭐⭐ Medium)
11. Fix mobile scrolling on iOS

### Enhancements (⭐ Easy)
12. Add copy button to Terminal

All issues have:
- Clear acceptance criteria
- Step-by-step instructions
- Getting started guide
- Example code (where applicable)

---

## 🛡️ Security Setup

### Pre-Commit Hook Installed

**Location:** `.git/hooks/pre-commit` (local only, not tracked)

**Blocks:**
- API keys, tokens, passwords
- Tailscale URLs, gateway URLs
- Device IDs
- GitHub tokens
- AWS credentials
- Private IPs
- .env files

**Status:** ✅ Tested and working  
**Documentation:** `.git-hooks-setup/README.md`

---

## 🤖 AI Agent Ready

### For OpenClaw / AI Agents

**Quick Start:**

```
Read https://github.com/OpenKnots/terminal-ui/blob/main/AGENTS.md
then pick a good-first-issue and implement it.
```

**AGENTS.md contains:**
- Complete project structure
- How to add themes (step-by-step)
- How to create components (with template)
- Development workflow
- PR guidelines and checklist
- Common pitfalls to avoid

**Example Task:**

```
Add the Dracula color theme:
1. Read AGENTS.md section "Adding a Color Theme"
2. Get colors from draculatheme.com
3. Add to app/globals.css
4. Test with pnpm run build
5. Screenshot
6. Open PR
```

---

## 🎨 Design System

### Colors (CSS Variables)

Required for all themes:

```css
--term-bg           /* Main background */
--term-bg-light     /* Elevated surfaces */
--term-fg           /* Primary text */
--term-fg-dim       /* Secondary text */
--term-green        /* Success */
--term-blue         /* Info */
--term-yellow       /* Warning */
--term-red          /* Error */
--term-purple       /* Accent */
--term-cyan         /* Accent */
```

### Styling Rules

- ✅ Use CSS variables for colors
- ✅ Use Tailwind utility classes
- ✅ Use `font-mono` for terminal text
- ❌ No inline styles
- ❌ No hardcoded colors

---

## 📋 Contribution Workflow

### Standard PR Process

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/terminal-ui.git
cd terminal-ui

# 2. Install (MUST use pnpm)
pnpm install

# 3. Create branch
git checkout -b feat/your-feature

# 4. Make changes
pnpm run dev  # Test at http://localhost:3000

# 5. Verify build
pnpm run build  # Must pass

# 6. Commit and push
git add .
git commit -m "feat: your feature"
git push origin feat/your-feature

# 7. Open PR on GitHub
```

### PR Requirements

- [ ] Follows existing code style
- [ ] TypeScript types included
- [ ] JSDoc comments (for components)
- [ ] Example in playground (for components)
- [ ] Build passes
- [ ] Screenshot (if visual change)
- [ ] References issue number

---

## 🚀 Launch Status

### Completed ✅

- [x] Repository initialized
- [x] Core components built
- [x] Landing page designed
- [x] Playground created
- [x] All documentation written
- [x] 12 issues prepared
- [x] Issue/PR templates created
- [x] Automation scripts ready
- [x] Security audit passed (no leaks)
- [x] Pre-commit hook installed
- [x] AI agent guide (AGENTS.md)

### Not Yet Done ⏳

- [ ] Push to GitHub
- [ ] Create labels
- [ ] Create issues
- [ ] Pin good-first-issues
- [ ] Create welcome discussion
- [ ] Deploy to Vercel
- [ ] Announce on Discord

**Time to launch:** ~30 minutes (follow LAUNCH_CHECKLIST.md)

---

## 🎯 Use Cases

### Why This Project Exists

1. **Practice PRs** - Safe place for beginners to learn GitHub workflow
2. **Learn React** - Simple, well-structured components
3. **Test code-flow** - Generate real PRs to review with our maintainer console
4. **Build UIs** - Real components for CLI-style interfaces
5. **Community** - Grow OpenKnots contributor base

### Who It's For

- **Beginners** learning open source contribution
- **Developers** building AI agent interfaces
- **OpenClaw users** who want terminal aesthetics
- **Maintainers** practicing PR review (code-flow)
- **AI agents** testing automated PR generation

---

## 🔑 Key Decisions

### Technical Choices

- **pnpm only** - Faster, better than npm
- **Tailwind v4** - No `@apply` directives (use utilities)
- **TypeScript strict** - All components typed
- **Next.js 16** - Uses `proxy.ts` not `middleware.ts`
- **Glassmorphic design** - Backdrop blur, subtle shadows

### Process Choices

- **Public repo** - Anyone can contribute
- **Beginner-friendly** - Issues have detailed instructions
- **No tests required** - Keep barrier low (for now)
- **Fast review** - Aim for <24 hour PR review
- **Recognize contributors** - All added to README

---

## 📊 Success Metrics

### Week 1 Goals

- 5+ stars
- 3+ contributors
- 5+ merged PRs

### Month 1 Goals

- 25+ stars
- 10+ contributors
- 20+ merged PRs
- All 4 themes complete
- At least 1 new component

### Quarter 1 Goals

- 100+ stars
- 25+ contributors
- All 12 starter issues complete
- 5+ new components
- Featured in a newsletter

---

## 🔗 Integration with code-flow

This repo is **perfect for testing code-flow** (our maintainer console):

1. Add `OpenKnots/terminal-ui` to code-flow
2. Filter by `good-first-issue` label
3. Watch PRs appear
4. Use PR detail modal to review
5. Practice the 3-phase workflow (Review → Prepare → Merge)

**Win-win:** Contributors learn, maintainers practice, code-flow gets real testing data.

---

## 📞 Maintainer

**Primary:** Val (@ValOpenClaw)  
**Response Time:** < 24 hours (usually same-day)  
**Timezone:** America/Chicago (CST/CDT)

---

## 🎉 Ready to Launch

Everything is in place. Just need to:

1. Run 3 commands (see LAUNCH_CHECKLIST.md)
2. Post to Discord (templates ready)
3. Watch the PRs roll in! 🚀

---

_This file is for context only. For contribution instructions, see CONTRIBUTING.md or AGENTS.md._
