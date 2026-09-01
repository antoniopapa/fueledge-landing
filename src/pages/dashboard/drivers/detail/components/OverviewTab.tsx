import { useNavigate } from 'react-router-dom';
import type { Driver } from '@/mocks/drivers';

function runsCompleted(driver: Driver): number | null {
  const [done] = driver.todayRuns.split('/');
  const n = Number(done);
  return Number.isFinite(n) && done !== '' ? n : null;
}

export default function OverviewTab({ driver }: { driver: Driver }) {
  const navigate = useNavigate();
  const completed = runsCompleted(driver);
  const [done, total] = driver.todayRuns.split('/');
  const progress = total && done && Number(total) > 0 ? (Number(done) / Number(total)) * 100 : 0;
  const hasDelay = driver.exceptions.some((e) => e.kind === 'Delayed');
  const volumeDelivered = completed != null ? (completed * 29500).toLocaleString('en-IE') : '—';
  const distance = completed != null ? (completed * 96).toLocaleString('en-IE') : '—';
  const onTime = hasDelay ? '80%' : '100%';

  const hasAssignment = Boolean(driver.currentAssignment);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* left */}
      <div className="lg:col-span-2 space-y-4">
        {/* current assignment */}
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground-950">Current Assignment</h2>
            {driver.currentAssignment && (
              <button
                type="button"
                onClick={() =>
                  navigate(`/orders/${driver.currentAssignment?.split(' · ')[0].replace('#', '')}`)
                }
                className="text-[11px] font-medium text-primary-700 hover:underline cursor-pointer whitespace-nowrap"
              >
                {driver.currentAssignment.split(' · ')[0]}
              </button>
            )}
          </div>

          {hasAssignment ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Route</p>
                <p className="mt-1 text-[13px] font-semibold text-foreground-900">{driver.route}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Product</p>
                <p className="mt-1 text-[13px] font-semibold text-foreground-900">{driver.product}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Volume</p>
                <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{driver.volume}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">ETA</p>
                <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{driver.eta ?? '—'}</p>
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-foreground-500">No active assignment right now.</p>
          )}
        </div>

        {/* live map */}
        <div className="rounded-lg border border-background-200 overflow-hidden bg-background-100">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-background-200 bg-background-100/40">
            <span className="text-[12px] font-semibold text-foreground-900">Live Position</span>
            <span className="text-[11px] font-medium text-foreground-400">{driver.location}</span>
          </div>
          <div className="relative h-64 md:h-80">
            <iframe
              title={`${driver.name} live position map`}
              src="https://maps.google.com/maps?q=Germany&z=6&output=embed"
              className="absolute inset-0 w-full h-full border-0 [filter:saturate(0.72)_contrast(1.02)]"
              loading="lazy"
              aria-label="Live map showing terminal, current truck position and customer delivery location"
            />

            <div className="absolute inset-0 pointer-events-none">
              {/* route line terminal → truck → customer */}
              <div
                className="absolute h-[2px] rounded-full bg-primary-500 opacity-60 origin-left"
                style={{ left: '22%', top: '30%', width: '30%', transform: 'rotate(24deg)' }}
              />
              <div
                className="absolute h-[2px] rounded-full bg-accent-500 opacity-60 origin-left"
                style={{ left: '50%', top: '44%', width: '28%', transform: 'rotate(28deg)' }}
              />

              {/* terminal */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: '22%', top: '30%' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 ring-2 ring-background-50" />
                <span className="mt-0.5 text-[8px] font-semibold text-foreground-700 bg-background-50/90 px-1 rounded whitespace-nowrap leading-tight">
                  Terminal
                </span>
              </div>

              {/* truck */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center ring-2 ring-background-50" style={{ left: '50%', top: '44%' }}>
                <i className="ri-truck-line text-background-50 text-[9px] leading-none" />
              </div>

              {/* customer */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: '78%', top: '60%' }}>
                <span className="w-3 h-3 rounded-full bg-accent-500 ring-4 ring-accent-500/25" />
                <span className="mt-1 text-[8px] font-bold text-foreground-900 bg-background-50 px-1 rounded whitespace-nowrap leading-tight">
                  Customer
                </span>
              </div>

              <div className="absolute left-3 top-3 bg-background-50/95 rounded-md px-2.5 py-1.5 border border-background-200">
                <span className="text-[9px] font-medium text-foreground-500">Live · Europe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* right */}
      <div className="space-y-4">
        {/* shift & progress */}
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-3">Today</h2>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] text-foreground-500">Progress</span>
            <span className="text-[12px] font-semibold text-foreground-900 tabular">{driver.todayRuns} runs</span>
          </div>
          <div className="h-2 rounded-full bg-background-200 overflow-hidden">
            <div className="h-full rounded-full bg-primary-500" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground-500">Shift</span>
              <span className="text-[12px] font-semibold text-foreground-900 tabular">{driver.shift}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground-500">Location</span>
              <span className="text-[12px] font-semibold text-foreground-900">{driver.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground-500">Next assignment</span>
              <span className="text-[12px] font-semibold text-foreground-900 text-right max-w-[60%]">{driver.nextAssignment}</span>
            </div>
          </div>
        </div>

        {/* performance */}
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-3">Today&apos;s Performance</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-background-100 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Runs Completed</p>
              <p className="mt-1 text-lg font-bold text-foreground-950 tabular">{completed ?? '—'}</p>
            </div>
            <div className="rounded-md bg-background-100 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Volume Delivered</p>
              <p className="mt-1 text-lg font-bold text-foreground-950 tabular">{volumeDelivered} L</p>
            </div>
            <div className="rounded-md bg-background-100 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Distance</p>
              <p className="mt-1 text-lg font-bold text-foreground-950 tabular">{distance} km</p>
            </div>
            <div className="rounded-md bg-background-100 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">On-Time</p>
              <p className={`mt-1 text-lg font-bold tabular ${onTime === '100%' ? 'text-accent-700' : 'text-secondary-700'}`}>
                {onTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}