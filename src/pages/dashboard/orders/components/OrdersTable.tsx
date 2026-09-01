import { useNavigate } from 'react-router-dom';
import type { Order } from '@/mocks/orders';
import OrderStatusBadge from './OrderStatusBadge';

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1120px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Order</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Customer</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Destination</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Volume</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Delivery window</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Source</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400 text-right">Margin</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Assigned run</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {orders.map((o) => (
              <tr
                key={o.id}
                onClick={() => navigate(`/orders/${o.id}`)}
                className="hover:bg-background-100/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/${o.id}`);
                    }}
                    className="text-[12px] font-semibold text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
                  >
                    #{o.id}
                  </button>
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground-800 whitespace-nowrap">{o.customer}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{o.destination}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{o.product}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{o.volume}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-500 tabular whitespace-nowrap">{o.deliveryWindow}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{o.source}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular text-right whitespace-nowrap">
                  {o.margin}
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground-500 tabular whitespace-nowrap">
                  {o.assignedRun ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}