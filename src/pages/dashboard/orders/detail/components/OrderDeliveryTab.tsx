import { useNavigate } from 'react-router-dom';
import type { Order } from '@/mocks/orders';

const toneDot: Record<string, string> = {
  info: 'bg-primary-500',
  warning: 'bg-secondary-500',
  success: 'bg-accent-500',
  danger: 'bg-red-500',
};

export default function OrderDeliveryTab({ order }: { order: Order }) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* delivery facts */}
      <div className="rounded-lg border border-background-200 bg-background-50 p-4">
        <h2 className="text-sm font-semibold text-foreground-950 mb-3">Delivery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Delivery Status</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900">{order.deliveryStatus ?? 'Not started'}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">ETA</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{order.eta}</p>
          </div>
        </div>
      </div>

      {/* route map */}
      <div className="rounded-lg border border-background-200 overflow-hidden bg-background-100">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-background-200 bg-background-100/40">
          <span className="text-[12px] font-semibold text-foreground-900">Route</span>
          <span className="text-[11px] font-medium text-foreground-400">{order.route}</span>
        </div>
        <div className="relative h-64 md:h-80">
          <iframe
            title={`Order ${order.id} route map`}
            src="https://maps.google.com/maps?q=Europe&z=6&output=embed"
            className="absolute inset-0 w-full h-full border-0 [filter:saturate(0.72)_contrast(1.02)]"
            loading="lazy"
            aria-label={`Route map ${order.route}`}
          />
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute h-[2px] rounded-full bg-primary-500 opacity-60 origin-left"
              style={{ left: '20%', top: '38%', width: '30%', transform: 'rotate(18deg)' }}
            />
            <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: '20%', top: '38%' }}>
              <span className="w-2.5 h-2.5 rounded-full bg-primary-500 ring-2 ring-background-50" />
              <span className="mt-0.5 text-[8px] font-semibold text-foreground-700 bg-background-50/90 px-1 rounded whitespace-nowrap leading-tight">
                {order.pickup}
              </span>
            </div>
            <div className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center ring-2 ring-background-50" style={{ left: '50%', top: '50%' }}>
              <i className="ri-truck-line text-background-50 text-[9px] leading-none" />
            </div>
            <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: '76%', top: '62%' }}>
              <span className="w-3 h-3 rounded-full bg-accent-500 ring-4 ring-accent-500/25" />
              <span className="mt-1 text-[8px] font-bold text-foreground-900 bg-background-50 px-1 rounded whitespace-nowrap leading-tight">
                {order.destination}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* activity mini-timeline */}
      <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
        <h2 className="text-sm font-semibold text-foreground-950 mb-4">Delivery Timeline</h2>
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-background-200" />
          <ul className="space-y-4">
            {order.activity.map((ev, i) => (
              <li key={i} className="relative flex items-start gap-3 pl-6">
                <span className={`absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full ${toneDot[ev.tone]}`} />
                <div>
                  <span className="text-[13px] text-foreground-800">{ev.label}</span>
                  <span className="ml-2 text-[11px] text-foreground-400">{ev.actor} · {ev.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}