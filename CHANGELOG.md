# Changelog

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