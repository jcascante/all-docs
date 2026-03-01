import type { GeneratedPlan } from "@/lib/types";
import { WeekView } from "./WeekView";

interface PlanViewerProps {
  plan: GeneratedPlan;
}

export function PlanViewer({ plan }: PlanViewerProps) {
  return (
    <div data-testid="plan-viewer">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {plan.program_id.replace(/_/g, " ")}
          </h1>
          <p className="mt-1 text-sm text-gray-400 dark:text-slate-500">
            v{plan.program_version} &mdash; Generated{" "}
            {new Date(plan.generated_at).toLocaleDateString()}
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          {plan.weeks.length} weeks &bull; {plan.weeks[0]?.sessions.length ?? 0} days/wk
        </span>
      </div>

      <div className="space-y-10">
        {plan.weeks.map((week) => (
          <WeekView key={week.week} week={week} />
        ))}
      </div>

      {plan.warnings.length > 0 && (
        <div
          className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10"
          data-testid="warnings"
        >
          <h3 className="font-semibold text-amber-800 dark:text-amber-400">Warnings</h3>
          <ul className="mt-2 list-disc pl-4 text-sm text-amber-700 dark:text-amber-300">
            {plan.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
