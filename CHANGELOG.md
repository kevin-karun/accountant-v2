# Changelog

## Checkpoint 7.1 - Add Picker Neutral Default + Maestro Selector Stability

- Add Transaction create mode now resets the account picker to a neutral `Select account` placeholder instead of keeping a stale prior selection
- Transaction edit mode still preloads the correct account
- Added a stable `testID` to the Accounts name input and updated the Maestro smoke flow to target that selector
- Kept account refresh-on-focus behavior intact so newly created accounts still appear in the picker
- npm run verify passes

## Checkpoint 7.1 - Expo Go Smoke Launch + Add Picker Focus Refresh

- Updated the Maestro smoke entry flow to handle Expo Go home by tapping the recent `app` project card when needed
- Add Transaction now refreshes its account list whenever the tab regains focus, so newly created accounts appear in the picker without restart
- Kept existing transaction edit/delete flows, compact form layout, and focus-based refresh behavior intact
- npm run verify passes

## Checkpoint 7.1 - Cancel Button Polish & UI Smoke Automation

- Corrected Add Transaction edit-mode action row so Save and Cancel align cleanly as primary and secondary actions
- Added a lightweight Maestro smoke suite covering launch, account creation, duplicate prevention, transaction create/edit/delete, dashboard refresh, and tab switching
- Added concise run documentation for the smoke suite in `README.md` and `.maestro/README.md`
- Kept app runtime dependencies unchanged
- npm run verify passes

## Checkpoint 7.1 - Edit Escape & Form Scroll Reset

- Added a visible `Cancel` action in transaction edit mode next to `Save Changes`
- Cancel now exits edit mode, clears loaded transaction state, and returns to the originating screen
- Add Transaction now resets scroll to top whenever the tab regains focus
- Accounts now resets scroll to top whenever the tab regains focus
- Preserved transaction save/delete flows, inline validation, and inline success behavior
- npm run verify passes

## Checkpoint 7.0 - Transactions Edit/Delete Completion

- Added transaction edit mode to Add Transaction using route params and a local `mode` flag
- Tapping a transaction on Transactions or Dashboard now opens Add Transaction in edit mode with all fields pre-filled
- Added `updateTransaction()` to the transaction service and reused the existing `deleteTransaction()` service in edit mode
- Edit mode now shows `Save Changes` and a deterministic `Delete Transaction` button with confirmation
- After update or delete, the app navigates back to the originating screen so existing focus-based reloads refresh Transactions and Dashboard values
- Create mode behavior, inline validation, compact spacing, and inline create success feedback remain intact
- npm run verify passes

## Checkpoint 6.3 - Dashboard Preview Density & Transaction Row Clarity

- Reduced Dashboard recent transactions preview from 5 items to 3 to keep the screen summary-first
- Kept Dashboard accounts preview at 3 items
- Updated Dashboard and Transactions row hierarchy to show description first, account name plus type second, and date third
- Added sensible transaction title fallbacks for missing descriptions: Income or Expense
- Preserved signed amount formatting with green income and red expense styling
- npm run verify passes

## Checkpoint 6.2 - Dashboard Summary Hierarchy

- Moved Recent Transactions above Accounts so Dashboard prioritizes recent activity
- Limited the Dashboard accounts preview to the first 3 accounts
- Added helper text directing users to the Accounts tab for the full list
- Tightened account row identity by showing name and type together for quicker scanning
- Kept dashboard data loading, refresh-on-focus, and services unchanged
- npm run verify passes

## Checkpoint 6.1 - Dashboard Meaningful Data Refinement

- Added net change for the last 7 days under Total Balance using existing transaction data
- Recent transaction amounts now keep explicit signed income/expense formatting for quicker scanning
- Dashboard empty-state text now better guides the next step based on whether accounts already exist
- Kept existing dashboard load path, refresh-on-focus behavior, and services unchanged
- npm run verify passes

## Checkpoint 5.7 - Add Transaction UX Tightening

- Add Transaction now auto-scrolls to the top after a successful create so inline success feedback is immediately visible
- Reduced vertical spacing within the Add Transaction form for a tighter iPhone-first layout
- Tightened spacing around Account, Type, labels, controls, and the submit button without changing validation placement
- Preserved inline success clearing, inline validation, transaction creation, and downstream refresh behavior
- npm run verify passes

## Checkpoint 5.6 - Transaction Inline Success Feedback

