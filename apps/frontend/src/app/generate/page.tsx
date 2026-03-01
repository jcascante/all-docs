"use client";

import { useState } from "react";
import { generatePlan, ApiError } from "@/lib/api-client";
import type { GeneratedPlan, PlanRequest } from "@/lib/types";
import { PlanViewer } from "@/components/plan/PlanViewer";

type ProgramType = "strength" | "conditioning";

const STRENGTH_DEFAULTS: PlanRequest = {
  program_id: "strength_ul_4w_v1",
  program_version: "1.0.0",
  weeks: 4,
  days_per_week: 4,
  athlete: {
    level: "intermediate",
    time_budget_minutes: 90,
    equipment: ["barbell", "rack", "bench", "dumbbells", "cable", "machine", "pullup_bar"],
    e1rm: { squat: 160, bench: 115, deadlift: 190, ohp: 70 },
  },
  rules: {
    rounding_profile: "plate_2p5kg",
    volume_metric: "hard_sets_weighted",
    allow_optional_ohp: true,
    hard_set_rule: "RIR_LE_4",
    main_method: "HYBRID",
    accessory_rir_target: 2,
  },
};

const CONDITIONING_DEFAULTS: PlanRequest = {
  program_id: "conditioning_4w_v1",
  program_version: "1.0.0",
  weeks: 4,
  days_per_week: 4,
  athlete: {
    level: "intermediate",
    time_budget_minutes: 60,
    modality: "run",
    equipment: [],
  },
  conditioning: {
    method: "HR_ZONES",
    hr_zone_formula: "KARVONEN_HRR",
    hr_max: 190,
    hr_rest: 55,
  },
};

const ALL_EQUIPMENT = [
  "barbell", "rack", "bench", "dumbbells", "cable", "machine", "pullup_bar", "kettlebells", "bands",
];

export default function GeneratePage() {
  const [programType, setProgramType] = useState<ProgramType>("strength");
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [level, setLevel] = useState("intermediate");
  const [weeks, setWeeks] = useState(4);
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [timeBudget, setTimeBudget] = useState(90);

  const [squat, setSquat] = useState(160);
  const [benchE1rm, setBenchE1rm] = useState(115);
  const [deadlift, setDeadlift] = useState(190);
  const [ohp, setOhp] = useState(70);
  const [equipment, setEquipment] = useState<string[]>([
    "barbell", "rack", "bench", "dumbbells", "cable", "machine", "pullup_bar",
  ]);

  const [modality, setModality] = useState("run");
  const [hrMax, setHrMax] = useState(190);
  const [hrRest, setHrRest] = useState(55);

  const toggleEquipment = (item: string) => {
    setEquipment((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      let request: PlanRequest;
      if (programType === "strength") {
        request = {
          ...STRENGTH_DEFAULTS,
          weeks,
          days_per_week: daysPerWeek,
          athlete: {
            level,
            time_budget_minutes: timeBudget,
            equipment,
            e1rm: { squat, bench: benchE1rm, deadlift, ohp },
          },
          rules: STRENGTH_DEFAULTS.rules,
        };
      } else {
        request = {
          ...CONDITIONING_DEFAULTS,
          weeks,
          days_per_week: daysPerWeek,
          athlete: { level, time_budget_minutes: timeBudget, modality, equipment: [] },
          conditioning: {
            method: "HR_ZONES",
            hr_zone_formula: "KARVONEN_HRR",
            hr_max: hrMax,
            hr_rest: hrRest,
          },
        };
      }
      const result = await generatePlan(request);
      setPlan(result);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API Error (${err.status}): ${err.message}`);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Generate Training Plan
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Configure your athlete profile and generate a periodized plan.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Sidebar form */}
        <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Program Type Toggle */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              Program Type
            </label>
            <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-slate-800">
              {(["strength", "conditioning"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setProgramType(t)}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition-all ${
                    programType === t
                      ? "bg-indigo-600 text-white shadow-sm dark:bg-indigo-500"
                      : "text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Common */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Level">
              <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputCls}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Field>
            <Field label="Time Budget (min)">
              <input type="number" value={timeBudget} onChange={(e) => setTimeBudget(+e.target.value)} className={inputCls} min={30} max={180} />
            </Field>
            <Field label="Weeks">
              <input type="number" value={weeks} onChange={(e) => setWeeks(+e.target.value)} className={inputCls} min={1} max={12} />
            </Field>
            <Field label="Days / Week">
              <input type="number" value={daysPerWeek} onChange={(e) => setDaysPerWeek(+e.target.value)} className={inputCls} min={2} max={7} />
            </Field>
          </div>

          {/* Strength-specific */}
          {programType === "strength" && (
            <>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                  Estimated 1RM (kg)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Squat">
                    <input type="number" value={squat} onChange={(e) => setSquat(+e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Bench">
                    <input type="number" value={benchE1rm} onChange={(e) => setBenchE1rm(+e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Deadlift">
                    <input type="number" value={deadlift} onChange={(e) => setDeadlift(+e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="OHP">
                    <input type="number" value={ohp} onChange={(e) => setOhp(+e.target.value)} className={inputCls} />
                  </Field>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                  Equipment
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_EQUIPMENT.map((item) => {
                    const sel = equipment.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleEquipment(item)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          sel
                            ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500"
                            : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-slate-600 dark:text-slate-400 dark:hover:border-slate-500"
                        }`}
                      >
                        {item.replace(/_/g, " ")}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Conditioning-specific */}
          {programType === "conditioning" && (
            <div className="space-y-3">
              <Field label="Modality">
                <select value={modality} onChange={(e) => setModality(e.target.value)} className={inputCls}>
                  <option value="run">Run</option>
                  <option value="row">Row</option>
                  <option value="bike">Bike</option>
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="HR Max">
                  <input type="number" value={hrMax} onChange={(e) => setHrMax(+e.target.value)} className={inputCls} />
                </Field>
                <Field label="HR Rest">
                  <input type="number" value={hrRest} onChange={(e) => setHrRest(+e.target.value)} className={inputCls} />
                </Field>
              </div>
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:shadow-indigo-500/20 dark:hover:bg-indigo-400"
          >
            {loading && <Spinner />}
            {loading ? "Generating..." : "Generate Plan"}
          </button>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        <div className="min-w-0">
          {plan ? (
            <PlanViewer plan={plan} />
          ) : (
            <div className="flex h-80 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700">
              {loading ? (
                <div className="flex flex-col items-center gap-3">
                  <Spinner className="h-8 w-8 text-indigo-500" />
                  <span className="text-sm text-gray-400 dark:text-slate-500">Generating your plan...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-slate-500">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm">Configure and generate a plan</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}
