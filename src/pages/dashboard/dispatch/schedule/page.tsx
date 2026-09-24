import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import { fetchScheduleRuns } from '@/mocks/schedule';
import {
  useScheduleRuns,
  scheduleResourcesFromRuns,
  replaceScheduleRuns,
  updateScheduleRun,
} from '@/pages/dashboard/dispatch/dispatchStore';
import { buildDays, weekRangeLabel } from './scheduleUtils';
import ScheduleToolbar from './components/ScheduleToolbar';
import Legend from './components/Legend';
import WeekBoard from './components/WeekBoard';

export default function SchedulePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);
  const scheduleRuns = useScheduleRuns();
  const [driverFilter, setDriverFilter] = useState('All Drivers');
  const [truckFilter, setTruckFilter] = useState('All Trucks');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchScheduleRuns()
      .then((apiRuns) => {
        if (active) replaceScheduleRuns(apiRuns);
      })
      .catch(() => {
        if (active) {
          replaceScheduleRuns([]);
          setToast(t('dashboard.dispatch.schedule.loadFailed'));
          window.setTimeout(() => setToast(null), 2600);
        }
      });

    return () => {
      active = false;
    };
  }, [t]);

  const days = useMemo(() => buildDays(weekOffset), [weekOffset]);
  const dateLabel = weekRangeLabel(days);
  const scheduleResources = useMemo(() => scheduleResourcesFromRuns(scheduleRuns), [scheduleRuns]);

  const drivers = useMemo(() => scheduleResources.map((r) => r.driverName), [scheduleResources]);
  const trucks = useMemo(() => Array.from(new Set(scheduleResources.map((r) => r.truckPlate))), [scheduleResources]);
  const statuses = ['Scheduled', 'Dispatched', 'Delayed', 'Conflict', 'Completed'];

  const visibleResources = useMemo(
    () =>
      scheduleResources.filter(
        (r) =>
          (driverFilter === 'All Drivers' || r.driverName === driverFilter) &&
          (truckFilter === 'All Trucks' || r.truckPlate === truckFilter),
      ),
    [scheduleResources, driverFilter, truckFilter],
  );

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }

  function handleDropRun(runId: string, driverName: string, truckPlate: string, day: number | null) {
    updateScheduleRun(runId, { driverName, truckPlate, ...(day !== null ? { day } : {}) });
    showToast(t('dashboard.dispatch.schedule.toasts.reassignedRun', { runId, driverName }));
  }

  function handleOpenRun(runId: string) {
    navigate(`/dispatch/runs/${runId}/edit`);
  }

  function handlePrev() {
    setWeekOffset((o) => o - 1);
  }

  function handleNext() {
    setWeekOffset((o) => o + 1);
  }

  function handleToday() {
    setWeekOffset(0);
  }

  return (
    <DashboardShell>
      <div className="w-full">
        <div className="mb-4 flex justify-end">
          <Link
            to="/dispatch/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
          >
            <i className="ri-add-line text-sm leading-none" />
            {t('dashboard.dispatch.schedule.newSchedule')}
          </Link>
        </div>

      <ScheduleToolbar
        dateLabel={dateLabel}
        onToday={handleToday}
        onPrev={handlePrev}
        onNext={handleNext}
        driverFilter={driverFilter}
        truckFilter={truckFilter}
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onDriverFilter={setDriverFilter}
        onTruckFilter={setTruckFilter}
        onStatusFilter={setStatusFilter}
        onSearchQuery={setSearchQuery}
        drivers={drivers}
        trucks={trucks}
        statuses={statuses}
      />

      <Legend />

        <WeekBoard
          days={days}
          resources={visibleResources}
          runs={scheduleRuns}
          onRunClick={() => undefined}
          onRunDoubleClick={(l) => handleOpenRun(l.id)}
          onDropRun={handleDropRun}
        />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          </span>
          {toast}
        </div>
      )}
      </div>
    </DashboardShell>
  );
}
