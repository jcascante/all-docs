# Stakeholder Proposal — Dynamic Training Program Generator

Date: 2026-02-23

## 1) Problem

Coaches build programs repeatedly by hand. Program logic often includes:
- 1–2 main exercises with progression across weeks
- accessory variation by day
- conditioning blocks based on HR/pace/power targets
- constraints (equipment, restrictions, fatigue, minimum pattern volume)

This work is time-consuming, inconsistent, and hard to integrate into an app UI.

## 2) Solution

Build a **Programs-as-Code** toolchain where coaches define *what they want to program* via structured templates and rules.

**Core idea**
- Coaches define a **ProgramDefinition** (template + logic + validation).
- The system generates a **GeneratedPlan JSON** from a **PlanRequest**.
- Outputs are deterministic and UI-ready.
- AI is optional, used for authoring assistance and quality checks.

## 3) What We Deliver (MVP)

### 3.1 Deterministic Engine
- Parameter resolution (dynamic required/visible fields)
- Template expansion (weeks/days/blocks)
- Exercise selection (tags + equipment + restrictions)
- Prescription resolution (RPE/%/hybrid; conditioning via HRR/PACE/POWER/RPE)
- Metrics: volume + fatigue
- Validation + repair strategies
- JSON output suitable for rendering

### 3.2 Assets Included
- Exercise library v1 (100+ exercises)
- Two ProgramDefinitions (Option 1):
  - Strength/Hypertrophy UL (4w/4d)
  - Conditioning (4w/3–5d)
- Example PlanRequests + full 4-week GeneratedPlans
- OpenAPI starter spec
- JSON Schemas for validation
- C4 architecture diagrams

## 4) Why This Works

### Coach-first flexibility
Coaches control:
- progression rules
- accessory logic
- objectives and intensity models
- constraints and repair behavior

### Engineering-first reliability
- deterministic generation with optional seed
- strict schema validation at every boundary
- safe expression engine sandbox
- auditability and reproducibility

### Product-first UI integration
- JSON output is structured for “Overview / Session Detail / Analytics” views
- easy integration with any UI framework

## 5) AI: Where It Adds Value (Optional)

AI does **not** generate final plans. The deterministic engine remains authoritative.

AI can:
- build ProgramDefinitions from natural language
- suggest accessory candidates for slots
- lint/QA for balance, variety, interference
- propose repair actions when constraints fail
- generate athlete-facing session explanations

**Guardrail:** AI outputs must validate via JSON Schema before being accepted.

## 6) Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Expression engine security | sandbox + whitelist + timeouts |
| Non-deterministic outputs | seed + snapshot tests |
| Poor exercise library coverage | incremental library expansion + coach overrides |
| Over-constrained programs fail | repair loop + clear error output |

## 7) Success Metrics

- Time saved for coaches authoring programs
- % plans generated without manual post-editing
- Reduction in plan inconsistencies across coaches
- App engagement (users completing plans; retention)

## 8) Recommended Roadmap

### Phase 1 (MVP)
- deterministic engine + validation/repair
- 2 ProgramDefinitions (Option 1)
- exercise library v1
- API + schemas

### Phase 2
- ProgramDefinition editor UX enhancements
- richer metrics + analytics UI
- AI authoring assistant + lint agent

### Phase 3
- adaptive progression based on completion feedback
- export formats (PDF/CSV), sharing & versioning
- agent orchestration for iterative program building

---

## Appendix: Where to Find the Artifacts

- Markdown spec: `docs/dynamic-training-program-generator.md`
- C4 diagrams: `docs/architecture_c4.md`
- JSON schemas: `schemas/*.schema.json`
- ProgramDefinitions: `definitions/*.json`
- Example outputs: `examples/*.json`
- OpenAPI: `openapi/openapi.yaml`
