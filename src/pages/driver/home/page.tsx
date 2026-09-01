import { useEffect, useState } from 'react';
import DriverAppShell from '@/pages/driver/components/DriverAppShell';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import ActiveRunScreen from '@/pages/driver/active/components/ActiveRunScreen';
import PrimaryRunCard from './components/PrimaryRunCard';
import UpNextCard from './components/UpNextCard';
import { windowDay } from '@/pages/driver/driverUtils';

export default function DriverHomePage() {
  const { runs, driver } = useDriverApp();
  const [lastActiveId, setLastActiveId] = useState<string | null>(null);

  const activeRun = runs.find((run) => run.status === 'In Progress');
  const completed = activeRun
    ? null
    : runs.find((run) => run.id === lastActiveId && run.status === 'Completed');

  useEffect(() => {
    if (activeRun) setLastActiveId(activeRun.id);
  }, [activeRun]);

  const displayRun = activeRun ?? completed ?? null;

  const firstName = driver.name.split(' ')[0];
  const greeting = (
    <p className="pt-4 text-center text-sm font-bold text-foreground-600">Hi, {firstName}</p>
  );

  if (displayRun) {
    return (
      <DriverAppShell>
        {greeting}
        <div className="mt-4">
          <ActiveRunScreen run={displayRun} onBackHome={() => setLastActiveId(null)} />
        </div>
      </DriverAppShell>
    );
  }

  const scheduledToday = runs.filter(
    (run) => run.status === 'Scheduled' && windowDay(run) === 'Today',
  );

  const heroRun = scheduledToday[0] ?? null;
  const upNext = scheduledToday.slice(1);
  const noWork = scheduledToday.length === 0;

  return (
    <DriverAppShell>
      {greeting}

      {heroRun && (
        <div className="mt-4">
          <PrimaryRunCard run={heroRun} />
        </div>
      )}

      {upNext.length > 0 && (
        <section className="mt-6">
          <h2 className="font-heading text-lg font-bold text-foreground-950">Next runs</h2>
          <div className="mt-3 space-y-3">
            {upNext.map((run) => (
              <UpNextCard key={run.id} run={run} blocked={false} />
            ))}
          </div>
        </section>
      )}

      {noWork && (
        <div className="mt-4 rounded-lg border border-dashed border-background-300 bg-background-50 p-8 text-center">
          <i className="ri-inbox-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">No runs assigned</p>
          <p className="mt-1 text-[12px] text-foreground-400">There's currently no work assigned to you.</p>
        </div>
      )}
    </DriverAppShell>
  );
}