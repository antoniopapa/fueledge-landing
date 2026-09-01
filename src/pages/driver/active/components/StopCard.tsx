import { useState } from 'react';
import type { DriverRun, Stop } from '@/mocks/driver';
import StatusPill from '@/pages/driver/components/StatusPill';
import PickupFlow from './PickupFlow';
import DeliveryFlow from './DeliveryFlow';
import UnableToCompleteSheet from '@/pages/driver/components/UnableToCompleteSheet';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import {
  formatMinutes,
  isStopBlocked,
  getBlockingIssue,
} from '@/pages/driver/driverUtils';
import { getNavApp, openNavigation } from '@/pages/driver/navigation';

export default function StopCard({ run, stop }: { run: DriverRun; stop: Stop }) {
  const { navigateToStop, arriveAtStop } = useDriverApp();

  const [showUnable, setShowUnable] = useState(false);

  const isPickup = stop.kind === 'pickup';
  const issue = run.issues.find((item) => item.stopId === stop.id);
  const blocked = isStopBlocked(run, stop);
  const blockingIssue = getBlockingIssue(run, stop);

  const destination = encodeURIComponent(`${stop.name}, ${stop.city}`);

  function handleNavigate() {
    if (stop.status === 'Next') navigateToStop(run.id, stop.id);
    openNavigation(getNavApp(), destination);
  }



  if (stop.status === 'Completed') {
    const arrived = stop.arrivedAt;
    const loadDone = stop.loadCompletedAt ?? null;
    const doneAt = stop.completedAt;
    const breakdown =
      isPickup && arrived != null && loadDone != null && doneAt != null
        ? `Ops ${formatMinutes(loadDone - arrived)}m · Paperwork ${formatMinutes(doneAt - loadDone)}m · Dwell ${formatMinutes(doneAt - arrived)}m`
        : null;

    return (
      <div className="animate-collapse-in rounded-lg border border-background-200 bg-background-50 p-3">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
            <i className="ri-check-line text-accent-700 text-base leading-none" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground-800">{stop.name}</p>
            <p className="text-[12px] text-foreground-500">
              {isPickup
                ? `Pickup · ${stop.actualQuantity ?? stop.quantity} · BoL ${stop.bol ?? '—'}`
                : `Delivered · ${stop.actualQuantity ?? stop.quantity} · PoD ${stop.pod ?? '—'}`}
            </p>
            {breakdown && <p className="text-[10px] text-foreground-400 tabular">{breakdown}</p>}
          </div>
          <i className="ri-checkbox-circle-fill text-accent-600 text-lg leading-none shrink-0" />
        </div>
      </div>
    );
  }

  if (stop.status === 'Upcoming') {
    return (
      <div className="rounded-lg border border-background-100 bg-background-50/60 p-3 opacity-70">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-background-100 flex items-center justify-center shrink-0 text-foreground-400">
            <i className={`${isPickup ? 'ri-gas-station-line' : 'ri-building-2-line'} text-sm leading-none`} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground-600">{stop.name}</p>
            <p className="text-[12px] text-foreground-400">
              {isPickup ? 'Pickup' : 'Delivery'} · {stop.quantity}
            </p>
          </div>
          <StatusPill status={stop.status} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-active-card-in rounded-lg border border-primary-300 bg-primary-50/40 p-4 ring-1 ring-primary-200">
      <div className="flex items-start gap-3">
        <span
          className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
            isPickup ? 'bg-primary-500 text-background-50' : 'bg-accent-500 text-background-50'
          }`}
        >
          <i className={`${isPickup ? 'ri-gas-station-line' : 'ri-building-2-line'} text-lg leading-none`} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-bold uppercase tracking-wide ${isPickup ? 'text-primary-700' : 'text-accent-700'}`}>
            {isPickup ? 'Pickup' : 'Delivery'}
          </p>
          <p className="text-xl font-bold text-foreground-950">{stop.name}</p>
          <p className="text-sm text-foreground-600">{stop.address}</p>
          {!isPickup && stop.contactName && (
            <a
              href={`tel:${stop.contactPhone}`}
              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 tabular cursor-pointer"
            >
              <i className="ri-phone-line text-base leading-none" />
              {stop.contactName}
            </a>
          )}
        </div>
      </div>

      {issue && (
        <div className="animate-fade-in mt-3 rounded-md border border-accent-200 bg-accent-50 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <i className="ri-alert-line text-accent-700 text-base leading-none" />
            <div>
              <p className="text-[12px] font-semibold text-accent-800">Issue reported — {issue.category}</p>
              <p className="text-[11px] text-accent-700">Reported {issue.time}</p>
            </div>
          </div>
        </div>
      )}

      {/* Next / En route: one primary action telling the driver what to do next */}
      {(stop.status === 'Next' || stop.status === 'En route') && (
        <div className="mt-4 space-y-2">
          {stop.status === 'Next' ? (
            <>
              <button
                type="button"
                onClick={handleNavigate}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-base font-semibold px-4 py-4 whitespace-nowrap cursor-pointer transition-colors"
              >
                <i className="ri-navigation-line text-lg leading-none" />
                Navigate
              </button>
              <button
                type="button"
                onClick={() => arriveAtStop(run.id, stop.id)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary-500 text-primary-700 hover:bg-primary-50 text-base font-semibold px-4 py-4 whitespace-nowrap cursor-pointer transition-colors"
              >
                I'm already here
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => arriveAtStop(run.id, stop.id)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-base font-semibold px-4 py-4 whitespace-nowrap cursor-pointer transition-colors"
              >
                <i className="ri-map-pin-2-line text-lg leading-none" />
                I've Arrived
              </button>
              <button
                type="button"
                onClick={handleNavigate}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary-500 text-primary-700 hover:bg-primary-50 text-base font-semibold px-4 py-4 whitespace-nowrap cursor-pointer transition-colors"
              >
                Re-open maps
              </button>
            </>
          )}
        </div>
      )}

      {/* Arrived at terminal (pickup): compartment-driven load → BoL mini-flow */}
      {stop.status === 'Arrived' && isPickup && (
        <div className="mt-4 space-y-3">
          {blocked && blockingIssue ? (
            <div className="rounded-md border border-accent-300 bg-accent-50 p-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
                  <i className="ri-lock-line text-accent-700 text-base leading-none" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-accent-900">Pickup blocked</p>
                  <p className="text-[12px] text-accent-700">{blockingIssue.category}</p>
                </div>
              </div>
              <p className="mt-2 text-[12px] text-accent-800">Call your dispatcher for help</p>
            </div>
          ) : (
            <PickupFlow run={run} stop={stop} onUnable={() => setShowUnable(true)} />
          )}
        </div>
      )}

      {/* Arrived at customer (delivery): compartment + tank driven delivery flow */}
      {stop.status === 'Arrived' && !isPickup && (
        <div className="mt-4 space-y-3">
          {blocked && blockingIssue ? (
            <div className="rounded-md border border-accent-300 bg-accent-50 p-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
                  <i className="ri-lock-line text-accent-700 text-base leading-none" />
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-accent-900">Delivery blocked</p>
                  <p className="text-[12px] text-accent-700">{blockingIssue.category}</p>
                </div>
              </div>
              <p className="mt-2 text-[12px] text-accent-800">Call your dispatcher for help</p>
            </div>
          ) : (
            <DeliveryFlow run={run} stop={stop} onUnable={() => setShowUnable(true)} />
          )}
        </div>
      )}

      {showUnable && (
        <UnableToCompleteSheet
          open={showUnable}
          run={run}
          stopId={stop.id}
          stopLabel={stop.name}
          stopKind={stop.kind}
          onClose={() => setShowUnable(false)}
        />
      )}
    </div>
  );
}