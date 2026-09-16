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
  New: 'ÐÐ¾Ð²Ð°',
  'Ready to Source': 'Ð“Ð¾Ñ‚Ð¾Ð²Ð° Ð·Ð° ÑÐ½Ð°Ð±Ð´ÑÐ²Ð°Ð½Ðµ',
  Sourced: 'Ð¡Ð½Ð°Ð±Ð´ÐµÐ½Ð°',
  Scheduled: 'ÐŸÐ»Ð°Ð½Ð¸Ñ€Ð°Ð½Ð°',
  'In Progress': 'Ð’ Ñ…Ð¾Ð´',
  Completed: 'Ð—Ð°Ð²ÑŠÑ€ÑˆÐµÐ½Ð°',
  Cancelled: 'ÐžÑ‚ÐºÐ°Ð·Ð°Ð½Ð°',
};

type RunsTableProps = {
  period?: 'today' | 'week' | 'month';
};

const headingByPeriod: Record<'today' | 'week' | 'month', string> = {
  today: 'Ð”Ð½ÐµÑˆÐ½Ð¸ ÐºÑƒÑ€ÑÐ¾Ð²Ðµ',
  week: 'ÐšÑƒÑ€ÑÐ¾Ð²Ðµ Ñ‚Ð°Ð·Ð¸ ÑÐµÐ´Ð¼Ð¸Ñ†Ð°',
  month: 'ÐšÑƒÑ€ÑÐ¾Ð²Ðµ Ñ‚Ð¾Ð·Ð¸ Ð¼ÐµÑÐµÑ†',
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
          Ð’Ð¸Ð¶ Ð²ÑÐ¸Ñ‡ÐºÐ¸ ÐºÑƒÑ€ÑÐ¾Ð²Ðµ
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-arrow-right-line text-xs leading-none" />
          </span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">ÐŸÐ¾Ñ€ÑŠÑ‡ÐºÐ°</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">ÐœÐ°Ñ€ÑˆÑ€ÑƒÑ‚</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">ÐŸÑ€Ð¾Ð´ÑƒÐºÑ‚</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Ð¨Ð¾Ñ„ÑŒÐ¾Ñ€</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Ð˜Ð·Ñ‚Ð¾Ñ‡Ð½Ð¸Ðº</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Ð¡Ñ‚Ð°Ñ‚ÑƒÑ</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">ÐžÑ‡Ð°ÐºÐ²Ð°Ð½Ð¾</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400 text-right">Ð”Ð¾ÑÑ‚Ð°Ð²Ð½Ð° Ñ†ÐµÐ½Ð°</th>
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
