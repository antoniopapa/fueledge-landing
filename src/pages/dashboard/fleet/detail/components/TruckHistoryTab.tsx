import { useNavigate } from 'react-router-dom';
import type { Truck } from '@/mocks/fleet';
import { orders } from '@/mocks/orders';

export default function TruckHistoryTab({ truck }: { truck: Truck }) {
  const navigate = useNavigate();
  const history = orders.filter((o) => o.truck === truck.plate);

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-background-200">
        <div>
          <h2 className="text-sm font-semibold text-foreground-950">Run History</h2>
          <p className="text-[11px] text-foreground-400">{history.length} runs for this truck</p>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[840px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Order</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Route</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Volume</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Driver</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Delivered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {history.map((o) => (
                <tr key={o.id} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${o.id}`)}
                      className="text-[12px] font-semibold text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
                    >
                      #{o.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{o.route}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{o.product}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{o.volume}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{o.driver}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        o.status === 'Completed' ? 'text-accent-700 bg-accent-100' : 'text-primary-700 bg-primary-100'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{o.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <i className="ri-inbox-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">No runs on record</p>
          <p className="text-xs text-foreground-400 mt-1">This truck has not completed any runs yet.</p>
        </div>
      )}
    </div>
  );
}