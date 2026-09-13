import { useParams, Link } from 'react-router-dom';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { useScheduleRuns } from '@/pages/dashboard/dispatch/dispatchStore';
import { useDriverRuns, useTruckInventory } from '@/pages/driver/driverStore';
import {
  driverProfile,
  type DriverRun,
  type Stop,
  type PickupProduct,
  type DeliveryProduct,
} from '@/mocks/driver';
import { trucks, trailers } from '@/mocks/fleet';
import { formatLiters, formatTimeOfDay } from '@/pages/driver/driverUtils';

const runStatusStyle: Record<string, string> = {
  Scheduled: 'text-secondary-700 bg-secondary-100',
  'In Progress': 'text-primary-700 bg-primary-100',
  Completed: 'text-accent-700 bg-accent-100',
};

const stopStatusStyle: Record<string, string> = {
  Upcoming: 'text-foreground-500 bg-background-100',
  Next: 'text-primary-700 bg-primary-100',
  'En route': 'text-secondary-700 bg-secondary-100',
  Arrived: 'text-accent-700 bg-accent-100',
  Completed: 'text-accent-700 bg-accent-50',
};

function compartmentLabel(id: string): string {
  if (!id) return '—';
  const match = id.match(/\d+/);
  return match ? `Compartment ${match[0]}` : id;
}

function deviationLabel(reason: string | null | undefined): string {
  switch (reason) {
    case 'different_quantity':
      return 'Different quantity';
    case 'different_compartment':
      return 'Different compartment';
    case 'product_unavailable':
      return 'Product unavailable';
    case 'skipped':
      return 'Skipped';
    default:
      return 'Other';
  }
}

