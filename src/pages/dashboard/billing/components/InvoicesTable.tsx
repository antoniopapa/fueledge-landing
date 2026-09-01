import { useNavigate } from 'react-router-dom';
import type { Invoice } from '@/mocks/billing';
import InvoiceStatusBadge from './InvoiceStatusBadge';

export default function InvoicesTable({ rows }: { rows: Invoice[] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Invoice #</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Customer</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Order</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Date</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Amount</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Due Date</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Accounting Sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {rows.map((i) => (
              <tr key={i.id} className="hover:bg-background-100/50 transition-colors">
                <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{i.id}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{i.customer}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${i.order.replace('#', '')}`)}
                    className="text-[12px] text-foreground-700 hover:underline whitespace-nowrap cursor-pointer"
                  >
                    {i.order}
                  </button>
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{i.date}</td>
                <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">{i.amount}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{i.dueDate}</td>
                <td className="px-4 py-3">
                  <InvoiceStatusBadge status={i.status} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap ${
                      i.accountingSync === 'Synced'
                        ? 'text-accent-700'
                        : i.accountingSync === 'Failed'
                          ? 'text-secondary-700'
                          : 'text-foreground-500'
                    }`}
                  >
                    <i
                      className={`${
                        i.accountingSync === 'Synced'
                          ? 'ri-checkbox-circle-line'
                          : i.accountingSync === 'Failed'
                            ? 'ri-error-warning-line'
                            : 'ri-time-line'
                      } text-[13px] leading-none`}
                    />
                    {i.accountingSync}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}