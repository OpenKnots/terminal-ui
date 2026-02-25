#!/bin/bash

# Automated issue creation for terminal-ui
# Run this after pushing the repo to GitHub

set -e

echo "🚀 Creating starter issues for terminal-ui..."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) not found. Install it first:"
    echo "   brew install gh"
    echo "   OR follow: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub. Run:"
    echo "   gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready"
echo ""

# Color themes (easy)
echo "📦 Creating theme issues..."

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Add Dracula color theme" \
  --label "good-first-issue,theme,help-wanted" \
  --body-file .github/issues/01-dracula-theme.md \
  || echo "⚠️  Issue might already exist"

echo "  ✓ Dracula theme"

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Add Nord color theme" \
  --label "good-first-issue,theme,help-wanted" \
  --body "See .github/STARTER_ISSUES.md - Issue #3" \
  || echo "⚠️  Issue might already exist"

echo "  ✓ Nord theme"

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Add Monokai color theme" \
  --label "good-first-issue,theme,help-wanted" \
  --body "See .github/STARTER_ISSUES.md - Issue #6" \
  || echo "⚠️  Issue might already exist"

echo "  ✓ Monokai theme"

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Add GitHub Dark color theme" \
  --label "good-first-issue,theme,help-wanted" \
  --body "See .github/STARTER_ISSUES.md - Issue #10" \
  || echo "⚠️  Issue might already exist"

echo "  ✓ GitHub Dark theme"

# Components
echo ""
echo "🎨 Creating component issues..."

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Create TerminalProgress component" \
  --label "good-first-issue,component,help-wanted" \
  --body "See .github/STARTER_ISSUES.md - Issue #2" \
  || echo "⚠️  Issue might already exist"

echo "  ✓ TerminalProgress"

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Create TerminalTable component" \
  --label "component,help-wanted,advanced" \
  --body "See .github/STARTER_ISSUES.md - Issue #4" \
  || echo "⚠️  Issue might already exist"

echo "  ✓ TerminalTable"

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Create TerminalTree component" \
  --label "good-first-issue,component,help-wanted" \
  --body "See .github/STARTER_ISSUES.md - Issue #9" \
  || echo "⚠️  Issue might already exist"

echo "  ✓ TerminalTree"

# Enhancements
echo ""
echo "✨ Creating enhancement issues..."

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Add copy button to Terminal component" \
  --label "good-first-issue,enhancement,help-wanted" \
  --body "See .github/STARTER_ISSUES.md - Issue #5" \
  || echo "⚠️  Issue might already exist"

echo "  ✓ Copy button"

# Docs
echo ""
echo "📚 Creating documentation issues..."

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Add JSDoc comments to all components" \
  --label "good-first-issue,docs,help-wanted" \
  --body "See .github/STARTER_ISSUES.md - Issue #8" \
  || echo "⚠️  Issue might already exist"

echo "  ✓ JSDoc comments"

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Add screenshots to README" \
  --label "good-first-issue,docs,help-wanted" \
  --body "See .github/STARTER_ISSUES.md - Issue #11" \
  || echo "⚠️  Issue might already exist"

echo "  ✓ README screenshots"

# Bugs
echo ""
echo "🐛 Creating bug fix issues..."

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Fix terminal scrolling on mobile devices" \
  --label "bug,mobile,help-wanted" \
  --body "See .github/STARTER_ISSUES.md - Issue #7" \
  || echo "⚠️  Issue might already exist"

echo "  ✓ Mobile scrolling fix"

# Advanced
echo ""
echo "🎯 Creating advanced issues..."

gh issue create \
  --repo OpenKnots/terminal-ui \
  --title "Create interactive TerminalPrompt component" \
  --label "component,help-wanted,advanced" \
  --body "See .github/STARTER_ISSUES.md - Issue #12" \
  || echo "⚠️  Issue might already exist"

echo "  ✓ TerminalPrompt (advanced)"

echo ""
echo "✅ Done! Check: https://github.com/OpenKnots/terminal-ui/issues"
echo ""
echo "Next steps:"
echo "  1. Pin 4 good-first-issue items"
echo "  2. Create welcome discussion"
echo "  3. Deploy to Vercel"
echo ""
