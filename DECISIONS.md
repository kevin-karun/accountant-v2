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