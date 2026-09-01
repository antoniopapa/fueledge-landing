import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AssignmentOption, UnscheduledRun } from '@/mocks/schedule';
import { getTruckInventory, formatLiters, validateDeliveryFirstRoute } from '@/pages/driver/driverUtils';

interface AssignmentModalProps {
  run: UnscheduledRun | null;
  options: AssignmentOption[];
  drivers: string[];
  trucks: string[];
  onClose: () => void;
  onAssign: (driverName: string, truckPlate: string) => void;
}

export default function AssignmentModal({
  run,
  options,
  drivers,
  trucks,
  onClose,
  onAssign,
}: AssignmentModalProps) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedTruck, setSelectedTruck] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(0);

  useEffect(() => {
    if (run) {
      setVisible(false);
      if (options.length > 0) {
        setSelectedDriver(options[0].driverName);
        setSelectedTruck(options[0].truckPlate);
        setSelectedOption(0);
      }
      const t = window.setTimeout(() => setVisible(true), 10);
      return () => window.clearTimeout(t);
    }
  }, [run, options]);

  if (!run) return null;

  function pickOption(idx: number) {
    setSelectedOption(idx);
    setSelectedDriver(options[idx].driverName);
    setSelectedTruck(options[idx].truckPlate);
  }

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`w-full max-w-lg rounded-lg border border-background-200 bg-background-50 flex flex-col max-h-[90vh] transition-all duration-200 ${
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* header */}
          <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-background-200">
            <div className="min-w-0">
              <h2 className="font-heading text-lg font-bold text-foreground-950">Assign Run #{run.id}</h2>
              <p className="text-sm text-foreground-500 mt-0.5">
                {run.sourceTerminal} → {run.destination}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 cursor-pointer"
            >
              <i className="ri-close-line text-lg leading-none" />
            </button>
          </div>

          {/* body */}
          <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
            {/* summary */}
            <div className="rounded-md bg-background-100 px-3 py-2.5">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-foreground-600">
                <span className="font-semibold text-foreground-900">{run.product}</span>
                <span>{run.volume}</span>
                <span>Pickup {run.pickupWindow}</span>
                <span>Delivery {run.deliveryWindow}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-secondary-700">
                <span className="w-3.5 h-3.5 flex items-center justify-center">
                  <i className="ri-alert-line text-secondary-600 text-[13px] leading-none" />
                </span>
                {run.reason}
              </div>
            </div>

            {/* delivery-first inventory + validation */}
            {run.deliveryFirst && run.stops && (() => {
              const truckId = selectedTruck || run.recommendedTruck;
              const validation = validateDeliveryFirstRoute(
                run.requiredFuelL ?? 0,
                run.product,
                truckId,
              );
              const inventory = getTruckInventory(truckId);
              return (
                <div
                  className={`rounded-md border p-3 ${
                    validation.ok ? 'border-accent-200 bg-accent-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center">
                      <i
                        className={`${
                          validation.ok ? 'ri-checkbox-circle-fill text-accent-600' : 'ri-alert-fill text-red-500'
                        } text-base leading-none`}
                      />
                    </span>
                    <p className={`text-[12px] font-semibold ${validation.ok ? 'text-accent-800' : 'text-red-700'}`}>
                      Delivery-first route
                    </p>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <p className="text-foreground-400 uppercase tracking-wide text-[10px] font-semibold">Starting inventory</p>
                      <p className="mt-0.5 font-medium text-foreground-800 tabular">
                        {inventory ? `${formatLiters(inventory.quantityL)} ${inventory.fuelType}` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground-400 uppercase tracking-wide text-[10px] font-semibold">Required for route</p>
                      <p className="mt-0.5 font-medium text-foreground-800 tabular">
                        {formatLiters(run.requiredFuelL ?? 0)}
                      </p>
                    </div>
                  </div>
                  {!validation.ok && (
                    <p className="mt-2 rounded bg-red-100/70 px-2 py-1.5 text-[11px] font-medium text-red-700">
                      {validation.reason}
                    </p>
                  )}
                  <div className="mt-2 space-y-1 border-t border-background-200 pt-2">
                    {run.stops.map((stop, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="text-foreground-700">
                          <span className="font-semibold text-foreground-900">{idx + 1}.</span> {stop.name}
                        </span>
                        <span className="text-foreground-500 tabular whitespace-nowrap">
                          {stop.kind === 'delivery' ? 'Delivery' : 'Pickup'} · {formatLiters(stop.quantityL)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* recommended */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400">
                  Recommended combinations
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/dispatch/map')}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-700 hover:underline cursor-pointer whitespace-nowrap"
                >
                  <span className="w-3 h-3 flex items-center justify-center">
                    <i className="ri-map-pin-line text-[12px] leading-none" />
                  </span>
                  View on Map
                </button>
              </div>
              <div className="space-y-2">
                {options.map((opt, idx) => {
                  const selected = selectedOption === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => pickOption(idx)}
                      className={`w-full text-left rounded-md border p-3 transition-colors cursor-pointer ${
                        selected
                          ? 'border-primary-400 bg-primary-50 ring-1 ring-primary-300'
                          : 'border-background-200 bg-background-50 hover:bg-background-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selected ? 'border-primary-500' : 'border-background-300'
                          }`}
                        >
                          {selected && <span className="w-2 h-2 rounded-full bg-primary-500" />}
                        </span>
                        <span className="text-[13px] font-semibold text-foreground-900">{opt.driverName}</span>
                        <span className="text-foreground-400 text-[13px]">+</span>
                        <span className="text-[13px] font-semibold text-foreground-900 tabular">{opt.truckPlate}</span>
                        {idx === 0 && (
                          <span className="text-[10px] font-semibold text-primary-700 bg-primary-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-foreground-500 flex-wrap">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                          <span className="w-3 h-3 flex items-center justify-center">
                            <i className="ri-time-line text-[12px] leading-none" />
                          </span>
                          Available {opt.available}
                        </span>
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                          <span className="w-3 h-3 flex items-center justify-center">
                            <i className="ri-road-map-line text-[12px] leading-none" />
                          </span>
                          {opt.distance} from terminal
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 flex-wrap">
                        {opt.checks.map((c) => (
                          <span
                            key={c.label}
                            className={`inline-flex items-center gap-1 text-[11px] font-medium whitespace-nowrap ${
                              c.ok ? 'text-accent-700' : 'text-secondary-700'
                            }`}
                          >
                            <span className="w-3 h-3 flex items-center justify-center">
                              <i
                                className={`${
                                  c.ok ? 'ri-checkbox-circle-fill text-accent-500' : 'ri-close-circle-fill text-secondary-500'
                                } text-[12px] leading-none`}
                              />
                            </span>
                            {c.label}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* override */}
            <div className="rounded-md border border-background-200 bg-background-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400 mb-2">
                Override assignment
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-foreground-500 mb-1">Driver</label>
                  <select
                    value={selectedDriver}
                    onChange={(e) => {
                      setSelectedDriver(e.target.value);
                      setSelectedOption(null);
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
                  <label className="block text-[11px] text-foreground-500 mb-1">Truck</label>
                  <select
                    value={selectedTruck}
                    onChange={(e) => {
                      setSelectedTruck(e.target.value);
                      setSelectedOption(null);
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
            </div>
          </div>

          {/* footer */}
          <div className="px-5 py-4 border-t border-background-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-background-200 bg-background-50 hover:bg-background-100 text-foreground-700 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onAssign(selectedDriver, selectedTruck)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-calendar-check-line text-sm leading-none" />
              </span>
              Assign & Add to Schedule
            </button>
          </div>
        </div>
      </div>
    </>
  );
}