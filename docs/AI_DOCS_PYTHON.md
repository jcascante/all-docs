---
title: Python Backend - Best Practices & AI Guidelines
description: Comprehensive guide for Python backend development with FastAPI, type hints, testing patterns, and quality standards
author: Copilot
lastUpdated: 2026-03-02
version: 1.0
tags: [python, fastapi, backend, tdd, type-hints, testing]
---

# Python Backend - Best Practices & AI Guidelines

> **For AI Models (Copilot, Claude, etc.)**: This document describes patterns to follow when generating or modifying Python code.

---

## Project Structure

```
apps/backend/
├── src/
│   ├── app/              # FastAPI app setup
│   ├── api/              # Route handlers & endpoints
│   ├── models/           # Pydantic models (domain objects)
│   ├── services/         # Business logic & orchestration
│   ├── core/             # Configuration, constants, utilities
│   ├── schemas/          # JSON Schema definitions
│   └── loaders/          # Data loading & transformation
├── tests/
│   ├── unit/             # Unit tests (isolated, fast)
│   ├── integration/      # Integration tests (services, API)
│   ├── api/              # API endpoint tests
│   ├── property/         # Property-based tests (hypothesis)
│   └── snapshot/         # Snapshot tests (syrupy)
└── pyproject.toml        # Dependencies & config
```

---

## Language & Style

- **Python Version**: 3.12+
- **Type Hints**: **Mandatory** - Use full type hints on all functions
- **Line Length**: 100 characters (enforced by Ruff)
- **Formatter**: Ruff (auto-format with `ruff format`)
- **Linter**: Ruff (check with `ruff check --fix`)
- **Type Checker**: mypy (strict mode)

### Type Hints Requirements

```python
# ✅ GOOD - Full type hints
def generate_plan(request: PlanRequest, config: Config) -> GeneratedPlan:
    """Generate a training plan from a request."""
    pass

# ❌ BAD - Missing return type
def generate_plan(request: PlanRequest, config: Config):
    pass

# ✅ GOOD - Complex types
from typing import Optional, Sequence
def process_items(
    items: Sequence[Item],
    filter_fn: Optional[Callable[[Item], bool]] = None,
) -> list[Item]:
    pass
```

---

## Pydantic Model Guidelines

All data structures are Pydantic v2 models. Generate models from JSON Schema definitions when possible.

```python
from pydantic import BaseModel, Field

class Exercise(BaseModel):
    """An exercise within a program."""
    name: str = Field(..., description="Exercise name")
    reps: int = Field(gt=0, description="Number of repetitions")
    sets: int = Field(gt=0, description="Number of sets")
    rest_seconds: int = Field(ge=0, default=60)
    
    model_config = ConfigDict(extra="forbid", json_schema_extra={...})
```

### Model Patterns

- Use `Field()` with descriptions for all fields
- Use validators sparingly; prefer Pydantic's built-in constraints
- Set `extra="forbid"` to catch unexpected fields
- Include docstrings explaining the model's purpose
- Use literal types for enums: `Literal["strength", "conditioning"]`

---

## Async & FastAPI Patterns

Backend uses **async/await** throughout. All I/O operations must be async.

### Endpoint Pattern

```python
from fastapi import APIRouter, HTTPException
from typing import Annotated

router = APIRouter(prefix="/v1/plans", tags=["plans"])

@router.post("", response_model=GeneratedPlan, status_code=201)
async def create_plan(request: PlanRequest) -> GeneratedPlan:
    """Create a new training plan."""
    try:
        plan = await service.generate_plan(request)
        return plan
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### Service Pattern

Services encapsulate business logic. They should:
- Accept dependencies via constructor
- Be testable (dependencies injected)
- Use async methods
- Raise domain-specific exceptions

```python
class PlanGenerator:
    def __init__(self, loader: ExerciseLoader, validator: SchemaValidator):
        self.loader = loader
        self.validator = validator
    
    async def generate_plan(self, request: PlanRequest) -> GeneratedPlan:
        """Business logic here."""
        exercises = await self.loader.load_exercises(request.program_id)
        self.validator.validate(request)
        # ... generate plan
        return GeneratedPlan(...)
```

---

## Error Handling

Use **domain-specific exceptions** for application errors, not generic ones.

```python
# Define in app/exceptions.py
class SchemaValidationError(Exception):
    """Raised when schema validation fails."""
    pass

class ExerciseNotFoundError(Exception):
    """Raised when an exercise is not found."""
    pass

# In endpoints, convert to HTTP responses
try:
    await service.do_work()
except SchemaValidationError as e:
    raise HTTPException(status_code=400, detail=str(e))
except ExerciseNotFoundError:
    raise HTTPException(status_code=404, detail="Exercise not found")
