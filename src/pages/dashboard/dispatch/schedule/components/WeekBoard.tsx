import type { ScheduleResource, ScheduleRun } from '@/mocks/schedule';
import type { DayInfo } from '../scheduleUtils';
import RunBlock from './RunBlock';
import ResourceLabel from './ResourceLabel';

interface WeekBoardProps {
  days: DayInfo[];
  resources: ScheduleResource[];
  runs: ScheduleRun[];
  onRunClick: (run: ScheduleRun) => void;
  onDropRun: (runId: string, driverName: string, truckPlate: string, day: number) => void;
}

const GRID = '210px repeat(7, minmax(148px, 1fr))';

export default function WeekBoard({ days, resources, runs, onRunClick, onDropRun }: WeekBoardProps) {
  function runsFor(driverName: string, day: number) {
    return runs.filter((l) => l.driverName === driverName && l.day === day);
  }

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          {/* header */}
          <div className="grid border-b border-background-200" style={{ gridTemplateColumns: GRID }}>
            <div className="sticky left-0 z-10 bg-background-50 px-4 py-3 border-r border-background-200">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Driver</span>
            </div>
            {days.map((d) => (
              <div
                key={`${d.weekday}-${d.date}`}
                className={`px-2 py-3 text-center border-r border-background-100 last:border-r-0 ${d.isToday ? 'bg-primary-50' : ''}`}
              >
                <p className="text-[11px] text-foreground-400">{d.weekday}</p>
                <p className={`text-sm font-semibold tabular ${d.isToday ? 'text-primary-700' : 'text-foreground-900'}`}>
                  {d.date}
                </p>
              </div>
            ))}
          </div>

          {/* rows */}
          {resources.map((r) => {
            const unavailable = r.availability === 'Unavailable';
            return (
              <div key={r.driverName} className="grid border-b border-background-100 last:border-b-0" style={{ gridTemplateColumns: GRID }}>
                <div className="sticky left-0 z-10 bg-background-50 px-3 py-2.5 border-r border-background-200 flex items-center">
                  <ResourceLabel resource={r} />
                </div>
                {days.map((d, di) => (
                  <div
                    key={`${r.driverName}-${d.weekday}-${d.date}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const id = e.dataTransfer.getData('text/plain');
                      if (id) onDropRun(id, r.driverName, r.truckPlate, di);
                    }}
                    className={`relative min-h-[68px] p-1.5 border-r border-background-100 last:border-r-0 ${
                      d.isToday ? 'bg-primary-50/40' : ''
                    }`}
                  >
                    {unavailable ? (
                      <div
                        className="absolute inset-0 opacity-[0.5]"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(0,0,0,0.04) 6px, rgba(0,0,0,0.04) 12px)',
                        }}
                      />
                    ) : (
                      runsFor(r.driverName, di).map((l) => (
                        <RunBlock key={l.id} run={l} variant="week" onClick={() => onRunClick(l)} />
                      ))
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