export default function DispatchRunDetailPage() {
  const { id } = useParams();
  const runs = useDriverRuns();
  const scheduleRuns = useScheduleRuns();
  const inventory = useTruckInventory();

  const numeric = id?.replace(/^RN-/, '') ?? '';
  const run: DriverRun | undefined = runs.find(
    (r) => r.id === id || r.id === `RN-${numeric}` || r.orderId === `#${numeric}`,
  );
  const scheduleRun = scheduleRuns.find((sr) => sr.id === numeric);

  // Graceful fallback: the run isn't in the driver's live store yet.
  if (!run) {
    return (
      <ModuleShell title="Run Detail" description="Compartment-level run record." icon="ri-route-line">
        {scheduleRun ? (
          <div className="rounded-lg border border-background-200 bg-background-50 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-lg bg-secondary-100 flex items-center justify-center shrink-0">
                  <i className="ri-calendar-line text-secondary-700 text-xl leading-none" />
                </span>
                <div>
                  <h1 className="font-heading text-lg font-bold text-foreground-950">
                    Run #{scheduleRun.id} · {scheduleRun.route}
                  </h1>
                  <p className="text-sm text-foreground-500 mt-0.5">
                    {scheduleRun.driverName} · {scheduleRun.truckPlate} · {scheduleRun.product} ·{' '}
                    {scheduleRun.volume}
                  </p>
                </div>
              </div>
              <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap text-secondary-700 bg-secondary-100">
                {scheduleRun.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Pickup</p>
                <p className="mt-0.5 text-[13px] font-semibold text-foreground-900">{scheduleRun.pickup}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Delivery</p>
                <p className="mt-0.5 text-[13px] font-semibold text-foreground-900">{scheduleRun.delivery}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Window</p>
                <p className="mt-0.5 text-[13px] font-semibold text-foreground-900 tabular">
                  {scheduleRun.startTime}–{scheduleRun.endTime}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400">Volume</p>
                <p className="mt-0.5 text-[13px] font-semibold text-foreground-900 tabular">{scheduleRun.volume}</p>
              </div>
            </div>

            <div className="mt-4 rounded-md border border-dashed border-background-300 bg-background-50 p-4 text-center">
              <i className="ri-time-line text-foreground-300 text-2xl leading-none" />
              <p className="mt-2 text-[13px] font-medium text-foreground-600">
                This run is planned but hasn't reached the driver's app yet.
              </p>
              <p className="text-[12px] text-foreground-400 mt-1">
                Live compartment, tank and document details will appear here once the driver starts.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-14 text-center">
            <i className="ri-route-line text-foreground-300 text-3xl leading-none" />
            <p className="mt-3 text-sm font-medium text-foreground-600">Run not found</p>
            <p className="text-xs text-foreground-400 mt-1">
              This run hasn't reached the driver app yet, or the id is wrong.
            </p>
          </div>
        )}
        <Link
          to="/dispatch"
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
        >
          <i className="ri-arrow-left-line text-sm leading-none" />
          Back to schedule
        </Link>
      </ModuleShell>
    );
  }

  const pickups = run.stops.filter((stop) => stop.kind === 'pickup');
  const deliveries = run.stops.filter((stop) => stop.kind === 'delivery');

  const truckPlate = scheduleRun?.truckPlate ?? driverProfile.truck.registrationNumber;
  const truck = trucks.find((t) => t.plate === truckPlate);
  const trailer = truck?.trailerId ? trailers.find((t) => t.id === truck.trailerId) : null;
  const driverName = scheduleRun?.driverName ?? driverProfile.name;
  const onboard = inventory.find((item) => item.truckId === truckPlate);

  return (
    <ModuleShell
      title={`Run ${run.id}`}
      description={`${run.route} · ${run.product} · ${run.volume}`}
      icon="ri-route-line"
    >
      <Link
        to="/dispatch"
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground-500 hover:text-foreground-900 mb-4 cursor-pointer transition-colors whitespace-nowrap"
      >
        <i className="ri-arrow-left-line text-[13px] leading-none" />
        Dispatch schedule
      </Link>

      {/* header */}
      <div className="rounded-lg border border-background-200 bg-background-50 p-4 mb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
              <i className="ri-route-line text-primary-700 text-xl leading-none" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-xl font-bold text-foreground-950">{run.id}</h1>
                <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${runStatusStyle[run.status]}`}>
                  {run.status}
                </span>
              </div>
              <p className="text-sm text-foreground-500 mt-0.5">
                {run.route} · {run.product} · {run.volume} · {run.window}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400">Stops</p>
              <p className="text-lg font-bold text-foreground-950 tabular">{run.stops.length}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400">Pickups</p>
              <p className="text-lg font-bold text-foreground-950 tabular">{pickups.length}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400">Deliveries</p>
              <p className="text-lg font-bold text-foreground-950 tabular">{deliveries.length}</p>
            </div>
          </div>
        </div>

        {/* driver / truck / trailer */}
        <div className="mt-3 pt-3 border-t border-background-100 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-foreground-600">
          <span>
            <span className="text-foreground-400">Driver · </span>
            <span className="font-semibold text-foreground-800">{driverName}</span>
          </span>
          <span>
            <span className="text-foreground-400">Truck · </span>
            <span className="font-semibold text-foreground-800">
              {truck ? `${truck.plate} · ${truck.make} ${truck.model}` : truckPlate}
            </span>
          </span>
          <span>
            <span className="text-foreground-400">Trailer · </span>
            <span className="font-semibold text-foreground-800">
              {trailer ? `${trailer.plate} · ${trailer.capacity}` : '—'}
            </span>
          </span>
        </div>
      </div>

      {/* onboard fuel (compartment-aware, live) */}
      {onboard && (
        <div className="rounded-lg border border-background-200 bg-background-50 p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center shrink-0">
              <i className="ri-gas-station-line text-accent-700 text-base leading-none" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
                Onboard fuel · {truckPlate}
              </p>
              <p className="text-[13px] font-semibold text-foreground-900 tabular">
                {formatLiters(onboard.quantityL)} total
              </p>
            </div>
          </div>
          {onboard.compartments && onboard.compartments.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {onboard.compartments.map((comp) => (
                <div key={comp.id} className="rounded-md bg-background-100 px-3 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground-500">{comp.id}</p>
                  <p className="text-[15px] font-bold text-foreground-950 tabular">
                    {formatLiters(comp.currentL)}
                  </p>
                  <p className="text-[10px] text-foreground-400">/ {formatLiters(comp.capacityL)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-[12px] text-foreground-500 tabular">
              {formatLiters(onboard.quantityL)} {onboard.fuelType}
            </p>
          )}
        </div>
      )}

      {/* stops with compartment breakdown */}
      <div className="space-y-4">
        {run.stops.map((stop) => (
          <StopDetail key={stop.id} stop={stop} />
        ))}
      </div>

      {/* issues */}
      {run.issues.length > 0 && (
        <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden mt-4">
          <div className="px-4 py-3 border-b border-background-200">
            <h2 className="text-sm font-semibold text-foreground-950">Issues</h2>
          </div>
          <div className="divide-y divide-background-100">
            {run.issues.map((issue) => (
              <div key={issue.id} className="flex items-start gap-3 px-4 py-3">
                <span className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center shrink-0">
                  <i className="ri-alert-line text-secondary-700 text-base leading-none" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-semibold text-foreground-900">{issue.category}</p>
                    <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                      issue.status === 'Resolved'
                        ? 'text-accent-700 bg-accent-100'
                        : issue.status === 'Acknowledged'
                          ? 'text-secondary-700 bg-secondary-100'
                          : 'text-primary-700 bg-primary-100'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                  <p className="text-[12px] text-foreground-500 mt-0.5">
                    {issue.stopLabel} · {issue.note || 'No note'}
                  </p>
                </div>
                <span className="text-[11px] text-foreground-400 tabular whitespace-nowrap">{issue.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* history */}
      {run.history.length > 0 && (
        <div className="rounded-lg border border-background-200 bg-background-50 p-4 mt-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-4">Activity History</h2>
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-background-200" />
            <ul className="space-y-3">
              {run.history.map((event) => (
                <li key={event.id} className="relative flex items-start gap-3 pl-6">
                  <span className="absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full bg-primary-500" />
                  <div className="min-w-0">
                    <span className="text-[13px] text-foreground-800">{event.action}</span>
                    <span className="block text-[12px] text-foreground-500">{event.detail}</span>
                  </div>
                  <span className="ml-auto text-[11px] text-foreground-400 tabular whitespace-nowrap">{event.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}

function StopDetail({ stop }: { stop: Stop }) {
  const isPickup = stop.kind === 'pickup';
  const products = isPickup ? stop.pickupProducts ?? [] : stop.deliveryProducts ?? [];

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-background-200 flex items-center gap-3">
        <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
          isPickup ? 'bg-primary-500 text-background-50' : 'bg-accent-500 text-background-50'
        }`}>
          <i className={`${isPickup ? 'ri-gas-station-line' : 'ri-building-2-line'} text-base leading-none`} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wide ${isPickup ? 'text-primary-700' : 'text-accent-700'}`}>
              {isPickup ? 'Pickup' : 'Delivery'}
            </span>
            <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${stopStatusStyle[stop.status]}`}>
              {stop.status}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground-950">{stop.name}</p>
          <p className="text-[12px] text-foreground-500">{stop.address}</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] font-semibold text-foreground-900 tabular">
            {stop.actualQuantity ?? stop.quantity}
          </p>
          {stop.actualQuantity && stop.actualQuantity !== stop.quantity && (
            <p className="text-[11px] text-foreground-400 line-through tabular">{stop.quantity}</p>
          )}
          <p className="text-[11px] text-foreground-400 tabular">{stop.window}</p>
        </div>
      </div>

      {/* reference lines */}
      <div className="px-4 py-2.5 border-b border-background-100 flex flex-wrap gap-x-6 gap-y-1.5">
        {isPickup && stop.supplier && (
          <span className="text-[12px] text-foreground-600">
            <span className="text-foreground-400">Supplier · </span>{stop.supplier}
          </span>
        )}
        {isPickup && stop.loadingNumber && (
          <span className="text-[12px] text-foreground-600 tabular">
            <span className="text-foreground-400">Loading · </span>{stop.loadingNumber}
          </span>
        )}
        {isPickup && stop.bol && (
          <span className="text-[12px] text-foreground-600 tabular">
            <span className="text-foreground-400">BoL · </span>{stop.bol}
          </span>
        )}
        {!isPickup && stop.poNumber && (
          <span className="text-[12px] text-foreground-600 tabular">
            <span className="text-foreground-400">PO · </span>{stop.poNumber}
          </span>
        )}
        {!isPickup && stop.deliveryTicket && (
          <span className="text-[12px] text-foreground-600 tabular">
            <span className="text-foreground-400">Ticket · </span>{stop.deliveryTicket}
          </span>
        )}
        {!isPickup && stop.pod && (
          <span className="text-[12px] text-foreground-600 tabular">
            <span className="text-foreground-400">PoD · </span>{stop.pod}
          </span>
        )}
        <span className="text-[12px] text-foreground-400 tabular">
          Arrived {formatTimeOfDay(stop.arrivedAt)} · Completed {formatTimeOfDay(stop.completedAt)}
        </span>
      </div>

      {/* notes / discrepancy */}
      {(stop.notes || stop.discrepancy) && (
        <div className="px-4 py-2.5 border-b border-background-100 flex flex-wrap gap-x-6 gap-y-1.5">
          {stop.notes && (
            <span className="text-[12px] text-foreground-600">
              <span className="text-foreground-400">Notes · </span>{stop.notes}
            </span>
          )}
          {stop.discrepancy && (
            <span className="text-[12px] text-accent-700">
              <span className="text-accent-500">Discrepancy · </span>{stop.discrepancy}
            </span>
          )}
        </div>
      )}

      {/* compartment table */}
      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[860px]">
            <thead>
              <tr className="border-b border-background-100 bg-background-100/40">
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Compartment</th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Planned</th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Actual</th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Gross</th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Net</th>
                <th className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-100">
              {products.map((product, index) => {
                const planned = product.plannedQuantity ?? product.expectedGrossQuantity;
                const gross = product.grossQuantity;
                const net = product.netQuantity;
                const deviation = product.deviation?.reason ?? null;
                const deviationNote = product.deviation?.note ?? null;
                const capacityL = product.capacityL;
                const currentL = product.currentL;
                const retained = product.retainedQuantity;
                const actual = isPickup
                  ? (product as PickupProduct).actualLoadedQuantity
                  : (product as DeliveryProduct).actualDeliveredQuantity;
                const tank = !isPickup
                  ? (product as DeliveryProduct).tankSerialNumber
                  : null;
                return (
                  <tr key={`${product.compartmentId}-${index}`} className="hover:bg-background-100/50 align-top">
                    <td className="px-4 py-2.5 text-[12px] font-semibold text-foreground-800 whitespace-nowrap">
                      {compartmentLabel(product.compartmentId)}
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="text-[12px] text-foreground-700">
                        {product.product}
                        {tank && <span className="text-foreground-400"> · {tank}</span>}
                      </p>
                      {(capacityL != null || currentL != null) && (
                        <p className="text-[11px] text-foreground-400">
                          Capacity {capacityL != null ? formatLiters(capacityL) : '—'} · Onboard{' '}
                          {currentL != null ? formatLiters(currentL) : '—'}
                        </p>
                      )}
                      {retained != null && retained > 0 && (
                        <p className="text-[11px] font-medium text-accent-700">
                          Retain {formatLiters(retained)} onboard
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-foreground-600 tabular whitespace-nowrap">
                      {planned != null ? formatLiters(planned) : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-foreground-600 tabular whitespace-nowrap">
                      {actual != null ? formatLiters(actual) : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-foreground-600 tabular whitespace-nowrap">
                      {gross != null ? formatLiters(gross) : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">
                      {net != null ? formatLiters(net) : '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      {deviation ? (
                        <div>
                          <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-secondary-700 bg-secondary-100 whitespace-nowrap">
                            {deviationLabel(deviation)}
                          </span>
                          {deviationNote && (
                            <p className="text-[11px] text-foreground-500 mt-1">{deviationNote}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-foreground-400">As planned</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* tank volumes for delivery */}
      {!isPickup && products.some((p) => (p as { tankSerialNumber: string | null }).tankSerialNumber) && (
        <div className="px-4 py-2.5 border-t border-background-100 flex flex-wrap gap-x-6 gap-y-1.5">
          {(() => {
            const firstTank = products.find((p) => (p as { tankSerialNumber: string | null }).tankSerialNumber);
            const initial = firstTank ? (firstTank as { initialTankVolume: number | null }).initialTankVolume : null;
            const final = firstTank ? (firstTank as { finalTankVolume: number | null }).finalTankVolume : null;
            const water = firstTank ? (firstTank as { waterInTank: number | null }).waterInTank : null;
            return (
              <>
                <span className="text-[12px] text-foreground-600 tabular">
                  <span className="text-foreground-400">Tank initial · </span>{initial != null ? formatLiters(initial) : '—'}
                </span>
                <span className="text-[12px] text-foreground-600 tabular">
                  <span className="text-foreground-400">Tank final · </span>{final != null ? formatLiters(final) : '—'}
                </span>
                <span className="text-[12px] text-foreground-600 tabular">
                  <span className="text-foreground-400">Water · </span>{water != null ? formatLiters(water) : '—'}
                </span>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
