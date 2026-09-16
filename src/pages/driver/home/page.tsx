import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DriverAppShell from '@/pages/driver/components/DriverAppShell';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import ActiveRunScreen from '@/pages/driver/active/components/ActiveRunScreen';
import PrimaryRunCard from './components/PrimaryRunCard';
import UpNextCard from './components/UpNextCard';
import { windowDay } from '@/pages/driver/driverUtils';

export default function DriverHomePage() {
  const { runs, driver } = useDriverApp();
  const { t } = useTranslation();
  const [lastActiveId, setLastActiveId] = useState<string | null>(null);

  const activeRun = runs.find((run) => run.status === 'In Progress');

  useEffect(() => {
    if (activeRun) setLastActiveId(activeRun.id);
  }, [activeRun]);

  const greeting = (
    <p className="pt-4 text-center text-sm font-bold text-foreground-600">
      {t('driver.greeting', { name: driver.name.split(' ')[0] })}
    </p>
  );

  const scheduledToday = runs.filter(
    (run) => run.status === 'Scheduled' && windowDay(run) === 'Today',
  );

  const heroRun = scheduledToday[0] ?? null;
  const noWork = scheduledToday.length === 0;

  return (
    <DriverAppShell>
      {greeting}

      {heroRun && (
        <div className="mt-4">
          <PrimaryRunCard run={heroRun} />
        </div>
      )}

      {noWork && (
        <div className="mt-4 rounded-lg border border-dashed border-background-300 bg-background-50 p-8 text-center">
          <i className="ri-inbox-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">{t('driver.noRunsAssigned')}</p>
          <p className="mt-1 text-[12px] text-foreground-400">{t('driver.noRunsAssignedDesc')}</p>
        </div>
      )}
    </DriverAppShell>
  );
}
