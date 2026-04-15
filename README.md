# Accountant V2

## Starting Line

This project is being built using a structured, low-touch workflow with AI-assisted development.

## What this is

Accountant is a single-user, offline-first mobile app for tracking financial balances and upcoming bills.

## Core Goal

Help the user:
- track money movement simply
- maintain accurate account balances
- avoid missing upcoming expenses

## Principles

- Offline-first
- Manual entry only
- Simple and fast UX
- Deterministic behavior
- Ledger-based system

## Current Stage

Checkpoint 1 — App Shell Setup

## Workflow

- ChatGPT → Product + Architecture + Task Definition
- Codex → Code Implementation
- Local Machine → Testing
- Git → Version Control

## Next Milestone

App shell with navigation and screens

## UI Smoke Tests

Maestro smoke coverage now lives in `.maestro/`.

Run:

```bash
cd app
npm start
```

In another terminal:

```bash
maestro test .maestro/smoke.yaml
```
