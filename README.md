# Dynamic Training Program Generator

A "Programs-as-Code" system where coaches define ProgramDefinitions and a deterministic engine generates multi-week training plans (strength + conditioning) from PlanRequests.

## Documentation

- **Design & Architecture**: [`docs/design_and_architecture.md`](docs/design_and_architecture.md)
- **Progress Tracker**: [`docs/TODO.md`](docs/TODO.md)
- **Stakeholder Proposal**: [`docs/stakeholder_proposal.md`](docs/stakeholder_proposal.md)
- **C4 Architecture Diagrams**: [`docs/architecture_c4.md`](docs/architecture_c4.md)
- **Specification**: [`docs/dynamic-training-program-generator.md`](docs/dynamic-training-program-generator.md)

## Prerequisites

- Python 3.12+
- Node.js 20+ LTS
- pnpm 9+ (`corepack enable && corepack prepare pnpm@latest`)
- [uv](https://docs.astral.sh/uv/) (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- Docker + Docker Compose (optional, for containerized deployment)

## Setup

### Backend

```bash
cd apps/backend
uv sync --all-extras
```

### Frontend

```bash
cd apps/frontend
pnpm install
```

## Development

### Backend

```bash
cd apps/backend
make run          # Start dev server (port 8000)
make test         # Run all tests
make lint         # Lint with Ruff
make typecheck    # Type check with mypy
make format       # Auto-format with Ruff
```

### Frontend

```bash
cd apps/frontend
pnpm dev          # Start dev server (port 3000)
pnpm test         # Run Vitest
pnpm lint         # Lint with ESLint
pnpm typecheck    # Type check with tsc
pnpm test:e2e     # Run Playwright E2E tests
```

### Docker

```bash
docker-compose up --build
```

Backend available at `http://localhost:8000`, frontend at `http://localhost:3000`.

## Project Structure

```
apps/backend/     Python FastAPI backend (deterministic engine + API)
apps/frontend/    Next.js frontend (plan viewer + analytics + forms)
schemas/          JSON Schema files (source of truth)
definitions/      ProgramDefinition templates
data/             Exercise library
examples/         Example PlanRequests + GeneratedPlans
docs/             Documentation
```

## Tech Stack

- **Backend**: Python 3.12, FastAPI, Pydantic v2, uv, Ruff, mypy, pytest
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Recharts, TanStack Query, Vitest, Playwright
- **Infrastructure**: Docker, Turborepo, GitHub Actions
