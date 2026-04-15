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

## 2026-04-15 — Income transaction automation added

Added a separate Maestro flow for deterministic income transaction coverage.

Key points:
- Smoke flow left unchanged
- New income flow added at `.maestro/income-transaction.yaml`
- Deterministic Dev Tools helper added for smoke income creation
- Transactions and Dashboard verification use stable selectors
- Dashboard account balance verification added for Smoke Account
