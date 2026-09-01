import type { DriverRun, RunIssue, Stop, TruckInventory } from '@/mocks/driver';
import { truckInventory } from '@/mocks/driver';

export function getCurrentStop(run: DriverRun): Stop | null {
  return (
    run.stops.find(
      (stop) =>
        stop.status === 'Next' ||
        stop.status === 'En route' ||
        stop.status === 'Arrived',
    ) ?? null
  );
}

/**
 * Whether a stop has an unresolved "unable to complete" exception. This is
 * layered on top of the operational status — it does not change the stop's
 * physical progress. Once dispatch resolves the issue, the flag clears and
 * the stop returns to its real operational state.
 */
export function isStopBlocked(run: DriverRun, stop: Stop): boolean {
  return run.issues.some(
    (issue) =>
      issue.stopId === stop.id &&
      issue.kind === 'unable_to_complete' &&
      issue.status !== 'Resolved',
  );
}

export function getBlockingIssue(run: DriverRun, stop: Stop): RunIssue | null {
  return (
    run.issues.find(
      (issue) =>
        issue.stopId === stop.id &&
        issue.kind === 'unable_to_complete' &&
        issue.status !== 'Resolved',
    ) ?? null
  );
}

export function getOpenIssues(run: DriverRun): RunIssue[] {
  return run.issues.filter((issue) => issue.status !== 'Resolved');
}

export function pickupCount(run: DriverRun): number {
  return run.stops.filter((stop) => stop.kind === 'pickup').length;
}

export function deliveryCount(run: DriverRun): number {
  return run.stops.filter((stop) => stop.kind === 'delivery').length;
}

export function stopCount(run: DriverRun): number {
  return run.stops.length;
}

/** Maps German operating cities to their fuel-distribution operating region. */
const CITY_REGION: Record<string, string> = {
  Frankfurt: 'Rhein-Main',
  Raunheim: 'Rhein-Main',
  Mainz: 'Rhein-Main',
  Wiesbaden: 'Rhein-Main',
  Darmstadt: 'Rhein-Main',
  Offenbach: 'Rhein-Main',
  Hanau: 'Rhein-Main',
  'Rüsselsheim': 'Rhein-Main',
  Mannheim: 'Rhein-Neckar',
  Heidelberg: 'Rhein-Neckar',
  Ludwigshafen: 'Rhein-Neckar',
  Speyer: 'Rhein-Neckar',
  Worms: 'Rhein-Neckar',
  Köln: 'Rhine-Ruhr',
  Cologne: 'Rhine-Ruhr',
  Düsseldorf: 'Rhine-Ruhr',
  Essen: 'Rhine-Ruhr',
  Duisburg: 'Rhine-Ruhr',
  Dortmund: 'Rhine-Ruhr',
  Leverkusen: 'Rhine-Ruhr',
  Bonn: 'Rhine-Ruhr',
};

/**
 * Contextual route label for a run. Multi-stop runs cannot always be
 * reduced to "A → B", so this picks the most honest label:
 *  - single city → "Local route · Frankfurt"
 *  - cities within one operating region → "Regional route · Rhein-Main"
 *  - a clear 1 pickup + 1 delivery across two regions → "Frankfurt → Mannheim"
 *  - otherwise a first → last fallback.
 */
export function getRouteLabel(run: DriverRun): string {
  const cities = run.stops.map((stop) => stop.city);
  const distinct = Array.from(new Set(cities));
  const pickups = pickupCount(run);
  const deliveries = deliveryCount(run);

  if (distinct.length === 1) {
    return `Local route · ${distinct[0]}`;
  }

  const regions = Array.from(
    new Set(distinct.map((city) => CITY_REGION[city]).filter(Boolean)),
  );
  if (regions.length === 1) {
    return `Regional route · ${regions[0]}`;
  }

  if (pickups === 1 && deliveries === 1 && distinct.length === 2) {
    return `${distinct[0]} → ${distinct[1]}`;
  }

  return `${distinct[0]} → ${distinct[distinct.length - 1]}`;
}

/** First word of the run window, e.g. "Today", "Tomorrow", "Friday". */
export function windowDay(run: DriverRun): string {
  return run.window.split(' ')[0] || 'Today';
}

/** Time-of-day portion of the run window, e.g. "15:10–17:30". */
export function windowTime(run: DriverRun): string {
  const parts = run.window.split(' ');
  return parts.length > 1 ? parts.slice(1).join(' ') : run.window;
}

/**
 * Dispatcher-defined scheduled start time for a run (e.g. "07:30"), if one
 * exists. This is the single source of truth used by both Home (Up Next) and
 * the Schedule page so the two views always stay in sync.
 */
export function getScheduledStartAt(run: DriverRun): string | null {
  return run.scheduledStartAt ?? null;
}

export function completedStopCount(run: DriverRun): number {
  return run.stops.filter((stop) => stop.status === 'Completed').length;
}

