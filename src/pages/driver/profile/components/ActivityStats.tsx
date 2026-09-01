import { useDriverApp } from '@/pages/driver/DriverAppContext';
import { pastRuns } from '@/mocks/driverPastRuns';
import { pickupCount, deliveryCount } from '@/pages/driver/driverUtils';
import type { DriverRun } from '@/mocks/driver';

function formatHours(totalMinutes: number): string {
  return `${(totalMinutes / 60).toFixed(1)}h`;
}

export default function ActivityStats() {
  const { runs } = useDriverApp();

  const completedToday = runs
    .filter((run) => run.status === 'Completed' && run.window.startsWith('Today'))
    .sort((a, b) => b.window.localeCompare(a.window));

  const allCompleted: DriverRun[] = [...completedToday, ...pastRuns];

  const totalRuns = allCompleted.length;
  const totalMinutes = allCompleted.reduce((sum, run) => sum + (run.durationMin ?? 0), 0);
  const totalPickups = allCompleted.reduce((sum, run) => sum + pickupCount(run), 0);
  const totalDeliveries = allCompleted.reduce((sum, run) => sum + deliveryCount(run), 0);

  const stats = [
    { label: 'Hours', value: formatHours(totalMinutes), icon: 'ri-time-line' },
    { label: 'Runs', value: String(totalRuns), icon: 'ri-truck-line' },
    { label: 'Pickups', value: String(totalPickups), icon: 'ri-gas-station-line' },
    { label: 'Deliveries', value: String(totalDeliveries), icon: 'ri-building-2-line' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-background-200 bg-background-50 px-2 py-3 text-center"
        >
          <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-background-100">
            <i className={`${stat.icon} text-foreground-500 text-[14px] leading-none`} />
          </span>
          <p className="mt-2 font-heading text-[15px] font-bold text-foreground-950 tabular">{stat.value}</p>
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}