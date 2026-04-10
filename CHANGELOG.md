# Changelog

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