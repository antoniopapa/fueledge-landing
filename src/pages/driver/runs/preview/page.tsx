import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import DriverAppShell from '@/pages/driver/components/DriverAppShell';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import { getRouteLabel, stopCount, getScheduledStartAt } from '@/pages/driver/driverUtils';

export default function DriverRunPreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { runs } = useDriverApp();

  const run = runs.find((r) => r.id === id);
  const hasActive = runs.some((r) => r.status === 'In Progress');

  if (!run) {
    return (
      <DriverAppShell title={t('driver.runDetails')} onBack={() => navigate('/driver/home')}>
        <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-12 text-center">
          <i className="ri-truck-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-base font-medium text-foreground-600">{t('driver.runNotFound')}</p>
        </div>
      </DriverAppShell>
    );
  }

  const total = stopCount(run);
  const scheduledStart = getScheduledStartAt(run);

  function handleStart() {
    navigate(`/driver/start/${run!.id}`);
  }

  return (
    <DriverAppShell title={t('driver.runDetails')} onBack={() => navigate('/driver/home')}>
      <div className="space-y-5">
        <div className="rounded-lg border border-background-200 bg-background-50 p-5">
          <p className="font-heading text-2xl font-bold leading-tight text-foreground-950">
            {getRouteLabel(run)}
          </p>
          <p className="mt-2 text-base font-medium text-foreground-600 tabular">
            {scheduledStart ? `${scheduledStart} · ` : ''}
            {t('driver.stopsCount', { count: total })}
          </p>
        </div>

        <section>
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground-950">{t('driver.stops')}</h2>
          <div className="space-y-2.5">
            {run.stops.map((stop, index) => (
              <div key={stop.id} className="flex items-center gap-3 rounded-lg border border-background-200 bg-background-50 p-4">
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[15px] font-bold tabular ${
                    stop.kind === 'pickup' ? 'bg-primary-100 text-primary-700' : 'bg-accent-100 text-accent-800'
                  }`}
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-foreground-900">{stop.name}</p>
                  <p className="mt-0.5 text-sm text-foreground-500">{stop.address}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-semibold tabular text-foreground-900">{stop.quantity}</p>
                  <span
                    className={`mt-0.5 inline-block text-sm font-semibold ${
                      stop.kind === 'pickup' ? 'text-primary-700' : 'text-accent-800'
                    }`}
                  >
                    {stop.kind === 'pickup' ? t('driver.pickup') : t('driver.delivery')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {run.status === 'Scheduled' && (
          <>
            {hasActive ? (
              <div className="flex items-center gap-2 rounded-lg border border-background-200 bg-background-100/70 px-4 py-3.5">
                <i className="ri-lock-line text-foreground-400 text-lg leading-none" />
                <span className="text-base font-medium text-foreground-500">{t('driver.startsAfterCurrentRun')}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-lg font-bold px-4 py-4 whitespace-nowrap cursor-pointer transition-colors"
              >
                <i className="ri-play-fill text-xl leading-none" />
                {t('driver.startRun')}
              </button>
            )}
          </>
        )}
      </div>
    </DriverAppShell>
  );
}
