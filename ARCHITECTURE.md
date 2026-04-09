# Architecture

## Platform
React Native (Expo)

## Structure

- Mobile App (Frontend)
  - app/screens/ - Screen components
  - app/navigation/ - Navigation setup
  - app/database/ - SQLite database layer
    - index.ts - DatabaseService singleton
    - schema.ts - SQL table definitions
    - types.ts - TypeScript interfaces
    - accountsService.ts - Accounts CRUD operations
- Local Database (SQLite - implemented)
- No backend (V1)

## Flow

User → App UI → Local SQLite Database → Calculations → UI

## Design Principles

- Keep logic simple
- Avoid premature abstraction
- Build modular components