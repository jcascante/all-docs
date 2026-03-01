# Dynamic Training Program Generator (Programs-as-Code)

This repository folder contains a **Markdown specification** plus complete JSON definitions and example outputs.

## Contents

- `docs/dynamic-training-program-generator.md` (this doc)
- `data/exercise_library_v1.json` (exercise library v1)
- `definitions/strength_ul_4w_v1.json` (ProgramDefinition: Strength/Hypertrophy UL)
- `definitions/conditioning_4w_v1.json` (ProgramDefinition: Conditioning)
- `examples/*` (PlanRequests + GeneratedPlans)
- `openapi/openapi.yaml` (starter OpenAPI)


---

## Related Documents

- Architecture (C4 / Mermaid): `docs/architecture_c4.md`
- Stakeholder proposal: `docs/stakeholder_proposal.md`
- JSON Schemas (Draft 2020-12): `schemas/`
  - `schemas/program_definition.schema.json`
  - `schemas/plan_request.schema.json`
  - `schemas/generated_plan.schema.json`
  - `schemas/exercise_library.schema.json`


## Closed Taxonomies

### Patterns
```json
[
  "squat",
  "hinge",
  "lunge_unilateral",
  "horizontal_push",
  "horizontal_pull",
  "vertical_push",
  "vertical_pull",
  "carry",
  "core_anti_extension",
  "core_anti_rotation",
  "core_flexion",
  "rotation",
  "conditioning_steady",
  "conditioning_intervals"
]
```

### Muscles
```json
[
  "quads",
  "hamstrings",
  "glutes",
  "adductors",
  "calves",
  "erectors",
  "lats",
  "upper_back",
  "chest",
  "delts_anterior",
  "delts_lateral",
  "delts_posterior",
  "biceps",
  "triceps",
  "forearms_grip",
  "abs",
  "obliques"
]
```

---

## Conditioning Heart-Rate Zones (Default)

**Karvonen (HRR)**
- HRR = HRmax − HRrest
- HR_target = HRrest + (HRR × intensity%)

The ProgramDefinition supports choosing:
- `KARVONEN_HRR` (default)
- `PERCENT_HRMAX`

---

## Repository Layout Recommendation

```text
/docs
  dynamic-training-program-generator.md

/data
  exercise_library_v1.json

/definitions
  strength_ul_4w_v1.json
  conditioning_4w_v1.json

/examples
  strength_plan_request.json
  strength_generated_plan.json
  conditioning_plan_request.json
  conditioning_generated_plan.json

/openapi
  openapi.yaml
```

---

## ProgramDefinition: Strength/Hypertrophy (Option 1)

File: `definitions/strength_ul_4w_v1.json`

- 4 weeks, 4 days (UL split)
- Main lifts: Top set + backoffs (RPE/%/Hybrid supported)
- Secondary + accessories: reps-range + RIR
- Validations: weekly volume + session/week fatigue
- Repair strategy: reduce accessories → swap variants → reduce backoffs → drop optional blocks

---

## ProgramDefinition: Conditioning (Option 1)

File: `definitions/conditioning_4w_v1.json`

- 4 weeks, 3–5 days template (examples use 4 days)
- Z2 steady + Threshold intervals + VO2 optional + Recovery optional
- Supports HR_ZONES (HRR/%HRmax), PACE (1km and 5km), POWER (%FTP), RPE
- Validations: min Z2 minutes/week and max intense minutes/week

---

## Examples

### Strength PlanRequest
File: `examples/strength_plan_request.json`

### Strength GeneratedPlan (Complete 4 weeks)
File: `examples/strength_generated_plan.json`

### Conditioning PlanRequest
File: `examples/conditioning_plan_request.json`

### Conditioning GeneratedPlan (Complete 4 weeks)
File: `examples/conditioning_generated_plan.json`

---

## Visualization Guidelines (App UX Reference)

### 1) Plan Overview
- Tabs: Week 1..Week 4
- Cards per Day (tags + headline: “Lower Strength”, “Threshold Intervals”, etc.)
- Inline warnings

### 2) Session Detail
- Blocks in order
- For strength blocks: exercise + sets/reps + intensity + load where applicable
- For accessories: show `load_note` if baseline is not supplied
- Metrics footer: fatigue + volume summary

### 3) Analytics
- Strength: weekly volume (by muscle/pattern) + weekly fatigue
- Conditioning: weekly Z2 minutes + intense minutes + intensity distribution

---

## AI Integration (Optional)

AI is **not** the core engine. The deterministic engine remains authoritative.

