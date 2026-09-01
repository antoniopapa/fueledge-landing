import { useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import ReadyToInvoiceTable from '@/pages/dashboard/billing/components/ReadyToInvoiceTable';
import { readyToInvoice } from '@/mocks/billing';
import { billingNav } from '@/pages/dashboard/nav';

export default function ReadyToInvoicePage() {
  const [toast, setToast] = useState<string | null>(null);

  function handleAction(label: string) {
    setToast(label);
    window.setTimeout(() => setToast(null), 2800);
  }

  const totalValue = readyToInvoice.length;
  const totalMargin = readyToInvoice.length * 850;

  return (
    <ModuleShell
      title="Ready to Invoice"
      description="Completed, reconciled deliveries that are ready for invoicing."
      icon="ri-inbox-archive-line"
      subNav={billingNav}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-lg border border-background-200 bg-background-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Ready to Invoice</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-foreground-950">{totalValue}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">completed &amp; reconciled</p>
        </div>
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Est. Gross Margin</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-accent-700">
            €{totalMargin.toLocaleString('en-US')}
          </p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">across all deliveries</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Documents</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-foreground-950">{totalValue}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">BOL &amp; POD complete</p>
        </div>
      </div>

      <div className="mt-4">
        <ReadyToInvoiceTable rows={readyToInvoice} onAction={handleAction} />
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          {toast}
        </div>
      )}
    </ModuleShell>
  );
}