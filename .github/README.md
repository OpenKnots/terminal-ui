# GitHub Configuration

This directory contains templates and automation for the terminal-ui repository.

## Contents

- **`ISSUE_TEMPLATE/`** - Issue templates (bug report, feature request, good first issue)
- **`pull_request_template.md`** - PR template for contributors
- **`STARTER_ISSUES.md`** - 12 ready-to-paste issues for getting started
- **`SETUP.md`** - Complete setup guide for maintainers
- **`issues/`** - Individual issue files for automation
- **`create-issues.sh`** - Script to create all issues at once

## Quick Start (Maintainers)

After pushing the repo to GitHub:

```bash
# 1. Create labels first
gh label create "good-first-issue" --color "7057ff"
gh label create "help-wanted" --color "008672"
gh label create "theme" --color "a2eeef"
gh label create "component" --color "0075ca"
gh label create "docs" --color "fef2c0"
gh label create "enhancement" --color "84b6eb"
gh label create "mobile" --color "d93f0b"
gh label create "advanced" --color "5319e7"

# 2. Create all issues
.github/create-issues.sh
```

Or manually copy-paste from `STARTER_ISSUES.md`.

## For Contributors

See:
- [CONTRIBUTING.md](../CONTRIBUTING.md) - How to contribute
- [GOOD_FIRST_ISSUES.md](../GOOD_FIRST_ISSUES.md) - Ideas for PRs

## Issue Labels

| Label | Color | Usage |
|-------|-------|-------|
| `good-first-issue` | Purple | Beginner-friendly tasks |
| `help-wanted` | Green | Need community help |
| `theme` | Light blue | Color scheme additions |
| `component` | Blue | New React components |
| `docs` | Yellow | Documentation improvements |
| `enhancement` | Cyan | Feature requests |
| `mobile` | Orange | Mobile-specific issues |
| `advanced` | Dark purple | Complex tasks |
| `bug` | Red | Bug reports |

## Templates

- **Bug Report** - For reporting bugs
- **Feature Request** - For suggesting new features
- **Good First Issue** - Template for beginner tasks
- **Pull Request** - Standard PR template

All contributors will see these automatically when creating issues/PRs.