```

---

## Testing (TDD-First)

### Test File Naming

- Unit tests: `test_<module>.py` (mirrors `src/` structure)
- Integration tests: `test_<feature>.py`
- Place in `tests/unit/`, `tests/integration/`, etc.

### Test Structure

**Write tests BEFORE implementation** (Test-Driven Development).

```python
import pytest
from app.services import PlanGenerator
from app.models import PlanRequest, GeneratedPlan

class TestPlanGenerator:
    """Tests for PlanGenerator service."""
    
    @pytest.fixture
    def generator(self) -> PlanGenerator:
        """Fixture: Create a generator with mocked dependencies."""
        loader = MockExerciseLoader()
        validator = MockValidator()
        return PlanGenerator(loader, validator)
    
    @pytest.mark.asyncio
    async def test_generate_plan_returns_valid_structure(
        self, generator: PlanGenerator
    ) -> None:
        """Given valid input, should return a GeneratedPlan."""
        request = PlanRequest(program_id="test", athlete_level="intermediate")
        result = await generator.generate_plan(request)
        assert isinstance(result, GeneratedPlan)
        assert len(result.weeks) > 0
    
    @pytest.mark.asyncio
    async def test_generate_plan_raises_on_invalid_input(
        self, generator: PlanGenerator
    ) -> None:
        """Given invalid input, should raise SchemaValidationError."""
        request = PlanRequest(program_id="", athlete_level="invalid")
        with pytest.raises(SchemaValidationError):
            await generator.generate_plan(request)
```

### Test Types & Tools

| Type | Tool | Purpose |
|------|------|---------|
| Unit | pytest | Test functions/classes in isolation |
| Integration | pytest | Test services + dependencies |
| Property-Based | hypothesis | Generate test cases to find edge cases |
| Snapshot | syrupy | Lock complex output (e.g., generated JSON) |
| API | pytest + httpx | Test endpoints end-to-end |

### Coverage Expectations

- **Minimum**: 80% line coverage (enforced by CI)
- **Target**: 85-90% for business-critical code
- Critical paths (plan generation, validation) must be >90%

Run coverage:
```bash
pytest --cov=src --cov-report=html tests/
```

---

## Common Patterns

### Dependency Injection

```python
# ✅ Good: Dependencies injected
class PlanService:
    def __init__(self, db: Database, cache: Cache):
        self.db = db
        self.cache = cache

# In FastAPI, use Depends()
@router.get("/plans/{id}")
async def get_plan(
    plan_id: str,
    service: Annotated[PlanService, Depends(get_plan_service)]
) -> PlanDTO:
    return await service.get_plan(plan_id)
```

### Validation

```python
# ✅ Use Pydantic validators
class PlanRequest(BaseModel):
    athlete_level: Literal["beginner", "intermediate", "advanced"]
    duration_weeks: int = Field(gt=0, le=52)
    
    @field_validator("duration_weeks")
    @classmethod
    def validate_duration(cls, v: int) -> int:
        if v % 4 != 0:
            raise ValueError("Duration must be in 4-week blocks")
        return v
```

### Async Context Managers

```python
# ✅ Use async context managers for resource cleanup
class DatabaseConnection:
    async def __aenter__(self):
        await self.connect()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()

# Usage
async with DatabaseConnection() as db:
    result = await db.query(...)
```

---

## Imports & Organization

```python
# Order:
# 1. Standard library
import asyncio
import json
from typing import Optional

# 2. Third-party
from pydantic import BaseModel, Field
import httpx

# 3. Local
from app.models import ExerciseModel
from app.services import ExerciseService
```

Ruff will auto-organize imports with `ruff check --fix`.

---

## Environment & Configuration

Configuration is managed via Pydantic Settings (environment variables + `.env`).

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings from environment."""
    api_title: str = "Training Program Generator"
    debug: bool = False
    database_url: str
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        extra = "forbid"

settings = Settings()
```

---

## Logging

Use Python's built-in `logging` module (not print statements).

```python
import logging

logger = logging.getLogger(__name__)

async def generate_plan(request: PlanRequest) -> GeneratedPlan:
    logger.info(f"Generating plan for athlete: {request.athlete_id}")
    try:
        plan = await service.generate(request)
        logger.debug(f"Plan generated with {len(plan.weeks)} weeks")
        return plan
    except Exception as e:
        logger.error(f"Plan generation failed: {e}", exc_info=True)
        raise
```

---

## Performance Considerations

- Use async/await for all I/O-bound operations
- Cache frequently accessed data (e.g., exercise definitions)
- Use batch operations for database queries
- Profile with `cProfile` if performance issues arise
- Avoid N+1 queries in services

---

## Checklist Before Committing

- [ ] All functions have complete type hints
- [ ] Tests written BEFORE code (TDD)
- [ ] Minimum 80% test coverage
- [ ] `ruff check --fix` passes
- [ ] `ruff format` applied
- [ ] `mypy --strict` passes
- [ ] `pytest` all tests pass
- [ ] No hardcoded secrets or credentials
- [ ] Docstrings on public functions/classes
- [ ] Error handling is explicit (no bare except)
