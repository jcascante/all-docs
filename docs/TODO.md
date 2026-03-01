# TODO -- Dynamic Training Program Generator

> **Read this file at the start of every session to know where we left off.**
>
> Mark items `[x]` as they are completed. Each phase has a GATE that must pass
> before moving to the next phase. See `docs/design_and_architecture.md` for
> full design details.

---

## Phase 0: Environment & Tooling

- [x] 0.1  Create monorepo root `package.json` with workspaces config
- [x] 0.2  Create `turbo.json` with pipeline definitions (lint, typecheck, test, build, dev)
- [x] 0.3  Create `.gitignore` (Python + Node + env files + IDE)
- [x] 0.4  Create `.cursor/rules` file with TDD + coding standards
- [x] 0.5  Scaffold backend: `apps/backend/pyproject.toml` with all dependencies and tool config (ruff, mypy, pytest)
- [x] 0.6  Create backend `apps/backend/src/` directory structure with `__init__.py` files
- [x] 0.7  Create backend `apps/backend/tests/` directory structure with `__init__.py` files and `conftest.py`
- [x] 0.8  Create backend `apps/backend/Makefile` (test, lint, format, typecheck, run)
- [x] 0.9  Scaffold frontend: `apps/frontend/` with Next.js 15, TypeScript, Tailwind, shadcn/ui
- [x] 0.10 Configure frontend testing: `vitest.config.ts`, `playwright.config.ts`
- [x] 0.11 Create `apps/backend/Dockerfile` (multi-stage)
- [x] 0.12 Create `apps/frontend/Dockerfile` (multi-stage)
- [x] 0.13 Create root `docker-compose.yml` (backend + frontend)
- [x] 0.14 Create `.env.example` files (root + backend + frontend)
- [x] 0.15 Create `.github/workflows/ci.yml` (lint, typecheck, test, build)
- [x] 0.16 Write `README.md` with prerequisites + setup instructions
- [x] 0.17 **GATE**: `uv run ruff check .` passes in backend
- [x] 0.18 **GATE**: `uv run mypy src/` passes in backend
- [x] 0.19 **GATE**: `uv run pytest` runs (0 tests collected, no errors)
- [x] 0.20 **GATE**: `pnpm typecheck` passes in frontend
- [x] 0.21 **GATE**: `pnpm test` runs in frontend (6 tests pass)

---

## Phase 1: Domain Models + Data Loading

- [x] 1.1  Write `tests/unit/test_models.py` -- tests for all enums (Pattern, Muscle, Level, Method)
- [x] 1.2  Implement `src/models/enums.py` -- all closed taxonomy enums
- [x] 1.3  Run tests -> enums pass
- [x] 1.4  Write tests for `ExerciseLibrary` + `Exercise` model (valid data, invalid data, edge cases)
- [x] 1.5  Implement `src/models/exercise_library.py` -- Pydantic models from `schemas/exercise_library.schema.json`
- [x] 1.6  Run tests -> exercise library model tests pass
- [x] 1.7  Write tests for `ProgramDefinition` model (valid data, missing required fields, nested validation)
- [x] 1.8  Implement `src/models/program_definition.py` -- from `schemas/program_definition.schema.json`
- [x] 1.9  Run tests -> program definition model tests pass
- [x] 1.10 Write tests for `PlanRequest` + `Athlete` model (valid/invalid, conditional fields)
- [x] 1.11 Implement `src/models/plan_request.py` -- from `schemas/plan_request.schema.json`
- [x] 1.12 Run tests -> plan request model tests pass
- [x] 1.13 Write tests for `GeneratedPlan` model (valid structure, nested weeks/sessions/blocks)
- [x] 1.14 Implement `src/models/generated_plan.py` -- from `schemas/generated_plan.schema.json`
- [x] 1.15 Run tests -> generated plan model tests pass
- [x] 1.16 Implement `src/models/errors.py` -- structured error model
- [x] 1.17 Write tests for data loader: loads `exercise_library_v1.json`, validates, caches
- [x] 1.18 Implement `src/loaders/library_loader.py` -- file-based loader with validation
- [x] 1.19 Run tests -> library loads 80+ exercises, all validated
- [x] 1.20 Write tests for loading ProgramDefinitions from `definitions/` folder
- [x] 1.21 Implement definition loading in `src/loaders/library_loader.py`
- [x] 1.22 Run tests -> both definitions load and validate
- [x] 1.23 Write `tests/unit/test_schema_validation.py` -- validate all JSON data against JSON schemas
- [x] 1.24 **GATE**: `uv run pytest tests/unit/test_models.py` -- all pass (43 tests)
- [x] 1.25 **GATE**: `uv run pytest` -- all 51 tests pass, coverage 93% for models + data
- [x] 1.26 **GATE**: `uv run mypy src/` -- no errors
- [x] 1.27 **GATE**: `uv run ruff check .` -- no errors

