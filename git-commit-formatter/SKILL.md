---
name: git-commit-formatter
description: Standardized git commit message formatting following Conventional Commits for the RWA Prediction Market project.
---

# Git Commit Formatter Skill

This skill provides mandatory instructions for formatting git commit messages to ensure a professional, searchable, and automated history.

## Commit Message Format

Each commit message consists of a **header**, an optional **body**, and an optional **footer**.

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### 1. Type
Must be one of the following:
- **feat**: A new feature (e.g., adding MiniMax integration)
- **fix**: A bug fix (e.g., fixing webhook timeout)
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

### 2. Scope
The scope should be the name of the module/directory affected:
- `contracts`
- `workflow`
- `frontend`
- `api`
- `infra`

### 3. Subject
- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No dot (.) at the end

## Examples

### Feature Commit
```text
feat(workflow): implement confidence threshold for settlement

Adds a check for parsed.confidence >= 5000 before sending the transaction.
Prevents low-confidence AI decisions from settling markets.
```

### Fix Commit
```text
fix(api): handle base64 decoding error in webhook

Wraps JSON.parse in a try-catch to prevent 500 errors when payload is malformed.
```

### Chore Commit
```text
chore(infra): add minimax api key to .env.example
```

## Guidelines for the Assistant
- ALWAYS use this format when suggesting or performing commits.
- Group related changes into a single logical commit when possible.
- If a change is "Breaking", add `!` after the type/scope (e.g., `feat(api)!: change settlement payload structure`).
