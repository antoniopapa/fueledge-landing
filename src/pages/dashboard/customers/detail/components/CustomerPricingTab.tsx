import type { Customer } from '@/mocks/customers';
import { orders } from '@/mocks/orders';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">{label}</p>
      <p className="mt-1 text-[13px] font-semibold text-foreground-900">{value}</p>
    </div>
  );
}

export default function CustomerPricingTab({ customer }: { customer: Customer }) {
  const pricedOrder = orders.find(
    (o) => o.customer === customer.name && o.effectivePrice !== '—',
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Pricing Agreement</p>
          <p className="mt-1 text-[13px] font-semibold text-foreground-900">{customer.pricingAgreement}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Contract</p>
          <p className="mt-1 text-[13px] font-semibold text-foreground-900">{customer.contract}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Credit Limit</p>
          <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{customer.creditLimit}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Credit Status</p>
          <p className="mt-1 text-[13px] font-semibold text-foreground-900">{customer.creditStatus}</p>
        </div>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-background-200">
          <h2 className="text-sm font-semibold text-foreground-950">Product Pricing</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Basis</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Effective Price</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {customer.products.map((p) => (
                <tr key={p} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3 text-[12px] font-medium text-foreground-900 whitespace-nowrap">{p}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{customer.pricingAgreement}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 tabular whitespace-nowrap">
                    {pricedOrder ? pricedOrder.effectivePrice : 'Indexed'}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-500 whitespace-nowrap">
                    {pricedOrder ? pricedOrder.createdAt : 'Contract rate'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}