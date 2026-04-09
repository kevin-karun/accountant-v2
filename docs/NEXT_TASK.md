# Next Task — Checkpoint 4: Accounts CRUD Completion

**Target Checkpoint:** Checkpoint 4  
**Objective:** Accounts CRUD Completion (Edit & Delete)  
**Estimated Scope:** Add account update/delete operations and UI interactions

## Scope for Checkpoint 4

### In Scope
1. **Accounts Service Layer Extension**
   - Implement `updateAccount()` function
   - Implement `deleteAccount()` function
   - Implement `getAccountById()` function
   - Keep service functions database-aware only

2. **Edit Account UI**
   - Press/tap account in list to open edit screen or modal
   - Pre-fill form with current account values
   - Allow editing: name, type, opening balance
   - Submit button updates account in database
   - Cancel button returns to list

3. **Delete Account UI**
   - Delete button on edit screen or account item
   - Confirmation alert before deletion
   - Remove from SQLite on confirm
   - Refresh list after deletion

4. **List Interactivity**
   - Tap account item to open edit screen
   - Long-press or swipe for delete (optional - can use button)
   - Visual feedback on selection

### Explicit Non-Goals
- ❌ Transaction CRUD (that's Checkpoint 5)
- ❌ Account balance calculations or history
- ❌ Account archiving or soft deletes
- ❌ Batch operations
- ❌ Undo functionality
- ❌ State management library
- ❌ Any backend or sync

## Test Expectations

After Checkpoint 4, verify:

1. ✅ App runs without crashes
2. ✅ Tap account in list opens edit screen/modal
3. ✅ Edit screen shows current account data
4. ✅ Can modify account name, type, balance
5. ✅ Submit updates account in database
6. ✅ Updated account immediately shows in list
7. ✅ Can delete account with confirmation
8. ✅ Deleted account removed from list
9. ✅ Changes persist across app restarts
10. ✅ Multiple edits and deletions work correctly

## Stop Conditions

Stop if:

- Edit UI requires major navigation changes (keep it simple)
- Need for state management library arises (use hooks only)
- Requirements to add new external dependencies (not allowed)
- Delete operation has unexpected data integrity issues

## Implementation Notes

- Reuse the same form component/UI pattern for editing
- Keep edit operations localized to same screen if possible
- Use React Navigation or simple modal for edit flow
- Keep AccountsService functions straightforward database queries
- Minimal state lifting if possible

## Success Criteria

- [ ] App runs with no crashes
- [ ] `updateAccount()` function created and tested
- [ ] `deleteAccount()` function created and tested
- [ ] Edit UI allows modification of account fields
- [ ] Delete UI shows confirmation before removing
- [ ] Updates and deletions persist to SQLite
- [ ] List refreshes after edit or delete operations
- [ ] Code is clean, TypeScript strict, and self-documenting

---

**After Completing Checkpoint 4:**
- Update CHANGELOG.md with Accounts CRUD completion
- Update TASKS.md to mark Checkpoint 4 complete and add Checkpoint 5
- Move on to Transactions CRUD foundation
