import type { AuditEvent } from '@/mocks/driver';

type Tone = 'neutral' | 'pickup' | 'delivery' | 'done' | 'issue';

interface EventMeta {
  icon: string;
  tone: Tone;
}

const toneClass: Record<Tone, string> = {
  neutral: 'bg-background-100 text-foreground-500',
  pickup: 'bg-primary-100 text-primary-700',
  delivery: 'bg-accent-100 text-accent-700',
  done: 'bg-accent-500 text-background-50',
  issue: 'bg-secondary-100 text-secondary-700',
};

/**
 * Map an audit event's action string to an icon + tone. This is intentionally
 * string-based so the single `AuditEvent` shape works unchanged for both live
 * (Active Run) and historical (Activity History) runs.
 */
function eventMeta(action: string): EventMeta {
  const a = action.toLowerCase();

  if (a === 'run completed') return { icon: 'ri-checkbox-circle-line', tone: 'done' };
  if (a === 'run started') return { icon: 'ri-play-line', tone: 'neutral' };
  if (a === 'en route') return { icon: 'ri-navigation-line', tone: 'neutral' };
  if (a === 'arrived') return { icon: 'ri-map-pin-2-line', tone: 'neutral' };
  if (a === 'loading completed') return { icon: 'ri-gas-station-line', tone: 'pickup' };
  if (a.includes('bol uploaded')) return { icon: 'ri-file-text-line', tone: 'pickup' };
  if (a.includes('pickup completed')) return { icon: 'ri-check-double-line', tone: 'pickup' };
  if (a === 'unloading completed') return { icon: 'ri-download-2-line', tone: 'delivery' };
  if (a.includes('pod uploaded') || a.includes('pod signed')) return { icon: 'ri-camera-line', tone: 'delivery' };
  if (a.includes('delivery completed')) return { icon: 'ri-check-double-line', tone: 'delivery' };

  if (a.includes('unable') || a.includes('breakdown') || a.includes('safety') || a.includes('spill') || a.includes('leak')) {
    return { icon: 'ri-alert-line', tone: 'issue' };
  }
  if (a.includes('issue reported')) return { icon: 'ri-alert-line', tone: 'issue' };
  if (a.includes('issue acknowledged')) return { icon: 'ri-chat-check-line', tone: 'issue' };
  if (a.includes('issue resolved')) return { icon: 'ri-check-line', tone: 'issue' };
  if (a.includes('issue')) return { icon: 'ri-alert-line', tone: 'issue' };

  return { icon: 'ri-record-circle-line', tone: 'neutral' };
}

/** Loading placeholder used while a run's history is fetched lazily. */
export function EventTimelineSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <span className="h-7 w-7 shrink-0 rounded-full bg-background-200" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-32 rounded bg-background-200" />
            <div className="h-2.5 w-48 rounded bg-background-100" />
          </div>
          <div className="h-2.5 w-10 shrink-0 rounded bg-background-200" />
        </div>
      ))}
    </div>
  );
}

export default function EventTimeline({ events }: { events: AuditEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="py-4 text-center text-[12px] text-foreground-400">No events recorded yet.</p>
    );
  }

  return (
    <div>
      {events.map((event, index) => {
        const meta = eventMeta(event.action);
        const isLast = index === events.length - 1;
        return (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${toneClass[meta.tone]}`}
              >
                <i className={`${meta.icon} text-[13px] leading-none`} />
              </span>
              {!isLast && <span className="w-px flex-1 bg-background-200" />}
            </div>
            <div className={`min-w-0 flex-1 ${isLast ? '' : 'pb-3'}`}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[13px] font-semibold text-foreground-900">{event.action}</p>
                <span className="shrink-0 text-[11px] text-foreground-400 tabular whitespace-nowrap">
                  {event.time}
                </span>
              </div>
              {event.detail && <p className="text-[12px] text-foreground-500">{event.detail}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}