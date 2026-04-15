# Next Task — Accountant V2

## Objective
Stabilize and extend post-smoke test architecture.

## Current State
- Smoke flow fully stable using Option C
- Deterministic setup via Dev Tools
- Pure subflows implemented
- Verification uses real UI selectors

## Next Priorities

1. Add test coverage for edge cases
   - Multiple transactions
   - Different transaction types (income vs expense)
   - Empty vs populated states

2. Strengthen verification layer
   - Validate amounts
   - Validate account balances update correctly
   - Validate transaction list ordering

3. Remove Dev Tools dependency (long-term)
   - Gradually replace with real UI flows
   - Keep tests deterministic without internal shortcuts

4. Improve selector stability
   - Ensure all critical UI elements have testIDs
   - Avoid text-based selectors where possible

## Constraints
- No redesign
- No new packages
- Minimal diffs only

## Definition of Done
- Smoke test extended with at least 2 additional scenarios
- No flaky runs across 5 consecutive executions
