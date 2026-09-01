import { useNavigate } from 'react-router-dom';
import type { Customer } from '@/mocks/customers';
import CustomerStatusBadge from './CustomerStatusBadge';

export default function CustomersTable({ customers }: { customers: Customer[] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1120px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Customer</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Account Status</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Locations</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Products</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Pricing / Contract</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Open Orders</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Billing</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Last Delivery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {customers.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigate(`/customers/${c.id}`)}
                className="hover:bg-background-100/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-md bg-background-200 flex items-center justify-center shrink-0">
                      <i className="ri-team-line text-foreground-500 text-[15px] leading-none" />
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{c.name}</p>
                      <p className="text-[10px] text-foreground-400 whitespace-nowrap">{c.type}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <CustomerStatusBadge status={c.accountStatus} />
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-foreground-600 whitespace-nowrap">
                    <i className="ri-map-pin-line text-foreground-400 text-[13px]" />
                    {c.locations.length}
                  </span>
                </td>

                <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{c.products.join(' · ')}</td>

                <td className="px-4 py-3">
                  <p className="text-[12px] font-medium text-foreground-800 whitespace-nowrap">{c.pricingAgreement}</p>
                  <p className="text-[10px] text-foreground-400 whitespace-nowrap">{c.contract}</p>
                </td>

                <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">
                  {c.openOrders}
                </td>

                <td className="px-4 py-3">
                  <p
                    className={`text-[12px] font-semibold tabular whitespace-nowrap ${
                      c.accountStatus === 'Credit Warning' ? 'text-secondary-700' : 'text-foreground-800'
                    }`}
                  >
                    {c.outstandingBalance}
                  </p>
                  <p className="text-[10px] text-foreground-400 whitespace-nowrap">{c.billingStatus}</p>
                </td>

                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{c.lastDelivery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}