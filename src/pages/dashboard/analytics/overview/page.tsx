import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { analyticsNav } from '@/pages/dashboard/nav';
import KpiCard from '@/pages/dashboard/analytics/components/KpiCard';
import Panel from '@/pages/dashboard/analytics/components/Panel';
import ComboChart from '@/pages/dashboard/analytics/components/ComboChart';
import ProductMixPanel from '@/pages/dashboard/analytics/components/ProductMixPanel';
import {
  overviewPrimaryMetrics,
  overviewSecondaryMetrics,
  overviewCombo,
  overviewProductMix,
} from '@/mocks/analytics';

export default function AnalyticsOverviewPage() {
  return (
    <ModuleShell
      title="Analytics"
      description="Operational and financial insights across your fuel operations."
      icon="ri-bar-chart-line"
      subNav={analyticsNav}
    >
      {/* period badge */}
      <div className="flex items-center justify-end mb-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground-500">
          <i className="ri-calendar-line text-sm leading-none" />
          Last 30 days · updated 08:45
        </span>
      </div>

      {/* primary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {overviewPrimaryMetrics.map((m) => (
          <KpiCard key={m.label} {...m} emphasized />
        ))}
      </div>

      {/* secondary KPIs */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {overviewSecondaryMetrics.map((m) => (
          <KpiCard key={m.label} {...m} />
        ))}
      </div>

      {/* charts */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <Panel
            title="Delivered Volume & Margin"
            subtitle="Volume per day (kL) with gross margin per litre overlaid · click a day to inspect"
          >
            <ComboChart items={overviewCombo} />
          </Panel>
        </div>
        <ProductMixPanel items={overviewProductMix} />
      </div>
    </ModuleShell>
  );
}