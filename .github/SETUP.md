# Repository Setup Guide

Step-by-step instructions to get terminal-ui live on GitHub with issues ready for contributors.

## 1. Push to GitHub

### Option A: Using GitHub CLI (Recommended)

```bash
cd ~/Documents/GitHub/OpenKnots/terminal-ui

# Make sure you're authenticated
gh auth status

# Create the repo and push
gh repo create OpenKnots/terminal-ui \
  --public \
  --source=. \
  --description="Beautiful terminal-like UI components for React" \
  --push
```

### Option B: Manual Setup

1. Go to https://github.com/organizations/OpenKnots/repositories/new
2. Name: `terminal-ui`
3. Description: `Beautiful terminal-like UI components for React`
4. Public repository
5. **Don't** initialize with README (we already have one)
6. Create repository
7. Then push:

```bash
cd ~/Documents/GitHub/OpenKnots/terminal-ui
git push -u origin main
```

---

## 2. Configure Repository Settings

Go to: `https://github.com/OpenKnots/terminal-ui/settings`

### General

- ✅ Issues enabled
- ✅ Projects enabled
- ✅ Discussions enabled
- ✅ Wiki disabled (we'll use docs/)

### Branches

- Set `main` as default branch
- Add branch protection:
  - ✅ Require pull request reviews before merging
  - ✅ Require status checks to pass (`Typecheck & Build`, `Validate Conventional Commit PR title`)
  - ✅ Keep Vercel preview checks non-blocking unless contributor deploy authorization is enabled

---

## 3. Create Labels

### Using GitHub CLI:

```bash
gh label create "good-first-issue" --color "7057ff" --description "Good for newcomers"
gh label create "help-wanted" --color "008672" --description "Extra attention is needed"
gh label create "theme" --color "a2eeef" --description "Color theme additions"
gh label create "component" --color "0075ca" --description "New component"
gh label create "docs" --color "fef2c0" --description "Documentation"
gh label create "enhancement" --color "84b6eb" --description "New feature or request"
gh label create "mobile" --color "d93f0b" --description "Mobile-specific"
gh label create "advanced" --color "5319e7" --description "Advanced difficulty"
```

### Using Web UI:

Go to: `https://github.com/OpenKnots/terminal-ui/labels`

Click "New label" for each:

| Name | Color | Description |
|------|-------|-------------|
| good-first-issue | `#7057ff` | Good for newcomers |
| help-wanted | `#008672` | Extra attention is needed |
| theme | `#a2eeef` | Color theme additions |
| component | `#0075ca` | New component |
| docs | `#fef2c0` | Documentation |
| enhancement | `#84b6eb` | New feature or request |
| mobile | `#d93f0b` | Mobile-specific |
| advanced | `#5319e7` | Advanced difficulty |

---

## 4. Create Issues (Automated)

We've prepared 12 starter issues in `.github/STARTER_ISSUES.md`.

### Using GitHub CLI:

```bash
# Easy themes (Issues 1, 3, 6, 10)
gh issue create \
  --title "Add Dracula color theme" \
  --label "good-first-issue,theme,help-wanted" \
  --body-file .github/issues/01-dracula-theme.md

gh issue create \
  --title "Add Nord color theme" \
  --label "good-first-issue,theme,help-wanted" \
  --body-file .github/issues/03-nord-theme.md

gh issue create \
  --title "Add Monokai color theme" \
  --label "good-first-issue,theme,help-wanted" \
  --body-file .github/issues/06-monokai-theme.md

gh issue create \
  --title "Add GitHub Dark color theme" \
  --label "good-first-issue,theme,help-wanted" \
  --body-file .github/issues/10-github-dark-theme.md

# Components (Issues 2, 4, 9, 12)
gh issue create \
  --title "Create TerminalProgress component" \
  --label "good-first-issue,component,help-wanted" \
  --body-file .github/issues/02-progress-component.md

# ... (repeat for remaining issues)
```

### Using Web UI (Easier):

1. Go to: `https://github.com/OpenKnots/terminal-ui/issues/new`
2. Open `.github/STARTER_ISSUES.md`
3. Copy-paste each issue (title + body)
4. Add labels
5. Submit

**Do this for all 12 issues!**

---

## 5. Enable Discussions

Go to: `https://github.com/OpenKnots/terminal-ui/settings`

- ✅ Enable Discussions
- Create categories:
  - 💡 Ideas
  - 🙏 Q&A
  - 📣 Announcements
  - 🎉 Show and Tell

---

## 6. Add Topics

Go to: `https://github.com/OpenKnots/terminal-ui`

Click ⚙️ next to "About" → Add topics:

- `terminal`
- `cli`
- `ui-components`
- `react`
- `nextjs`
- `typescript`
- `openclaw`

---

## 7. Create First Discussion

Go to: `https://github.com/OpenKnots/terminal-ui/discussions/new`

**Title:** Welcome to terminal-ui! 🎉

**Body:**

```markdown
Thanks for checking out **terminal-ui**! 

This is a beginner-friendly project designed for:
- 🎨 Learning React component development
- 🔧 Practicing the GitHub PR workflow
- 🤝 Contributing to open source

## Getting Started

1. Browse our [good first issues](https://github.com/OpenKnots/terminal-ui/issues?q=is%3Aissue+is%3Aopen+label%3A%22good-first-issue%22)
2. Read the [Contributing Guide](CONTRIBUTING.md)
3. Check out the [Playground](http://localhost:3000/playground) locally
4. Ask questions here!

## Perfect for Testing

This repo pairs great with [code-flow](https://github.com/OpenKnots/code-flow) - our maintainer console for reviewing PRs!

Happy coding! 🚀
```

---

## 8. Optional: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import `OpenKnots/terminal-ui`
3. Framework: Next.js (auto-detected)
4. Deploy
5. Update README with live URL

---

## 9. Pin Issues

Go to each good-first-issue and click "📌 Pin issue"

Pin these for visibility:
- Add Dracula theme
- Create TerminalProgress component
- Add copy button
- Improve mobile scrolling

---

## 10. Announce!

Share on:
- Twitter: "Just launched terminal-ui - React components for CLI-style UIs! Perfect for practice PRs 🎨"
- Discord: OpenClaw community
- Reddit: r/reactjs (as "Show & Tell")

---

## Quick Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed (`git push -u origin main`)
- [ ] Labels created (8 labels)
- [ ] Issues created (12 issues)
- [ ] Discussions enabled
- [ ] Topics added
- [ ] Branch protection enabled
- [ ] First discussion posted
- [ ] 4 issues pinned
- [ ] Deployed to Vercel (optional)

---

## Testing the Workflow

Create a test PR:

1. Fork the repo
2. Add a simple theme
3. Open a PR
4. Use code-flow to review it!

This validates:
- PR templates work
- Labels auto-apply
- CI passes (if configured)
- code-flow can fetch PRs

---

**Next:** Share with the community and watch the PRs roll in! 🎉
