# Next Task

## Immediate goal
Expand test coverage beyond the current smoke flow.

## Done
- Smoke flow passes reliably with Option C
- smoke.yaml is the only orchestrator
- subflows are pure
- reset preflight is deterministic
- create/update/delete use Dev Tools helpers
- verify uses real UI selectors

## Next automation targets
1. Income transaction flow
   - create income transaction
   - verify transaction row appears
   - verify dashboard reflects it
   - verify account balance changes correctly

2. Validation flow
   - attempt save with missing required fields
   - verify validation errors appear
   - verify nothing is created

3. Multi-transaction flow
   - create multiple transactions
   - verify order in Transactions
   - verify dashboard recent transactions
   - verify final balance

## Rule
Keep smoke.yaml small and fast.
Do not bloat smoke with broader scenario coverage.