Recommended AI tools:
- `suggest_program_definition()` → outputs ProgramDefinition JSON (must validate)
- `suggest_accessories()` → proposes exercise candidates; engine validates and selects
- `lint_program_or_plan()` → produces warnings + recommendations
- `suggest_repairs()` → proposes structural fixes when repair fails

**Guardrails**
- Schema-first: AI outputs must pass strict validation.
- Auditability: store suggestions and rationale under metadata (optional).
- Reproducibility: optional seed for controlled variation.

---

## Notes

- Accessory loads can be either:
  - **not specified** (default; uses `load_note`) OR
  - computed if PlanRequest includes accessory baselines (future extension).
- This spec intentionally omits session duration estimation.
---

# Appendix: UI-ready Renders (Tables)

This appendix shows how to render the generated JSON into app-friendly tables.

## A) Strength/Hypertrophy — Week 1 Overview

| Día | Enfoque | Principal | Accesorios (resumen) | Fatiga |
|---|---|---|---|---|
| D1 | Lower | Back Squat | Leg Extension, Pallof Press | 6.81 |
| D2 | Upper | Bench Press | Lat Pulldown, Lateral Raise | 6.73 |
| D3 | Lower | Deadlift (Conventional) | Seated Leg Curl, Standing Calf Raise | 6.48 |
| D4 | Upper | Overhead Press | Seated Cable Row, DB Curl, Triceps Pushdown | 6.12 |

### Week 1 — Day 1 Detail (Lower)

| Bloque | Ejercicio | Prescripción | Intensidad | Carga |
|---|---|---|---|---|
| main_lift | Back Squat | Top: 1×5 @RPE7 + Backoff: 3×5 | RPE | Top 120.0 kg · Backoff 107.5 kg |
| secondary_lift | Romanian Deadlift (Barbell) | 3×8 @RIR2 | RIR | (nota) Select load (or supply accessory baselines to compute). |
| accessory | Leg Extension | 3×10–15 @RIR2 | RIR | (nota) Select load (or supply accessory baselines to compute). |
| accessory | Pallof Press | 3×10–15 @RIR2 | RIR | (nota) Select load (or supply accessory baselines to compute). |

**Métricas sesión:** Fatiga **6.81** · Volumen (hard sets ponderados) top keys: quads, glutes, erectors, hamstrings, obliques, abs

### Week 1 — Day 2 Detail (Upper)

| Bloque | Ejercicio | Prescripción | Intensidad | Carga |
|---|---|---|---|---|
| main_lift | Bench Press | Top: 1×6 @RPE7 + Backoff: 3×6 | RPE | Top 85.0 kg · Backoff 77.5 kg |
| secondary_lift | Barbell Row | 3×8 @RIR2 | RIR | (nota) Select load (or supply accessory baselines to compute). |
| accessory | Lat Pulldown | 3×10–15 @RIR2 | RIR | (nota) Select load (or supply accessory baselines to compute). |
| accessory | Lateral Raise | 3×12–20 @RIR2 | RIR | (nota) Select load (or supply accessory baselines to compute). |

**Métricas sesión:** Fatiga **6.73** · Volumen (hard sets ponderados) top keys: chest, triceps, delts_anterior, upper_back, lats, biceps

**Progresión — Back Squat**

| Semana | Top Set | Backoff | Carga Top |
|---|---|---|---|
| W1 | 1×5 @RPE7 | 3×5 @ 107.5 kg | 120.0 kg |
| W2 | 1×5 @RPE8 | 3×5 @ 110.0 kg | 122.5 kg |
| W3 | 1×3 @RPE8.5 | 4×3 @ 115.0 kg | 127.5 kg |
| W4 | 1×5 @RPE6 | 2×5 @ 97.5 kg | 107.5 kg |

**Progresión — Bench Press**

| Semana | Top Set | Backoff | Carga Top |
|---|---|---|---|
| W1 | 1×6 @RPE7 | 3×6 @ 77.5 kg | 85.0 kg |
| W2 | 1×5 @RPE8 | 4×5 @ 80.0 kg | 87.5 kg |
| W3 | 1×4 @RPE8.5 | 4×4 @ 80.0 kg | 90.0 kg |
| W4 | 1×6 @RPE6 | 2×6 @ 67.5 kg | 75.0 kg |

**Progresión — Deadlift (Conventional)**

| Semana | Top Set | Backoff | Carga Top |
|---|---|---|---|
| W1 | 1×4 @RPE7 | 2×4 @ 130.0 kg | 147.5 kg |
| W2 | 1×4 @RPE8 | 3×4 @ 135.0 kg | 152.5 kg |
| W3 | 1×2 @RPE8.5 | 4×2 @ 137.5 kg | 155.0 kg |
| W4 | 1×4 @RPE6 | 1×4 @ 117.5 kg | 132.5 kg |

