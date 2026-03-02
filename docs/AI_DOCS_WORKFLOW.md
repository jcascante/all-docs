---
title: Development Workflow & Conventions
description: Standards for file organization, naming conventions, git workflow, development checklist, and CI/CD
author: Copilot
lastUpdated: 2026-03-02
version: 1.0
tags: [workflow, conventions, git, cicd, setup]
---

# Development Workflow & Conventions

> Standards for file organization, naming, and development processes.

---

## File & Folder Naming Conventions

### Python Backend

```
apps/backend/src/
├── app/                          # Module: FastAPI app initialization
│   └── __init__.py              # exports: app, settings, lifespan
├── api/                         # Module: Route handlers
│   ├── routes/
│   │   ├── plans.py            # Resource: routes for /plans endpoints
│   │   ├── definitions.py       # Resource: routes for /definitions endpoints
│   │   └── health.py           # Resource: health check endpoint
│   └── __init__.py
├── models/                       # Module: Pydantic models (domain objects)
│   ├── plan.py                 # Class: Plan, Week, Session, Block, Exercise
│   ├── program.py              # Class: ProgramDefinition
│   ├── request.py              # Class: PlanRequest, CreateProgramRequest
│   └── __init__.py
├── services/                    # Module: Business logic
│   ├── plan_generator.py       # Class: PlanGenerator (main orchestrator)
│   ├── selector.py             # Class: ExerciseSelector
│   ├── validator.py            # Class: SchemaValidator
│   ├── loader.py               # Class: ExerciseLoader, SchemaLoader
│   └── __init__.py
├── core/                        # Module: Config, constants, utilities
│   ├── config.py               # Class: Settings (Pydantic config)
│   ├── exceptions.py           # Classes: Custom exceptions
│   ├── logger.py               # Logging setup
│   └── __init__.py
├── schemas/                     # Module: JSON Schema definitions
│   ├── plan_request_schema.json
│   ├── program_definition_schema.json
│   └── exercise_schema.json
└── loaders/                     # Module: Data loading
    ├── exercise_loader.py      # Class: ExerciseLoader
    ├── schema_loader.py        # Class: SchemaLoader
    └── __init__.py

apps/backend/tests/
├── unit/
│   ├── test_models.py          # Tests for: models.plan, models.program
│   ├── test_selector.py        # Tests for: services.selector.ExerciseSelector
│   ├── test_validator.py       # Tests for: services.validator.SchemaValidator
│   └── test_loaders.py         # Tests for: loaders.* modules
├── integration/
│   ├── test_pipeline_strength.py    # Tests for: strength plan generation pipeline
│   ├── test_pipeline_conditioning.py # Tests for: conditioning plan generation
│   └── test_plan_generator.py       # Tests for: plan_generator service
├── api/
│   └── test_endpoints.py       # Tests for: api.routes.* endpoints
└── conftest.py                 # Pytest fixtures and configuration
```

**Naming Rules**:
- Modules: `lowercase_with_underscores`
- Classes: `PascalCase`
- Functions: `lowercase_with_underscores`
- Constants: `UPPERCASE_WITH_UNDERSCORES`
- Test files: `test_<module>.py`
- Test functions: `test_<specific_behavior>`
- Test classes: `Test<ClassName>`

### TypeScript/React Frontend

