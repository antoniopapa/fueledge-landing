import type { Order } from '@/mocks/orders';

const toneDot: Record<string, string> = {
  info: 'bg-primary-500',
  warning: 'bg-secondary-500',
  success: 'bg-accent-500',
  danger: 'bg-red-500',
};

export default function OrderActivityTab({ order }: { order: Order }) {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
      <h2 className="text-sm font-semibold text-foreground-950 mb-4">Activity</h2>
      <div className="relative">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-background-200" />
        <ul className="space-y-5">
          {order.activity.map((ev, i) => (
            <li key={i} className="relative flex items-start gap-3 pl-6">
              <span className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full ${toneDot[ev.tone]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-[13px] font-medium text-foreground-900">{ev.label}</p>
                  <span className="text-[11px] text-foreground-400 tabular whitespace-nowrap">{ev.time}</span>
                </div>
                <p className="text-[12px] text-foreground-500 mt-0.5">{ev.actor}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}