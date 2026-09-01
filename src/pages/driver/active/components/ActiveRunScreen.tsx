import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DriverRun } from '@/mocks/driver';
import { undoStartRun } from '@/pages/driver/driverStore';
import {
  pickupCount,
  deliveryCount,
  isStopBlocked,
  getBlockingIssue,
  getOpenIssues,
  getRouteLabel,
  getCurrentStop,
  getStopPosition,
  canUndoStart,
} from '@/pages/driver/driverUtils';
import StopCard from './StopCard';
import CompletedRouteTrail from './CompletedRouteTrail';

export default function ActiveRunScreen({ run, onBackHome }: { run: DriverRun; onBackHome?: () => void }) {
  const navigate = useNavigate();

  const activeStopId = getCurrentStop(run)?.id ?? null;
  const activeStopRef = useRef<HTMLDivElement | null>(null);
  const prevStopIdRef = useRef<string | null | undefined>(undefined);

  function handleUndoStart() {
    undoStartRun(run.id);
    if (onBackHome) onBackHome();
    else navigate('/driver/home');
  }

  useEffect(() => {
    if (prevStopIdRef.current === undefined) {
      prevStopIdRef.current = activeStopId;
      return;
    }
    if (activeStopId && activeStopId !== prevStopIdRef.current) {
      activeStopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    prevStopIdRef.current = activeStopId;
  }, [activeStopId]);

  if (run.status === 'Completed') {
    const pickups = pickupCount(run);
    const deliveries = deliveryCount(run);
    const summaryDelay = run.stops.length * 200 + 200;
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-accent-200 bg-accent-50 p-6">
          <CompletedRouteTrail run={run} />
          <div className="animate-fade-in text-center" style={{ animationDelay: `${summaryDelay}ms` }}>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-100">
              <i className="ri-checkbox-circle-fill text-accent-700 text-4xl leading-none" />
            </span>
            <p className="mt-3 font-heading text-xl font-bold text-foreground-950">Run completed</p>
            <div className="mx-auto mt-4 max-w-xs space-y-2 text-left">
              {pickups > 0 && (
                <div className="flex items-center gap-2.5 text-[13px] text-foreground-700">
                  <i className="ri-check-line text-accent-600 text-base leading-none" />
                  {pickups} pickup{pickups !== 1 ? 's' : ''} completed
                </div>
              )}
              {deliveries > 0 && (
                <div className="flex items-center gap-2.5 text-[13px] text-foreground-700">
                  <i className="ri-check-line text-accent-600 text-base leading-none" />
                  {deliveries} deliver{deliveries !== 1 ? 'ies' : 'y'} completed
                </div>
              )}
              <div className="flex items-center gap-2.5 text-[13px] text-foreground-700">
                <i className="ri-check-line text-accent-600 text-base leading-none" />
                {run.volume} delivered
              </div>
            </div>
            <button
              type="button"
              onClick={() => (onBackHome ? onBackHome() : navigate('/driver/home'))}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const blockedStop = run.stops.find((stop) => isStopBlocked(run, stop)) ?? null;
  const blockingIssue = blockedStop ? getBlockingIssue(run, blockedStop) : null;
  const openIssues = getOpenIssues(run);
  const otherOpenIssues = blockingIssue
    ? openIssues.filter((issue) => issue.id !== blockingIssue.id)
    : openIssues;

  const currentStop = getCurrentStop(run);
  const position = currentStop
    ? getStopPosition(run, currentStop)
    : { position: 1, total: run.stops.length };

  return (
    <div className="space-y-4">
      {(blockedStop && blockingIssue) || otherOpenIssues.length > 0 ? (
        <div className="space-y-2">
          {blockedStop && blockingIssue && (
            <div className="rounded-lg border border-accent-300 bg-accent-50 p-4">
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
                  <i className="ri-lock-line text-accent-700 text-base leading-none" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-accent-900">
                    {blockedStop.kind === 'pickup' ? 'Pickup blocked' : 'Delivery blocked'} · {blockedStop.name}
                  </p>
                  <p className="text-[13px] text-accent-700">{blockingIssue.category}</p>
                  <p className="mt-0.5 text-[12px] text-accent-700">
                    Call your dispatcher for help
                  </p>
                </div>
              </div>
            </div>
          )}
          {otherOpenIssues.length > 0 && (
            <div className="rounded-lg border border-background-200 bg-background-50 p-3">
              {otherOpenIssues.map((issue) => (
                <div key={issue.id} className="flex items-start gap-2.5 py-1">
                  <i className="ri-alert-line mt-0.5 text-[14px] leading-none text-secondary-700" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-foreground-800">Issue · {issue.category}</p>
                    <p className="text-[11px] text-foreground-500">{issue.stopLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      <div className="rounded-lg border border-background-200 bg-background-50 p-4">
        <p className="text-2xl font-bold text-foreground-950">{getRouteLabel(run)}</p>
        <p className="mt-1 text-sm text-foreground-600">
          Stop {position.position} of {position.total}
        </p>
      </div>

      <section className="space-y-3">
        {run.stops.map((stop) => (
          <div
            key={`${stop.id}-${stop.status}`}
            ref={stop.id === activeStopId ? activeStopRef : undefined}
          >
            <StopCard run={run} stop={stop} />
          </div>
        ))}
      </section>

      {canUndoStart(run) && (
        <button
          type="button"
          onClick={handleUndoStart}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-background-200 bg-background-50 px-4 py-3 text-[13px] font-semibold text-foreground-600 hover:bg-background-100 cursor-pointer transition-colors"
        >
          <i className="ri-arrow-go-back-line text-base leading-none" />
          Undo Start
        </button>
      )}
    </div>
  );
}