import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { DriverRun } from '@/mocks/driver';
import { getRouteLabel, stopCount, getScheduledStartAt } from '@/pages/driver/driverUtils';

export default function UpNextCard({ run, blocked }: { run: DriverRun; blocked: boolean }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const totalStops = stopCount(run);
  const scheduledStart = getScheduledStartAt(run);

  return (
    <button
      type="button"
      onClick={() => navigate(`/driver/runs/${run.id}`)}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-background-200 bg-background-50 p-4 text-left hover:border-primary-200 hover:bg-primary-50/40 cursor-pointer transition-colors"
    >
      <div className="min-w-0">
        <p className="font-heading text-base font-bold text-foreground-950">{getRouteLabel(run)}</p>

        <p className="mt-1.5 text-sm font-medium text-foreground-500 tabular">
          {scheduledStart ? `${scheduledStart} · ` : ''}
          {t('driver.stopsCount', { count: totalStops })}
        </p>

        {blocked && (
          <p className="mt-2.5 flex items-center gap-1.5 text-[13px] font-medium text-foreground-400">
            <i className="ri-lock-line text-[13px] leading-none" />
            {t('driver.startsAfterCurrentRun')}
          </p>
        )}
      </div>

      <i className="ri-arrow-right-s-line text-2xl leading-none text-foreground-300" />
    </button>
  );
}
