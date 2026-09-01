import { useNavigate } from 'react-router-dom';
import type { Order } from '@/mocks/orders';

const lifecycle = ['New', 'Ready to Source', 'Sourced', 'Scheduled', 'In Progress', 'Completed'] as const;

export default function OrderOverviewTab({
  order,
  onGotoSourcing,
}: {
  order: Order;
  onGotoSourcing: () => void;
}) {
  const navigate = useNavigate();
  const isCancelled = order.status === 'Cancelled';
  const currentIndex = lifecycle.indexOf(order.status as (typeof lifecycle)[number]);

  return (
    <div className="space-y-4">
      {/* lifecycle stepper */}
      <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
        <h2 className="text-sm font-semibold text-foreground-950 mb-4">Order Progress</h2>
        {isCancelled ? (
          <div className="flex items-center gap-2 rounded-md border border-background-200 bg-background-100 px-4 py-3">
            <i className="ri-close-circle-line text-foreground-400 text-lg leading-none" />
            <span className="text-[13px] font-medium text-foreground-600">
              This order was cancelled before completion.
            </span>
          </div>
        ) : (
          <div className="flex items-center overflow-x-auto">
            {lifecycle.map((step, i) => {
              const done = i < currentIndex;
              const current = i === currentIndex;
              return (
                <div key={step} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold leading-none ${
                        done
                          ? 'bg-accent-500 text-background-50'
                          : current
                            ? 'bg-primary-500 text-background-50 ring-4 ring-primary-500/20'
                            : 'bg-background-200 text-foreground-400'
                      }`}
                    >
                      {done ? <i className="ri-check-line text-[13px] leading-none" /> : i + 1}
                    </span>
                    <span
                      className={`text-[10px] font-medium whitespace-nowrap ${
                        current ? 'text-primary-700' : done ? 'text-foreground-600' : 'text-foreground-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < lifecycle.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 rounded-full ${i < currentIndex ? 'bg-accent-500' : 'bg-background-200'}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* key facts */}
      <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
        <h2 className="text-sm font-semibold text-foreground-950 mb-3">Order Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Customer</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900">{order.customer}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Destination</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900">{order.destination}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Product</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900">{order.product}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Volume</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{order.volume}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Delivery Window</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{order.deliveryWindow}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Source</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900">{order.source}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Margin</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">
              {order.margin === '—' ? '—' : `${order.margin} (${order.marginPct})`}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Assigned Run</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{order.assignedRun ?? '—'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Driver</p>
            {order.driverId ? (
              <button
                type="button"
                onClick={() => navigate(`/drivers/${order.driverId}`)}
                className="mt-1 block text-[13px] font-semibold text-primary-700 hover:underline cursor-pointer"
              >
                {order.driver}
              </button>
            ) : (
              <p className="mt-1 text-[13px] font-semibold text-foreground-900">{order.driver}</p>
            )}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Truck</p>
            {order.truck ? (
              <button
                type="button"
                onClick={() => navigate(`/trucks/${order.truck}`)}
                className="mt-1 block text-[13px] font-semibold text-primary-700 hover:underline cursor-pointer"
              >
                {order.truck}
              </button>
            ) : (
              <p className="mt-1 text-[13px] font-semibold text-foreground-900">—</p>
            )}
          </div>
        </div>
      </div>

      {/* notes & exceptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-2">Notes</h2>
          <p className="text-[13px] text-foreground-700">{order.notes || 'No notes recorded.'}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-2">Exceptions</h2>
          {order.exception ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full text-secondary-700 bg-secondary-100 whitespace-nowrap">
              <i className="ri-alert-line text-[11px] leading-none" />
              {order.exception}
            </span>
          ) : (
            <p className="text-[13px] text-foreground-400">None</p>
          )}
        </div>
      </div>

      {/* sourcing CTA */}
      {order.status === 'Ready to Source' && (
        <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-lg bg-secondary-100 flex items-center justify-center shrink-0">
              <i className="ri-flask-line text-secondary-700 text-lg leading-none" />
            </span>
            <div>
              <p className="text-[13px] font-semibold text-foreground-900">Ready to source</p>
              <p className="text-[12px] text-foreground-500">Compare terminals and lock in the best delivered cost.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onGotoSourcing}
            className="inline-flex items-center gap-1.5 rounded-md bg-secondary-500 hover:bg-secondary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
          >
            Compare Sources
          </button>
        </div>
      )}
    </div>
  );
}