---

## Phase 2: Expression Engine

- [x] 2.1  Write `tests/unit/test_expression_lexer.py` -- tokenize numbers, strings, identifiers, operators, parentheses (35 tests)
- [x] 2.2  Implement `src/core/expression/lexer.py` -- Token, TokenType, Lexer
- [x] 2.3  Run tests -> lexer tests pass
- [x] 2.4  Write `tests/unit/test_expression_parser.py` -- parse literals, binary ops, function calls, member access, arrays, dicts (36 tests)
- [x] 2.5  Implement `src/core/expression/ast_nodes.py` -- AST node types
- [x] 2.6  Implement `src/core/expression/parser.py` -- recursive-descent parser
- [x] 2.7  Run tests -> parser tests pass
- [x] 2.8  Write `tests/unit/test_expression_evaluator.py` -- evaluate all constructs (66 tests)
- [x] 2.9  Implement `src/core/expression/evaluator.py` -- AST evaluator with sandboxed function registry
- [x] 2.10 Run tests -> all evaluator tests pass
- [x] 2.11 Write sandbox boundary tests: unknown function rejected, no eval/exec, no __import__
- [x] 2.12 Run tests -> sandbox boundary tests pass
- [x] 2.13 **GATE**: `uv run ruff check .` -- all checks passed
- [x] 2.14 **GATE**: `uv run mypy src/` -- no errors
- [x] 2.15 **GATE**: `uv run pytest` -- 188 tests pass, 96% coverage

---

## Phase 3: Exercise Selector

- [x] 3.1  Write `tests/unit/test_selector.py` (22 tests)
- [x] 3.2  Implement `src/core/selector/exercise_selector.py`
- [x] 3.3  Run tests -> all 22 selector tests pass
- [x] 3.4  **GATE**: `uv run ruff check .` -- all checks passed
- [x] 3.5  **GATE**: `uv run mypy src/` -- no errors
- [x] 3.6  **GATE**: `uv run pytest` -- 210 tests pass, 96% coverage

---

## Phase 4: Prescription + Load Resolution

- [x] 4.1  Write `tests/unit/test_prescription.py` (27 tests)
- [x] 4.2  Implement `src/core/prescription/load_resolver.py` -- RPE table, load calc, rounding
- [x] 4.3  Implement `src/core/prescription/prescription_resolver.py` -- mode dispatch
- [x] 4.4  Run tests -> all 27 prescription tests pass
- [x] 4.5  **GATE**: `uv run ruff check .` -- all checks passed
- [x] 4.6  **GATE**: `uv run mypy src/` -- no errors
- [x] 4.7  **GATE**: `uv run pytest` -- 237 tests pass, 95% coverage

---

## Phase 5: Metrics Engine

- [x] 5.1  Write `tests/unit/test_metrics.py` (14 tests)
- [x] 5.2  Implement `src/core/metrics/metrics_engine.py` -- unified engine
- [x] 5.3  Run tests -> all 14 metrics tests pass
- [x] 5.4  **GATE**: `uv run ruff check .` -- all checks passed
- [x] 5.5  **GATE**: `uv run mypy src/` -- no errors
- [x] 5.6  **GATE**: `uv run pytest` -- 251 tests pass, 95% coverage

---

## Phase 6: Validation + Repair

- [x] 6.1  Write `tests/unit/test_validator.py` (19 tests)
- [x] 6.2  Implement `src/core/validation/validator.py`
- [x] 6.3  Write `tests/unit/test_repair.py` (15 tests)
- [x] 6.4  Implement `src/core/repair/strategies.py` + `src/core/repair/engine.py`
- [x] 6.5  **GATE**: `uv run ruff check .` -- all checks passed
- [x] 6.6  **GATE**: `uv run mypy src/` -- no errors (34 files)
- [x] 6.7  **GATE**: `uv run pytest` -- 285 tests pass, 94% coverage

