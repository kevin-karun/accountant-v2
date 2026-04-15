# Next Task

## Objective
Build deterministic validation automation for transaction creation.

## Goal
- verify required-field validation blocks invalid submit
- confirm no transaction is created when validation fails

## Test Coverage

1. Missing amount
2. Missing description
3. Missing both fields

## Assertions

- Validation message appears
- User stays on Add/Edit Transaction screen
- No new transaction appears in Transactions list
- Dashboard remains unchanged

## Constraints

- Use existing selectors where possible
- Add minimal new testIDs only if required
- Do not modify smoke.yaml
- Keep flow independent (no chaining with other flows)

## Definition of Done

- Validation flow passes consistently (5/5 runs)
- No flaky selectors
- No unintended data created
