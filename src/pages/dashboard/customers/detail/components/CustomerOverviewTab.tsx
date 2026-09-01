import type { Customer } from '@/mocks/customers';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">{label}</p>
      <p className="mt-1 text-[13px] font-semibold text-foreground-900">{value}</p>
    </div>
  );
}

export default function CustomerOverviewTab({ customer }: { customer: Customer }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-3">Commercial Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Credit Limit" value={customer.creditLimit} />
            <Field label="Credit Status" value={customer.creditStatus} />
            <Field label="Total Volume" value={customer.totalVolume} />
            <Field label="Revenue" value={customer.revenue} />
            <Field label="Gross Margin" value={customer.grossMargin} />
            <Field label="Open Orders" value={String(customer.openOrders)} />
            <Field label="Open Invoices" value={String(customer.openInvoices)} />
            <Field label="Outstanding" value={customer.outstandingBalance} />
          </div>
        </div>

        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-3">Products &amp; Pricing</h2>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {customer.products.map((p) => (
              <span key={p} className="text-[12px] font-medium text-foreground-700 bg-background-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                {p}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Pricing Agreement" value={customer.pricingAgreement} />
            <Field label="Contract" value={customer.contract} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-3">Contacts</h2>
          <div className="space-y-3">
            {customer.mainContacts.map((c) => (
              <div key={c.email} className="rounded-md bg-background-100 px-3 py-2.5">
                <p className="text-[13px] font-semibold text-foreground-900">{c.name}</p>
                <p className="text-[11px] text-foreground-500">{c.role}</p>
                <p className="text-[11px] text-foreground-500 mt-0.5">{c.email}</p>
                <p className="text-[11px] text-foreground-500">{c.phone}</p>
              </div>
            ))}
            <div className="rounded-md border border-background-200 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Billing Contact</p>
              <p className="mt-0.5 text-[13px] font-semibold text-foreground-900">{customer.billingContact.name}</p>
              <p className="text-[11px] text-foreground-500">{customer.billingContact.role}</p>
              <p className="text-[11px] text-foreground-500 mt-0.5">{customer.billingContact.email}</p>
            </div>
          </div>
        </div>

        {customer.notes && (
          <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4">
            <h2 className="text-sm font-semibold text-secondary-800 mb-1.5">Account Notes</h2>
            <p className="text-[12px] text-secondary-700">{customer.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}