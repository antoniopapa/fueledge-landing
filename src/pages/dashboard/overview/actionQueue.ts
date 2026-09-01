import { useMemo } from 'react';
import { useDriverRuns } from '@/pages/driver/driverStore';
import { useUnassignedRuns, useScheduleRuns } from '@/pages/dashboard/dispatch/dispatchStore';
import { getOpenIssues } from '@/pages/driver/driverUtils';

export type QueueSeverity = 'critical' | 'warning' | 'info';

export type QueueActionKind = 'acknowledge' | 'resolve';

export interface QueueItem {
  id: string;
  severity: QueueSeverity;
  category: string;
  title: string;
  detail: string;
  link: string;
  time?: string;
  icon: string;
  resolveRunId?: string;
  resolveIssueId?: string;
  actionKind?: QueueActionKind;
}

const SEVERITY_RANK: Record<QueueSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

function compartmentShort(id: string): string {
  const match = id.match(/\d+/);
  return match ? `C${match[0]}` : id;
}

function deviationReasonLabel(reason: string): string {
  switch (reason) {
    case 'different_quantity':
      return 'Quantity differs from plan';
    case 'different_compartment':
      return 'Loaded into different compartment';
    case 'product_unavailable':
      return 'Product unavailable';
    case 'skipped':
      return 'Stop skipped';
    default:
      return 'Deviation from plan';
  }
}

/**
 * Consolidates everything that needs a dispatcher's action into one
 * priority-sorted queue. Pulls live from the driver store (issues,
 * deviations, document gaps) plus the dispatch store (unassigned,
 * delayed and double-booked runs).
 */
export function useActionQueue(): QueueItem[] {
  const runs = useDriverRuns();
  const unassigned = useUnassignedRuns();
  const schedule = useScheduleRuns();

  return useMemo(() => {
    const items: QueueItem[] = [];

    // 1) Driver-side signals — issues, deviations, quantity exceptions, missing documents.
    for (const run of runs) {
      const link = `/dispatch/runs/${run.id}`;

      for (const issue of getOpenIssues(run)) {
        const blocked = issue.kind === 'unable_to_complete';
        const actionKind: QueueActionKind =
          issue.status === 'Acknowledged' ? 'resolve' : blocked ? 'resolve' : 'acknowledge';
        items.push({
          id: `iss-${issue.id}`,
          severity: blocked || issue.severity === 'urgent' ? 'critical' : 'warning',
          category: blocked ? 'Blocked stop' : 'Issue',
          title: issue.category,
          detail: `${run.id} · ${issue.stopLabel}${issue.note ? ` · ${issue.note}` : ''}`,
          link,
          time: issue.time,
          icon: blocked ? 'ri-lock-line' : 'ri-alert-line',
          resolveRunId: run.id,
          resolveIssueId: issue.id,
          actionKind,
        });
      }

      for (const stop of run.stops) {
        const products =
          stop.kind === 'pickup' ? stop.pickupProducts ?? [] : stop.deliveryProducts ?? [];

        for (const product of products) {
          if (!product.deviation) continue;
          const isQuantity = product.deviation.reason === 'different_quantity';
          items.push({
            id: `dev-${stop.id}-${product.compartmentId}`,
            severity: 'warning',
            category: isQuantity ? 'Quantity exception' : 'Deviation',
            title: deviationReasonLabel(product.deviation.reason),
            detail: `${run.id} · ${stop.name} · ${compartmentShort(product.compartmentId)}${
              product.deviation.note ? ` · ${product.deviation.note}` : ''
            }`,
            link,
            icon: isQuantity ? 'ri-scales-3-line' : 'ri-error-warning-line',
          });
        }

        // Completed stop missing its required document.
        if (stop.status === 'Completed') {
          if (stop.kind === 'pickup' && !stop.bol) {
            items.push({
              id: `doc-${stop.id}`,
              severity: 'warning',
              category: 'Missing document',
              title: 'Bill of Lading not captured',
              detail: `${run.id} · ${stop.name}`,
              link,
              icon: 'ri-file-warning-line',
            });
          } else if (stop.kind === 'delivery' && !stop.pod) {
            items.push({
              id: `doc-${stop.id}`,
              severity: 'warning',
              category: 'Missing document',
              title: 'Proof of Delivery not captured',
              detail: `${run.id} · ${stop.name}${stop.discrepancy ? ` · ${stop.discrepancy}` : ''}`,
              link,
              icon: 'ri-file-warning-line',
            });
          }
        }
      }
    }

    // 2) Today's schedule — delayed and double-booked (vehicle conflict) runs.
    for (const s of schedule.filter((run) => run.day === 0)) {
      if (s.status === 'Delayed') {
        items.push({
          id: `late-${s.id}`,
          severity: 'warning',
          category: 'Late run',
          title: 'Behind schedule',
          detail: `${s.driverName} · ${s.truckPlate} · ${s.route}`,
          link: `/dispatch/runs/${s.id}`,
          time: s.startTime,
          icon: 'ri-time-line',
        });
      } else if (s.status === 'Conflict') {
        items.push({
          id: `conflict-${s.id}`,
          severity: 'critical',
          category: 'Vehicle conflict',
          title: 'Truck double-booked',
          detail: `${s.driverName} · ${s.truckPlate} · ${s.conflictNote ?? s.route}`,
          link: `/dispatch/runs/${s.id}`,
          time: s.startTime,
          icon: 'ri-alarm-warning-line',
        });
      }
    }

    // 3) Unassigned runs waiting for a truck + driver.
    for (const u of unassigned) {
      items.push({
        id: `unassigned-${u.id}`,
        severity: 'warning',
        category: 'Unassigned run',
        title: `${u.sourceTerminal} → ${u.destination}`,
        detail: `${u.volume} ${u.product} · ${u.reason}`,
        link: '/dispatch/unassigned',
        icon: 'ri-user-add-line',
      });
    }

    return items.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
  }, [runs, unassigned, schedule]);
}