- Removed the success popup from Add Transaction after successful creation
- Added lightweight inline success text near the transaction form
- Transaction success message now clears as soon as the user edits the form again
- Preserved inline validation, form reset behavior, Transactions refresh, and Dashboard balance updates
- npm run verify passes

## Checkpoint 6.1 - Dashboard Runtime Load Error Fix

- Fixed the Dashboard startup race where SQLite-dependent screens could load before the database finished initializing
- Prevented the initial Dashboard tab from triggering `Database not initialized. Call initialize() first.`
- Empty Dashboard states now load cleanly without error alerts or dev error toasts during normal startup
- Kept Dashboard refresh-on-focus and existing ledger-based balance loading unchanged
- Added a simple app-level fallback message for true database initialization failures
- npm run verify passes

## Checkpoint 6 - Dashboard Foundation

- Replaced the placeholder Dashboard screen with real SQLite-backed account and transaction data
- Added total balance summary using existing ledger-based account balance calculations
- Added account summary section with account name, type, and current calculated balance
- Added recent transactions section showing the latest 5 transactions with account name, description, amount, and date
- Added clear empty states for missing accounts and missing transactions
- Dashboard now refreshes when the screen regains focus using useFocusEffect
- No new packages added and existing Accounts/Transactions behavior preserved
- npm run verify passes

## Checkpoint 5.5 - Validation Hierarchy & Error Timing Refinement

- Refined account validation into a strict order: name, then type, then opening balance, then duplicate conflict
- Tier 2 and Tier 3 account errors now stay hidden until the required name and type are valid
- Duplicate account guidance now appears only after name, type, and opening balance all pass
- Inline account validation now shows only the highest-priority blocking step to reduce noise
- Preserved disabled submit behavior, duplicate prevention, success feedback, and transaction validation
- npm run verify passes

## Checkpoint 5.4 - Disabled Account Submit Guidance

- Made disabled account submit actions self-explanatory with pre-submit inline validation
- Added a placeholder account type state so missing type can be surfaced as a real validation blocker
- Field errors now appear when a field has been interacted with or once the account form is partially filled
- Preserved disabled Create Account and Save Changes behavior, duplicate prevention, and success feedback
- Kept transaction validation unchanged
- npm run verify passes

## Checkpoint 5.1 - Transaction Foundation Fixes

- Fixed Create Account button visibility: Added "New Account" button in form header for easy access to create mode
- Replaced alert-based transaction validation with inline field errors in red text under each input
- Added useFocusEffect to TransactionsScreen to refresh data when navigating back from Add Transaction
- Transaction form now clears validation errors on successful creation
- Maintained all existing CRUD behavior and balance calculations
- Tests still passing (9/9)
- TypeScript validation clean

## Checkpoint 5.2 - Accounts Form Validation & Duplicate Prevention

- Restored clear primary account action buttons: "Create Account" in create mode and "Save Changes" in edit mode
- Added inline validation for account name, type, opening balance, and duplicate account conflicts
- Prevented duplicate accounts with the same trimmed, case-insensitive name and identical type
- Kept duplicate prevention from blocking saving the existing record without changes
- Preserved all existing Accounts CRUD behavior and transaction validation
- Tests still passing (9/9)
- TypeScript validation clean
## Checkpoint 5.3 - Accounts Form UX Completion

- Disabled Create and Save Changes buttons when the account form is invalid
- Attached duplicate-account errors inline near the Account Name field
- Added lightweight inline success feedback for create and update actions
- Maintained all existing account create/edit/delete behavior and balance display
- Kept transaction inline validation unchanged
- Tests still passing (9/9)
- TypeScript validation clean

## Checkpoint 5 - Transactions CRUD Foundation

- Created transactionsService.ts with createTransaction, getAllTransactions, getTransactionsByAccount, deleteTransaction functions
- Implemented AddTransactionScreen with form for creating transactions: account picker, type selector (income/expense), amount input, description input, date input
- Implemented TransactionsScreen with list view showing all transactions with account name, type, amount, description, date
- Added transaction deletion with long-press confirmation alert
- Updated accountsService with getAccountBalance function that calculates balance from opening_balance + all income/expense transactions
- Updated AccountsScreen to display calculated balances instead of static opening_balance
- Transaction creation form includes validation for required fields and numeric amount
- Transaction list shows empty state when no transactions exist
- All transaction operations persist correctly to SQLite across app restarts
- Tests still passing (9/9)
- TypeScript validation clean

