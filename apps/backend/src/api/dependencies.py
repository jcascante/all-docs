"""Dependency injection for FastAPI routes."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from src.config import settings
from src.models.exercise_library import ExerciseLibrary
from src.models.program_definition import ProgramDefinition


@lru_cache
def get_exercise_library() -> ExerciseLibrary:
    lib_path = Path(settings.data_dir) / "exercise_library_v1.json"
    raw = json.loads(lib_path.read_text())
    return ExerciseLibrary.model_validate(raw)


@lru_cache
def get_program_definitions() -> dict[str, ProgramDefinition]:
    defs_dir = Path(settings.definitions_dir)
    definitions: dict[str, ProgramDefinition] = {}
    for path in sorted(defs_dir.glob("*.json")):
        raw = json.loads(path.read_text())
        defn = ProgramDefinition.model_validate(raw)
        definitions[defn.program_id] = defn
    return definitions


def get_definition_by_id(program_id: str) -> ProgramDefinition | None:
    defs = get_program_definitions()
    return defs.get(program_id)
