import { Link } from 'react-router-dom';
import { sourcingOpportunitiesList } from '@/pages/dashboard/overview/overviewData';

export default function SourcingOpportunities() {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-background-200 bg-background-100/40">
        <span className="text-[12px] font-semibold text-foreground-900">Sourcing Opportunities</span>
        <Link
          to="/sourcing"
          className="text-[11px] font-medium text-primary-700 whitespace-nowrap hover:text-primary-800"
        >
          Open Sourcing
        </Link>
      </div>

      <div className="flex-1 divide-y divide-background-200">
        {sourcingOpportunitiesList.map((s) => (
          <div key={s.order} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-foreground-900 whitespace-nowrap">{s.order}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-700 whitespace-nowrap">
                <i className="ri-arrow-down-line text-[10px]" />
                {s.saving}
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-foreground-700 whitespace-nowrap">{s.route}</p>
            <p className="mt-0.5 text-[10px] text-foreground-400 whitespace-nowrap">{s.volume}</p>
          </div>
        ))}
      </div>
    </div>
  );
}