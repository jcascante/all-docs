# Architecture — C4 (Mermaid)

Date: 2026-02-23

This document provides **C4-style** diagrams for the Dynamic Training Program Generator.
All diagrams are expressed in Mermaid so they render nicely in GitHub / GitLab / Markdown viewers that support Mermaid.

> If your repo viewer does not support Mermaid, you can still use these as source-of-truth and export via a doc tool later.

---

## C1 — System Context

```mermaid
flowchart LR
  Coach[Coach / Trainer] -->|Creates & edits| PDE[ProgramDefinition Editor UI]
  Coach -->|Generates plans| APP[Training Program App/API]

  subgraph APP[Dynamic Training Program Generator System]
    API[API Gateway / Backend Service]
    CORE[Deterministic Generation Core]
    VAL[Validation & Repair Engine]
    MET[Metrics Engine]
    STORE[(Storage: ProgramDefs / Plans / Libraries)]
  end

  PDE -->|Saves ProgramDefinitions| STORE
  API --> CORE
  CORE --> MET
  CORE --> VAL
  VAL --> CORE
  API --> STORE
  API -->|Returns JSON| Coach

  subgraph AI[Optional AI Services]
    LLM[LLM / AI Provider]
  end
  API -. tool calls .-> LLM
  LLM -. suggestions .-> API
```

---

## C2 — Container Diagram

```mermaid
flowchart TB
  subgraph Frontend[Frontend]
    UI[Coach UI (Web/Mobile)]
    DEFUI[ProgramDefinition Editor]
    PLANUI[Plan Viewer / Renderer]
    ANALYTICSUI[Analytics Dashboard]
  end

  subgraph Backend[Backend]
    BFF[Plan API Service (REST/GraphQL)]
    SCHEMA[Schema Validator (JSON Schema)]
    EXPR[Expression Engine (Sandbox)]
    SELECT[Exercise Selector]
    GEN[Plan Generator]
    METRICS[Metrics Engine]
    VALIDATE[Validation Engine]
    REPAIR[Repair Engine]
    AIA[AI Orchestrator (Optional)]
  end

  subgraph Data[Data Layer]
    DB[(DB: ProgramDefs, Plans)]
    LIB[(Exercise Library JSON)]
    LOG[(Audit Logs)]
  end

  UI --> BFF
  DEFUI --> BFF
  PLANUI --> BFF
  ANALYTICSUI --> BFF

  BFF --> SCHEMA
  BFF --> GEN
  GEN --> EXPR
  GEN --> SELECT
  GEN --> METRICS
  GEN --> VALIDATE
  VALIDATE --> REPAIR
  REPAIR --> GEN

  BFF --> DB
  BFF --> LIB
  GEN --> LOG

  BFF -. optional .-> AIA
  AIA -. tool calls .-> LLM[LLM Provider]
```

---

## C3 — Component Diagram (Backend Service)

```mermaid
flowchart LR
  BFF[Plan API Service] -->|validate| SCHEMA[JSON Schema Validator]
  BFF -->|generate| PIPE[Generation Pipeline]
  BFF -->|store/retrieve| REPO[Repo/DAO Layer]

  subgraph PIPE[Generation Pipeline]
    P0[Load ProgramDefinition]
    P1[Resolve Parameters]
    P2[Session Template Expansion]
    P3[Exercise Selection]
    P4[Prescription Resolution]
    P5[Metrics Computation]
    P6[Constraints Validation]
    P7[Repair Loop]
    P8[Finalize GeneratedPlan]
  end

  P0 --> P1 --> P2 --> P3 --> P4 --> P5 --> P6 --> P7 --> P8

  P3 --> SEL[Selector: tag filters + scoring]
  P4 --> EXPR[Expression Engine Sandbox]
  P5 --> MET[Metrics: volume + fatigue + conditioning]
  P6 --> VAL[Hard/Soft Validator]
  P7 --> REP[Repair Strategies]

  REPO --> DB[(DB)]
  REPO --> LIB[(Exercise Library)]
  REPO --> AUD[(Audit Logs)]

  BFF -. optional .-> AI[AI Orchestrator]
  AI -. tool calls .-> LLM[LLM Provider]
```

---

## Notes & Responsibilities

- **Deterministic core** is always authoritative.
- **AI** (if enabled) can only propose JSON artifacts (definitions, accessory candidates, lint findings).
- **Schema validation** is required at every boundary (inputs, AI outputs, stored artifacts).
- **Expression engine** must be sandboxed (no IO, no imports, no OS access).
