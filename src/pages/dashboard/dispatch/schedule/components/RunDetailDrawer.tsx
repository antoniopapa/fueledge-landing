import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { ScheduleRun } from '@/mocks/schedule';
import { useTruckInventory } from '@/pages/driver/driverStore';
import { formatLiters } from '@/pages/driver/driverUtils';
import { statusMeta } from './statusMeta';

interface RunDetailDrawerProps {
  run: ScheduleRun | null;
  drivers: string[];
  trucks: string[];
  onClose: () => void;
  onReassignDriver: (driverName: string) => void;
  onReassignTruck: (truckPlate: string) => void;
  onChangeTime: (startTime: string, endTime: string) => void;
}

export default function RunDetailDrawer({
  run,
  drivers,
  trucks,
  onClose,
  onReassignDriver,
  onReassignTruck,
  onChangeTime,
}: RunDetailDrawerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inventory = useTruckInventory();
  const [visible, setVisible] = useState(false);
  const [driver, setDriver] = useState('');
  const [truck, setTruck] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (run) {
      setVisible(false);
      setDriver(run.driverName);
      setTruck(run.truckPlate);
      setStartTime(run.startTime);
      setEndTime(run.endTime);
      const t = window.setTimeout(() => setVisible(true), 10);
      return () => window.clearTimeout(t);
    }
  }, [run]);

  if (!run) return null;
  const meta = statusMeta[run.status];
  const onboard = inventory.find((item) => item.truckId === run.truckPlate);

  const selectCls =
    'w-full rounded-md border border-background-200 bg-background-50 px-2 py-1.5 text-[12px] text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer';

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-foreground-950/40 transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-background-50 border-l border-background-200 flex flex-col transition-transform duration-200 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-background-200">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading text-lg font-bold text-foreground-950">
                {t('dashboard.dispatch.schedule.run')} #{run.id}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${meta.bg} ${meta.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                {t(meta.labelKey)}
              </span>
            </div>
            <p className="text-sm text-foreground-500 mt-0.5">{run.route}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('dashboard.dispatch.schedule.close')}
            className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 cursor-pointer"
          >
            <i className="ri-close-line text-lg leading-none" />
          </button>
        </div>

        {/* conflict callout */}
        {run.conflict && (
          <div className="mx-5 mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 flex items-start gap-2">
            <span className="w-4 h-4 flex items-center justify-center mt-0.5">
              <i className="ri-alert-fill text-red-500 text-base leading-none" />
            </span>
            <div>
              <p className="text-[12px] font-semibold text-red-700">
                {t('dashboard.dispatch.schedule.conflictHeading')}
              </p>
              <p className="text-[11px] text-red-600">
                {run.conflictNote ?? t('dashboard.dispatch.schedule.conflictFallback')}
              </p>
            </div>
          </div>
        )}

        {/* details */}
        <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-3">
            {[
              { label: t('dashboard.dispatch.schedule.pickup'), value: run.pickup },
              { label: t('dashboard.dispatch.schedule.delivery'), value: run.delivery },
              { label: t('dashboard.dispatch.schedule.product'), value: run.product },
              { label: t('dashboard.dispatch.schedule.quantity'), value: run.volume },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-medium text-foreground-400 uppercase tracking-wide whitespace-nowrap">
                  {row.label}
                </span>
                <span className="text-[13px] font-medium text-foreground-900 text-right">{row.value}</span>
              </div>
            ))}
          </div>

          {onboard && (
            <div className="flex items-center gap-2 rounded-md border border-accent-200 bg-accent-50 px-3 py-2.5">
              <span className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
                <i className="ri-gas-station-line text-accent-700 text-[14px] leading-none" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-accent-700">
                  {t('dashboard.dispatch.schedule.onboardFuel')} · {run.truckPlate}
                </p>
                <p className="text-[13px] font-semibold text-foreground-900 tabular">
                  {formatLiters(onboard.quantityL)} {onboard.fuelType}
                </p>
              </div>
            </div>
          )}

          {/* assignment */}
          <div className="rounded-md border border-background-200 bg-background-50 p-3 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
              {t('dashboard.dispatch.schedule.assignment')}
            </p>
            <div>
              <label className="block text-[11px] text-foreground-500 mb-1">
                {t('dashboard.dispatch.schedule.driver')}
              </label>
              <select
                value={driver}
                onChange={(e) => {
                  setDriver(e.target.value);
                  onReassignDriver(e.target.value);
                }}
                className={selectCls}
              >
                {drivers.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-foreground-500 mb-1">
                {t('dashboard.dispatch.schedule.truck')}
              </label>
              <select
                value={truck}
                onChange={(e) => {
                  setTruck(e.target.value);
                  onReassignTruck(e.target.value);
                }}
                className={selectCls}
              >
                {trucks.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* reschedule */}
          <div className="rounded-md border border-background-200 bg-background-50 p-3 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
              {t('dashboard.dispatch.schedule.reschedule')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-foreground-500 mb-1">
                  {t('dashboard.dispatch.schedule.pickup')}
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    onChangeTime(e.target.value, endTime);
                  }}
                  className={selectCls}
                />
              </div>
              <div>
                <label className="block text-[11px] text-foreground-500 mb-1">
                  {t('dashboard.dispatch.schedule.delivery')}
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    onChangeTime(startTime, e.target.value);
                  }}
                  className={selectCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="px-5 py-4 border-t border-background-200 space-y-2">
          <button
            type="button"
            onClick={() => navigate(`/dispatch/runs/RN-${run.id}`)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-route-line text-sm leading-none" />
            </span>
            {t('dashboard.dispatch.schedule.fullRunDetail')}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/orders/${run.id}`)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-background-200 bg-background-50 hover:bg-background-100 text-foreground-700 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-external-link-line text-sm leading-none" />
            </span>
            {t('dashboard.dispatch.schedule.openOrder')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dispatch/map')}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-background-200 bg-background-50 hover:bg-background-100 text-foreground-700 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer"
          >
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-map-pin-line text-sm leading-none" />
            </span>
            {t('dashboard.dispatch.schedule.viewOnMap')}
          </button>
        </div>
      </aside>
    </>
  );
}
