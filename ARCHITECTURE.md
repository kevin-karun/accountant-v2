# Architecture

## Platform
React Native (Expo)

## Structure

- Mobile App (Frontend)
  - app/screens/ - Screen components
    - DashboardScreen.tsx - Dashboard totals, account summaries, and recent transaction overview
  - app/navigation/ - Navigation setup
  - app/database/ - SQLite database layer
    - index.ts - DatabaseService singleton
    - schema.ts - SQL table definitions
    - types.ts - TypeScript interfaces
    - accountsService.ts - Accounts CRUD operations and ledger-based balance calculation
    - transactionsService.ts - Transaction CRUD reads and writes
  - app/__tests__/ - Test suites
    - accountsService.test.ts - Account ID generation tests
    - App.test.ts - App module and environment tests
  - jest.config.js - Jest configuration with jest-expo preset
- Local Database (SQLite - implemented)
- Testing (Jest with jest-expo - implemented)
- No backend (V1)

## Flow

User → App UI → Local SQLite Database → Calculations → UI

Dashboard flow:
DashboardScreen → accountsService/getAllAccounts + transactionsService/getAllTransactions + accountsService/getAccountBalance → UI sections

## Design Principles

- Keep logic simple
- Avoid premature abstraction
- Build modular components
- Reuse existing service functions before adding new data layers
