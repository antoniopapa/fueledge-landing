import type { ScheduleResource, ScheduleRun } from '@/mocks/schedule';
import type { DayInfo } from '../scheduleUtils';
import RunBlock from './RunBlock';
import ResourceLabel from './ResourceLabel';

interface DayBoardProps {
  day: DayInfo;
  dayIndex: number;
  resources: ScheduleResource[];
  runs: ScheduleRun[];
  onRunClick: (run: ScheduleRun) => void;
  onDropRun: (runId: string, driverName: string, truckPlate: string) => void;
}

const TIME_COLUMNS = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
const START_MIN = 6 * 60;
const RANGE_MIN = 14 * 60; // 06:00 → 20:00

function toMin(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function leftPct(time: string): number {
  return ((toMin(time) - START_MIN) / RANGE_MIN) * 100;
}

function widthPct(start: string, end: string): number {
  return ((toMin(end) - toMin(start)) / RANGE_MIN) * 100;
}

function assignLanes(runs: ScheduleRun[]): ScheduleRun[][] {
  const sorted = [...runs].sort((a, b) => toMin(a.startTime) - toMin(b.startTime));
  const lanes: ScheduleRun[][] = [];
  const laneEnd: number[] = [];
  for (const run of sorted) {
    let placed = false;
    for (let i = 0; i < lanes.length; i++) {
      if (toMin(run.startTime) >= laneEnd[i]) {
        lanes[i].push(run);
        laneEnd[i] = toMin(run.endTime);
        placed = true;
        break;
      }
    }
    if (!placed) {
      lanes.push([run]);
      laneEnd.push(toMin(run.endTime));
    }
  }
  return lanes;
}

export default function DayBoard({ day, dayIndex, resources, runs, onRunClick, onDropRun }: DayBoardProps) {
  const dayRuns = runs.filter((r) => r.day === dayIndex);

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[880px]">
          {/* header */}
          <div className="grid border-b border-background-200" style={{ gridTemplateColumns: '210px 1fr' }}>
            <div className="sticky left-0 z-10 bg-background-50 px-4 py-3 border-r border-background-200">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Driver / Truck</span>
            </div>
            <div className={`grid grid-cols-8 ${day.isToday ? 'bg-primary-50' : ''}`}>
              {TIME_COLUMNS.map((t) => (
                <div
                  key={t}
                  className="px-1 py-3 text-center text-[11px] font-medium text-foreground-500 tabular border-r border-background-100 last:border-r-0"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* rows */}
          {resources.map((r) => {
            const driverRuns = dayRuns.filter((l) => l.driverName === r.driverName);
            const lanes = assignLanes(driverRuns);
            const rowHeight = lanes.length > 1 ? 88 : 64;

            return (
              <div
                key={r.driverName}
                className="grid border-b border-background-100 last:border-b-0"
                style={{ gridTemplateColumns: '210px 1fr' }}
              >
                <div className="sticky left-0 z-10 bg-background-50 px-3 py-2 border-r border-background-200 flex items-center">
                  <ResourceLabel resource={r} />
                </div>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData('text/plain');
                    if (id) onDropRun(id, r.driverName, r.truckPlate);
                  }}
                  className={`relative border-r border-background-100 ${day.isToday ? 'bg-primary-50/40' : ''}`}
                  style={{ height: rowHeight }}
                >
                  {/* vertical grid lines */}
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="absolute top-0 bottom-0 border-r border-background-100" style={{ left: `${i * 12.5}%` }} />
                  ))}

                  {lanes.map((lane, li) =>
                    lane.map((l) => {
                      const left = leftPct(l.startTime);
                      const width = Math.max(widthPct(l.startTime, l.endTime), 3);
                      return (
                        <div
                          key={l.id}
                          className="absolute px-1"
                          style={{ left: `${left}%`, width: `${width}%`, top: li * 42 + 6 }}
                        >
                          <RunBlock run={l} variant="day" onClick={() => onRunClick(l)} />
                        </div>
                      );
                    }),
                  )}

                  {driverRuns.length === 0 && r.availability === 'Available' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[11px] font-medium text-accent-700">Available</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}