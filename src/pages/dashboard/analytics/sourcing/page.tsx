import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { analyticsNav } from '@/pages/dashboard/nav';
import KpiCard from '@/pages/dashboard/analytics/components/KpiCard';
import Panel from '@/pages/dashboard/analytics/components/Panel';
import Bars from '@/pages/dashboard/analytics/components/Bars';
import Columns from '@/pages/dashboard/analytics/components/Columns';
import Donut from '@/pages/dashboard/analytics/components/Donut';
import {
  sourcingMetrics,
  overrideReasons,
  spendBySupplier,
  volumeBySupplier,
  volumeByTerminal,
  priceTrend,
  allocationUtilization,
} from '@/mocks/analytics';

export default function AnalyticsSourcingPage() {
  return (
    <ModuleShell
      title="Sourcing Analytics"
      description="Sourcing performance, savings and supplier allocation."
      icon="ri-flask-line"
      subNav={analyticsNav}
    >
      <div className="flex items-center justify-end mb-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground-500">
          <i className="ri-calendar-line text-sm leading-none" />
          Last 30 days · updated 08:45
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sourcingMetrics.map((m) => (
          <KpiCard key={m.label} {...m} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Spend by Supplier" subtitle="Purchase spend (€)">
          <Bars items={spendBySupplier} tone="primary" />
        </Panel>
        <Panel title="Volume by Supplier" subtitle="Lifted volume (litres)">
          <Bars items={volumeBySupplier} tone="accent" />
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <Panel title="Volume by Terminal" subtitle="Lifted volume (litres)">
            <Bars items={volumeByTerminal} tone="secondary" />
          </Panel>
        </div>
        <Panel title="Override Reasons" subtitle="Why recommendations were overridden">
          <Donut segments={overrideReasons} centerLabel="Overrides" centerValue="18%" />
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Price Trend" subtitle="Diesel EN590 effective price (€/L)">
          <Columns items={priceTrend} />
        </Panel>
        <Panel title="Allocation Utilization" subtitle="Contracted allocation used">
          <Bars items={allocationUtilization} tone="accent" />
        </Panel>
      </div>
    </ModuleShell>
  );
}