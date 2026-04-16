Checkpoint: smoke flow passes with Option C

- smoke.yaml is the only orchestrator
- subflows are pure
- reset preflight is deterministic
- create/update/delete use Dev Tools helpers
- verify uses real UI selectors

Checkpoint: empty amount validation automation complete

- validation-empty-amount flow passes consistently
- production auto-select in Add Transaction removed
- validation flow uses deterministic dev-only setup (Dev Tools + smoke account helper)
- validation asserts:
  - amount error is visible
  - user remains on Add Transaction
  - no transaction is created
  - other screens remain unchanged
