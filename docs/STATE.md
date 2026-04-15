# Project State — Accountant V2

**Last Updated:** April 14, 2026  
**Current Checkpoint:** 7.1 (Edit Escape & Form Scroll Reset)

## Completed Checkpoints

### Starting Line
- Project repository initialized
- Documentation structure created
- Decisions and architecture framework established

### Checkpoint 0: Project Foundation
- Expo project initialized
- Basic React Native setup
- TypeScript configured
- package.json with initial dependencies

### Checkpoint 1: App Shell
- Bottom tab navigation implemented
- 5 screen stubs created:
  - Dashboard
  - Transactions
  - Add Transaction
  - Accounts
  - Settings
- Clean, minimalist UI styling applied
- All screens render without crashes

### Checkpoint 2: SQLite Database Foundation
- Expo SQLite integrated
- Database module created (`app/database/`)
- Schema defined:
  - `accounts` table (id, name, type, opening_balance, timestamps)
  - `transactions` table (id, account_id, type, amount, description, date, timestamps)
- Foreign key relationship configured
- Database initialization on app startup
- TypeScript types defined for entities

### Checkpoint 3: Accounts CRUD Foundation
- Accounts service layer created (`app/database/accountsService.ts`)
- Create account operation with form validation
- List accounts operation with real-time display
- Accounts screen converted from Categories to Accounts
- Account form includes: name, type (dropdown), opening balance
- Accounts display as list with name, type, balance
- All operations persist to SQLite
- Error handling and loading states implemented
- Testing foundation established with Jest/jest-expo
- Testing cleanup completed (9/9 tests passing)

### Checkpoint 4: Accounts CRUD Completion
- Edit account functionality implemented (inline edit mode)
- Delete account functionality with confirmation alerts
- Edit form reuses create form with conditional UI
- Visual edit mode indicators (blue border, "EDITING" badge)
- Action button hierarchy refined (Save/Cancel horizontal, Delete separate)
- All operations persist and refresh UI immediately
- Accounts UI polish completed
- Edit mode UX polish completed

### Checkpoint 5: Transactions CRUD Foundation
- Transactions service layer created (`app/database/transactionsService.ts`)
- Transaction creation form implemented with account picker, type selector, amount/description/date inputs
- Transaction list view implemented with account names, amounts, descriptions, dates
- Transaction deletion with long-press confirmation
- Balance calculation updated to use ledger-based approach (opening_balance + transaction sums)
- Account balances now reflect actual transaction history
- Transaction operations persist to SQLite across app restarts

### Checkpoint 5.1: Transaction Foundation Fixes
- Create Account button visibility fixed with "New Account" button in form header
- Transaction validation replaced with inline field errors (red text under inputs)
- Transaction list refresh implemented with useFocusEffect for immediate updates
- Form validation errors clear on successful transaction creation
- All existing CRUD behavior preserved
- npm run verify passes (9/9 tests)

### Checkpoint 5.2: Accounts Form Validation & Duplicate Prevention
- Restored clear Create Account and Save Changes primary action buttons
- Added inline field validation for account name, account type, opening balance, and duplicate conflicts
- Prevented duplicate accounts using trimmed case-insensitive name plus same account type
- Maintained existing edit/delete account flows and account balance behavior
- npm run verify passes (9/9 tests)

### Checkpoint 5.3: Accounts Form UX Completion
- Disabled Create and Save Changes buttons when the account form is invalid
- Duplicate-account errors attached inline to the Account Name field area
- Added lightweight inline success feedback for create/update completion
- Preserved all existing account CRUD behavior and balance display
- Kept transaction inline validation unchanged
- npm run verify passes (9/9 tests)

### Checkpoint 5.4: Disabled Account Submit Guidance
- Kept disabled Create Account and Save Changes buttons, but made invalid states explainable with visible inline validation
- Added a placeholder account type selection so missing type can surface before submit
- Account field errors now appear after field interaction or once the form becomes partially filled
- Preserved duplicate prevention, success feedback, and transaction validation behavior
- npm run verify passes (9/9 tests)

### Checkpoint 5.5: Validation Hierarchy & Error Timing Refinement
- Accounts validation now follows a strict progression: name, then type, then opening balance, then duplicate conflict
- Balance and duplicate guidance stay hidden until the required name and type are valid
- Duplicate conflict does not appear until opening balance is also valid, reducing stacked and unrelated errors
- Accounts form now shows only the highest-priority blocking inline error at a time
- npm run verify passes (9/9 tests)

### Checkpoint 5.6: Transaction Inline Success Feedback
- Removed the Add Transaction success popup so submission no longer requires an extra confirmation tap
- Added lightweight inline success feedback near the transaction form after successful creation
- Success feedback clears when the user edits the form again
- Preserved transaction validation, transaction list refresh behavior, and dashboard balance updates
- npm run verify passes (9/9 tests)

### Checkpoint 5.7: Add Transaction UX Tightening
- Add Transaction now auto-scrolls to the top after success so inline confirmation is immediately visible
- Tightened vertical spacing around Account, Type, labels, controls, and submit button to reduce scrolling
- Kept inline validation under each field and preserved existing create/reset behavior
- npm run verify passes (9/9 tests)

### Checkpoint 6: Dashboard Foundation
- Dashboard now shows total balance across all accounts using existing ledger-based balance calculations
- Added account summary section listing each account with name, type, and current calculated balance
- Added recent transactions section showing the latest 5 items with account name, description, amount, and date
- Added clear empty states for accounts and transactions so the screen remains useful with partial or empty data
- Dashboard refreshes on focus with useFocusEffect to reflect the latest account and transaction changes
- npm run verify passes (9/9 tests)