/**
 * Whether a started run can still be undone. Undo is only allowed before the
 * driver performs the first operational action (Navigate/Arrived); once any
 * stop has begun execution, the run is locked and can no longer be reverted.
 */
export function canUndoStart(run: DriverRun): boolean {
  if (run.status !== 'In Progress') return false;
  return !run.stops.some(
    (stop) =>
      stop.status === 'En route' ||
      stop.status === 'Arrived' ||
      stop.status === 'Completed',
  );
}

export function getStopLabel(run: DriverRun, stop: Stop): string {
  const sameKind = run.stops.filter((item) => item.kind === stop.kind);
  const index = sameKind.findIndex((item) => item.id === stop.id);
  return stop.kind === 'pickup'
    ? `Pickup ${index + 1} of ${sameKind.length}`
    : `Delivery ${index + 1} of ${sameKind.length}`;
}

/** Overall 1-based position of a stop within the dispatcher-defined order. */
export function getStopPosition(run: DriverRun, stop: Stop): { position: number; total: number } {
  const position = run.stops.findIndex((item) => item.id === stop.id) + 1;
  return { position, total: run.stops.length };
}

/** 1-based position of a stop within its own type (pickup or delivery). */
export function getStopTypePosition(run: DriverRun, stop: Stop): { typePosition: number; typeTotal: number } {
  const sameKind = run.stops.filter((item) => item.kind === stop.kind);
  const typePosition = sameKind.findIndex((item) => item.id === stop.id) + 1;
  return { typePosition, typeTotal: sameKind.length };
}

/** Parse a human-readable volume string ("18,000 L") into litres (18000). */
export function parseLiters(value: string): number {
  const digits = String(value ?? '').replace(/[^0-9.]/g, '');
  const parsed = digits.length > 0 ? Number(digits) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Format a litre count into a human-readable volume string ("18,000 L"). */
export function formatLiters(value: number): string {
  return `${Math.round(value).toLocaleString('en-US')} L`;
}

/** Look up a truck's onboard inventory from the shared mock model. */
export function getTruckInventory(truckId: string): TruckInventory | undefined {
  return truckInventory.find((item) => item.truckId === truckId);
}

/** Sum of all delivery quantities on a run (litres). */
export function deliveryLiters(run: DriverRun): number {
  return run.stops
    .filter((stop) => stop.kind === 'delivery')
    .reduce((sum, stop) => sum + parseLiters(stop.quantity), 0);
}

/** Sum of all pickup quantities on a run (litres). */
export function pickupLiters(run: DriverRun): number {
  return run.stops
    .filter((stop) => stop.kind === 'pickup')
    .reduce((sum, stop) => sum + parseLiters(stop.quantity), 0);
}

/** Distinct fuel types required by a run. */
export function distinctFuelTypes(run: DriverRun): string[] {
  return Array.from(new Set(run.stops.map((stop) => stop.fuelType).filter(Boolean)));
}

/** Whether the first stop in the dispatcher-defined order is a delivery. */
export function isDeliveryFirst(run: DriverRun): boolean {
  return run.stops.length > 0 && run.stops[0].kind === 'delivery';
}

/** Whether a run has at least one pickup stop. */
export function hasPickupStops(run: DriverRun): boolean {
  return run.stops.some((stop) => stop.kind === 'pickup');
}

/** Whether a run has at least one delivery stop. */
export function hasDeliveryStops(run: DriverRun): boolean {
  return run.stops.some((stop) => stop.kind === 'delivery');
}

export interface DeliveryFirstValidation {
  ok: boolean;
  reason: string;
  onboardL: number;
}

/**
 * Dispatcher-side check for a delivery-first route: the assigned truck must
 * already hold enough compatible product to cover the deliveries without a
 * pickup. Returns a reason when the route is not valid as delivery-only.
 */
export function validateDeliveryFirstRoute(
  requiredFuelL: number,
  fuelType: string,
  truckId: string,
): DeliveryFirstValidation {
  const inventory = getTruckInventory(truckId);
  if (!inventory) {
    return { ok: false, reason: 'No onboard inventory data for this truck', onboardL: 0 };
  }
  if (inventory.fuelType !== fuelType) {
    return {
      ok: false,
      reason: `Onboard product (${inventory.fuelType}) does not match required product (${fuelType})`,
      onboardL: inventory.quantityL,
    };
  }
  if (inventory.quantityL < requiredFuelL) {
    return {
      ok: false,
      reason: `Onboard inventory (${formatLiters(inventory.quantityL)}) is less than required (${formatLiters(requiredFuelL)})`,
      onboardL: inventory.quantityL,
    };
  }
  return { ok: true, reason: '', onboardL: inventory.quantityL };
}

export function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatMinutes(ms: number): number {
  return Math.max(0, Math.floor(ms / 60000));
}

export function formatTimeOfDay(timestamp: number | null): string {
  if (timestamp == null) return '—';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}