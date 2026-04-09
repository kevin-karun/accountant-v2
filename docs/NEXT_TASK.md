# Next Task — Checkpoint 3: Accounts CRUD Foundation

**Target Checkpoint:** Checkpoint 3  
**Objective:** Accounts CRUD Foundation  
**Estimated Scope:** Create account insert/read operations and minimal UI

## Scope for Checkpoint 3

### In Scope
1. **Accounts Service Layer**
   - Create `app/database/accountsService.ts`
   - Implement `createAccount()` function
   - Implement `getAllAccounts()` function
   - Implement `getAccountById()` function
   - Keep service functions database-aware only

2. **Accounts Screen UI**
   - Convert Categories screen to Accounts list screen
   - Show list of all accounts
   - Display: account name, type, opening balance
   - Press account to view details (or prepare for editing)
   - Simple, list-based UI

3. **Add Account Sheet/Modal**
   - Minimal form with:
     - Account name (text input)
     - Account type (dropdown/picker)
     - Opening balance (number input)
   - Submit button creates account in database
   - Success feedback (navigation update or toast)
   - Cancel button closes form

4. **Database Integration**
   - Wire service layer into Accounts screen
   - Load accounts on screen mount
   - Insert new account on form submit
   - Real SQLite persistence

### Explicit Non-Goals
- ❌ Account editing/update form
- ❌ Account deletion
- ❌ Account search/filtering
- ❌ Multi-account calculations
- ❌ Transaction CRUD (that's Checkpoint 4)
- ❌ Form validation (basic only, just required fields)
- ❌ Error handling beyond console logging
- ❌ State management library
- ❌ Any backend or sync

## Test Expectations

After Checkpoint 3, verify:

1. ✅ App runs without crashes
2. ✅ Accounts screen displays list (empty initially)
3. ✅ Can navigate to Add Account form
4. ✅ Can enter account name, select type, enter balance
5. ✅ Submitting form creates account in database
6. ✅ New account appears in list immediately
7. ✅ Switching away and back to Accounts screen shows persisted accounts
8. ✅ Multiple accounts can be created
9. ✅ App startup reloads accounts from database

## Stop Conditions

Stop if:

- Form validation becomes complex (keep it simple)
- Need for state management library arises (use hooks only)
- Temptation to build account editing form (that's later)
- Need for backend sync or authentication (not in scope)
- Requirements to add new external dependencies (not allowed)
- Ambiguity on what "Categories" screen should become (ask first)

## Implementation Notes

- Use the existing `DatabaseService` from Checkpoint 2
- Add new `accountsService.ts` alongside it
- Reuse existing screen pattern and styling
- No new navigation routes needed
- Use native React hooks only (useState, useEffect, useCallback)
- Keep screens under 200 lines

## Success Criteria

- [ ] App runs with no crashes
- [ ] Accounts service layer created with create/read operations
- [ ] Accounts screen shows list of accounts
- [ ] Add Account form collects required fields
- [ ] New accounts persist to SQLite database
- [ ] Accounts reload on app startup
- [ ] Code is clean, TypeScript strict, and self-documenting

---

**After Completing Checkpoint 3:**
- Update CHANGELOG.md with Accounts CRUD completion
- Update TASKS.md to mark Checkpoint 3 complete and add Checkpoint 4
- Start on transactions or refine any discovered issues