## B) Conditioning — Week 2 Overview (Karvonen HRR)

| Día | Tipo | Duración | Intensidad | Fatiga |
|---|---|---|---|---|
| D1 | Steady | 40 | z(2) (150–163 bpm) | 0.27 |
| D2 | Intervals | 48 min | thr() (170–179 bpm) | 0.56 |
| D3 | Steady | 30 | z(2) (150–163 bpm) | 0.2 |
| D4 | Intervals | 36 min | vo2() (179–186 bpm) | 0.41 |

**Resumen semana:** Z2 = **70 min** · Intenso = **27.0 min**

### Week 2 — Day 1 Detail (Z2)

| Bloque | Modalidad | Prescripción | Intensidad |
|---|---|---|---|
| steady | Run Steady | 40 min continuo | z(2) (150–163 bpm) |

### Week 2 — Day 2 Detail (Threshold)

| Bloque | Modalidad | Prescripción | Intensidad |
|---|---|---|---|
| intervals | Run Intervals | Warmup 10 min; 5×4 min work / 2 min rest; Cooldown 8 min | thr() (170–179 bpm) |

### Week 2 — Day 4 Detail (VO2 Optional)

| Bloque | Modalidad | Prescripción | Intensidad |
|---|---|---|---|
| intervals | Run Intervals | Warmup 10 min; 7×60s work / 90s rest; Cooldown 8 min | vo2() (179–186 bpm) |


# 🔍 Extended Technical Appendix

This section expands the documentation to make it fully production-ready and implementation-ready.

---

# 1. System Architecture (Conceptual)

## 1.1 High-Level Components

```
Coach (UI)
    ↓
ProgramDefinition Editor
    ↓
Validation Engine
    ↓
Plan Generator (Deterministic Core)
    ↓
Metrics Engine
    ↓
Validation + Repair Engine
    ↓
GeneratedPlan JSON
    ↓
UI Renderer / API Response
```

---

# 2. Generation Flow (Sequence)

1. Load ProgramDefinition
2. Validate PlanRequest parameters
3. Resolve expressions (week/day context)
4. Select exercises (deterministic selector)
5. Generate prescriptions
6. Compute metrics (volume, fatigue)
7. Validate constraints
8. Apply repair if needed
9. Output GeneratedPlan JSON

---

# 3. Expression Engine Specification

Expressions must support:

- choose(index, list)
- min(), max(), round(), clamp()
- Arithmetic operators
- Boolean logic
- Context variables (ctx.week, ctx.athlete.level, etc.)

Sandbox required. No filesystem access.

---

# 4. Error Handling

Example:

```
{
  "error": {
    "type": "CONSTRAINT_VIOLATION",
    "message": "Max weekly volume exceeded and repair failed",
    "details": {
      "muscle": "quads",
      "limit": 20,
      "actual": 26
    }
  }
}
```

---

# 5. Edge Cases

- Missing equipment → selector filters out exercises
- Restriction conflicts → error if pattern minimum not met
- HRR without HRrest → validation error

---

# 6. Versioning Strategy

- Semantic versioning for ProgramDefinition
- GeneratedPlan must store version and timestamp

---

# 7. Security

- Expression engine sandboxed
- AI outputs schema validated
- Deterministic core always authoritative

---

# 8. Performance Expectations

- Single plan generation <50ms (deterministic)
- Linear scaling for bulk generation

---

# 9. Testing Strategy

Unit Tests:
- Expression evaluation
- Fatigue math
- Volume aggregation

Integration Tests:
- Full plan generation
- Repair scenarios

Snapshot Tests:
- Ensure deterministic JSON outputs

---

# 10. AI Usage Guidelines

AI must:
- Output valid JSON
- Pass schema validation
- Never override deterministic engine

Possible tools:
- suggest_program_definition()
- suggest_accessories()
- lint_plan()
- suggest_repairs()

---

# 11. Deployment Notes

Backend:
- FastAPI or Node
- JSON schema validation

Frontend:
- Weekly tabs
- Collapsible session blocks
- Analytics dashboard

---

# 12. Production Checklist

- [ ] Schema validation implemented
- [ ] Expression sandbox secured
- [ ] Repair loop tested
- [ ] HRR calculations verified
- [ ] OpenAPI documented
- [ ] Determinism confirmed

---

End of Extended Technical Appendix.
