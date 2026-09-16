import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import DriverAppShell from '@/pages/driver/components/DriverAppShell';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import { getRouteLabel, stopCount } from '@/pages/driver/driverUtils';
import type { Vehicle } from '@/mocks/driver';

function VehicleCard({ label, vehicle, registrationLabel }: { label: string; vehicle: Vehicle; registrationLabel: string }) {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-foreground-500">{label}</span>
        <span className="text-[11px] font-medium text-foreground-400">{vehicle.fleetNumber}</span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="rounded-md border-2 border-foreground-300 bg-background-100 px-3 py-1.5 font-heading text-2xl font-bold tracking-[0.15em] text-foreground-950">
          {vehicle.registrationNumber}
        </span>
        <span className="text-[11px] font-medium text-foreground-400">{registrationLabel}</span>
      </div>
    </div>
  );
}

export default function DriverStartPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { runs, driver, startRun } = useDriverApp();

  const [confirming, setConfirming] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportNote, setReportNote] = useState('');
  const [reported, setReported] = useState(false);

  const run = runs.find((r) => r.id === id);

  if (!run) {
    return (
      <DriverAppShell title={t('driver.startRunTitle')} onBack={() => navigate('/driver/home')}>
        <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-12 text-center">
          <i className="ri-truck-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-base font-medium text-foreground-600">{t('driver.runNotFound')}</p>
        </div>
      </DriverAppShell>
    );
  }

  const total = stopCount(run);

  function handleConfirm() {
    if (confirming) return;
    setConfirming(true);
    window.setTimeout(() => {
      startRun(run!.id);
      navigate('/driver/home');
    }, 400);
  }

  function handleSendReport() {
    setReported(true);
  }

  return (
    <DriverAppShell title={t('driver.startRunTitle')} onBack={() => navigate('/driver/home')}>
      <div className="space-y-4">
        <div className="rounded-lg border border-background-200 bg-background-50 p-5">
          <p className="font-heading text-2xl font-bold leading-tight text-foreground-950">
            {getRouteLabel(run)}
          </p>
          <p className="mt-2 text-sm font-medium text-foreground-600">
            {t('driver.stopsCount', { count: total })}
          </p>
        </div>

        <section>
          <h2 className="mb-3 font-heading text-lg font-bold text-foreground-950">{t('driver.confirmRig')}</h2>
          <div className="space-y-3">
            <VehicleCard label={t('driver.tractor')} vehicle={driver.truck} registrationLabel={t('driver.registration')} />
            <VehicleCard label={t('driver.trailer')} vehicle={driver.trailer} registrationLabel={t('driver.registration')} />
          </div>
          <p className="mt-3 text-center text-[13px] text-foreground-500">
            {t('driver.checkPlates')}
          </p>
        </section>

        {reported ? (
          <div className="animate-fade-in rounded-lg border border-accent-300 bg-accent-50 p-5 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
              <i className="ri-checkbox-circle-fill text-accent-700 text-3xl leading-none" />
            </span>
            <p className="mt-3 text-sm font-bold text-accent-900">{t('driver.mismatchReported')}</p>
            <p className="mt-1 text-[13px] text-accent-700">{t('driver.dispatcherWillContact')}</p>
            <button
              type="button"
              onClick={() => navigate('/driver/home')}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 text-background-50 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
            >
              {t('driver.backToHome')}
            </button>
          </div>
        ) : reporting ? (
          <div className="space-y-3 rounded-lg border border-background-200 bg-background-50 p-4">
            <p className="text-sm font-semibold text-foreground-800">{t('driver.whatDoesntMatch')}</p>
            <textarea
              value={reportNote}
              onChange={(e) => setReportNote(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder={t('driver.mismatchPlaceholder')}
              className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 placeholder:text-foreground-400 focus:border-primary-400 focus:outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSendReport}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
              >
                {t('driver.sendReport')}
              </button>
              <button
                type="button"
                onClick={() => setReporting(false)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
              >
                {t('driver.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleConfirm}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-md text-lg font-bold px-4 py-4 whitespace-nowrap transition-colors ${
                confirming
                  ? 'bg-accent-500 text-background-50 cursor-default animate-confirm-flash'
                  : 'bg-primary-500 hover:bg-primary-600 text-background-50 cursor-pointer'
              }`}
            >
              {confirming ? (
                <>
                  <i className="ri-checkbox-circle-fill text-xl leading-none" />
                  {t('driver.runStarted')}
                </>
              ) : (
                <>
                  {t('driver.confirmAndStart')}
                  <i className="ri-arrow-right-line text-xl leading-none" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setReporting(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-error-warning-line text-base leading-none" />
              {t('driver.reportMismatch')}
            </button>
          </>
        )}
      </div>
    </DriverAppShell>
  );
}
