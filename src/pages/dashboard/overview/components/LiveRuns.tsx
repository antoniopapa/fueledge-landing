import { Link } from 'react-router-dom';
import { useDriverRuns } from '@/pages/driver/driverStore';
import { useScheduleRuns } from '@/pages/dashboard/dispatch/dispatchStore';
import { completedStopCount, isStopBlocked } from '@/pages/driver/driverUtils';

type RiskTone = 'blocked' | 'conflict' | 'delayed' | 'progress' | 'dispatched';

const riskMeta: Record<RiskTone, { label: string; cls: string; dot: string }> = {
  blocked: { label: 'Blocked', cls: 'text-red-700 bg-red-100', dot: 'bg-red-500' },
  conflict: { label: 'Conflict', cls: 'text-red-700 bg-red-100', dot: 'bg-red-500' },
  delayed: { label: 'Delayed', cls: 'text-amber-700 bg-amber-100', dot: 'bg-amber-500' },
  progress: { label: 'In progress', cls: 'text-primary-700 bg-primary-100', dot: 'bg-primary-500' },
  dispatched: { label: 'Dispatched', cls: 'text-secondary-700 bg-secondary-100', dot: 'bg-secondary-500' },
};

export default function LiveRuns() {
  const driverRuns = useDriverRuns();
  const schedule = useScheduleRuns();

  const active = schedule
    .filter(
      (s) =>
        s.day === 0 &&
        (s.status === 'Dispatched' || s.status === 'Delayed' || s.status === 'Conflict'),
    )
    .map((s) => ({
      schedule: s,
      run: driverRuns.find((r) => r.id === `RN-${s.id}` || r.orderId === `#${s.id}`),
    }));

  if (active.length === 0) return null;

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-background-200 bg-background-100/40">
        <span className="text-[12px] font-semibold text-foreground-900">Live Runs</span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
          {active.length} on the road
        </span>
      </div>

      <div className="divide-y divide-background-200">
        {active.map(({ schedule: s, run }) => {
          const progress =
            run && run.stops.length > 0
              ? Math.round((completedStopCount(run) / run.stops.length) * 100)
              : null;
          const blocked = run ? run.stops.some((stop) => isStopBlocked(run, stop)) : false;
          const tone: RiskTone = blocked
            ? 'blocked'
            : s.status === 'Conflict'
              ? 'conflict'
              : s.status === 'Delayed'
                ? 'delayed'
                : run
                  ? 'progress'
                  : 'dispatched';
          const meta = riskMeta[tone];

          return (
            <Link
              key={s.id}
              to={`/dispatch/runs/${s.id}`}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-background-100/50 transition-colors cursor-pointer group"
            >
              <span className="w-14 shrink-0 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">
                #{s.id}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-foreground-900 leading-tight whitespace-nowrap">
                  {s.route}
                </p>
                <p className="text-[10px] text-foreground-400 whitespace-nowrap">
                  {s.driverName} · {s.truckPlate} · {s.volume} {s.product}
                </p>
              </div>

              {progress != null ? (
                <div className="hidden sm:flex items-center gap-2 w-40 shrink-0">
                  <div className="flex-1 h-1.5 rounded-full bg-background-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        tone === 'blocked' || tone === 'conflict' ? 'bg-red-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-foreground-500 tabular whitespace-nowrap">
                    {progress}%
                  </span>
                </div>
              ) : (
                <span className="hidden sm:block text-[10px] text-foreground-400 tabular whitespace-nowrap w-40 shrink-0">
                  {s.startTime}–{s.endTime}
                </span>
              )}

              <span
                className={`inline-flex items-center gap-1.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${meta.cls}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>

              <span className="w-4 h-4 flex items-center justify-center text-foreground-300 group-hover:text-foreground-600 shrink-0">
                <i className="ri-arrow-right-s-line text-sm leading-none" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}