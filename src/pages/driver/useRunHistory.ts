import { useEffect, useState } from 'react';
import type { AuditEvent, DriverRun } from '@/mocks/driver';

/**
 * Session cache for run history, keyed by run id. Stores the fetched events
 * plus the source length at fetch time so we can detect when new events land
 * mid-run (e.g. a stop completes) and refresh only then. Survives
 * unmount/remount within the current session.
 */
const historyCache = new Map<string, { length: number; events: AuditEvent[] }>();

/**
 * Simulated history fetch. This is the single seam to swap for a real
 * database/API later — replace the body with a query keyed by `run.id`.
 * It resolves after a short delay to exercise the loading state.
 */
function fetchHistory(run: DriverRun): Promise<AuditEvent[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(run.history), 400);
  });
}

/**
 * Lazily loads a run's audit timeline only when `active` becomes true, so the
 * history query is never fired on page load — only on expand. Results are
 * cached for the session, so collapsing + re-expanding does not re-query.
 */
export function useRunHistory(run: DriverRun, active: boolean) {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const total = run.history.length;

  useEffect(() => {
    if (!active) return;

    const cached = historyCache.get(run.id);
    if (cached && cached.length === total) {
      setEvents(cached.events);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchHistory(run).then((result) => {
      if (cancelled) return;
      historyCache.set(run.id, { length: total, events: result });
      setEvents(result);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [active, run.id, total]);

  return { loading, events, total };
}