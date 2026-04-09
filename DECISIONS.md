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

## Starting Line

- Expo chosen for fast iteration
- Offline-first architecture
- No backend for V1
- Single-user focus