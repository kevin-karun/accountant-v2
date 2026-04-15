# History — Accountant V2

## 2026-04-15 — Option C Stabilization

Smoke test architecture finalized.

Key decisions:
- Adopted Option C: smoke.yaml as single orchestrator
- All subflows made pure (no chaining between flows)
- Dev Tools used for deterministic setup and mutations
- Verification moved to real UI selectors (user-facing screens only)
- Added deterministic reset preflight

Impact:
- Smoke flow is now stable and repeatable
- Eliminated flaky UI dependencies in setup flows
- Clear separation between setup, mutation, and verification

Notes:
- This is the first fully reliable end-to-end test baseline
- Future features should plug into this pattern only
