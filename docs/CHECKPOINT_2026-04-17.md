# Checkpoint: Clean Base Established

## Date
2026-04-17

## Summary
- Rebased and cleaned commit history
- Squashed last commits into a single meaningful commit
- Connected local repo to GitHub (origin)
- Renamed repo to remove leading hyphen
- Verified push and pull consistency
- Established main → origin/main tracking

## Current State
- Branch: main
- Status: clean
- Remote: configured
- CI: GitHub Actions added for npm ci, typecheck, and test in ./app
- Branch protection: not yet configured

## Key Files Changed
- app/screens/AddTransactionScreen.tsx
- .maestro/validation-missing-description.yaml

## Tag
v0.1-clean-base

## Next Focus
- Branch strategy
- PR workflow
- Test automation integration (Maestro)

## Risk Notes
- Direct commits to main → future instability

## CI
- Added `.github/workflows/ci.yml`
- Triggers on push and pull_request to `main`
- Runs `npm ci`, `npm run typecheck`, and `npm run test` in `./app`

## Local Workflow Guards
- Added versioned git hooks in `.githooks/`
- Enforced commit prefixes and branch naming locally
- Pre-push now runs `npm run typecheck` and `npm run test` in `./app`
