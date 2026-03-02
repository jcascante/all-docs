---
title: VS Code & Copilot Integration Guide
description: Configuration guide for VS Code, GitHub Copilot, extensions, debugging, and AI-assisted development
author: Copilot
lastUpdated: 2026-03-02
version: 1.0
tags: [vscode, copilot, editor, debugging, extensions]
---

# VS Code & Copilot Integration Guide

> Configuration and recommendations for optimal AI-assisted development with VS Code and GitHub Copilot.

---

## VS Code Settings

Create or update `.vscode/settings.json` in the project root:

```json
{
  // Editor basics
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.rulers": [100],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,

  // TypeScript
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    }
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,

  // Python
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll": "explicit",
      "source.organizeImports": "explicit"
    }
  },
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.testing.pytestEnabled": true,
  "python.testing.pytestArgs": ["apps/backend/tests"],

  // Ruff (Python linter/formatter)
  "ruff.importStrategy": "fromEnvironment",
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.ruff": "explicit",
      "source.organizeImports.ruff": "explicit"
    }
  },

  // General
  "files.exclude": {
    "**/__pycache__": true,
    "**/.pytest_cache": true,
    "**/node_modules": true,
    "**/.venv": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/.pytest_cache": true,
    "**/dist": true,
    "**/build": true
  },

  // Copilot
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": false
  },

  // Testing
  "testing.automaticallyOpenPeekView": "failureInVisibleDocument"
}
```

---

## Recommended Extensions

### Core Extensions

- **Python**: `ms-python.python`
- **Pylance**: `ms-python.vscode-pylance` (type checking for Python)
- **Ruff**: `charliermarsh.ruff` (Python linter/formatter)
- **TypeScript Vue Plugin**: Built-in
- **ESLint**: `dbaeumer.vscode-eslint`
- **Prettier**: `esbenp.prettier-vscode`
- **Jest**: `orta.vscode-jest` (frontend testing)
- **Playwright Test for VSCode**: `ms-playwright.playwright`

### AI & Copilot

- **GitHub Copilot**: `GitHub.copilot`
- **GitHub Copilot Chat**: `GitHub.copilot-chat`

### Productivity

- **REST Client**: `humao.rest-client` (test API endpoints)
- **Thunder Client**: `rangav.vscode-thunder-client` (alternative to Postman)
- **Thunder Client**: `humao.rest-client`
- **GitLens**: `eamodio.gitlens` (git visualization)

### Visualization & Debugging

- **Thunder Client**: For API testing
- **Debugpy**: `ms-python.debugpy` (Python debugger)
- **JS Debug Terminal**: Built-in

---

## Workspace Setup

### .vscode/extensions.json

Recommend extensions to team:

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "charliermarsh.ruff",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "GitHub.copilot",
    "GitHub.copilot-chat",
    "eamodio.gitlens"
  ]
}
```

---

## Using GitHub Copilot Effectively

### 1. Copilot Chat

Open with `Cmd+Shift+I` (Mac) or `Ctrl+Shift+I` (Windows/Linux).

**Good prompts** (AI-friendly):

```
// TDD approach - ask for tests first
@workspace Write tests for a function that selects the highest 
priority exercise from a list. The tests should cover normal case, 
empty list, and tie-breaking.

// Code generation with context
@workspace Generate a Pydantic model for ExerciseBlock that includes
name (string), exercises (list of Exercise), rest_between_sets (int),
and rest_after_block (int). Add descriptions for each field.

// Explain existing code
@workspace Explain what the PlanGenerator.generate_plan method does,
including its inputs, outputs, and side effects.

// Find improvements
@workspace Review the ExerciseSelector.select_highest method for
performance issues or bugs.

// Refactoring
@workspace Refactor the plan generation service to use dependency
injection for the ExerciseLoader and Validator.
```

**Avoid**:

```
❌ "Fix this code" (be specific)
❌ "Make it work" (provide context)
❌ "Implement a plan generator" (too vague, provide requirements)
❌ Very long prompts without @workspace context
```

### 2. Copilot Code Completions

Appears automatically as you type. **Tips**:

- **Start with comments**: Write a clear comment about what you want, Copilot will suggest
  ```typescript
  // Generate a unique plan ID using UUID
  const planId = // <- Copilot will suggest: crypto.randomUUID()
  ```

- **Finish method signatures first**: Copilot understands parameter types
  ```python
  async def generate_plan(request: PlanRequest) -> GeneratedPlan:
      # <- Copilot will suggest relevant implementation
  ```

- **Use keyboard shortcuts**:
  - `Cmd+\` (Mac) / `Ctrl+\` (Windows/Linux): Toggle Copilot
  - `Cmd+→` (Mac) / `Ctrl+→` (Windows/Linux): Accept next word
  - `Escape`: Reject suggestion

### 3. Context for Copilot

Copilot works better with context:

- **Open related files**: Open `types.ts` + `api-client.ts` before generating API code
- **Keep tests visible**: Have test file open when implementing
- **Use @workspace**: Reference the whole workspace in Chat: `@workspace how should I structure...`
- **Reference files in chat**: `@file:src/services/plan-generator.ts refactor this`

---

## Copilot Instructions File

Create `.copilot-instructions.md` in project root to guide Copilot:

```markdown
# Project Guidelines for AI Assistants

This project uses test-driven development (TDD). Always write tests before code.

## Architecture

