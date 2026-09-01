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

type RunsTableProps = {
  period?: 'today' | 'week' | 'month';
};

const headingByPeriod: Record<'today' | 'week' | 'month', string> = {
  today: "Today's Runs",
  week: "This Week's Runs",
  month: "This Month's Runs",
};

export default function RunsTable({ period = 'today' }: RunsTableProps) {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-background-200">
        <div>
          <h2 className="text-sm font-semibold text-foreground-950">{headingByPeriod[period]}</h2>
          <p className="text-[11px] text-foreground-400">
            {runSummary.open} open · {runSummary.awaitingSource} awaiting source
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-700 cursor-pointer whitespace-nowrap">
          View all runs
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-arrow-right-line text-xs leading-none" />
          </span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Order</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Route</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Driver</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Source</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">ETA</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400 text-right">Delivered Cost</th>
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
                    {row.status}
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