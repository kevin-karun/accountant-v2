# Project Context

## Goal
Build Accountant-V2 with a strict, production-like workflow:
- PR-only merges to main
- CI enforced
- Local hooks enforcing discipline
- Clean, repeatable dev workflow

## Current Setup
- GitHub repo with protected main
- CI: typecheck + tests on PR
- Local hooks:
  - commit-msg: enforces prefixes
  - pre-push: enforces branch naming + typecheck + tests
- Hooks installed via scripts/setup-hooks.sh

## Branch Rules
Allowed:
- feat/*
- fix/*
- chore/*
- docs/*
- test/*
- main

## Commit Rules
Allowed prefixes:
- feat:
- fix:
- chore:
- docs:
- test:

## Workflow (MANDATORY)
1. Create branch from main
2. Make changes
3. Commit with valid prefix
4. Push (local hooks run)
5. Open PR
6. Wait for CI
7. Merge to main

## What is already done
- Branch protection enabled
- CI pipeline working
- Local git hooks working
- Hook verification script added

## What comes next
- PR template
- Issue/task workflow
- Codex-driven development flow