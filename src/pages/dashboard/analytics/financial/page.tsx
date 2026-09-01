import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { analyticsNav } from '@/pages/dashboard/nav';
import KpiCard from '@/pages/dashboard/analytics/components/KpiCard';
import Panel from '@/pages/dashboard/analytics/components/Panel';
import Bars from '@/pages/dashboard/analytics/components/Bars';
import Columns from '@/pages/dashboard/analytics/components/Columns';
import {
  financialMetrics,
  revenueTrend,
  marginByCustomer,
  marginByProduct,
  marginByTerminal,
} from '@/mocks/analytics';

export default function AnalyticsFinancialPage() {
  return (
    <ModuleShell
      title="Financial Analytics"
      description="Revenue, cost and margin breakdowns across your business."
      icon="ri-funds-line"
      subNav={analyticsNav}
    >
      <div className="flex items-center justify-end mb-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground-500">
          <i className="ri-calendar-line text-sm leading-none" />
          Last 30 days · updated 08:45
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {financialMetrics.map((m) => (
          <KpiCard key={m.label} {...m} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Revenue Trend" subtitle="Revenue per day (€k)">
          <Columns items={revenueTrend} unit="k" />
        </Panel>
        <Panel title="Margin by Product" subtitle="Gross margin (€)">
          <Bars items={marginByProduct} tone="primary" />
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Margin by Customer" subtitle="Gross margin (€)">
          <Bars items={marginByCustomer} tone="accent" />
        </Panel>
        <Panel title="Margin by Terminal" subtitle="Gross margin (€)">
          <Bars items={marginByTerminal} tone="secondary" />
        </Panel>
      </div>
    </ModuleShell>
  );
}