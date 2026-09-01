import { upcomingDispatches } from '@/pages/dashboard/overview/overviewData';

export default function UpcomingDispatches() {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-background-200 bg-background-100/40">
        <span className="text-[12px] font-semibold text-foreground-900">Upcoming Dispatches</span>
        <span className="text-[11px] font-medium text-primary-700 cursor-pointer whitespace-nowrap hover:text-primary-800">
          Dispatch board
        </span>
      </div>

      <div className="flex-1 divide-y divide-background-200">
        {upcomingDispatches.map((d) => (
          <div key={`${d.route}-${d.time}`} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-primary-700 tabular whitespace-nowrap">{d.time}</span>
              <span className="text-[10px] text-foreground-400 whitespace-nowrap">{d.product}</span>
            </div>
            <p className="mt-1 text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{d.route}</p>
            <p className="mt-0.5 text-[10px] text-foreground-400 whitespace-nowrap">
              {d.driver} · {d.plate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}