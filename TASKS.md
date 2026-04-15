# Tasks

## Checkpoint 1 — App Shell ✅

- Setup navigation
- Create base screens:
  - Dashboard
  - Transactions
  - Add Transaction
  - Categories
  - Settings

## Checkpoint 2 — SQLite Database Foundation ✅

- Database setup
- Create accounts table
- Create transactions table
- Database initialization on startup

## Checkpoint 3 — Accounts CRUD Foundation ✅

- ✅ Account creation form
- ✅ Account list view
- ✅ Create operation (insert to SQLite)
- ✅ Read operation (list from SQLite)
- ✅ Fix Picker import error from react-native
- ✅ Testing foundation (Checkpoint 3.0.1)
- ✅ Testing cleanup (Checkpoint 3.0.2)
- ✅ Accounts flow cleanup and hardening (Checkpoint 3.1)
- ✅ Accounts screen scrolling fix (Checkpoint 3.1.1)
- ✅ Local automated validation pipeline (Checkpoint 3.2)

## Checkpoint 4 — Accounts CRUD Completion ✅

- ✅ Account editing (Update operation)
- ✅ Account deletion (Delete operation)
- ✅ Tap to edit account functionality
- ✅ Confirmation alert before deletion
- ✅ Edit form with save/cancel/delete buttons
- ✅ Account selection visual feedback
- ✅ Persistence across app restarts
- ✅ Accounts UI polish (Checkpoint 4.1)
- ✅ Accounts edit mode UX polish (Checkpoint 4.2)

## Checkpoint 5.1 — Transaction Foundation Fixes ✅

- ✅ Fixed Create Account button visibility with "New Account" button in header
- ✅ Replaced alert popups with inline red validation errors for transaction form
- ✅ Added screen refresh when navigating back to Transactions list
- ✅ Ensured transaction creation clears errors and shows success
- ✅ Verified transactions persist after app restart
- ✅ Maintained all existing Accounts CRUD behavior
- ✅ npm run verify passes

## Checkpoint 5.2 — Accounts Form Validation & Duplicate Prevention ✅

- ✅ Restored clear Create Account and Save Changes primary buttons
- ✅ Added inline field errors for account name, account type, opening balance, and duplicates
- ✅ Blocked duplicate accounts using trimmed case-insensitive name + type matching
- ✅ Preserved edit/delete account flows
- ✅ npm run verify passes

## Checkpoint 5.3 — Accounts Form UX Completion ✅

- ✅ Disabled Create and Save Changes buttons when the form is invalid
- ✅ Moved duplicate-account error into Account Name field area
- ✅ Added inline success feedback for create/update actions
- ✅ Kept transaction validation intact
- ✅ npm run verify passes

## Checkpoint 5.4 — Disabled Account Submit Guidance ✅

- ✅ Made disabled Create Account and Save Changes states explainable with visible inline validation
- ✅ Surface missing account name, missing account type, invalid opening balance, and duplicate conflicts before submit when appropriate
- ✅ Kept validation clean by showing errors after field interaction or once the form is partially filled
- ✅ Preserved existing account CRUD, duplicate prevention, and transaction validation behavior
- ✅ npm run verify passes

## Checkpoint 5.5 — Validation Hierarchy & Error Timing Refinement ✅

- ✅ Enforced validation order: name, then type, then opening balance, then duplicate conflict
- ✅ Prevented balance and duplicate errors from appearing before the primary fields are valid
- ✅ Limited inline guidance to the highest-priority blocking step to reduce confusion
- ✅ Kept all logic local to AccountsScreen.tsx with no layout changes or new libraries
- ✅ npm run verify passes

## Checkpoint 5.6 — Transaction Inline Success Feedback ✅

- ✅ Removed modal/popup success feedback from AddTransactionScreen
- ✅ Added subtle inline success text after successful transaction creation
- ✅ Clear success feedback when the user edits the transaction form again
- ✅ Preserved transaction validation, form reset, and downstream screen refresh behavior
- ✅ npm run verify passes

## Checkpoint 5.7 — Add Transaction UX Tightening ✅

- ✅ Auto-scroll to top after successful transaction creation so success text is immediately visible
- ✅ Reduced unnecessary vertical spacing in AddTransactionScreen only
- ✅ Kept inline validation, inline success clearing, and transaction creation behavior intact
- ✅ Avoided redesigns, new packages, and unrelated screen changes
- ✅ npm run verify passes

## Checkpoint 5 — Transactions CRUD Foundation ✅

