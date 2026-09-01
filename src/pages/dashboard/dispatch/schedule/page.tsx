import { useMemo, useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { dispatchNav } from '@/pages/dashboard/nav';
import { scheduleResources } from '@/mocks/schedule';
import { useScheduleRuns, updateScheduleRun } from '@/pages/dashboard/dispatch/dispatchStore';
import { buildDays, weekRangeLabel, singleDayLabel } from './scheduleUtils';
import ScheduleToolbar from './components/ScheduleToolbar';
import Legend from './components/Legend';
import WeekBoard from './components/WeekBoard';
import DayBoard from './components/DayBoard';
import RunDetailDrawer from './components/RunDetailDrawer';

type ViewMode = 'week' | 'day';

export default function SchedulePage() {
  const [view, setView] = useState<ViewMode>('week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const runs = useScheduleRuns();
  const [driverFilter, setDriverFilter] = useState('All Drivers');
  const [truckFilter, setTruckFilter] = useState('All Trucks');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const days = useMemo(() => buildDays(weekOffset), [weekOffset]);
  const dateLabel = view === 'week' ? weekRangeLabel(days) : singleDayLabel(days[selectedDay]);

  const drivers = useMemo(() => scheduleResources.map((r) => r.driverName), []);
  const trucks = useMemo(() => Array.from(new Set(scheduleResources.map((r) => r.truckPlate))), []);
  const statuses = ['Scheduled', 'Dispatched', 'Delayed', 'Conflict', 'Completed'];

  const visibleResources = useMemo(
    () =>
      scheduleResources.filter(
        (r) =>
          (driverFilter === 'All Drivers' || r.driverName === driverFilter) &&
          (truckFilter === 'All Trucks' || r.truckPlate === truckFilter),
      ),
    [driverFilter, truckFilter],
  );

  const visibleRuns = useMemo(
    () =>
      runs.filter((l) => {
        if (!visibleResources.some((r) => r.driverName === l.driverName)) return false;
        if (statusFilter === 'Completed') {
          if (l.status !== 'Completed') return false;
        } else {
          if (l.status === 'Completed') return false;
          if (statusFilter !== 'All Statuses' && l.status !== statusFilter) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const hay = `${l.id} ${l.route} ${l.driverName} ${l.truckPlate}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      }),
    [runs, visibleResources, statusFilter, searchQuery],
  );

  const selectedRun = runs.find((l) => l.id === selectedRunId) ?? null;

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }

  function handleDropRun(runId: string, driverName: string, truckPlate: string, day: number | null) {
    updateScheduleRun(runId, { driverName, truckPlate, ...(day !== null ? { day } : {}) });
    showToast(`Run #${runId} reassigned to ${driverName}`);
  }

  function handleReassignDriver(runId: string, driverName: string) {
    updateScheduleRun(runId, { driverName });
    showToast(`Run #${runId} driver changed to ${driverName}`);
  }

  function handleReassignTruck(runId: string, truckPlate: string) {
    updateScheduleRun(runId, { truckPlate });
    showToast(`Run #${runId} truck changed to ${truckPlate}`);
  }

  function handleChangeTime(runId: string, startTime: string, endTime: string) {
    updateScheduleRun(runId, { startTime, endTime });
    showToast(`Run #${runId} rescheduled to ${startTime}–${endTime}`);
  }

  function handlePrev() {
    if (view === 'week') setWeekOffset((o) => o - 1);
    else setSelectedDay((d) => (d + 6) % 7);
  }

  function handleNext() {
    if (view === 'week') setWeekOffset((o) => o + 1);
    else setSelectedDay((d) => (d + 1) % 7);
  }

  function handleToday() {
    setWeekOffset(0);
    setSelectedDay(0);
  }

  return (
    <ModuleShell
      title="Schedule"
      description="Plan driver and truck assignments across upcoming runs."
      icon="ri-calendar-line"
      subNav={dispatchNav}
    >
      <ScheduleToolbar
        dateLabel={dateLabel}
        view={view}
        onViewChange={setView}
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

      {view === 'week' ? (
        <WeekBoard
          days={days}
          resources={visibleResources}
          runs={visibleRuns}
          onRunClick={(l) => setSelectedRunId(l.id)}
          onDropRun={handleDropRun}
        />
      ) : (
        <DayBoard
          day={days[selectedDay]}
          dayIndex={selectedDay}
          resources={visibleResources}
          runs={visibleRuns}
          onRunClick={(l) => setSelectedRunId(l.id)}
          onDropRun={(runId, driverName, truckPlate) => handleDropRun(runId, driverName, truckPlate, null)}
        />
      )}

      <RunDetailDrawer
        run={selectedRun}
        drivers={drivers}
        trucks={trucks}
        onClose={() => setSelectedRunId(null)}
        onReassignDriver={(driverName) => selectedRun && handleReassignDriver(selectedRun.id, driverName)}
        onReassignTruck={(truckPlate) => selectedRun && handleReassignTruck(selectedRun.id, truckPlate)}
        onChangeTime={(startTime, endTime) => selectedRun && handleChangeTime(selectedRun.id, startTime, endTime)}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          </span>
          {toast}
        </div>
      )}
    </ModuleShell>
  );
}