import type { Order } from '@/mocks/orders';

function PriceRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px] text-foreground-500">{label}</span>
      <span className={`text-[13px] tabular ${accent ? 'font-bold text-foreground-950' : 'font-medium text-foreground-800'}`}>
        {value}
      </span>
    </div>
  );
}

export default function OrderPricingTab({ order }: { order: Order }) {
  const hasPricing = order.basePrice !== '—';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
        <h2 className="text-sm font-semibold text-foreground-950 mb-2">Price Breakdown</h2>
        {hasPricing ? (
          <div className="divide-y divide-background-100">
            <PriceRow label="Base price" value={`${order.basePrice} /L`} />
            <PriceRow label="Contract adjustment" value={order.contractAdjustment} />
            <PriceRow label="Effective price" value={`${order.effectivePrice} /L`} accent />
            <PriceRow label="Delivered cost" value={order.deliveredCost} />
          </div>
        ) : (
          <p className="text-[13px] text-foreground-500">
            Pricing is populated once a source terminal has been selected.
          </p>
        )}
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
        <h2 className="text-sm font-semibold text-foreground-950 mb-2">Margin</h2>
        {order.margin !== '—' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md bg-accent-50 border border-accent-200 px-4 py-3">
              <span className="text-[13px] font-medium text-foreground-700">Gross margin</span>
              <span className="text-lg font-bold text-accent-700 tabular">{order.margin}</span>
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-[13px] text-foreground-500">Margin rate</span>
              <span className="text-[13px] font-semibold text-foreground-900 tabular">{order.marginPct}</span>
            </div>
            <div className="flex items-center justify-between px-1">
              <span className="text-[13px] text-foreground-500">Delivered cost</span>
              <span className="text-[13px] font-semibold text-foreground-900 tabular">{order.deliveredCost}</span>
            </div>
          </div>
        ) : (
          <p className="text-[13px] text-foreground-500">Margin is calculated once the order is sourced and delivered.</p>
        )}
      </div>
    </div>
  );
}