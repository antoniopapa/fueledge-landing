import { useState } from 'react';
import type { Driver, ScheduleEvent } from '@/mocks/drivers';

const pendingRuns = [
  { id: '#2869', route: 'Rotterdam → Utrecht', volume: '24,000 L' },
  { id: '#2870', route: 'Antwerp → Bruges', volume: '19,000 L' },
  { id: '#2871', route: 'Hamburg → Hannover', volume: '22,000 L' },
];

const week = [
  { day: 'Mon', runs: 5 },
  { day: 'Tue', runs: 6 },
  { day: 'Wed', runs: 4 },
  { day: 'Thu', runs: 6 },
  { day: 'Fri', runs: 5 },
  { day: 'Sat', runs: 0 },
  { day: 'Sun', runs: 0 },
];

const dotClass: Record<ScheduleEvent['state'], string> = {
  completed: 'bg-accent-500',
  current: 'bg-primary-500 ring-4 ring-primary-500/20',
  upcoming: 'bg-background-300',
  delayed: 'bg-secondary-500',
};

const labelClass: Record<ScheduleEvent['state'], string> = {
  completed: 'text-foreground-500',
  current: 'text-primary-700 font-semibold',
  upcoming: 'text-foreground-400',
  delayed: 'text-secondary-700',
};

function EventIcon({ state }: { state: ScheduleEvent['state'] }) {
  if (state === 'completed') {
    return <i className="ri-check-line text-accent-600 text-[13px] leading-none" />;
  }
  if (state === 'delayed') {
    return <i className="ri-alert-line text-secondary-600 text-[13px] leading-none" />;
  }
  if (state === 'current') {
    return <i className="ri-record-circle-fill text-primary-600 text-[11px] leading-none" />;
  }
  return <i className="ri-record-circle-line text-foreground-300 text-[11px] leading-none" />;
}

export default function ScheduleTab({ driver }: { driver: Driver }) {
  const [view, setView] = useState<'today' | 'week'>('today');
  const [assignOpen, setAssignOpen] = useState(false);
  const [assigned, setAssigned] = useState<string | null>(null);

  function handleAssign(run: string) {
    setAssignOpen(false);
    setAssigned(run);
    window.setTimeout(() => setAssigned(null), 2800);
  }

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-1 rounded-full border border-background-200 bg-background-100 p-1">
          {(['today', 'week'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                view === v ? 'bg-primary-500 text-background-50' : 'text-foreground-600 hover:text-foreground-900'
              }`}
            >
              {v === 'today' ? 'Today' : 'Week'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAssignOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-[12px] font-semibold px-3 py-2 whitespace-nowrap cursor-pointer transition-colors"
        >
          <i className="ri-add-line text-[13px] leading-none" />
          Assign Run
        </button>
      </div>

      {view === 'today' ? (
        driver.schedule.length > 0 ? (
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-background-200" />
            <ul className="space-y-4">
              {driver.schedule.map((ev) => (
                <li key={`${ev.time}-${ev.label}`} className="relative flex items-start gap-3 pl-6">
                  <span
                    className={`absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center ${dotClass[ev.state]}`}
                  >
                    <EventIcon state={ev.state} />
                  </span>
                  <span className="w-16 shrink-0 text-[12px] font-medium text-foreground-500 tabular pt-0.5">{ev.time}</span>
                  <span className={`text-[13px] ${labelClass[ev.state]}`}>
                    {ev.label}
                    {ev.state === 'current' && (
                      <span className="ml-2 inline-block text-[9px] font-bold text-primary-700 bg-primary-100 px-1.5 py-0.5 rounded-full align-middle">
                        CURRENT
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-[13px] text-foreground-500">No schedule for today.</p>
        )
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {week.map((d) => (
            <div key={d.day} className="rounded-md border border-background-200 bg-background-50 p-3 text-center">
              <p className="text-[11px] font-medium text-foreground-500">{d.day}</p>
              <p className="mt-2 text-lg font-bold text-foreground-950 tabular">{d.runs}</p>
              <p className="text-[9px] text-foreground-400 uppercase">runs</p>
            </div>
          ))}
        </div>
      )}

      {/* assign run modal */}
      {assignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground-950/40" onClick={() => setAssignOpen(false)} />
          <div className="relative w-full max-w-md rounded-lg border border-background-200 bg-background-50 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-foreground-950">Assign Run</h3>
                <p className="text-[12px] text-foreground-500 mt-0.5">Assign a pending run to {driver.name}.</p>
              </div>
              <button
                type="button"
                onClick={() => setAssignOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 cursor-pointer"
                aria-label="Close"
              >
                <i className="ri-close-line text-lg leading-none" />
              </button>
            </div>

            <ul className="space-y-2">
              {pendingRuns.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => handleAssign(`${l.id} · ${l.route}`)}
                    className="flex w-full items-center justify-between rounded-md border border-background-200 px-3 py-2.5 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer text-left"
                  >
                    <div>
                      <p className="text-[13px] font-semibold text-foreground-900">{l.id}</p>
                      <p className="text-[11px] text-foreground-500">{l.route}</p>
                    </div>
                    <span className="text-[12px] text-foreground-600 tabular">{l.volume}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* toast */}
      {assigned && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          Assigned {assigned}
        </div>
      )}
    </div>
  );
}