### Checkpoint 6.1: Dashboard Runtime Load Error Fix
- Fixed the startup race where Dashboard could query SQLite before database initialization completed
- Normal empty Dashboard states no longer trigger error alerts or dev error toasts
- Dashboard still refreshes on focus and still loads total balance, account summaries, and recent transactions when data exists
- Added a simple fallback screen for true database initialization failures
- npm run verify passes (9/9 tests)

### Checkpoint 6.1: Dashboard Meaningful Data Refinement
- Added net change for the last 7 days beneath Total Balance for faster context
- Kept recent transaction amounts visually explicit with signed income and expense formatting
- Improved empty-state guidance so Dashboard points users toward creating an account or adding a transaction as needed
- Reused the existing Dashboard loading flow and preserved refresh-on-focus behavior
- npm run verify passes (9/9 tests)

### Checkpoint 6.2: Dashboard Summary Hierarchy
- Reordered Dashboard sections so Recent Transactions appears before Accounts
- Limited the Accounts section to a 3-item preview with subtle helper text pointing to the Accounts tab
- Tightened account labels by showing account name and type together for easier scanning
- Preserved the existing dashboard load path, net-change summary, and latest-5 transaction behavior
- npm run verify passes (9/9 tests)

### Checkpoint 6.3: Dashboard Preview Density & Transaction Row Clarity
- Reduced Dashboard recent transactions preview from 5 items to 3 so activity summary stays compact
- Kept Dashboard accounts preview at 3 items
- Updated transaction rows on Dashboard and Transactions screens to show description first, account name plus type second, and date third
- Added sensible fallback transaction titles for empty descriptions while keeping signed, color-coded amounts
- npm run verify passes (9/9 tests)

### Checkpoint 7.0: Transactions Edit/Delete Completion
- Add Transaction now supports explicit create and edit modes
- Tapping a transaction from Transactions or Dashboard opens edit mode with all fields pre-filled
- Edit mode supports saving changes and deleting the transaction with confirmation
- After update or delete, the app returns to the originating screen so existing focus-based reloads refresh Transactions and Dashboard
- Transaction create mode behavior, inline validation, and inline success feedback remain intact
- npm run verify passes (9/9 tests)

### Checkpoint 7.1: Edit Escape & Form Scroll Reset
- Added a visible Cancel action in transaction edit mode to provide a clear escape path
- Cancel clears local edit state and returns to the originating screen without saving
- Add Transaction resets to the top when its tab regains focus
- Accounts resets to the top when its tab regains focus
- Existing save/delete flows and inline feedback behavior remain intact
- npm run verify passes (9/9 tests)

### Checkpoint 7.1: Cancel Button Polish & UI Smoke Automation
- Polished the Add Transaction edit-mode action row so Save and Cancel align more cleanly
- Added a lightweight Maestro smoke suite for core account, transaction, dashboard, and tab-switching flows
- Documented smoke test run steps in `README.md` and `.maestro/README.md`
- No app runtime packages were added
- npm run verify passes (9/9 tests)

### Checkpoint 7.1: Expo Go Smoke Launch + Add Picker Focus Refresh
- Maestro smoke startup now handles the Expo Go home-screen case by tapping the recent `app` card when needed
- Add Transaction reloads accounts on focus so newly created accounts show up in the picker after returning to the Add tab
- Existing transaction edit/delete behavior and dashboard refresh behavior remain intact
- npm run verify passes (9/9 tests)

### Checkpoint 7.1: Add Picker Neutral Default + Maestro Selector Stability
- Add Transaction create mode now returns to a neutral `Select account` picker state instead of keeping a stale selected account
- Edit mode still preloads the transaction's account correctly
- Added a stable Accounts name-input selector for Maestro and updated the smoke flow to use it
- Existing account CRUD, transaction flows, and dashboard refresh behavior remain intact
- npm run verify passes (9/9 tests)

## Current App Status
- Accounts CRUD: complete with create, read, update, delete
- Transactions lifecycle: create, read, update, delete implemented
- Transaction form UX: inline validation, inline success feedback, and visible edit escape are in place
- Add Transaction layout: tighter and less scroll-heavy, with success auto-scroll
- Add Transaction data refresh: account picker updates on focus
- Add Transaction create mode: neutral account picker placeholder by default
- UI smoke automation: lightweight Maestro flow available for core regression coverage
- Form tabs: Add Transaction and Accounts reset to top on revisit
- Dashboard: implemented as a summary-first screen with total balance, 7-day net change, 3 recent transactions, and a 3-account preview
- Dashboard startup: stable with database-ready gating before initial tab mount
- Inline validation: stable in Accounts and Transactions forms, with progressive account error sequencing
- Duplicate prevention: active for Accounts
- SQLite persistence: working across restarts
- App runs without crashes in current workflow

## Current Constraints
1. Offline-first only: local SQLite data
2. No sync, no cloud, no auth
3. Manual entry only, no import engines
4. React hooks only, no state library
5. Expo ecosystem packages only

## Current Repo Structure
- `app/` — Expo app code
- `app/screens/` — screen components
- `app/database/` — SQLite service and CRUD logic
- `docs/` — project state and next-task documentation
- `CHANGELOG.md`, `TASKS.md`, `DECISIONS.md` — ongoing checkpoint tracking

## Current Focus
- Moving to next incremental feature work after Dashboard foundation
- Keep next changes low-risk and incremental
