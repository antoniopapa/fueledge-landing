import { useSyncExternalStore } from 'react';
import {
  driverNotifications,
  driverProfile,
  truckInventory,
  type DriverRun,
  type DriverNotification,
  type IssueSeverity,
  type IssueKind,
  type AuditEvent,
  type TruckInventory,
  type LoadDeviationReason,
} from '@/mocks/driver';
import { initialRunsToday } from '@/mocks/driverRunsToday';
import { initialRunsUpcoming } from '@/mocks/driverRunsUpcoming';
import { initialRunsNextWeek } from '@/mocks/driverRunsNextWeek';
import { nowTime, parseLiters, formatMinutes } from '@/pages/driver/driverUtils';

const initialRuns: DriverRun[] = [
  ...initialRunsToday,
  ...initialRunsUpcoming,
  ...initialRunsNextWeek,
];

let runs: DriverRun[] = initialRuns.map((run) => ({
  ...run,
  stops: run.stops.map((stop) => ({ ...stop })),
  issues: [...run.issues],
  history: [...run.history],
}));

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeDriverRuns(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getRuns(): DriverRun[] {
  return runs;
}

export function useDriverRuns(): DriverRun[] {
  return useSyncExternalStore(subscribeDriverRuns, getRuns);
}

export function getDriverRunsSnapshot(): DriverRun[] {
  return runs;
}

// --- Truck onboard inventory (shared mock model, read-only + adjusted on stop completion) ---

let inventory: TruckInventory[] = truckInventory.map((item) => ({ ...item }));

const inventoryListeners = new Set<() => void>();

function emitInventory(): void {
  inventoryListeners.forEach((listener) => listener());
}

function subscribeInventory(fn: () => void): () => void {
  inventoryListeners.add(fn);
  return () => {
    inventoryListeners.delete(fn);
  };
}

function getInventory(): TruckInventory[] {
  return inventory;
}

export function useTruckInventory(): TruckInventory[] {
  return useSyncExternalStore(subscribeInventory, getInventory);
}

export function getTruckInventorySnapshot(): TruckInventory[] {
  return inventory;
}

/** Increase (positive) or decrease (negative) a truck's onboard quantity. */
function adjustInventory(truckId: string, deltaL: number): void {
  inventory = inventory.map((item) =>
    item.truckId === truckId
      ? { ...item, quantityL: Math.max(0, item.quantityL + deltaL) }
      : item,
  );
  emitInventory();
}

/**
 * Compartment-aware inventory adjustment. When a truck has a per-compartment
 * breakdown, updates each compartment's `currentL` and recomputes `quantityL`
 * as their sum, so onboard fuel stays consistent with what the driver loads
 * and unloads at the compartment level.
 */
function adjustInventoryByCompartments(
  truckId: string,
  deltas: { compartmentId: string; deltaL: number }[],
): void {
  const totalDelta = deltas.reduce((sum, d) => sum + d.deltaL, 0);
  inventory = inventory.map((item) => {
    if (item.truckId !== truckId) return item;
    if (!item.compartments || item.compartments.length === 0) {
      return { ...item, quantityL: Math.max(0, item.quantityL + totalDelta) };
    }
    const compartments = item.compartments.map((comp) => {
      const delta = deltas.find((d) => d.compartmentId === comp.id)?.deltaL ?? 0;
      return { ...comp, currentL: Math.max(0, comp.currentL + delta) };
    });
    const quantityL = compartments.reduce((sum, comp) => sum + comp.currentL, 0);
    return { ...item, compartments, quantityL };
  });
  emitInventory();
}

// --- In-app notifications (shared so dispatch-side resolve can notify the driver) ---

let notifications: DriverNotification[] = driverNotifications.map((notification) => ({
  ...notification,
}));

const notificationListeners = new Set<() => void>();

function emitNotifications(): void {
  notificationListeners.forEach((listener) => listener());
}

function subscribeDriverNotifications(fn: () => void): () => void {
  notificationListeners.add(fn);
  return () => {
    notificationListeners.delete(fn);
  };
}

function getNotifications(): DriverNotification[] {
  return notifications;
}

export function useDriverNotifications(): DriverNotification[] {
  return useSyncExternalStore(subscribeDriverNotifications, getNotifications);
}

export function addDriverNotification(notification: DriverNotification): void {
  notifications = [notification, ...notifications];
  emitNotifications();
}

export function markNotificationRead(id: string): void {
  notifications = notifications.map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification,
  );
  emitNotifications();
}

export function markAllNotificationsRead(): void {
  notifications = notifications.map((notification) => ({ ...notification, read: true }));
  emitNotifications();
}

