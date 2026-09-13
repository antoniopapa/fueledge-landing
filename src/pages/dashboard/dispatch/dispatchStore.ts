import { useEffect, useSyncExternalStore } from 'react';
import {
  fetchScheduleRuns,
  scheduleRuns as initialScheduleRuns,
  unassignedRuns as initialUnassignedRuns,
  type ScheduleRun,
  type UnscheduledRun,
} from '@/mocks/schedule';

let schedule: ScheduleRun[] = [...initialScheduleRuns];
let unassigned: UnscheduledRun[] = [...initialUnassignedRuns];
let scheduleLoading = false;
let scheduleLoaded = false;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function getSchedule(): ScheduleRun[] {
  return schedule;
}

function loadScheduleRuns(): void {
  if (scheduleLoading || scheduleLoaded) return;

  scheduleLoading = true;
  fetchScheduleRuns()
    .then((runs) => {
      if (runs.length > 0) {
        schedule = runs;
        emit();
      }
    })
    .catch(() => {
      // Keep the bundled schedule as a fallback when the API is unavailable.
    })
    .finally(() => {
      scheduleLoading = false;
      scheduleLoaded = true;
    });
}

function getUnassigned(): UnscheduledRun[] {
  return unassigned;
}

export function useScheduleRuns(): ScheduleRun[] {
  useEffect(() => {
    loadScheduleRuns();
  }, []);

  return useSyncExternalStore(subscribe, getSchedule);
}

export function useUnassignedRuns(): UnscheduledRun[] {
  return useSyncExternalStore(subscribe, getUnassigned);
}

export function updateScheduleRun(runId: string, patch: Partial<ScheduleRun>): void {
  schedule = schedule.map((r) => (r.id === runId ? { ...r, ...patch } : r));
  emit();
}

function firstTime(window: string): string {
  const match = window.match(/\d{2}:\d{2}/);
  return match ? match[0] : '09:00';
}

function lastTime(window: string): string {
  const matches = window.match(/\d{2}:\d{2}/g);
  return matches && matches.length > 1 ? matches[matches.length - 1] : '11:00';
}

export function assignRun(run: UnscheduledRun, driverName: string, truckPlate: string): void {
  unassigned = unassigned.filter((r) => r.id !== run.id);
  const window = run.deliveryFirst ? run.deliveryWindow : `${run.pickupWindow} – ${run.deliveryWindow}`;
  const route = run.deliveryFirst
    ? `Delivery-first · ${run.destination}`
    : `${run.sourceTerminal} → ${run.destination}`;
  const newRun: ScheduleRun = {
    id: run.id,
    driverName,
    truckPlate,
    route,
    product: run.product,
    volume: run.volume,
    day: 0,
    startTime: firstTime(window),
    endTime: lastTime(window),
    status: 'Scheduled',
    pickup: run.deliveryFirst ? 'Onboard fuel (no pickup)' : run.sourceTerminal,
    delivery: run.destination,
  };
  schedule = [...schedule, newRun];
  emit();
}
