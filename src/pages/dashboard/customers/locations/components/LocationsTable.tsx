import { useNavigate } from 'react-router-dom';
import type { Customer, CustomerLocation } from '@/mocks/customers';

export interface LocationRow extends CustomerLocation {
  customer: string;
  customerId: string;
}

export default function LocationsTable({ rows }: { rows: LocationRow[] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1040px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Location</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Address</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Products</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Delivery Window</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Tanks</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Last Delivery</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Next Delivery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {rows.map((l) => (
              <tr
                key={l.id}
                onClick={() => navigate(`/customers/locations/${l.id}`)}
                className="hover:bg-background-100/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-md bg-background-200 flex items-center justify-center shrink-0">
                      <i className="ri-map-pin-2-line text-foreground-500 text-[15px] leading-none" />
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{l.name}</p>
                      <p className="text-[10px] text-foreground-400 whitespace-nowrap">{l.customer}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <p className="text-[12px] text-foreground-700 whitespace-nowrap">{l.address}</p>
                  <p className="text-[10px] text-foreground-400 whitespace-nowrap">
                    {l.city}, {l.country}
                  </p>
                </td>

                <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{l.products.join(' · ')}</td>

                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{l.deliveryWindow}</td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-foreground-600 whitespace-nowrap">
                    <i className="ri-database-2-line text-foreground-400 text-[13px]" />
                    {l.tanks.length}
                  </span>
                </td>

                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{l.lastDelivery}</td>

                <td className="px-4 py-3 text-[12px] font-medium text-primary-700 whitespace-nowrap">{l.nextDelivery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}