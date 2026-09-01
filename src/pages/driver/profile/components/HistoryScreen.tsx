import { useState } from 'react';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import { pastRuns } from '@/mocks/driverPastRuns';
import { pickupCount, deliveryCount } from '@/pages/driver/driverUtils';
import type { DriverRun } from '@/mocks/driver';
import EventTimeline, { EventTimelineSkeleton } from '@/pages/driver/components/EventTimeline';
import { useRunHistory } from '@/pages/driver/useRunHistory';

function formatDuration(min?: number): string {
  if (!min) return '—';
  const hours = Math.floor(min / 60);
  const minutes = min % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * Expanded timeline for a single completed run. Fetches lazily on mount (the
 * component is only rendered once the card is expanded) and caches for the
 * session via `useRunHistory`.
 */
function RunTimeline({ run }: { run: DriverRun }) {
  const { loading, events } = useRunHistory(run, true);

  if (loading) {
    return (
      <div className="px-4 py-4">
        <EventTimelineSkeleton />
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <EventTimeline events={events} />
    </div>
  );
}

function CompletedRunCard({
  run,
  expanded,
  onToggle,
}: {
  run: DriverRun;
  expanded: boolean;
  onToggle: () => void;
}) {
  const pickups = pickupCount(run);
  const deliveries = deliveryCount(run);

  return (
    <div className="overflow-hidden rounded-lg border border-background-200 bg-background-50">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left cursor-pointer hover:bg-background-100/60 transition-colors"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-100">
          <i className="ri-checkbox-circle-line text-accent-700 text-base leading-none" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-foreground-900 tabular">{run.id}</p>
            <span className="text-[11px] text-foreground-400 truncate">{run.route}</span>
          </div>
          <p className="text-[12px] text-foreground-500">
            {run.product} · {run.volume} · {run.window}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-foreground-500">
            <span className="flex items-center gap-1">
              <i className="ri-gas-station-line text-foreground-400 text-[12px] leading-none" />
              {pickups} pickup{pickups === 1 ? '' : 's'}
            </span>
            <span className="flex items-center gap-1">
              <i className="ri-building-2-line text-foreground-400 text-[12px] leading-none" />
              {deliveries} deliver{deliveries === 1 ? 'y' : 'ies'}
            </span>
            <span className="flex items-center gap-1">
              <i className="ri-time-line text-foreground-400 text-[12px] leading-none" />
              {formatDuration(run.durationMin)}
            </span>
          </div>
        </div>
        <i
          className={`ri-arrow-down-s-line text-foreground-400 text-base leading-none transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-background-200 bg-background-50">
          <RunTimeline run={run} />
        </div>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-8 text-center">
      <i className="ri-history-line text-foreground-300 text-2xl leading-none" />
      <p className="mt-2 text-sm font-medium text-foreground-600">{label}</p>
    </div>
  );
}

export default function HistoryScreen() {
  const { runs } = useDriverApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Today's completed runs come from the live store; the rest are historical cycles.
  const completedToday = runs
    .filter((run) => run.status === 'Completed' && run.window.startsWith('Today'))
    .sort((a, b) => b.window.localeCompare(a.window));

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-sm font-semibold text-foreground-950">Today</h2>
        <div className="mt-3 space-y-3">
          {completedToday.length === 0 ? (
            <EmptyState label="No completed runs today" />
          ) : (
            completedToday.map((run) => (
              <CompletedRunCard
                key={run.id}
                run={run}
                expanded={expandedId === run.id}
                onToggle={() => setExpandedId(expandedId === run.id ? null : run.id)}
              />
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-foreground-950">Past runs</h2>
        <div className="mt-3 space-y-3">
          {pastRuns.length === 0 ? (
            <EmptyState label="No past runs yet" />
          ) : (
            pastRuns.map((run) => (
              <CompletedRunCard
                key={run.id}
                run={run}
                expanded={expandedId === run.id}
                onToggle={() => setExpandedId(expandedId === run.id ? null : run.id)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}