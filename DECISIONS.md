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