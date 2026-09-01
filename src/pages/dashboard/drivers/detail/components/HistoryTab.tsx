import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Driver, DeliveryRecord } from '@/mocks/drivers';

const podStyle: Record<DeliveryRecord['pod'], string> = {
  Signed: 'text-accent-700 bg-accent-100',
  Pending: 'text-secondary-700 bg-secondary-100',
  Exception: 'text-red-600 bg-red-100',
};

export default function HistoryTab({ driver }: { driver: Driver }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-background-200">
        <div>
          <h2 className="text-sm font-semibold text-foreground-950">Delivery History</h2>
          <p className="text-[11px] text-foreground-400">{driver.history.length} deliveries · last 7 days</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[880px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Date</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Order</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Route</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Truck</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Volume</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Delivery Time</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {driver.history.map((rec) => {
              const isOpen = expanded === rec.order;
              return (
                <FragmentRow
                  key={rec.order}
                  rec={rec}
                  isOpen={isOpen}
                  onToggle={() => setExpanded(isOpen ? null : rec.order)}
                  onOrder={() => navigate(`/orders/${rec.order.replace('#', '')}`)}
                  onTruck={() => navigate(`/trucks/${rec.truck}`)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FragmentRow({
  rec,
  isOpen,
  onToggle,
  onOrder,
  onTruck,
}: {
  rec: DeliveryRecord;
  isOpen: boolean;
  onToggle: () => void;
  onOrder: () => void;
  onTruck: () => void;
}) {
  return (
    <>
      <tr onClick={onToggle} className="hover:bg-background-100/50 transition-colors cursor-pointer">
        <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{rec.date}</td>
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOrder();
            }}
            className="text-[12px] font-semibold text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
          >
            {rec.order}
          </button>
        </td>
        <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{rec.route}</td>
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTruck();
            }}
            className="text-[12px] font-medium text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
          >
            {rec.truck}
          </button>
        </td>
        <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{rec.product}</td>
        <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{rec.volume}</td>
        <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{rec.deliveryTime}</td>
        <td className="px-4 py-3">
          <span
            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
              rec.status === 'Completed' ? 'text-accent-700 bg-accent-100' : 'text-secondary-700 bg-secondary-100'
            }`}
          >
            {rec.status}
            {rec.statusDetail ? ` ${rec.statusDetail}` : ''}
          </span>
        </td>
        <td className="px-2 py-3 text-foreground-400">
          <i className={`ri-arrow-down-s-line text-[14px] leading-none transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </td>
      </tr>

      {isOpen && (
        <tr className="bg-background-100/30">
          <td colSpan={9} className="px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Proof of Delivery</p>
                <span className={`mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${podStyle[rec.pod]}`}>
                  {rec.pod}
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">BOL</p>
                <p className="mt-1.5 text-[12px] font-semibold text-foreground-900">{rec.bol}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Customer Signature</p>
                <p className="mt-1.5 text-[12px] text-foreground-700">{rec.signature}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Delivered Quantity</p>
                <p className="mt-1.5 text-[12px] font-semibold text-foreground-900 tabular">{rec.deliveredQty}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Driver Notes</p>
                <p className="mt-1.5 text-[12px] text-foreground-700">{rec.notes || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Exceptions</p>
                {rec.exception ? (
                  <span className="mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full text-secondary-700 bg-secondary-100">
                    {rec.exception}
                  </span>
                ) : (
                  <p className="mt-1.5 text-[12px] text-foreground-400">None</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}