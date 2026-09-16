import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { DriverRun } from '@/mocks/driver';
import { stopCount, getRouteLabel } from '@/pages/driver/driverUtils';

export default function PrimaryRunCard({ run }: { run: DriverRun }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const totalStops = stopCount(run);
  const firstStop = run.stops[0];

  function handleStart() {
    navigate(`/driver/start/${run.id}`);
  }

  return (
    <div className="rounded-lg bg-primary-500 p-5 text-background-50">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-background-50/90">
          <i className="ri-play-circle-line text-base leading-none" />
          {t('driver.nextRun')}
        </span>
      </div>

      <p className="mt-4 font-heading text-4xl font-bold leading-tight">{getRouteLabel(run)}</p>

      <p className="mt-2 text-sm font-medium text-background-50/85">
        {t('driver.stopsCount', { count: totalStops })}
      </p>

      {firstStop && (
        <div className="mt-6 border-t border-background-50/20 pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-background-50/70">{t('driver.firstStop')}</p>
          <p className="mt-1.5 text-xl font-bold">{firstStop.name}</p>
        </div>
      )}

      <div className="mt-6">
        <button
          type="button"
          onClick={handleStart}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-background-50 px-4 py-5 text-lg font-bold text-primary-600 hover:bg-background-50/90 whitespace-nowrap cursor-pointer transition-colors"
        >
          {t('driver.startRun')}
          <i className="ri-arrow-right-line text-xl leading-none" />
        </button>
        <button
          type="button"
          onClick={() => navigate(`/driver/runs/${run.id}`)}
          className="mt-2 flex w-full items-center justify-center gap-1.5 py-2 text-sm font-medium text-background-50/90 hover:text-background-50 whitespace-nowrap cursor-pointer transition-colors"
        >
          {t('driver.viewStops', { count: totalStops })}
          <i className="ri-arrow-right-s-line text-base leading-none" />
        </button>
      </div>
    </div>
  );
}