- ✅ Transaction creation form (AddTransactionScreen)
- ✅ Transaction list view (TransactionsScreen)
- ✅ Create operation (insert to SQLite)
- ✅ Read operation (list from SQLite)
- ✅ Delete operation (long-press confirmation)
- ✅ Balance calculation from transactions (ledger-based)
- ✅ Account balance display updates
- ✅ Transaction form validation
- ✅ Empty state handling
- ✅ Persistence across app restarts

## Checkpoint 6 — Dashboard Foundation ✅

- ✅ Show total balance across all accounts
- ✅ Show account summary list with current ledger-based balances
- ✅ Show latest 5 transactions with account name, description, amount, and date
- ✅ Add clear empty states for accounts and recent transactions
- ✅ Refresh Dashboard data when returning to the screen
- ✅ npm run verify passes

## Checkpoint 6.1 — Dashboard Runtime Load Error Fix ✅

- ✅ Fixed Dashboard startup loading before SQLite initialization completed
- ✅ Removed normal empty-state Dashboard error popup/toast behavior
- ✅ Preserved refresh-on-focus and real data loading for populated states
- ✅ Kept fix low-risk and local without new packages
- ✅ npm run verify passes

## Checkpoint 6.1 — Dashboard Meaningful Data Refinement ✅

- ✅ Added last-7-days net change context under Total Balance
- ✅ Kept income and expense amounts visually distinct in Recent Transactions
- ✅ Improved Dashboard empty-state guidance based on whether accounts exist
- ✅ Reused existing Dashboard loading logic and services without restructuring
- ✅ npm run verify passes

## Checkpoint 6.2 — Dashboard Summary Hierarchy ✅

- ✅ Moved Recent Transactions above Accounts on the Dashboard
- ✅ Limited Accounts preview to 3 items with balances still visible
- ✅ Added helper text pointing users to the Accounts tab for the full list
- ✅ Made account rows easier to scan by showing name and type together
- ✅ npm run verify passes

## Checkpoint 6.3 — Dashboard Preview Density & Transaction Row Clarity ✅

- ✅ Reduced Dashboard recent transactions preview to 3 items
- ✅ Kept Dashboard accounts preview at 3 items
- ✅ Updated transaction rows on Dashboard and Transactions screens to prioritize description, then account name plus type, then date
- ✅ Preserved signed, color-coded amount formatting
- ✅ npm run verify passes

## Checkpoint 7.0 — Transactions Edit/Delete Completion ✅

- ✅ Added explicit create/edit transaction mode using AddTransactionScreen
- ✅ Enabled tapping transactions from Transactions and Dashboard to open edit mode with pre-filled fields
- ✅ Added transaction update service and reused transaction delete service in edit mode
- ✅ Added Save Changes and Delete Transaction controls in edit mode
- ✅ Preserved Dashboard and Transactions refresh via existing focus-based reload pattern
- ✅ npm run verify passes

## Checkpoint 7.1 — Edit Escape & Form Scroll Reset ✅

- ✅ Added a visible non-destructive exit path for transaction edit mode
- ✅ Cancel exits edit mode, clears stale edit state, and returns to the originating screen
- ✅ Add Transaction resets scroll to top on tab revisit
- ✅ Accounts resets scroll to top on tab revisit
- ✅ npm run verify passes

## Checkpoint 7.1 — Cancel Button Polish & UI Smoke Automation ✅

- ✅ Polished the Add Transaction edit-mode Cancel button alignment and hierarchy
- ✅ Added a lightweight Maestro smoke suite for core account and transaction flows
- ✅ Documented how to run the smoke suite
- ✅ Kept app runtime dependencies unchanged
- ✅ npm run verify passes

## Checkpoint 7.1 — Expo Go Smoke Launch + Add Picker Focus Refresh ✅

- ✅ Stabilized Maestro startup flow for the Expo Go home-screen case
- ✅ Refreshed Add Transaction accounts on focus so new accounts appear in the picker
- ✅ Preserved existing transaction and dashboard behaviors
- ✅ npm run verify passes

## Checkpoint 7.1 — Add Picker Neutral Default + Maestro Selector Stability ✅

- ✅ Reset Add Transaction create mode to a neutral `Select account` picker state
- ✅ Preserved edit-mode account prefill
- ✅ Added a stable Accounts form selector for Maestro
- ✅ Updated the Maestro smoke flow to use the stable selector
- ✅ npm run verify passes

## Future

- Transaction logic
- Bills system
