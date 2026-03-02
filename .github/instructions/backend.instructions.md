---
applyTo: "apps/backend/**/*"
description: Path-specific instructions for FastAPI backend development
---

# Backend Instructions (apps/backend/)

> Path-specific instructions for Python FastAPI backend development

---

## Quick Context

- **Language**: Python 3.12+
- **Framework**: FastAPI with async/await
- **Testing**: pytest (TDD-first, 80%+ coverage required)
- **Type Checking**: mypy --strict (mandatory)
- **Linting**: Ruff
- **Structure**: `src/` contains app code, `tests/` contains tests

---

## Before You Start

1. **Read First**: `/docs/AI_DOCS_PYTHON.md` for detailed backend patterns
2. **Type Hints**: Every function needs complete type hints - no exceptions
3. **Tests First**: Write tests BEFORE implementing code (TDD)
4. **Async/Await**: All I/O operations must be async - no blocking calls

---

## Key Patterns

### Type Hints (Mandatory)
```python
from typing import Optional, Sequence

# ✅ GOOD - Full type hints
async def generate_plan(
    request: PlanRequest,
    service: PlanGenerator,
) -> GeneratedPlan:
    return await service.generate(request)

# ❌ BAD - Missing type hints
async def generate_plan(request, service):
    pass
```

### Test-First Development
```python
# Step 1: Write test first (RED)
def test_selector_returns_highest_priority():
    """Given exercises, should return highest priority."""
    exercises = [Exercise(name="A", priority=5), Exercise(name="B", priority=10)]
    result = ExerciseSelector().select_highest(exercises)
    assert result.name == "B"

# Step 2: Implement code (GREEN)
class ExerciseSelector:
    def select_highest(self, exercises: list[Exercise]) -> Exercise:
        return max(exercises, key=lambda ex: ex.priority)
```

### Dependency Injection
```python
# ✅ GOOD - Dependencies injected
class PlanGenerator:
    def __init__(self, loader: ExerciseLoader, validator: SchemaValidator):
        self.loader = loader
        self.validator = validator
    
    async def generate(self, request: PlanRequest) -> GeneratedPlan:
        exercises = await self.loader.load(request.program_id)
        self.validator.validate(request)
        # ... implementation
```

### FastAPI Endpoint Pattern
```python
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/v1/plans")

@router.post("", response_model=GeneratedPlan, status_code=201)
async def create_plan(request: PlanRequest) -> GeneratedPlan:
    """Create a new training plan."""
    try:
        plan = await service.generate_plan(request)
        return plan
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### Custom Exceptions (Not Bare Exception)
```python
# ✅ GOOD - Domain-specific exceptions
class ValidationError(Exception):
    """Raised when validation fails."""
    pass

try:
    await service.validate(request)
except ValidationError as e:
    raise HTTPException(status_code=400, detail=str(e))

# ❌ BAD - Bare or generic exception
except Exception:  # Too broad!
    pass
```

### Pydantic Models with Field Descriptions
```python
from pydantic import BaseModel, Field

class Exercise(BaseModel):
    """An exercise within a program."""
    name: str = Field(..., description="Exercise name")
    reps: int = Field(gt=0, description="Reps (must be > 0)")
    sets: int = Field(gt=0, description="Sets (must be > 0)")
    
    model_config = ConfigDict(extra="forbid")
```

---

## Code Quality Checklist

Before committing, verify:

- [ ] **Tests written FIRST** (TDD - red, green, refactor)
- [ ] **All tests pass**: `pytest tests/`
- [ ] **Coverage ≥80%**: `pytest --cov=src --cov-report=term`
- [ ] **Type hints complete**: No missing return types or parameter types
- [ ] **Linting passes**: `ruff check --fix src`
- [ ] **Formatting correct**: `ruff format src`
- [ ] **Type checking**: `mypy --strict src`
- [ ] **No hardcoded secrets** (use environment variables)
- [ ] **Error handling explicit** (custom exceptions, not bare except)
- [ ] **Docstrings on public functions**

---

## Testing Requirements

### Test File Organization
```
tests/
├── unit/            # Unit tests (isolated, fast)
├── integration/     # Integration tests (services + deps)
├── api/             # Endpoint tests
└── conftest.py      # Shared fixtures
```

### Test Naming & Structure
```python
# Test function: test_<specific_behavior>
def test_selector_returns_highest_priority():
    """Given X, should do Y."""
    # Setup
    exercises = [Exercise(name="A", priority=5), ...]
    selector = ExerciseSelector()
    
    # Act
    result = selector.select_highest(exercises)
    
    # Assert
    assert result.name == "B"
    assert result.priority == 10

# Test class: Test<ClassName>
class TestPlanGenerator:
    """Tests for PlanGenerator service."""
    
    @pytest.fixture
    def generator(self) -> PlanGenerator:
        return PlanGenerator(MockLoader(), MockValidator())
    
    @pytest.mark.asyncio
    async def test_generate_plan_returns_valid_structure(self, generator):
        # Test implementation
        pass
```

### Coverage Targets
- **Minimum**: 80% line coverage (enforced)
- **Target**: 90%+ for business-critical code (plan generation, validation)
- **Run**: `pytest --cov=src --cov-report=html`

---

## Command Reference

```bash
# Development setup
pip install -e ".[dev]"

# Run tests
pytest                          # All tests
pytest tests/unit/             # Unit only
pytest -k test_selector        # Matching pattern
pytest --cov=src               # With coverage

# Linting & formatting
ruff check --fix src            # Check + fix
ruff format src                 # Format code

# Type checking
mypy --strict src

# Server
uvicorn app:app --reload       # Dev server
```

---

## File Structure Conventions

- **Modules**: `lowercase_with_underscores` (e.g., `plan_generator.py`)
- **Classes**: `PascalCase` (e.g., `PlanGenerator`)
- **Functions**: `lowercase_with_underscores` (e.g., `generate_plan`)
- **Constants**: `UPPERCASE_WITH_UNDERSCORES` (e.g., `MAX_WEEKS`)
- **Tests**: `test_<module>.py` (e.g., `test_selector.py`)
- **Imports**: From `app.*` (e.g., `from app.services import PlanGenerator`)

---

## What NOT to Do

❌ Skip tests or write tests after code
❌ Use bare `except` or generic `Exception`
❌ Missing type hints on functions
❌ Create dependencies inside classes (use injection)
❌ Mix async and sync code
❌ Use `print()` instead of logging
❌ Hardcode configuration values
❌ Ignore linting or type checking errors

---

## Documentation

- **Detailed Guide**: `docs/AI_DOCS_PYTHON.md`
- **Testing Patterns**: `docs/AI_DOCS_TESTING.md`
- **File Structure**: `docs/AI_DOCS_WORKFLOW.md`
- **Architecture**: `docs/design_and_architecture.md`

---

**Last Updated**: 2026-03-02
