import { useNavigate } from 'react-router-dom';
import DriverAppShell from '@/pages/driver/components/DriverAppShell';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import {
  getRouteLabel,
  stopCount,
  windowDay,
  getScheduledStartAt,
} from '@/pages/driver/driverUtils';
import type { DriverRun } from '@/mocks/driver';

const DAY_RANK: Record<string, number> = {
  Today: 0,
  Tomorrow: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
  Monday: 7,
  Tuesday: 8,
};

export default function DriverSchedulePage() {
  const { runs } = useDriverApp();
  const navigate = useNavigate();

  const scheduled = runs.filter((run) => run.status === 'Scheduled');
  const groups = new Map<string, DriverRun[]>();

  scheduled.forEach((run) => {
    const key = windowDay(run);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(run);
  });

  const orderedKeys = Array.from(groups.keys()).sort((a, b) => {
    const ra = DAY_RANK[a] ?? 99;
    const rb = DAY_RANK[b] ?? 99;
    return ra - rb;
  });

  return (
    <DriverAppShell>
      {orderedKeys.length === 0 && (
        <div className="mt-4 rounded-lg border border-dashed border-background-300 bg-background-50 p-10 text-center">
          <i className="ri-calendar-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">No runs scheduled</p>
          <p className="mt-1 text-[12px] text-foreground-400">Dispatch hasn't assigned you any upcoming runs.</p>
        </div>
      )}

      <div className="mt-4 space-y-6">
        {orderedKeys.map((key) => {
          const dayRuns = groups.get(key)!;
          return (
            <section key={key}>
              <div className="mb-3 flex items-baseline gap-2">
                <i className="ri-calendar-line text-base leading-none text-foreground-400" />
                <h2 className="font-heading text-lg font-bold text-foreground-600">{key}</h2>
                <span className="text-sm text-foreground-400 tabular">
                  {dayRuns.length} run{dayRuns.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-3">
                {dayRuns.map((run) => {
                  const total = stopCount(run);
                  const scheduledStart = getScheduledStartAt(run);
                  return (
                    <button
                      key={run.id}
                      type="button"
                      onClick={() => navigate(`/driver/runs/${run.id}`)}
                      className="flex w-full items-center justify-between gap-4 rounded-lg border border-background-200 bg-background-50 p-5 text-left hover:border-primary-200 hover:bg-primary-50/40 cursor-pointer transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-heading text-xl font-bold text-foreground-950">
                          {getRouteLabel(run)}
                        </p>
                        <p className="mt-2 text-base font-medium text-foreground-600 tabular">
                          {scheduledStart ? `${scheduledStart} · ` : ''}
                          {total} stop{total !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <i className="ri-arrow-right-s-line text-3xl leading-none text-foreground-300" />
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </DriverAppShell>
  );
}