## Checkpoint 4 - Accounts CRUD Completion (Edit & Delete)

- Added updateAccount() function to accountsService
- Added deleteAccount() function to accountsService
- Added getAccountById() function for retrieving single account
- Updated database layer to support account updates and deletions
- Accounts screen now supports edit mode triggered by tapping an account
- Added edit form with Save/Cancel/Delete buttons when editing
- Edit form pre-fills with current account values
- Delete includes confirmation alert to prevent accidental deletion
- Updated list refreshes immediately after edit/delete operations
- Account items highlight when selected for editing
- Preserved existing create/list functionality
- All operations persist correctly to SQLite across app restarts
- Tests still passing (9/9)
- TypeScript validation clean

# Changelog

## Checkpoint 4.2 - Accounts Edit Mode UX Polish

- Restructured edit action buttons: Save/Cancel now in horizontal row, Delete separated below
- Added subtle edit mode visual indicator: blue left border on form section and "EDITING" badge
- Reduced picker minHeight from 48 to 44 for more proportional sizing
- Improved action hierarchy: primary Save action, secondary Cancel, separated destructive Delete
- Maintained all existing edit/delete functionality and persistence
- Tests still passing (9/9)

## Checkpoint 4.1 - Accounts UI Polish

- Refined action button hierarchy for Save/Cancel/Delete
- Lightened the edit mode visual treatment
- Adjusted spacing between title, form, action row, and saved accounts
- Calmer selected-account styling with subtle highlight
- Picker presentation improved with gentler background and border
- Maintained all current account behavior and persistence
- Tests still passing (9/9)

## Checkpoint 3.2 - Local Automated Validation Pipeline

- Added npm run typecheck script using tsc --noEmit
- Added npm run verify script that runs typecheck and test in sequence
- Preserved existing npm run test script
- Local validation pipeline allows quick verification before commits
- No external CI/CD or Git hooks required for local workflow
- ESLint skipped for now (not installed, not blocking)
- All tests passing (9/9)
- TypeScript compilation clean with no errors

## Checkpoint 3.1.1 - Accounts Screen Scrolling Fix

- Fixed scrolling regression introduced in Checkpoint 3.1
- Replaced View container with ScrollView for full screen vertical scrolling
- Removed flex: 1 from container and listSection styles
- Added contentContainerStyle for proper padding
- Preserved all existing functionality and UI cleanup
- Tests still passing (9/9)

## Checkpoint 3.1 - Accounts Flow Cleanup and Hardening

- Renamed Categories tab to Accounts in bottom navigation
- Renamed CategoriesScreen.tsx to AccountsScreen.tsx and updated component name
- Updated navigation imports and references
- Added "Create New Account" section header for clearer form organization
- Reduced spacing between UI sections for tighter layout
- Preserved all existing functionality and behavior
- Tests still passing (9/9)

## Checkpoint 3.0.2 - Testing Cleanup

- Cleaned up package.json: moved jest-expo from dependencies to devDependencies only
- Improved App.test.ts with meaningful tests for database schema and types
- Added tests for SQL table creation statements validation
- Added tests for database type structure validation
- Tests now cover: module imports (2), schema constants (2), type validation (3)
- All tests passing (9/9)
- Testing foundation stabilized and more robust

## Checkpoint 3.0.1 - Automated Testing Foundation

- Set up Jest using jest-expo preset (Expo SDK 54 compatible)
- Installed jest, @types/jest, and jest-expo dev dependencies
- Created jest.config.js with minimal jest-expo preset configuration
- Added npm test script for running tests
- Created `__tests__` directory with focused test suites
- Implemented accountsService ID generation test suite (3 tests)
- Implemented App module import verification test suite (2 tests)
- All tests passing (5/5)
- Testing foundation ready for regression detection

## Checkpoint 3 - Accounts CRUD Foundation

- Created accounts service layer with create and list operations
- Implemented account creation form with name, type, and opening balance
- Added account list display with persistent storage to SQLite
- Converted Categories screen to Accounts management screen
- Added form validation and error handling
- All created accounts persist across app restarts

## Checkpoint 2 - SQLite Database Foundation

- Added Expo SQLite database setup
- Created accounts and transactions tables with proper schema
- Implemented database initialization on app startup
- Added TypeScript types for database entities
- Set up clean database module structure

## Starting Line

- Project initialized
- Expo app created
- Folder structure created
- Documentation initialized