---

## Phase 7: Pipeline Orchestrator + Snapshot Tests

- [x] 7.1  Implement `src/core/pipeline.py` -- 7-stage orchestrator wiring all core modules
- [x] 7.2  Write `tests/integration/test_pipeline_strength.py` (11 tests)
- [x] 7.3  Write `tests/integration/test_pipeline_conditioning.py` (9 tests)
- [x] 7.4  Fixed data consistency: added missing exercise tags to library
- [x] 7.5  Fixed reps_range_rir_multi mode (variables->output_mapping merge)
- [x] 7.6  **GATE**: `uv run ruff check .` -- passed
- [x] 7.7  **GATE**: `uv run mypy src/` -- no errors (35 files)
- [x] 7.8  **GATE**: `uv run pytest` -- 305 tests pass, 94% coverage

---

## Phase 8: FastAPI API Layer

- [x] 8.1  Write `tests/api/test_endpoints.py` (13 tests TDD first)
- [x] 8.2  Implement `src/api/dependencies.py` -- DI with lru_cache
- [x] 8.3  Implement `src/api/routes/library.py`, `definitions.py`, `generate.py`
- [x] 8.4  Implement `src/main.py` -- FastAPI app factory with CORS
- [x] 8.5  **GATE**: `uv run ruff check .` -- passed
- [x] 8.6  **GATE**: `uv run mypy src/` -- no errors (39 files)
- [x] 8.7  **GATE**: `uv run pytest` -- 318 tests pass, 96% coverage

---

## Phase 9: Frontend Scaffold + Component Tests

- [x] 9.1  Implement `src/lib/types.ts` -- TypeScript types + type guards for all backend models
- [x] 9.2  Implement `src/lib/api-client.ts` -- typed fetch wrapper with ApiError class
- [x] 9.3  Write `tests/lib/types.test.ts` (4 tests) -- type guard correctness
- [x] 9.4  Write `tests/lib/api-client.test.ts` (4 tests) -- MSW-mocked API calls + error handling
- [x] 9.5  Implement plan components: `BlockRow.tsx`, `SessionCard.tsx`, `WeekView.tsx`, `PlanViewer.tsx`
- [x] 9.6  Write `tests/components/plan/BlockRow.test.tsx` (4 tests) -- all prescription types
- [x] 9.7  Write `tests/components/plan/SessionCard.test.tsx` (4 tests) -- day, tags, blocks, metrics
- [x] 9.8  Write `tests/components/plan/PlanViewer.test.tsx` (5 tests) -- title, weeks, warnings
- [x] 9.9  **GATE**: `npm test` -- 27 tests pass
- [x] 9.10 **GATE**: `tsc --noEmit` -- no errors

---

## Phase 10: E2E Integration

- [x] 10.1 Write `tests/e2e/health.spec.ts` -- backend health + frontend homepage
- [x] 10.2 Write `tests/e2e/generate-plan.spec.ts` -- strength plan, conditioning plan, 404, 422
- [x] 10.3 Verify `docker-compose.yml` mounts data/definitions/schemas
- [x] 10.4 Docker services verified running (backend :8000, frontend :3000)
- [ ] 10.5 **GATE**: Run Playwright E2E tests against Docker environment

---

## Phase 11: UI/UX Overhaul (Dark/Light Theme)

