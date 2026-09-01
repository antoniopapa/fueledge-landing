import { useNavigate } from 'react-router-dom';
import type { Customer } from '@/mocks/customers';
import { invoices } from '@/mocks/billing';
import InvoiceStatusBadge from '@/pages/dashboard/billing/components/InvoiceStatusBadge';

export default function CustomerBillingTab({ customer }: { customer: Customer }) {
  const navigate = useNavigate();
  const customerInvoices = invoices.filter((i) => i.customer === customer.name);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Outstanding Balance</p>
          <p className={`mt-1 text-lg font-bold tabular ${customer.accountStatus === 'Credit Warning' ? 'text-secondary-700' : 'text-foreground-950'}`}>
            {customer.outstandingBalance}
          </p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Credit Limit</p>
          <p className="mt-1 text-lg font-bold tabular text-foreground-950">{customer.creditLimit}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Open Invoices</p>
          <p className="mt-1 text-lg font-bold tabular text-foreground-950">{customer.openInvoices}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Billing Status</p>
          <p className="mt-1 text-[13px] font-semibold text-foreground-900">{customer.billingStatus}</p>
        </div>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-background-200">
          <h2 className="text-sm font-semibold text-foreground-950">Invoices</h2>
        </div>
        {customerInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
              <thead>
                <tr className="border-b border-background-200 bg-background-100/40">
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Invoice</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Order</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Date</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Amount</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Due Date</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-200">
                {customerInvoices.map((i) => (
                  <tr key={i.id} className="hover:bg-background-100/50 transition-colors">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => navigate('/billing/invoices')}
                        className="text-[12px] font-semibold text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
                      >
                        {i.id}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{i.order}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{i.date}</td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">{i.amount}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{i.dueDate}</td>
                    <td className="px-4 py-3">
                      <InvoiceStatusBadge status={i.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <i className="ri-inbox-line text-foreground-300 text-3xl leading-none" />
            <p className="mt-3 text-sm font-medium text-foreground-600">No invoices for this customer</p>
          </div>
        )}
      </div>
    </div>
  );
}