import { useNavigate } from 'react-router-dom';
import type { Reconciliation } from '@/mocks/billing';
import ReconciliationStatusBadge from './ReconciliationStatusBadge';

export default function ReconciliationTable({ rows }: { rows: Reconciliation[] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1120px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Run</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Customer</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Supplier</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Terminal</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Loaded</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Delivered</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Purchase Cost</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Freight</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Customer Price</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Documents</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-background-100/50 transition-colors">
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/deliveries/${r.id}`)}
                    className="text-[12px] font-semibold text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
                  >
                    {r.run}
                  </button>
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{r.customer}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{r.supplier}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{r.terminal}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{r.loadedQty}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{r.deliveredQty}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{r.purchaseCost}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{r.freight}</td>
                <td className="px-4 py-3 text-[12px] font-medium text-foreground-800 tabular whitespace-nowrap">{r.customerPrice}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-500 whitespace-nowrap">{r.documents}</td>
                <td className="px-4 py-3">
                  <ReconciliationStatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}