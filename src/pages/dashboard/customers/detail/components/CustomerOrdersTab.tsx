import { useNavigate } from 'react-router-dom';
import type { Customer } from '@/mocks/customers';
import { orders } from '@/mocks/orders';
import OrderStatusBadge from '@/pages/dashboard/orders/components/OrderStatusBadge';

export default function CustomerOrdersTab({ customer }: { customer: Customer }) {
  const navigate = useNavigate();
  const customerOrders = orders.filter((o) => o.customer === customer.name);

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-background-200">
        <h2 className="text-sm font-semibold text-foreground-950">Orders</h2>
        <p className="text-[11px] text-foreground-400">{customerOrders.length} order{customerOrders.length === 1 ? '' : 's'}</p>
      </div>
      {customerOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[820px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Order</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Route</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Volume</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">ETA</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {customerOrders.map((o) => (
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
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{o.eta}</td>
                  <td className="px-4 py-3 text-[12px] font-medium text-foreground-800 tabular whitespace-nowrap">{o.margin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <i className="ri-inbox-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">No orders for this customer</p>
        </div>
      )}
    </div>
  );
}