```
apps/frontend/src/
├── app/                         # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── generate/
│   │   └── page.tsx            # Generate plan page
│   ├── definitions/
│   │   └── page.tsx            # Manage definitions page
│   └── plans/
│       ├── page.tsx            # List plans page
│       └── [id]/
│           └── page.tsx        # View plan detail page
├── components/                  # React components
│   ├── ui/                     # shadcn/ui components (auto-generated)
│   ├── plan/                   # Feature: Plan-related components
│   │   ├── SessionCard.tsx     # Component: displays single session
│   │   ├── PlanViewer.tsx      # Component: displays full plan
│   │   ├── BlockRow.tsx        # Component: displays exercise block
│   │   └── __tests__/          # (alternative) Test folder
│   │       └── PlanViewer.test.tsx
│   ├── forms/                  # Feature: Form components
│   │   └── PlanForm.tsx        # Component: form for plan generation
│   └── common/                 # Shared components
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── Navbar.tsx
├── lib/                         # Utilities & helpers
│   ├── api-client.ts           # Class/Object: API communication
│   ├── types.ts                # Types: Domain models & DTOs
│   ├── validation.ts           # Zod schemas for validation
│   ├── utils.ts                # Functions: Helper utilities
│   └── constants.ts            # Constants: App-wide values
├── hooks/                       # Custom React hooks
│   ├── useGetPlan.ts           # Hook: Query for fetching plan
│   ├── useCreatePlan.ts        # Hook: Mutation for creating plan
│   └── useUIStore.ts           # Hook: Wrapper around Zustand store
├── store/                       # Zustand state stores
│   ├── uiStore.ts              # Store: UI state (sidebar, modals, etc)
│   └── userStore.ts            # Store: User state
└── styles/
    └── globals.css             # Global Tailwind styles

apps/frontend/tests/
├── components/
│   ├── plan/
│   │   ├── SessionCard.test.tsx
│   │   ├── PlanViewer.test.tsx
│   │   └── BlockRow.test.tsx
│   └── forms/
│       └── PlanForm.test.tsx
├── lib/
│   ├── api-client.test.ts
│   ├── types.test.ts
│   └── utils.test.ts
├── e2e/
│   ├── generate-plan.spec.ts
│   └── health.spec.ts
├── setup.ts                    # Vitest + RTL setup
└── __mocks__/                 # Mock data and API responses
    └── handlers.ts            # MSW (Mock Service Worker) handlers
```

**Naming Rules**:
- Components: `PascalCase.tsx`
- Hooks: `useFeature.ts` (always start with `use`)
- Stores: `featureStore.ts`
- Test files: `Feature.test.tsx` (colocated) or `test_feature.ts` (separate)
- Types: `featureTypes.ts` or inline in `types.ts`
- Utilities: `featureName.ts` (lowercase)

---

## Import Path Aliases

Both projects use path aliases for cleaner imports.

### Python (pyproject.toml)

```toml
[tool.pytest.ini_options]
pythonpath = ["."]
```

Usage:
```python
# Instead of: from ../../services import PlanGenerator
from app.services import PlanGenerator
```

### TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Usage:
```typescript
// Instead of: from ../../../lib/api-client
import { apiClient } from "@/lib/api-client";
import { Plan } from "@/lib/types";
```

---

## Git Workflow

### Branch Naming

```
feature/<feature-name>          # New feature
fix/<bug-name>                  # Bug fix
refactor/<area>                 # Refactoring
docs/<section>                  # Documentation
test/<feature>                  # Test improvements
chore/<task>                    # Maintenance (dependencies, config)
```

Examples:
```
feature/plan-generation-v2
fix/selector-priority-ordering
refactor/validation-layer
docs/api-endpoints
test/exercise-loader-coverage
chore/update-dependencies
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `docs`: Documentation
- `chore`: Dependencies, config, build
- `perf`: Performance improvements

Examples:

```
feat(plan-generator): add duration validation

- Validate duration is between 1-52 weeks
- Return 400 error if invalid
- Add unit tests for validation edge cases

Closes #123
```

```
fix(selector): fix priority ordering with equal priorities

Previously, when exercises had equal priorities, the selector
would return inconsistent results. Now uses exercise name as
secondary sort key.

Fixes #456
```

```
test(frontend): improve plan form test coverage

- Add tests for validation error messages
- Add tests for form submission flow
- Add tests for field prefilling