- **Backend**: Python 3.12+ with FastAPI, async/await throughout
- **Frontend**: Next.js 15 with React 19, TypeScript strict mode
- **Testing**: pytest (backend), vitest + playwright (frontend)
- **Type Safety**: Mandatory type hints (Python) and strict TypeScript

## Code Generation Guidelines

### TDD First
1. Always generate tests first
2. Tests should be comprehensive (happy path, errors, edge cases)
3. Then implement code to pass tests
4. Then refactor

### Python Backend
- Use Pydantic v2 for models
- FastAPI with async/await
- Type hints on every function
- Follow `docs/AI_DOCS_PYTHON.md`

### TypeScript Frontend
- Strict TypeScript mode always
- React hooks, functional components
- Zod for form validation
- TanStack Query for server state, Zustand for client state
- Follow `docs/AI_DOCS_FRONTEND.md`

### Testing
- Backend: pytest with fixtures
- Frontend: vitest + React Testing Library + Playwright for E2E
- Minimum 80% coverage
- See `docs/AI_DOCS_TESTING.md`

## File Structure
- Python: Follow structure in `docs/AI_DOCS_WORKFLOW.md`
- TypeScript: Follow structure in `docs/AI_DOCS_WORKFLOW.md`

## Naming Conventions
- Python: `lowercase_with_underscores` for modules/functions, `PascalCase` for classes
- TypeScript: `PascalCase` for components, `camelCase` for functions/variables, `useFeature` for hooks

## Common Patterns
- Dependency injection in services
- Error handling with custom exceptions
- Async context managers for resource cleanup
- Form validation with Zod + React Hook Form

## Quality Standards
- All linters must pass (ruff, eslint)
- All type checkers must pass (mypy --strict, tsc --strict)
- All tests must pass with ≥80% coverage
- No hardcoded secrets or credentials
```

---

## Running Tests from VS Code

### Frontend (Vitest)

Click on test file → Click "Run" or "Debug" above test function.

Or use command palette: `Cmd+Shift+P` → "Test: Run Tests"

### Backend (pytest)

Install Python extension, then:

1. Open test file
2. Click "Run" or "Debug" above test function
3. Or use command palette: `Cmd+Shift+P` → "Python: Run Tests"

---

## Debugging

### Python Debugging

```python
# Set breakpoint
breakpoint()  # Or Shift+Cmd+D to set breakpoint in editor

# Run with debugger
# Command palette: "Python: Debug Tests"
```

### JavaScript/TypeScript Debugging

```typescript
// Set breakpoint
debugger;  // Or click gutter in editor

// Run with debugger
// Press F5 or click "Run and Debug" sidebar
```

### API Debugging

Use REST Client extension:

```rest
### Create Plan
POST http://localhost:8000/v1/plans
Content-Type: application/json

{
  "program_id": "strength_101",
  "athlete_level": "intermediate",
  "duration_weeks": 12
}

### Get Plan
GET http://localhost:8000/v1/plans/{{planId}}
```

---

## Command Palette Shortcuts

Useful commands (press `Cmd+Shift+P`):

```
TypeScript:
- "TypeScript: Restart TS Server" (if type checking stalls)
- "TypeScript: Go to Definition" (or Cmd+Click)

Python:
- "Python: Select Interpreter"
- "Python: Run Tests"
- "Python: Debug Tests"

General:
- "Format Document" (Shift+Opt+F on Mac)
- "Sort Imports" (if configured)
- "Toggle Fold" (Cmd+K Cmd+0)
- "Command Palette" (Cmd+Shift+P)

Git:
- "Git: Clone" (GitLens)
- "Git: View File History" (GitLens)
```

---

## Performance Tips

### Reduce VS Code Lag

If VS Code is slow:

1. Disable unnecessary extensions (check Extensions view)
2. Close unused files/folders
3. Restart TS Server: Cmd+Shift+P → "TypeScript: Restart TS Server"
4. Disable git integration if not needed: `"git.enabled": false`

### Speed Up Testing

- Run tests in watch mode: `pnpm test:watch`
- Run specific test file: `pytest tests/unit/test_models.py`
- Run tests matching pattern: `pytest -k test_selector`

---

## Git Integration (GitLens)

Installed via `eamodio.gitlens`:

- **View blame**: Hover over code line
- **File history**: Click file icon in command palette
- **Commit history**: Click on commit in timeline
- **Diff view**: Right-click file in Source Control

---

## Troubleshooting

### Copilot Not Suggesting Code

- Ensure GitHub login is active (check Accounts icon)
- Check that Copilot is enabled in settings
- Try: Cmd+I (Mac) to trigger inline chat
- Check if context is clear (comments, types help)

### Type Checking Errors

- Python: `python.linting.enabled: true` in settings
- TypeScript: Restart TS Server via Cmd+Shift+P
- Check `tsconfig.json` has `"strict": true`

### Formatter Conflicts

If Prettier and Ruff conflict:

```json
// settings.json - prioritize one formatter
"[python]": {
  "editor.defaultFormatter": "charliermarsh.ruff",
  "editor.formatOnSave": true
},
"[typescript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

### Python Virtual Environment Not Detected

```bash
# Create venv if missing
python3 -m venv .venv

# Activate
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows

# In VS Code Command Palette:
# "Python: Select Interpreter" → Choose .venv
```

---

## Recommended Reading

- **AI Docs**: Check `/docs/AI_DOCS_*.md` for language-specific guidelines
- **Project Design**: `/docs/design_and_architecture.md`
- **Architecture**: See system diagrams and C4 model