export function markRunNotificationsSeen(runId: string): void {
  notifications = notifications.map((notification) =>
    notification.runId === runId && notification.kind === 'assignment'
      ? { ...notification, read: true }
      : notification,
  );
  emitNotifications();
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function pushHistory(run: DriverRun, action: string, detail: string): DriverRun {
  const event: AuditEvent = { id: uid('h'), action, detail, time: nowTime() };
  return { ...run, history: [...run.history, event] };
}

function updateRun(id: string, updater: (run: DriverRun) => DriverRun): void {
  runs = runs.map((run) => (run.id === id ? updater(run) : run));
  emit();
}

function stopLabel(run: DriverRun, stopId: string): string {
  const stop = run.stops.find((item) => item.id === stopId);
  return stop ? stop.name : stopId;
}

function advanceAfterComplete(run: DriverRun): DriverRun {
  const nextUpcoming = run.stops.find((stop) => stop.status === 'Upcoming');
  if (!nextUpcoming) {
    return { ...run, status: 'Completed' as const, completedAt: Date.now() };
  }
  const stops = run.stops.map((stop) =>
    stop.id === nextUpcoming.id ? { ...stop, status: 'Next' as const } : stop,
  );
  return { ...run, stops };
}

export function startRun(id: string): void {
  updateRun(id, (run) => {
    if (run.status !== 'Scheduled') return run;
    const stops = run.stops.map((stop, index) =>
      index === 0 ? { ...stop, status: 'Next' as const } : stop,
    );
    const next: DriverRun = { ...run, status: 'In Progress' as const, startedAt: Date.now(), stops };
    return pushHistory(next, 'Run started', `${run.id} · ${run.route}`);
  });
}

export function undoStartRun(id: string): void {
  updateRun(id, (run) => {
    if (run.status !== 'In Progress') return run;
    const anyProgress = run.stops.some(
      (stop) =>
        stop.status === 'En route' ||
        stop.status === 'Arrived' ||
        stop.status === 'Completed',
    );
    if (anyProgress) return run;
    const stops = run.stops.map((stop) => ({ ...stop, status: 'Upcoming' as const }));
    const next: DriverRun = { ...run, status: 'Scheduled' as const, startedAt: null, stops };
    return pushHistory(next, 'Run start undone', `${run.id} · ${run.route}`);
  });
}

export function navigateToStop(runId: string, stopId: string): void {
  updateRun(runId, (run) => {
    const stops = run.stops.map((stop) =>
      stop.id === stopId ? { ...stop, status: 'En route' as const } : stop,
    );
    const next: DriverRun = { ...run, stops };
    return pushHistory(next, 'En route', `Navigating to ${stopLabel(run, stopId)}`);
  });
}

export function arriveAtStop(runId: string, stopId: string): void {
  updateRun(runId, (run) => {
    const stops = run.stops.map((stop) =>
      stop.id === stopId
        ? { ...stop, status: 'Arrived' as const, arrivedAt: Date.now() }
        : stop,
    );
    const next: DriverRun = { ...run, stops };
    return pushHistory(next, 'Arrived', `Arrived at ${stopLabel(run, stopId)}`);
  });
}

export function markLoadCompleted(runId: string, stopId: string): void {
  updateRun(runId, (run) => {
    const stops = run.stops.map((stop) =>
      stop.id === stopId ? { ...stop, loadCompletedAt: Date.now() } : stop,
    );
    const next: DriverRun = { ...run, stops };
    const action = run.stops.find((stop) => stop.id === stopId)?.kind === 'pickup'
      ? 'Loading completed'
      : 'Unloading completed';
    return pushHistory(next, action, stopLabel(run, stopId));
  });
}

export interface PickupProductResult {
  compartmentId: string;
  actualLoadedQuantity: number | null;
  deviation: LoadDeviationReason | null;
  deviationNote: string | null;
  grossQuantity: number | null;
  netQuantity: number | null;
}

export function completePickup(
  runId: string,
  stopId: string,
  data: {
    actualQuantity: string;
    bol: string;
    discrepancy: string;
    loadingNumber?: string | null;
    grossQuantity?: string | null;
    netQuantity?: string | null;
    products?: PickupProductResult[];
  },
): void {
  updateRun(runId, (run) => {
    const completed = run.stops.find((stop) => stop.id === stopId);
    const arrivedAt = completed?.arrivedAt ?? null;
    const loadCompletedAt = completed?.loadCompletedAt ?? null;
    const completedAt = Date.now();
    const dwellText =
      arrivedAt != null && loadCompletedAt != null
        ? ` · ${formatMinutes(completedAt - arrivedAt)} min at terminal`
        : '';
    const stops = run.stops.map((stop) =>
      stop.id === stopId
        ? {
            ...stop,
            status: 'Completed' as const,
            completedAt,
            actualQuantity: data.actualQuantity,
            actualPrice: null,
            bol: data.bol,
            loadingNumber: data.loadingNumber ?? stop.loadingNumber ?? null,
            discrepancy: data.discrepancy || null,
            pickupProducts: data.products
              ? stop.pickupProducts?.map((product) => {
                  const result = data.products?.find((item) => item.compartmentId === product.compartmentId);
                  if (!result) return product;
                  return {
                    ...product,
                    actualLoadedQuantity: result.actualLoadedQuantity,
                    grossQuantity: result.grossQuantity,
                    netQuantity: result.netQuantity,
                    deviation:
                      result.deviation != null
                        ? { reason: result.deviation, note: result.deviationNote }
                        : null,
                  };
                })
              : stop.pickupProducts,
          }
        : stop,
    );
    let next: DriverRun = { ...run, stops };
    next = pushHistory(
      next,
      'BoL uploaded',
      `${data.bol}${data.loadingNumber ? ` · LN ${data.loadingNumber}` : ''} · ${completed?.name ?? ''}`,
    );
    if (data.netQuantity) {
      next = pushHistory(
        next,
        'Quantities confirmed',
        `Net ${data.netQuantity} · Gross ${data.grossQuantity ?? '—'} · ${completed?.name ?? ''}`,
      );
    }
    next = pushHistory(next, 'Pickup completed', `${completed?.name ?? ''} · ${data.actualQuantity}${dwellText}`);
    return advanceAfterComplete(next);
  });
  if (data.products && data.products.length > 0) {
    adjustInventoryByCompartments(
      driverProfile.truck.id,
      data.products.map((product) => ({
        compartmentId: product.compartmentId,
        deltaL: product.actualLoadedQuantity ?? 0,
      })),
    );
  } else {
    adjustInventory(driverProfile.truck.id, parseLiters(data.actualQuantity));
  }
}

export function markDeliveryCompleted(runId: string, stopId: string): void {
  updateRun(runId, (run) => {
    const stops = run.stops.map((stop) =>
      stop.id === stopId ? { ...stop, deliveryCompletedAt: Date.now() } : stop,
    );
    const next: DriverRun = { ...run, stops };
    return pushHistory(next, 'Unloading completed', stopLabel(run, stopId));
  });
}

export interface DeliveryProductResult {
  compartmentId: string;
  actualDeliveredQuantity: number | null;
  deviation: LoadDeviationReason | null;
  deviationNote: string | null;
  grossQuantity: number | null;
  netQuantity: number | null;
}

export function completeDelivery(
  runId: string,
  stopId: string,
  data: {
    actualQuantity: string;
    notes: string;
    pod: string;
    discrepancy: string;
    deliveryTicket?: string | null;
    tank?: { initialVolume: number | null; finalVolume: number | null; waterInTank: number | null } | null;
    products?: DeliveryProductResult[];
  },
): void {
  updateRun(runId, (run) => {
    const completed = run.stops.find((stop) => stop.id === stopId);
    const arrivedAt = completed?.arrivedAt ?? null;
    const completedAt = Date.now();
    const dwellText =
      arrivedAt != null
        ? ` · ${formatMinutes(completedAt - arrivedAt)} min at customer`
        : '';
    const stops = run.stops.map((stop) =>
      stop.id === stopId
        ? {
            ...stop,
            status: 'Completed' as const,
            completedAt,
            actualQuantity: data.actualQuantity,
            notes: data.notes || stop.notes,
            pod: data.pod,
            discrepancy: data.discrepancy || null,
            deliveryTicket: data.deliveryTicket ?? stop.deliveryTicket ?? null,
            deliveryProducts: data.products
              ? stop.deliveryProducts?.map((product) => {
                  const result = data.products?.find((item) => item.compartmentId === product.compartmentId);
                  if (!result) return product;
                  return {
                    ...product,
                    actualDeliveredQuantity: result.actualDeliveredQuantity,
                    grossQuantity: result.grossQuantity,
                    netQuantity: result.netQuantity,
                    deviation:
                      result.deviation != null
                        ? { reason: result.deviation, note: result.deviationNote }
                        : null,
                  };
                })
              : stop.deliveryProducts,
          }
        : stop,
    );
    let next: DriverRun = { ...run, stops };

    if (data.tank) {
      next = {
        ...next,
        stops: next.stops.map((stop) =>
          stop.id === stopId
            ? {
                ...stop,
                deliveryProducts: stop.deliveryProducts?.map((product) =>
                  product.tankSerialNumber != null
                    ? {
                        ...product,
                        initialTankVolume: data.tank?.initialVolume ?? product.initialTankVolume,
                        finalTankVolume: data.tank?.finalVolume ?? product.finalTankVolume,
                        waterInTank: data.tank?.waterInTank ?? product.waterInTank,
                      }
                    : product,
                ),
              }
            : stop,
        ),
      };
      next = pushHistory(next, 'Tank measured', `${completed?.name ?? ''}`);
    }

    if (data.deliveryTicket) {
      next = pushHistory(next, 'Delivery ticket recorded', `${data.deliveryTicket} · ${completed?.name ?? ''}`);
    }

    next = pushHistory(next, 'PoD uploaded / signed', data.pod);
    next = pushHistory(next, 'Delivery completed', `${completed?.name ?? ''} · ${data.actualQuantity}${dwellText}`);
    const advanced = advanceAfterComplete(next);
    if (advanced.status === 'Completed') {
      return pushHistory(advanced, 'Run completed', `${run.id} · ${run.route}`);
    }
    return advanced;
  });
  if (data.products && data.products.length > 0) {
    adjustInventoryByCompartments(
      driverProfile.truck.id,
      data.products.map((product) => ({
        compartmentId: product.compartmentId,
        deltaL: -(product.actualDeliveredQuantity ?? 0),
      })),
    );
  } else {
    adjustInventory(driverProfile.truck.id, -parseLiters(data.actualQuantity));
  }
}

export function reportIssue(
  runId: string,
  stopId: string,
  stopLabelValue: string,
  category: string,
  note: string,
  severity: IssueSeverity,
  kind: IssueKind,
): void {
  updateRun(runId, (run) => {
    const issue = {
      id: uid('iss'),
      stopId,
      stopLabel: stopLabelValue,
      kind,
      category,
      note,
      severity,
      status: 'Reported' as const,
      time: nowTime(),
    };
    const withIssue: DriverRun = { ...run, issues: [issue, ...run.issues] };
    return pushHistory(withIssue, 'Issue reported', `${category} · ${stopLabelValue}`);
  });
}

export function reportUnableToComplete(
  runId: string,
  stopId: string,
  stopLabelValue: string,
  reason: string,
  note = '',
): void {
  updateRun(runId, (run) => {
    const issue = {
      id: uid('iss'),
      stopId,
      stopLabel: stopLabelValue,
      kind: 'unable_to_complete' as const,
      category: reason,
      note,
      severity: 'normal' as const,
      status: 'Reported' as const,
      time: nowTime(),
    };
    const detail = note ? `${reason}: ${note}` : reason;
    const withIssue: DriverRun = { ...run, issues: [issue, ...run.issues] };
    return pushHistory(withIssue, 'Unable to complete', `${detail} · ${stopLabelValue}`);
  });
}

/**
 * Dispatch-side first step: ack the driver's issue so it moves
 * Reported → Acknowledged (no unblocking happens here).
 */
export function acknowledgeIssue(runId: string, issueId: string): void {
  updateRun(runId, (run) => {
    const issue = run.issues.find((item) => item.id === issueId);
    if (!issue || issue.status !== 'Reported') return run;
    const issues = run.issues.map((item) =>
      item.id === issueId ? { ...item, status: 'Acknowledged' as const } : item,
    );
    const next: DriverRun = { ...run, issues };
    return pushHistory(next, 'Issue acknowledged', `${issue.category} · ${issue.stopLabel}`);
  });
}

/**
 * Dispatch-side final step that closes an issue. For "unable to complete"
 * exceptions this (1) unblocks the stop, (2) resets the stop back to "Arrived"
 * so the driver re-navigates to the customer instead of resuming mid-unload,
 * and (3) fires an in-app notification so the driver sees it live.
 */
export function resolveIssue(runId: string, issueId: string): void {
  updateRun(runId, (run) => {
    const issue = run.issues.find((item) => item.id === issueId);
    if (!issue) return run;

    const issues = run.issues.map((item) =>
      item.id === issueId ? { ...item, status: 'Resolved' as const } : item,
    );

    let next: DriverRun = { ...run, issues };

    if (issue.kind === 'unable_to_complete') {
      const stops = next.stops.map((stop) =>
        stop.id === issue.stopId
          ? {
              ...stop,
              status: 'Arrived' as const,
              arrivedAt: Date.now(),
              deliveryCompletedAt: null,
            }
          : stop,
      );
      next = { ...next, stops };
    }

    const action =
      issue.kind === 'unable_to_complete' ? 'Issue resolved · retry delivery' : 'Issue resolved by dispatch';
    const updated = pushHistory(next, action, `${issue.category} · ${issue.stopLabel}`);

    addDriverNotification({
      id: uid('dn'),
      kind: 'resolved',
      title: issue.kind === 'unable_to_complete' ? 'Stop unblocked · retry delivery' : 'Issue resolved',
      detail: `${issue.category} · ${issue.stopLabel}`,
      time: 'Just now',
      runId,
      read: false,
    });

    return updated;
  });
}