Closes #789
```

### Code Review

Before merging:

- [ ] **Tests pass** (CI/CD pipeline green)
- [ ] **Coverage maintained** (≥80%)
- [ ] **Code reviewed** by at least one teammate
- [ ] **No merge conflicts**
- [ ] **Commit messages follow convention**
- [ ] **No hardcoded secrets or credentials**

---

## Development Checklist

### Before Starting Work

- [ ] Create feature branch from `main`
- [ ] Understand the requirement (read issue/spec)
- [ ] Identify what tests to write (TDD)
- [ ] Check existing related code/patterns

### While Developing

- [ ] **Write test first** (red state)
- [ ] Implement code to pass test (green state)
- [ ] Refactor (clean up code)
- [ ] Run local tests: `npm test` or `pytest`
- [ ] Run linting: `npm run lint` or `ruff check`
- [ ] Run type checking: `npm run typecheck` or `mypy`
- [ ] Format code: `npm run format` or `ruff format`

### Before Committing

- [ ] All tests pass
- [ ] Coverage ≥80%
- [ ] Code formatted
- [ ] Linting passes
- [ ] Type checking passes
- [ ] Commit message follows convention
- [ ] No console.logs or print statements (unless intentional logging)

### Before Pushing

- [ ] Rebase on latest `main`
- [ ] Run full test suite one more time
- [ ] No merge conflicts
- [ ] Push feature branch

### Code Review / PR

- [ ] **Title**: Clear, follows convention (`feat: ...` or `fix: ...`)
- [ ] **Description**: Explains what and why (not just what)
- [ ] **Linked issue**: References issue number (`Closes #123`)
- [ ] **Test evidence**: Screenshots, test runs
- [ ] **No breaking changes** (or clearly documented)
- [ ] **Updated documentation** if needed

---

## Local Development Setup

### Backend

```bash
cd apps/backend

# Install dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run linting
ruff check --fix
ruff format

# Type checking
mypy src

# Start server
uvicorn app:app --reload
```

### Frontend

```bash
cd apps/frontend

# Install dependencies
pnpm install

# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Start dev server
pnpm dev
```

### Monorepo

```bash
# From root directory

# Run all tests
pnpm test

# Run all type checks
pnpm typecheck

# Run all linting
pnpm lint

# Run all formatting
pnpm format

# Run development servers
pnpm dev
```

---

## CI/CD Pipeline Requirements

All these must pass before merge:

- [ ] Unit tests pass (backend + frontend)
- [ ] Test coverage ≥80%
- [ ] Type checking passes (mypy + tsc)
- [ ] Linting passes (ruff + eslint)
- [ ] Code formatting correct (ruff format + prettier)
- [ ] No security vulnerabilities
- [ ] E2E tests pass

Automated via GitHub Actions (see `.github/workflows/`).

---

## Environment Configuration

### Backend (.env)

```bash
# .env.example (commit this)
API_TITLE=Training Program Generator
DEBUG=false
DATABASE_URL=postgresql://user:password@localhost/dbname
LOG_LEVEL=INFO

# .env (don't commit - local only)
# Copy from .env.example and customize
```

### Frontend (.env.local)

```bash
# .env.example (commit this)
NEXT_PUBLIC_API_URL=http://localhost:8000

# .env.local (don't commit - local only)
# Copy from .env.example and customize
```

---

## Performance & Optimization Tips

### Backend

- Use async/await for all I/O operations
- Cache schema definitions and exercise data
- Use batch operations for database queries
- Profile with `cProfile` if performance issues
- Monitor with logging (don't guess)

### Frontend

- Lazy-load routes and components
- Use React.memo for expensive components
- Profile with React DevTools Profiler
- Use Next.js Image optimization
- Minimize bundle size (check with `npm run build --analyze`)

---

## Troubleshooting

### Tests Failing Locally But Passing in CI

- Clear cache: `pytest --cache-clear` or `vitest --clearCache`
- Update snapshots: `pytest --snapshot-update` or `npm test -- -u`
- Check for platform-specific issues (path separators, line endings)

### Type Errors Not Caught

- Ensure TypeScript strict mode is enabled: `"strict": true` in tsconfig.json
- Run type checker: `pnpm typecheck` or `mypy --strict`
- Check IDE is using correct TS version

### Dependency Conflicts

- Clean install: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
- Or: `rm -rf .venv && pip install -e ".[dev]"`

### API Mocking Issues

- Frontend uses MSW (Mock Service Worker)
- Ensure MSW handlers are defined in `tests/__mocks__/handlers.ts`
- Reset handlers between tests: `server.resetHandlers()`
