import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { analyticsNav } from '@/pages/dashboard/nav';
import KpiCard from '@/pages/dashboard/analytics/components/KpiCard';
import Panel from '@/pages/dashboard/analytics/components/Panel';
import Bars from '@/pages/dashboard/analytics/components/Bars';
import Columns from '@/pages/dashboard/analytics/components/Columns';
import { operationsMetrics, runsPerDayTrend, delaysByReason, terminalWaitTime } from '@/mocks/analytics';

export default function AnalyticsOperationsPage() {
  return (
    <ModuleShell
      title="Operations Analytics"
      description="Delivery performance, utilization and exception trends."
      icon="ri-truck-line"
      subNav={analyticsNav}
    >
      <div className="flex items-center justify-end mb-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground-500">
          <i className="ri-calendar-line text-sm leading-none" />
          Last 30 days · updated 08:45
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
        {operationsMetrics.map((m) => (
          <KpiCard key={m.label} {...m} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Panel title="Runs per Day" subtitle="Completed runs by day">
          <Columns items={runsPerDayTrend} />
        </Panel>
        <Panel title="Delays & Exception Reasons" subtitle="Count of delayed runs by cause">
          <Bars items={delaysByReason} tone="secondary" />
        </Panel>
      </div>

      <div className="mt-4">
        <Panel title="Terminal Wait Time" subtitle="Average time at terminal before loading">
          <Bars items={terminalWaitTime} tone="accent" />
        </Panel>
      </div>
    </ModuleShell>
  );
}