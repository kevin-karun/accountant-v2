# Next Task

## Objective
Validation automation — missing description

## Goal
- Create a deterministic Maestro flow that verifies Add Transaction blocks submission when description is empty.

## Acceptance Criteria

- open Add Transaction with deterministic setup
- select smoke account through test-only helper
- enter valid amount
- leave description blank
- submit
- assert description error is visible
- assert user remains on Add Transaction
- assert no new transaction appears in Transactions
- assert Dashboard remains unchanged

## Constraints

- keep production UX explicit
- prefer existing selectors and helpers
- do not modify smoke.yaml
- keep the flow independent
