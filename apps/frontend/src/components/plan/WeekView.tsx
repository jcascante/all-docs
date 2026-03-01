import type { GeneratedWeek } from "@/lib/types";
import { SessionCard } from "./SessionCard";

interface WeekViewProps {
  week: GeneratedWeek;
}

export function WeekView({ week }: WeekViewProps) {
  return (
    <div data-testid={`week-${week.week}`}>
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Week {week.week}
        </h2>
        <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {week.sessions.map((session) => (
          <SessionCard key={session.day} session={session} />
        ))}
      </div>
    </div>
  );
}
