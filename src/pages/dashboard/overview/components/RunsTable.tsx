import { runRows, runSummary } from '@/pages/dashboard/overview/overviewData';
import type { OrderStatus } from '@/mocks/orders';

const statusStyle: Record<OrderStatus, string> = {
  New: 'text-secondary-700 bg-secondary-100',
  'Ready to Source': 'text-secondary-700 bg-secondary-100',
  Sourced: 'text-secondary-700 bg-secondary-100',
  Scheduled: 'text-primary-700 bg-primary-100',
  'In Progress': 'text-primary-700 bg-primary-100',
  Completed: 'text-accent-700 bg-accent-100',
  Cancelled: 'text-red-600 bg-red-100',
};

const statusLabel: Record<OrderStatus, string> = {
  New: 'Нова',
  'Ready to Source': 'Готова за снабдяване',
  Sourced: 'Снабдена',
  Scheduled: 'Планирана',
  'In Progress': 'В ход',
  Completed: 'Завършена',
  Cancelled: 'Отказана',
};

type RunsTableProps = {
  period?: 'today' | 'week' | 'month';
};

const headingByPeriod: Record<'today' | 'week' | 'month', string> = {
  today: 'Днешни курсове',
  week: 'Курсове тази седмица',
  month: 'Курсове този месец',
};

export default function RunsTable({ period = 'today' }: RunsTableProps) {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-background-200">
        <div>
          <h2 className="text-sm font-semibold text-foreground-950">{headingByPeriod[period]}</h2>
          <p className="text-[11px] text-foreground-400">
            {runSummary.open} отворени · {runSummary.awaitingSource} чакат снабдяване
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-700 cursor-pointer whitespace-nowrap">
          Виж всички курсове
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-arrow-right-line text-xs leading-none" />
          </span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Поръчка</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Маршрут</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Продукт</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Шофьор</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Източник</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Статус</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Очаквано</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400 text-right">Доставна цена</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {runRows.map((row) => (
              <tr key={row.id} className="hover:bg-background-100/50 transition-colors">
                <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{row.id}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{row.route}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{row.product}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{row.driver}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{row.source}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[row.status]}`}>
                    {statusLabel[row.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{row.eta}</td>
                <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular text-right whitespace-nowrap">{row.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
