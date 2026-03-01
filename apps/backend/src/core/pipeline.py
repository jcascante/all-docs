"""Pipeline orchestrator: wires all core modules into the generation flow.

Stages:
  P0. Load data (exercise library + program definition)
  P1. Build generation context from PlanRequest + ProgramDefinition
  P2. For each week/session/block: select exercises
  P3. Resolve prescriptions (loads, reps, sets)
  P4. Compute metrics (fatigue, volume, tonnage)
  P5. Validate constraints
  P6. Repair if needed
  P7. Assemble final GeneratedPlan
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any

from src.core.expression.evaluator import ExpressionEvaluator
from src.core.metrics.metrics_engine import MetricsEngine
from src.core.prescription.prescription_resolver import PrescriptionResolver
from src.core.selector.exercise_selector import (
    ExerciseSelector as ExSelector,
)

if TYPE_CHECKING:
    from src.models.exercise_library import ExerciseLibrary
    from src.models.plan_request import PlanRequest
    from src.models.program_definition import ProgramDefinition


class Pipeline:
    def __init__(
        self,
        library: ExerciseLibrary,
        definition: ProgramDefinition,
    ) -> None:
        self._library = library
        self._definition = definition
        self._evaluator = ExpressionEvaluator()
        self._selector = ExSelector(library)
        self._prescription = PrescriptionResolver()
        self._metrics = MetricsEngine()

    def generate(self, request: PlanRequest) -> dict[str, Any]:
        ctx = self._build_context(request)
        weeks = []

        for week_num in range(1, request.weeks + 1):
            ctx["week"] = week_num
            sessions = self._generate_week(ctx, request)
            weeks.append({"week": week_num, "sessions": sessions})

        return {
            "program_id": request.program_id,
            "program_version": request.program_version,
            "generated_at": datetime.now(UTC).isoformat(),
            "inputs_echo": request.model_dump(mode="json"),
            "weeks": weeks,
            "warnings": [],
            "repairs": [],
        }

    def _build_context(self, request: PlanRequest) -> dict[str, Any]:
        ctx: dict[str, Any] = {
            "athlete": request.athlete.model_dump(mode="json"),
            "week": 1,
        }
        if request.rules:
            ctx["rules"] = request.rules
        if request.conditioning:
            ctx["conditioning"] = request.conditioning
        return ctx

    def _generate_week(
        self, ctx: dict[str, Any], request: PlanRequest
    ) -> list[dict[str, Any]]:
        sessions = []
        used_ids_strength: set[str] = set()
        used_swap_groups_strength: set[str] = set()

        for session_def in self._definition.template.sessions:
            if session_def.day_index > request.days_per_week:
                continue

            if (
                session_def.optional
                and session_def.day_index > request.days_per_week
            ):
                    continue

            blocks = []
            is_conditioning = any(
                "conditioning" in b.type for b in session_def.blocks
            )

            for block_def in session_def.blocks:
                exercises = self._selector.select(
                    count=block_def.exercise_selector.count,
                    include_tags=block_def.exercise_selector.include_tags,
                    exclude_tags=(
                        block_def.exercise_selector.exclude_tags or []
                    ),
                    prefer_tags=(
                        block_def.exercise_selector.prefer_tags or []
                    ),
                    athlete_equipment=ctx["athlete"].get("equipment", []),
                    restrictions=ctx["athlete"].get("restrictions", []),
                    already_used_ids=(
                        set() if is_conditioning else used_ids_strength
                    ),
                    already_used_swap_groups=(
                        set()
                        if is_conditioning
                        else used_swap_groups_strength
                    ),
                    seed=request.seed,
                )

                if not is_conditioning:
                    for ex in exercises:
                        used_ids_strength.add(ex.id)
                        if ex.swap_group:
                            used_swap_groups_strength.add(ex.swap_group)

                for ex in exercises:
                    rx_def = self._definition.prescriptions[
                        block_def.prescription_ref
                    ]
                    rx_dict = rx_def.model_dump(mode="json")

                    e1rm_key = self._infer_e1rm_key(
                        block_def.type, ex, ctx
                    )

                    prescription = self._prescription.resolve(
                        prescription_def=rx_dict,
                        ctx=ctx,
                        e1rm_key=e1rm_key,
                    )

                    block_id = (
                        f"w{ctx['week']}d{session_def.day_index}"
                        f"_{block_def.id}"
                    )

                    blocks.append({
                        "block_id": block_id,
                        "type": block_def.type,
                        "exercise": {
                            "id": ex.id,
                            "name": ex.name,
                        },
                        "prescription": prescription,
                    })

            session_metrics = self._compute_session_metrics(blocks, ctx)

            sessions.append({
                "day": session_def.day_index,
                "tags": list(session_def.tags),
                "blocks": blocks,
                "metrics": session_metrics,
            })

        return sessions

    def _infer_e1rm_key(
        self,
        block_type: str,
        exercise: Any,
        ctx: dict[str, Any],
    ) -> str | None:
        if block_type not in ("main_lift", "conditional_block"):
            return None
        e1rm = ctx.get("athlete", {}).get("e1rm", {})
        if not e1rm:
            return None

        for pattern in exercise.patterns:
            if pattern in e1rm:
                return str(pattern)

        ex_id = exercise.id.lower()
        for key in e1rm:
            if key in ex_id:
                return str(key)

        for tag in exercise.tags:
            for key in e1rm:
                if key in tag:
                    return str(key)

        return next(iter(e1rm.keys())) if e1rm else None

    def _compute_session_metrics(
        self,
        blocks: list[dict[str, Any]],
        ctx: dict[str, Any],
    ) -> dict[str, Any]:
        fatigue_blocks = []
        volume_blocks = []
        tonnage_blocks = []

        for block in blocks:
            ex_data = block.get("exercise", {})
            rx = block.get("prescription", {})

            ex_from_lib = self._find_exercise(ex_data.get("id", ""))
            if ex_from_lib is None:
                continue

            if "top_set" in rx:
                ts = rx["top_set"]
                total_sets = ts.get("sets", 1)
                rpe = ts.get("target_rpe", 7)
                fatigue_blocks.append({
                    "exercise": ex_from_lib,
                    "sets": total_sets,
                    "rpe": rpe,
                })
                tonnage_blocks.append({
                    "exercise_id": ex_data["id"],
                    "sets": total_sets,
                    "reps": ts.get("reps", 1),
                    "load_kg": ts.get("load_kg"),
                })
                for bo in rx.get("backoff", []):
                    fatigue_blocks.append({
                        "exercise": ex_from_lib,
                        "sets": bo.get("sets", 1),
                        "rpe": max(rpe - 1, 6),
                    })
                    tonnage_blocks.append({
                        "exercise_id": ex_data["id"],
                        "sets": bo.get("sets", 1),
                        "reps": bo.get("reps", 1),
                        "load_kg": bo.get("load_kg"),
                    })
            elif "sets" in rx:
                sets = rx["sets"]
                rpe = 10 - rx.get("target_rir", 2)
                fatigue_blocks.append({
                    "exercise": ex_from_lib,
                    "sets": sets,
                    "rpe": rpe,
                })
            elif "duration_minutes" in rx:
                intensity_level = 2
                target = rx.get("intensity", {}).get("target", "")
                if "thr" in target:
                    intensity_level = 4
                elif "vo2" in target:
                    intensity_level = 5
                elif "z(1)" in target:
                    intensity_level = 1
                score = self._metrics.compute_conditioning_fatigue(
                    duration_minutes=rx["duration_minutes"],
                    intensity_level=intensity_level,
                )
                return {"fatigue_score": round(score, 2)}

            volume_blocks.append({
                "exercise": ex_from_lib,
                "sets": fatigue_blocks[-1]["sets"]
                if fatigue_blocks
                else 1,
            })

        fatigue = self._metrics.compute_session_fatigue(fatigue_blocks)
        volume = self._metrics.compute_volume_summary(volume_blocks)
        tonnage = self._metrics.compute_tonnage(tonnage_blocks)

        result: dict[str, Any] = {"fatigue_score": round(fatigue, 2)}
        if volume:
            result["volume_summary"] = {"hard_sets_weighted": volume}
        if tonnage:
            result["volume_summary"] = result.get("volume_summary", {})
            result["volume_summary"]["tonnage"] = tonnage

        return result

    def _find_exercise(self, exercise_id: str) -> Any | None:
        for ex in self._library.exercises:
            if ex.id == exercise_id:
                return ex
        return None
