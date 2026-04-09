# Accountant V2 — Agent Operating System

## Project

**Name:** Accountant V2

**Product Summary:**
- Single-user personal finance app
- Offline-first (local SQLite database)
- iPhone-first design (mobile-first, 375px base width)
- Built with Expo React Native
- Manual entry only (no imports or APIs initially)
- Minimalist, clean UI focus

## Workflow Rules

When working on this project, follow these rules strictly:

1. **Checkpoint Scope**: Always work within the current checkpoint scope only. Do not jump ahead to future work.
2. **No Over-engineering**: Keep architecture simple. Avoid unnecessary abstractions, patterns, or services.
3. **No Backend/Sync/Auth/AI**: Do not add backend APIs, cloud sync, authentication, or AI features unless explicitly requested.
4. **Documentation**: Update CHANGELOG.md, TASKS.md, DECISIONS.md, ARCHITECTURE.md when a checkpoint completes.
5. **Small Diffs**: Prefer small, focused changes. Do not rewrite unrelated files.
6. **File Preservation**: Do not modify or restructure files unrelated to the current task.

## Coding Rules

1. **TypeScript Only**: All code must be TypeScript. No JavaScript files.
2. **Simplicity First**: Write readable, simple code. Prefer clarity over cleverness.
3. **Avoid Abstractions**: Do not create unnecessary folders, services, or patterns. Add them only when needed.
4. **Minimal Dependencies**: Only add packages from the Expo ecosystem. Avoid external libraries unless required.
5. **Consistent Naming**: Use clear, descriptive names for files, functions, and variables.

## Safety & Stop Conditions

Stop and request clarification if:

- A change requires major architecture decisions (e.g., state management library)
- New dependencies outside the Expo ecosystem are required
- Requirements conflict with existing decisions or are ambiguous
- A task feels incomplete or unclear

## Output Rules

For every task, always report:

1. **Files Created or Modified**: List each file changed with brief context.
2. **Packages Installed**: Report any new dependencies added.
3. **How to Run/Test**: Provide clear instructions to verify the work.

---

**Last Updated:** April 9, 2026
