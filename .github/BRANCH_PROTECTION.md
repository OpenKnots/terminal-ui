# Branch Protection Playbook

Use this to enable baseline protections for `main`.

## Recommended settings

- Require pull request before merging
- Require at least **1 approval**
- Dismiss stale approvals on new commits
- Require status checks before merging:
  - `Typecheck & Build`
  - `Validate Conventional Commit PR title`
- Require conversation resolution before merge
- Restrict force pushes
- Restrict branch deletion

## GitHub UI path

1. Repository Settings → Branches
2. Add branch protection rule for `main`
3. Enable the settings above

## Optional: GitHub CLI/API (admin only)

```bash
gh api \
  -X PUT \
  repos/OpenKnots/terminal-ui/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]='Typecheck & Build' \
  -f required_status_checks.contexts[]='Validate Conventional Commit PR title' \
  -f enforce_admins=true \
  -F required_pull_request_reviews.dismiss_stale_reviews=true \
  -F required_pull_request_reviews.required_approving_review_count=1 \
  -f restrictions=
```

> Note: branch protection requires repo admin permissions.
