import { activeDeliveriesList } from '@/pages/dashboard/overview/overviewData';
import type { DeliveryStatus } from '@/mocks/deliveries';

const statusStyle: Record<DeliveryStatus, string> = {
  'Heading to Terminal': 'text-secondary-700 bg-secondary-100',
  Waiting: 'text-secondary-700 bg-secondary-100',
  Loading: 'text-secondary-700 bg-secondary-100',
  'In Transit': 'text-primary-700 bg-primary-100',
  'At Customer': 'text-accent-700 bg-accent-100',
  Delivering: 'text-accent-700 bg-accent-100',
  Completed: 'text-accent-700 bg-accent-100',
};

const iconStyle: Record<DeliveryStatus, string> = {
  'Heading to Terminal': 'bg-secondary-100 text-secondary-700',
  Waiting: 'bg-secondary-100 text-secondary-700',
  Loading: 'bg-secondary-100 text-secondary-700',
  'In Transit': 'bg-primary-100 text-primary-700',
  'At Customer': 'bg-accent-100 text-accent-700',
  Delivering: 'bg-accent-100 text-accent-700',
  Completed: 'bg-accent-100 text-accent-700',
};

const statusIcon: Record<DeliveryStatus, string> = {
  'Heading to Terminal': 'ri-route-line',
  Waiting: 'ri-time-line',
  Loading: 'ri-loader-4-line',
  'In Transit': 'ri-truck-line',
  'At Customer': 'ri-home-4-line',
  Delivering: 'ri-drop-line',
  Completed: 'ri-check-double-line',
};

const statusLabel: Record<DeliveryStatus, string> = {
  'Heading to Terminal': 'Към терминал',
  Waiting: 'Изчаква',
  Loading: 'Товарене',
  'In Transit': 'В движение',
  'At Customer': 'При клиент',
  Delivering: 'Разтоварване',
  Completed: 'Завършена',
};

export default function Deliveries() {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-background-200 bg-background-100/40">
        <span className="text-[12px] font-semibold text-foreground-900">Активни доставки</span>
        <span className="text-[11px] font-medium text-primary-700 cursor-pointer whitespace-nowrap">Виж всички</span>
      </div>
      <div className="divide-y divide-background-200">
        {activeDeliveriesList.map((d) => (
          <div key={d.route} className="flex items-center gap-3 px-4 py-2.5">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconStyle[d.status]}`}>
              <i className={`${statusIcon[d.status]} text-[15px] leading-none`} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-foreground-900 leading-tight whitespace-nowrap">
                {d.route}
              </p>
              <p className="text-[10px] text-foreground-400">
                {d.driver} · {d.plate}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className={`inline-block text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[d.status]}`}>
                {statusLabel[d.status]}
              </span>
              <p className="mt-1 text-[10px] text-foreground-400 tabular">Очаквано {d.eta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
