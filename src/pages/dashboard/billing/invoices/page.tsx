import { useMemo, useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import InvoicesTable from '@/pages/dashboard/billing/components/InvoicesTable';
import { invoices, type InvoiceStatus } from '@/mocks/billing';
import { billingNav } from '@/pages/dashboard/nav';

const statuses: InvoiceStatus[] = ['Draft', 'Sent', 'Paid', 'Overdue', 'Disputed'];

export default function InvoicesPage() {
  const [status, setStatus] = useState<InvoiceStatus | null>(null);

  const filtered = useMemo(
    () => invoices.filter((i) => !status || i.status === status),
    [status],
  );

  const paid = invoices.filter((i) => i.status === 'Paid').length;
  const outstanding = invoices.filter((i) => i.status === 'Overdue' || i.status === 'Sent').length;
  const disputed = invoices.filter((i) => i.status === 'Disputed').length;

  return (
    <ModuleShell
      title="Invoices"
      description="View and manage invoices, synced with external accounting."
      icon="ri-file-list-2-line"
      subNav={billingNav}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-background-200 bg-background-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Total Invoices</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-foreground-950">{invoices.length}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">this period</p>
        </div>
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Paid</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-accent-700">{paid}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">settled</p>
        </div>
        <div className="rounded-lg border border-secondary-200 bg-secondary-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Outstanding</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-secondary-700">{outstanding}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">sent or overdue</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Disputed</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-foreground-950">{disputed}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">need attention</p>
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
            {filtered.length} invoice{filtered.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <InvoicesTable rows={filtered} />
      </div>
    </ModuleShell>
  );
}