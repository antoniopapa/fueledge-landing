import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import TruckHeader from '@/pages/dashboard/fleet/detail/components/TruckHeader';
import TruckOverviewTab from '@/pages/dashboard/fleet/detail/components/TruckOverviewTab';
import TruckMaintenanceTab from '@/pages/dashboard/fleet/detail/components/TruckMaintenanceTab';
import TruckHistoryTab from '@/pages/dashboard/fleet/detail/components/TruckHistoryTab';
import TruckScheduleTab from '@/pages/dashboard/fleet/detail/components/TruckScheduleTab';
import TruckCompartmentsTab from '@/pages/dashboard/fleet/detail/components/TruckCompartmentsTab';
import { trucks } from '@/mocks/fleet';

type TabKey = 'overview' | 'schedule' | 'compartments' | 'history' | 'maintenance';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'compartments', label: 'Compartments' },
  { key: 'history', label: 'Run History' },
  { key: 'maintenance', label: 'Maintenance' },
];

export default function TruckDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState<TabKey>('overview');
  const truck = trucks.find((t) => t.id === id);

  if (!truck) {
    return (
      <DashboardShell>
        <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-16 text-center">
          <i className="ri-truck-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">Truck not found</p>
          <Link
            to="/trucks"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-line text-sm leading-none" />
            Back to trucks
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <TruckHeader truck={truck} />

      <div className="mt-4 flex items-center gap-1 border-b border-background-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              tab === t.key ? 'text-primary-700' : 'text-foreground-500 hover:text-foreground-900'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute left-3 right-3 bottom-0 h-0.5 rounded-full bg-primary-500" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'overview' && <TruckOverviewTab truck={truck} />}
        {tab === 'schedule' && <TruckScheduleTab truck={truck} />}
        {tab === 'compartments' && <TruckCompartmentsTab truck={truck} />}
        {tab === 'history' && <TruckHistoryTab truck={truck} />}
        {tab === 'maintenance' && <TruckMaintenanceTab truck={truck} />}
      </div>
    </DashboardShell>
  );
}