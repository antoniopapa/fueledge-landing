import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import DriverHeader from '@/pages/dashboard/drivers/detail/components/DriverHeader';
import OverviewTab from '@/pages/dashboard/drivers/detail/components/OverviewTab';
import ScheduleTab from '@/pages/dashboard/drivers/detail/components/ScheduleTab';
import HistoryTab from '@/pages/dashboard/drivers/detail/components/HistoryTab';
import { drivers } from '@/mocks/drivers';

type TabKey = 'overview' | 'schedule' | 'history';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'history', label: 'Delivery History' },
];

export default function DriverDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState<TabKey>('overview');
  const driver = drivers.find((d) => d.id === id);

  if (!driver) {
    return (
      <DashboardShell>
        <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-16 text-center">
          <i className="ri-user-unfollow-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">Driver not found</p>
          <Link
            to="/drivers"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-line text-sm leading-none" />
            Back to drivers
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DriverHeader driver={driver} />

      <div className="mt-4 flex items-center gap-1 border-b border-background-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              tab === t.key
                ? 'text-primary-700'
                : 'text-foreground-500 hover:text-foreground-900'
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
        {tab === 'overview' && <OverviewTab driver={driver} />}
        {tab === 'schedule' && <ScheduleTab driver={driver} />}
        {tab === 'history' && <HistoryTab driver={driver} />}
      </div>
    </DashboardShell>
  );
}