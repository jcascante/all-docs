export interface Exercise {
  id: string;
  name: string;
}

export interface TopSet {
  sets: number;
  reps: number;
  target_rpe: number;
  load_kg: number;
}

export interface BackoffSet {
  sets: number;
  reps: number;
  load_kg: number;
}

export interface StrengthPrescription {
  top_set: TopSet;
  backoff: BackoffSet[];
  rounding_profile?: string;
}

export interface RepsRangePrescription {
  sets: number;
  reps_range: [number, number];
  target_rir: number;
  load_note?: string;
}

export interface Intensity {
  method: string;
  target: string;
}

export interface ConditioningPrescription {
  duration_minutes: number;
  intensity: Intensity;
  notes?: string;
}

export interface IntervalWork {
  intervals: number;
  minutes_each?: number;
  seconds_each?: number;
  intensity: Intensity;
}

export interface IntervalPrescription {
  warmup_minutes: number;
  work: IntervalWork;
  cooldown_minutes: number;
  rest_minutes?: number;
  rest_seconds?: number;
  notes?: string;
}

export type Prescription =
  | StrengthPrescription
  | RepsRangePrescription
  | ConditioningPrescription
  | IntervalPrescription;

export interface PlanBlock {
  block_id: string;
  type: string;
  exercise: Exercise;
  prescription: Prescription;
}

export interface SessionMetrics {
  fatigue_score: number;
  volume_summary?: {
    hard_sets_weighted?: Record<string, number>;
    tonnage?: number;
  };
}

export interface GeneratedSession {
  day: number;
  tags: string[];
  blocks: PlanBlock[];
  metrics: SessionMetrics;
}

export interface GeneratedWeek {
  week: number;
  sessions: GeneratedSession[];
}

export interface GeneratedPlan {
  program_id: string;
  program_version: string;
  generated_at: string;
  inputs_echo: Record<string, unknown>;
  weeks: GeneratedWeek[];
  warnings: string[];
  repairs: string[];
}

export interface ProgramDefinitionSummary {
  program_id: string;
  version: string;
  name: string | null;
  description: string | null;
}

export interface Athlete {
  level: string;
  time_budget_minutes: number;
  equipment: string[];
  e1rm?: Record<string, number>;
  restrictions?: string[];
  modality?: string;
}

export interface PlanRequest {
  program_id: string;
  program_version: string;
  weeks: number;
  days_per_week: number;
  athlete: Athlete;
  rules?: Record<string, unknown>;
  conditioning?: Record<string, unknown>;
  seed?: number;
}

export function isStrengthPrescription(
  rx: Prescription
): rx is StrengthPrescription {
  return "top_set" in rx;
}

export function isRepsRangePrescription(
  rx: Prescription
): rx is RepsRangePrescription {
  return "reps_range" in rx;
}

export function isConditioningPrescription(
  rx: Prescription
): rx is ConditioningPrescription {
  return "duration_minutes" in rx && !("work" in rx);
}

export function isIntervalPrescription(
  rx: Prescription
): rx is IntervalPrescription {
  return "work" in rx && "warmup_minutes" in rx;
}