- [x] 11.1 Create `ThemeProvider` + `useTheme` hook (`src/lib/theme.tsx`) -- localStorage persistence, dark default
- [x] 11.2 Integrate `ThemeProvider` into `Providers` wrapper (`src/app/providers.tsx`)
- [x] 11.3 Configure Tailwind v4 dark mode: `@custom-variant dark` in `globals.css`
- [x] 11.4 Fix critical CSS build issue: `postcss.config.ts` → `postcss.config.mjs` (PostCSS plugin wasn't generating utility classes with `.ts` format)
- [x] 11.5 Add `@source "../../src"` directive for Tailwind v4 source detection (required when no git repo present)
- [x] 11.6 Add `.gitignore` to `apps/frontend/` for Tailwind source scanning
- [x] 11.7 Update `layout.tsx` -- dark default (`className="dark"`), `suppressHydrationWarning`
- [x] 11.8 Rewrite `Navbar` -- sticky glassmorphic, indigo brand badge, sun/moon theme toggle
- [x] 11.9 Rewrite Home page -- status pill, two-tone hero, icon-accented feature cards
- [x] 11.10 Rewrite Generate page -- segmented toggle, themed inputs, equipment pills, loading spinner
- [x] 11.11 Rewrite Definitions page -- themed cards, version badges, accent links
- [x] 11.12 Rewrite plan components -- color-coded type badges, fatigue progress bars, themed cards
- [x] 11.13 Update PlanViewer test for formatted program_id display
- [x] 11.14 **GATE**: `npm test` -- 27 tests pass
- [x] 11.15 **GATE**: `tsc --noEmit` -- no errors
- [x] 11.16 **GATE**: Docker rebuild + both services running

---

## Open Issues / Known Problems

> Carry these forward to the next session.

1. **E2E tests not yet executed** -- Playwright tests are written (`tests/e2e/health.spec.ts`, `tests/e2e/generate-plan.spec.ts`) but have not been run against the Docker environment. Need `npx playwright install` + `npx playwright test` with services up.

2. **UI visual verification needed** -- The Tailwind CSS build issue is fixed (utilities now compile), Docker is rebuilt and running. **The dark/light themed UI needs visual verification in a browser** to confirm layout, cards, buttons, theme toggle, and plan display all render correctly. The CSS fix was confirmed programmatically (28KB CSS with utility classes present) but not visually confirmed by user.

3. **`.cursor/rules` mentions shadcn/ui** -- The project doesn't use shadcn/ui components; styling is done with raw Tailwind utility classes. The rules file should be updated if shadcn/ui is not planned.

4. **Summary table in TODO.md was stale** -- Phases 1-6 were marked incomplete in the summary table despite being fully done. Fixed in this update.

5. **`postcss.config.ts` pitfall** -- Documented for reference: Next.js 15 + Tailwind v4 (`@tailwindcss/postcss`) does NOT work with a TypeScript PostCSS config. The plugin loads but fails to JIT-compile utility classes. Must use `.mjs` format. The `@source` directive is also required when building in Docker (no git repo).

---

## Next Session Backlog

> Suggested priorities for the next session, in order.

### P0 -- Must Do
- [ ] Visually verify the UI in the browser (dark mode, light mode, all pages)
- [ ] Fix any remaining visual/layout issues found during verification
- [ ] Run Playwright E2E tests (Phase 10.5)

### P1 -- Should Do
- [ ] Add form validation with React Hook Form + Zod (generate page)
- [ ] Add Zustand store for client-side state (selected program, last athlete config)
- [ ] Add loading skeletons for definitions page (better UX than spinner)
- [ ] Add responsive mobile layout for navbar (hamburger menu)

### P2 -- Nice to Have
- [ ] Add recharts-based visualizations (fatigue curves, volume distribution)
- [ ] Add plan export (JSON download, print-friendly view)
- [ ] Add plan comparison (side-by-side two generated plans)
- [ ] Add unit/integration tests for ThemeProvider
- [ ] Add snapshot tests for plan components (syrupy)

---

## Summary

| Phase | Description                     | Steps | Status      |
|-------|---------------------------------|-------|-------------|
| 0     | Environment & Tooling           | 21    | COMPLETED   |
| 1     | Domain Models + Data Loading    | 27    | COMPLETED   |
| 2     | Expression Engine               | 15    | COMPLETED   |
| 3     | Exercise Selector               | 6     | COMPLETED   |
| 4     | Prescription + Load Resolution  | 7     | COMPLETED   |
| 5     | Metrics Engine                  | 6     | COMPLETED   |
| 6     | Validation + Repair             | 7     | COMPLETED   |
| 7     | Pipeline + Snapshots            | 8     | COMPLETED   |
| 8     | API Layer                       | 7     | COMPLETED   |
| 9     | Frontend + Component Tests      | 10    | COMPLETED   |
| 10    | E2E Integration                 | 5     | 4/5 DONE    |
| 11    | UI/UX Overhaul (Dark/Light)     | 16    | COMPLETED   |
| **Total** |                             | **135** | **~98%**  |

### Test Counts
- **Backend**: 318 tests, 96% coverage (pytest)
- **Frontend**: 27 tests, all pass (vitest)
- **E2E**: Written, not yet executed (playwright)
