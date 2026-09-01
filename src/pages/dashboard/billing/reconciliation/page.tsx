import { useMemo, useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import ReconciliationTable from '@/pages/dashboard/billing/components/ReconciliationTable';
import { reconciliations, type ReconciliationStatus } from '@/mocks/billing';
import { billingNav } from '@/pages/dashboard/nav';

const statuses: ReconciliationStatus[] = [
  'Matched',
  'Needs Review',
  'Missing BOL',
  'Quantity Mismatch',
  'Price Mismatch',
  'Missing POD',
];

export default function ReconciliationPage() {
  const [status, setStatus] = useState<ReconciliationStatus | null>(null);

  const filtered = useMemo(
    () => reconciliations.filter((r) => !status || r.status === status),
    [status],
  );

  const matched = reconciliations.filter((r) => r.status === 'Matched').length;
  const needsReview = reconciliations.filter((r) => r.status !== 'Matched').length;
  const missingDocs = reconciliations.filter(
    (r) => r.status === 'Missing BOL' || r.status === 'Missing POD',
  ).length;

  return (
    <ModuleShell
      title="Reconciliation"
      description="Match supplier BOL, quantities, pricing, and documents against each run."
      icon="ri-scales-3-line"
      subNav={billingNav}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-background-200 bg-background-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Total Runs</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-foreground-950">{reconciliations.length}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">pending reconciliation</p>
        </div>
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Matched</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-accent-700">{matched}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">fully reconciled</p>
        </div>
        <div className="rounded-lg border border-secondary-200 bg-secondary-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Needs Review</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-secondary-700">{needsReview}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">discrepancies found</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Missing Docs</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-foreground-950">{missingDocs}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">BOL or POD missing</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-background-200 bg-background-50 p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setStatus(null)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              status === null
                ? 'bg-primary-500 text-background-50'
                : 'bg-background-100 text-foreground-600 hover:bg-background-200'
            }`}
          >
            All
          </button>
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                status === s
                  ? 'bg-primary-500 text-background-50'
                  : 'bg-background-100 text-foreground-600 hover:bg-background-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="pt-2 border-t border-background-200">
          <span className="text-[11px] text-foreground-400 whitespace-nowrap">
            {filtered.length} run{filtered.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <ReconciliationTable rows={filtered} />
      </div>
    </ModuleShell>
  );
}