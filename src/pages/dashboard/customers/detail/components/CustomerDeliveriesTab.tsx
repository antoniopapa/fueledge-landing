import { useNavigate } from 'react-router-dom';
import type { Customer } from '@/mocks/customers';
import { deliveries } from '@/mocks/deliveries';
import DeliveryStatusBadge from '@/pages/dashboard/deliveries/components/DeliveryStatusBadge';

export default function CustomerDeliveriesTab({ customer }: { customer: Customer }) {
  const navigate = useNavigate();
  const customerDeliveries = deliveries.filter((d) => d.customer === customer.name);

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-background-200">
        <h2 className="text-sm font-semibold text-foreground-950">Deliveries</h2>
        <p className="text-[11px] text-foreground-400">{customerDeliveries.length} delivery{customerDeliveries.length === 1 ? '' : 'ies'}</p>
      </div>
      {customerDeliveries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[880px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Delivery</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Route</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Volume</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Truck</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Driver</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {customerDeliveries.map((d) => (
                <tr key={d.id} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/deliveries/${d.id}`)}
                      className="text-[12px] font-semibold text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
                    >
                      #{d.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{d.route}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{d.product}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{d.volume}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{d.truck}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{d.driver}</td>
                  <td className="px-4 py-3">
                    <DeliveryStatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{d.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <i className="ri-inbox-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">No deliveries for this customer</p>
        </div>
      )}
    </div>
  );
}