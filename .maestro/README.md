# Maestro Smoke Tests

This folder contains a lightweight UI smoke suite for Accountant V2.

## Covered flows

- App launch
- Tab switching
- Create account
- Duplicate account prevention
- Create transaction
- Edit transaction
- Delete transaction
- Dashboard refresh after transaction changes

## Assumptions

- Expo app is already running in Expo Go or a compatible simulator session
- The connected simulator/device opens this app under Expo
- A clean or predictable local database state is preferred before running the smoke flow
- The smoke flow now handles two Expo Go startup cases:
  - the app opens directly
  - Expo Go home opens first and the recent `app` project card must be tapped

## Run

1. Start the app:

```bash
cd app
npm start
```

2. In another terminal, run the smoke flow:

```bash
maestro test .maestro/smoke.yaml
```

If your Expo session uses a different app id or launch target, adjust the `appId` in `.maestro/smoke.yaml` before running.
