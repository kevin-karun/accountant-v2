# Decisions

## Database

- Expo SQLite chosen as local database for V1
- Dates stored as text/ISO strings for simplicity
- Database file named accountant.db
- Foreign key relationships enabled between transactions and accounts
- Account IDs generated as: 'acc_' + timestamp + random suffix (simple, local-only approach)

## Architecture

- Service layer pattern: database queries separated into service functions
- Accounts service (accountsService.ts) contains create and list operations
- Screen components use React hooks (useState, useEffect, useCallback) for state
- No external state management library used for V1

## Edit/Delete Implementation

- Inline edit mode triggered by tapping an account item
- Edit form reuses the create form with conditional UI (section title, button labels)
- Edit state managed with editingId to track which account is being edited
- Delete operation uses native Alert.alert() for confirmation (no extra dependencies)
- Account item selection is subtle and calm, not visually overwhelming
- Edit mode visually indicated with blue left border and "EDITING" badge
- Action buttons restructured: Save/Cancel horizontal, Delete separated below
- Simplified approach: no separate edit screen, all operations on same screen
- List refreshes immediately after update/delete via loadAccounts() callback

## Build and Validation

- Local validation pipeline with npm run verify for quick checks
- Typecheck script uses tsc --noEmit (no file emission, pure validation)
- Verify script runs typecheck then test in sequence
- Early error detection before commits (local-first approach)
- ESLint deferred to future checkpoints (not blocking for V1)
- No Git hooks, CI/CD, or automation tooling required yet

## UI/UX

- Accounts screen renamed from Categories for consistency
- Minimalist design with clean spacing and clear section headers
- Form sections use white backgrounds with subtle shadows for visual separation
- Bottom navigation uses consistent iconography (Ionicons)
- Dashboard uses the same simple card/list treatment as the rest of the app, with no charts or extra visual systems

## Transaction Validation UX

- Alert-based validation replaced with inline field errors for better UX
- Error messages displayed in red text directly under relevant input fields
- Validation state managed with errors object (Record<string, string>)
- Form clears all errors on successful submission
- Simple field-specific validation without complex rules
- No additional validation libraries or dependencies
- Transaction success feedback is inline and non-blocking, matching the account form direction
- Add Transaction success text clears on the next user edit to keep the form responsive without extra taps
- Add Transaction scrolls back to the top after a successful create so inline success is immediately visible
- Add Transaction spacing is intentionally compact to reduce scrolling on iPhone-sized layouts without changing form structure

## Transaction List Refresh

- useFocusEffect from React Navigation used to refresh transaction list when screen comes into focus
- Ensures newly created transactions appear immediately after navigation
- No manual refresh buttons or pull-to-refresh (keeps UI simple)
- Automatic refresh on tab navigation maintains expected mobile app behavior

## Create Account Button Visibility

- Added "New Account" button in form header for consistent access to create mode when editing
- Green cancel button only appears while editing to avoid confusion in create mode
- Primary action button remains the main control: Create Account in create mode, Save Changes in edit mode
- No major UI restructuring, minimal change to preserve existing patterns

## Accounts Inline Validation

- Standardized form validation to inline errors for account name, account type, opening balance, and duplicate conflict
- Duplicate detection uses trimmed, case-insensitive name plus matching account type
- Duplicate errors display directly in the Account Name field area for clearer hierarchy
- Validation errors display in red text below the relevant field
- Errors clear when the user edits the field to keep the form responsive and user-safe
- Submit buttons are disabled when the form is invalid to prevent premature submission
- Lightweight inline success feedback is used for create/update completion
- No form library or global validation framework added; logic remains local to screen component
- Accounts form keeps submit buttons disabled on invalid state, but now derives visible inline errors before submit
- Error visibility rule: show account errors after field interaction or once any account form field has been filled
- Account type now uses a placeholder selection in create mode so missing type remains explainable without changing validation scope
- Account validation is progressive: name and type are Tier 1, opening balance is Tier 2, duplicate conflict is Tier 3
- Later-tier account errors stay hidden until earlier tiers pass to keep the disabled state explainable without stacking messages
- Accounts screen renders only the highest-priority visible blocking error at a time, using existing inline field placement

## Dashboard Data Loading

- Dashboard screen loads accounts and transactions directly from existing SQLite services
- Current account balances are reused from `getAccountBalance()` so dashboard totals stay aligned with Accounts screen ledger logic
- Latest dashboard transactions come from `getAllTransactions()` and are limited locally to the most recent 5
- Dashboard derives a simple last-7-days net change directly from the loaded transactions in-screen, avoiding extra services
- Dashboard accounts are previewed only as a short summary list (max 3) so the screen stays activity-first instead of duplicating the Accounts tab
- Dashboard recent transactions are previewed as a short summary list (max 3) for the same reason
- Dashboard refreshes with `useFocusEffect` so tab return reflects recent account and transaction changes without navigation changes
- No dedicated dashboard service was added because the existing service layer already covered the required data cleanly
- App navigation now waits for SQLite initialization before mounting the tab screens, preventing the initial Dashboard load from racing database startup

## Transaction Row Hierarchy

- Transaction rows prioritize the description as the primary line
- If description is blank or whitespace, the row falls back to Income or Expense
- Account name plus account type are shown together on the secondary line for better identity when names repeat
- Date remains the tertiary line and the signed amount stays on the right with existing income/expense colors

## Transaction Edit Flow

- AddTransactionScreen now supports a local `mode` flag with `create` and `edit`
- TransactionsScreen and DashboardScreen pass the full transaction object plus an origin screen when opening edit mode
- AddTransactionScreen consumes the edit params once, pre-fills the form, and clears the params so the Add tab does not stay stuck in edit mode
- Save uses `updateTransaction()` and delete uses the existing confirmation pattern with `deleteTransaction()`
- After update or delete, navigation returns to the originating screen so the app can rely on existing `useFocusEffect` reloads for synchronization

## Testing

- Jest used with jest-expo preset for Expo SDK 54 compatibility
- Tests placed in `__tests__/` directory with `.test.ts` suffix
- Tests focus on simple logic and module availability (no complex component rendering yet)
- No @testing-library/react-native due to React 19.1.0 compatibility conflicts
- Test coverage prioritizes database service logic, schema validation, and app initialization paths
- jest-expo kept only in devDependencies (not runtime dependencies)

## Starting Line

- Expo chosen for fast iteration
- Offline-first architecture
- No backend for V1
- Single-user focus
