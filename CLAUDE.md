# CLAUDE.md — Dynamic Training Program Generator

> "Programs-as-Code" system: coaches define ProgramDefinitions, a deterministic engine generates multi-week training plans from PlanRequests.
> **Core invariant**: The deterministic engine is always authoritative. AI is advisory only.

---

## Architecture at a Glance

```
training-program-generator/         ← Turborepo monorepo (pnpm workspaces)
├── apps/backend/                   ← Python 3.12 + FastAPI + Pydantic v2
├── apps/frontend/                  ← Next.js 15 (App Router) + React 19 + TypeScript
├── schemas/                        ← JSON Schema files (source of truth)
├── definitions/                    ← ProgramDefinition templates (JSON)
├── data/                           ← Exercise library (JSON)
├── examples/                       ← Example PlanRequests + GeneratedPlans
└── docs/                           ← Architecture & AI guidance docs
```

**Key docs** (read before modifying core logic):
- `docs/design_and_architecture.md` — single source of truth for system design
- `docs/AI_DOCS_FRONTEND.md` — detailed frontend patterns
- `docs/AI_DOCS_PYTHON.md` — detailed backend patterns
- `docs/TODO.md` — current progress tracker

---

## Commands

### Root (Turborepo)
```bash
pnpm dev           # Start all services
pnpm build         # Build all apps
pnpm test          # Run all tests
pnpm lint          # Lint all apps
pnpm typecheck     # Type check all apps
pnpm format        # Format all apps
```

### Backend (`apps/backend/`)
```bash
make run           # Start dev server (port 8000)
make test          # Run pytest (coverage ≥ 90% enforced)
make lint          # Ruff lint
make typecheck     # mypy strict
make format        # Ruff format
```

### Frontend (`apps/frontend/`)
```bash
pnpm dev           # Start dev server (port 3000)
pnpm test          # Run Vitest (coverage ≥ 80% enforced)
pnpm test:watch    # Watch mode
pnpm test:e2e      # Playwright E2E
pnpm typecheck     # tsc --strict
pnpm lint          # ESLint
pnpm format        # Prettier
```

---

## Coding Standards

### Non-negotiable rules
- **TDD mandatory** — write failing tests first (RED), then implement (GREEN), then refactor. Never write tests after code.
- **Type safety** — Python: `mypy --strict`, no `Any`. TypeScript: `strict` mode, no `any`.
- **Schema-first** — all data structures derive from `schemas/*.json`. Pydantic models are the Python source of truth; TypeScript types mirror them.
- **Determinism** — the engine must produce identical output for identical inputs. Use `seed` for controlled randomness.
- **Coverage gates** — backend ≥ 90%, frontend ≥ 80%.
- **No narrating comments** — comments only for non-obvious intent, trade-offs, or domain formulas.

### Backend (Python)
- Package manager: `uv` (never pip/poetry)
- Linter/formatter: `ruff` (replaces black, isort, flake8)
- Type checker: `mypy --strict`
- Testing: `pytest` + `pytest-asyncio` + `hypothesis` + `syrupy`
- Use `pydantic-settings` for config; never hardcode secrets
- Prefer immutable data structures; pipeline stages receive read-only context, return new objects
- Structured error types only — never bare `except Exception`

### Frontend (TypeScript/React)
- Framework: Next.js 15 App Router; server components by default, `"use client"` only when needed
- No `any` types — use `unknown` with type guards if necessary
- State: TanStack Query v5 (server state), Zustand (client state), React Hook Form + Zod (forms)
- Styling: Tailwind CSS v4 exclusively — no inline styles or CSS-in-JS
- UI primitives: shadcn/ui components
- Always handle all states explicitly: loading, error, empty, data
- Use `??` for nullish coalescing, not `||` for boolean checks

---

## Generation Pipeline (8 stages — backend core)

```
P0: Load ProgramDefinition
P1: Resolve Parameters        ← merge PlanRequest + defaults, build ctx
P2: Expand Session Templates  ← concrete week/day stubs
P3: Select Exercises          ← tag filter → score → dedup → seed
P4: Resolve Prescriptions     ← evaluate output_mapping expressions in sandbox
P5: Compute Metrics           ← fatigue, volume, tonnage, conditioning
P6: Validate Constraints      ← hard constraints (fail → P7), soft (warnings)
P7: Repair Loop               ← strategies → retry P3–P6, max repairs enforced
P8: Finalize GeneratedPlan
```

**Expression engine**: custom recursive-descent parser — no `eval()`, no `exec()`, 10ms timeout per expression, read-only context.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Readiness check |
| GET | `/program-definitions` | List available definitions |
| GET | `/program-definitions/{id}/{version}` | Get definition |
| POST | `/generate` | PlanRequest → GeneratedPlan |
| GET | `/exercise-library/{version}` | Exercise library |
| POST | `/validate-definition` | Validate definition JSON |

---

## What NOT to Do

- Skip writing tests or write tests after implementation
- Use `any` in TypeScript or `Any` in Python
- Call `eval()` or `exec()` anywhere in the expression engine
- Hardcode API URLs or credentials (use env vars)
- Mix server/client component concerns in Next.js
- Use `pip` or `poetry` — use `uv`
- Ignore error states or loading states in UI
- Let the AI layer override the deterministic engine output
- Amend published commits — always create new commits

---

## Performance Targets

- Plan generation: < 50ms (deterministic path, no I/O during generation)
- Expression evaluation: < 10ms per expression
- API `/generate`: < 100ms response
- Frontend initial load: < 2s (SSR/SSG)
