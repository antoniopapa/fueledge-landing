import { useState } from 'react';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import StatCards from './components/StatCards';
import AvailabilityStrip from './components/AvailabilityStrip';
import OperationsMap from './components/OperationsMap';
import ActionQueue from './components/ActionQueue';
import LiveRuns from './components/LiveRuns';
import Deliveries from './components/Deliveries';
import UpcomingDispatches from './components/UpcomingDispatches';
import SourcingOpportunities from './components/SourcingOpportunities';
import RunsTable from './components/RunsTable';

type OverviewPeriod = 'today' | 'week' | 'month';

const periodOptions: { key: OverviewPeriod; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

export default function OverviewPage() {
  const [period, setPeriod] = useState<OverviewPeriod>('today');

  return (
    <DashboardShell>
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl font-bold text-foreground-950">Overview</h1>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Live
            </span>
          </div>
          <p className="text-sm text-foreground-500">
            What needs your attention right now, and what's moving.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full border border-background-200 bg-background-50 px-1 py-1">
            {periodOptions.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  period === p.key
                    ? 'bg-primary-500 text-background-50'
                    : 'text-foreground-600 hover:text-foreground-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* action queue — the dispatcher's top priority */}
      <ActionQueue />

      {/* live runs — glanceable, no need to open each one */}
      <div className="mt-4">
        <LiveRuns />
      </div>

      {/* fleet & driver availability */}
      <div className="mt-4">
        <AvailabilityStrip />
      </div>

      {/* live operations map */}
      <div className="mt-4">
        <OperationsMap />
      </div>

      {/* primary KPIs */}
      <div className="mt-4">
        <StatCards />
      </div>

      {/* three operational columns */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Deliveries />
        <UpcomingDispatches />
        <SourcingOpportunities />
      </div>

      {/* runs table */}
      <div className="mt-4">
        <RunsTable period={period} />
      </div>
    </DashboardShell>
  );
}