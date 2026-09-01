import { useNavigate } from 'react-router-dom';
import type { ReadyToInvoiceItem } from '@/mocks/billing';

interface Props {
  rows: ReadyToInvoiceItem[];
  onAction: (label: string) => void;
}

export default function ReadyToInvoiceTable({ rows, onAction }: Props) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1120px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Customer</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Order</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Delivery</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Delivered Volume</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Purchase Cost</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Freight</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Customer Price</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Gross Margin</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Documents</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-background-100/50 transition-colors">
                <td className="px-4 py-3 text-[12px] font-medium text-foreground-800 whitespace-nowrap">{r.customer}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/orders/${r.id}`)}
                    className="text-[12px] font-semibold text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
                  >
                    {r.order}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/deliveries/${r.id}`)}
                    className="text-[12px] text-foreground-700 hover:underline whitespace-nowrap cursor-pointer"
                  >
                    {r.delivery}
                  </button>
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{r.deliveredVolume}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{r.purchaseCost}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{r.freight}</td>
                <td className="px-4 py-3 text-[12px] font-medium text-foreground-800 tabular whitespace-nowrap">{r.customerPrice}</td>
                <td className="px-4 py-3 text-[12px] font-semibold text-accent-700 tabular whitespace-nowrap">{r.grossMargin}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-500 whitespace-nowrap">{r.documents}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onAction(`Invoice generated for ${r.customer}`)}
                      className="inline-flex items-center gap-1 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-[11px] font-semibold px-2.5 py-1.5 whitespace-nowrap cursor-pointer transition-colors"
                    >
                      <i className="ri-file-add-line text-[12px] leading-none" />
                      Invoice
                    </button>
                    <button
                      type="button"
                      onClick={() => onAction(`Sent to accounting for ${r.customer}`)}
                      className="inline-flex items-center gap-1 rounded-md border border-background-200 bg-background-50 hover:bg-background-100 text-foreground-700 text-[11px] font-medium px-2.5 py-1.5 whitespace-nowrap cursor-pointer transition-colors"
                    >
                      <i className="ri-send-plane-line text-[12px] leading-none" />
                      Accounting
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}