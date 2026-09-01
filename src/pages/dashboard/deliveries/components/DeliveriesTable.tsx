import { useNavigate } from 'react-router-dom';
import type { Delivery } from '@/mocks/deliveries';
import DeliveryStatusBadge from './DeliveryStatusBadge';

export default function DeliveriesTable({ deliveries }: { deliveries: Delivery[] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1040px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Delivery</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Customer</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Route</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Volume</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Driver</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Truck</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {deliveries.map((d) => (
              <tr
                key={d.id}
                onClick={() => navigate(`/deliveries/${d.id}`)}
                className="hover:bg-background-100/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/deliveries/${d.id}`);
                    }}
                    className="text-[12px] font-semibold text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
                  >
                    {d.order}
                  </button>
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground-800 whitespace-nowrap">{d.customer}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{d.route}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{d.product}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{d.volume}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{d.driver}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{d.truck}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <DeliveryStatusBadge status={d.status} />
                    {d.exception && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full text-secondary-700 bg-secondary-100 whitespace-nowrap">
                        <i className="ri-alert-line text-[9px] leading-none" />
                        {d.exception}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{d.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}