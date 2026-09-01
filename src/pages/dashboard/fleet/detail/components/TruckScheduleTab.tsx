import { useState } from 'react';
import type { Truck, TruckScheduleEvent } from '@/mocks/fleet';

const stateDot: Record<TruckScheduleEvent['state'], string> = {
  completed: 'bg-accent-500',
  current: 'bg-primary-500',
  upcoming: 'bg-background-300',
  conflict: 'bg-secondary-500',
  delayed: 'bg-secondary-500',
};

const stateLabel: Record<TruckScheduleEvent['state'], string> = {
  completed: 'Completed',
  current: 'Current',
  upcoming: 'Upcoming',
  conflict: 'Conflict',
  delayed: 'Delayed',
};

function generateSchedule(truck: Truck): TruckScheduleEvent[] {
  if (truck.status === 'Available' || truck.status === 'Out of Service') {
    return [
      { time: '06:00', label: 'Idle at depot', state: 'completed' },
      { time: '09:00', label: 'Standby', state: 'completed' },
      { time: '12:00', label: 'Standby', state: 'current' },
      { time: '16:00', label: 'Day end', state: 'upcoming' },
    ];
  }
  if (truck.status === 'Maintenance') {
    return [
      { time: '08:00', label: 'Workshop check-in', state: 'completed' },
      { time: '09:00', label: 'Maintenance in progress', state: 'current' },
      { time: '16:00', label: 'Estimated completion', state: 'upcoming' },
    ];
  }
  return [
    { time: '06:00', label: 'Driver assignment', state: 'completed' },
    { time: '07:00', label: 'Terminal pickup', state: 'completed' },
    { time: '09:00', label: 'Loading', state: 'completed' },
    { time: '12:00', label: 'In transit', state: 'current' },
    { time: '14:30', label: 'Customer delivery', state: 'upcoming' },
    { time: '16:00', label: 'Next run', state: 'upcoming' },
  ];
}

export default function TruckScheduleTab({ truck }: { truck: Truck }) {
  const [range, setRange] = useState<'today' | 'week'>('today');
  const events = truck.schedule && truck.schedule.length > 0 ? truck.schedule : generateSchedule(truck);

  return (
    <div className="rounded-lg border border-background-200 bg-background-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-background-200">
        <h2 className="text-sm font-semibold text-foreground-950">Schedule</h2>
        <div className="flex items-center gap-1 rounded-full bg-background-100 p-1">
          {(['today', 'week'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-full text-[12px] font-medium capitalize whitespace-nowrap transition-colors cursor-pointer ${
                range === r
                  ? 'bg-primary-500 text-background-50'
                  : 'text-foreground-500 hover:text-foreground-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-background-200" />
          <ul className="space-y-4">
            {events.map((e, i) => (
              <li key={`${e.time}-${i}`} className="relative flex items-start gap-3 pl-6">
                <span
                  className={`absolute left-0 top-1 w-[15px] h-[15px] rounded-full border-2 border-background-50 flex items-center justify-center ${stateDot[e.state]}`}
                >
                  {e.state === 'current' && <span className="w-1.5 h-1.5 rounded-full bg-background-50" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-foreground-400 tabular whitespace-nowrap">
                      {e.time}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                        e.state === 'completed'
                          ? 'bg-accent-100 text-accent-700'
                          : e.state === 'current'
                            ? 'bg-primary-100 text-primary-700'
                            : e.state === 'delayed' || e.state === 'conflict'
                              ? 'bg-secondary-100 text-secondary-700'
                              : 'bg-background-100 text-foreground-500'
                      }`}
                    >
                      {stateLabel[e.state]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-foreground-900">{e.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 flex items-center gap-4 text-[11px] text-foreground-500 flex-wrap border-t border-background-200 pt-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-500" /> Completed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary-500" /> Current
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-background-300" /> Upcoming
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary-500" /> Delayed / Conflict
          </span>
        </div>
      </div>
    </div>
  );
}