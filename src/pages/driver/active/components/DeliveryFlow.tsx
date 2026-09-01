import { useState } from 'react';
import type { DriverRun, DeliveryProduct, Stop, LoadDeviationReason } from '@/mocks/driver';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import { useElapsed } from '@/pages/driver/useElapsed';
import { parseLiters, formatLiters, formatClock } from '@/pages/driver/driverUtils';
import PoDUploader from '@/pages/driver/components/PoDUploader';

type Stage = 'tank-initial' | 'deliver' | 'tank-final' | 'ticket' | 'pod';

interface TicketLine {
  compartmentId: string;
  product: string;
  gross: number;
  net: number;
}

interface DeliveryResult {
  actualDeliveredQuantity: number | null;
  deviation: LoadDeviationReason | null;
  deviationNote: string;
}

const DEVIATION_REASONS: { value: LoadDeviationReason; label: string; icon: string }[] = [
  { value: 'different_quantity', label: 'Different quantity', icon: 'ri-scales-3-line' },
  { value: 'different_compartment', label: 'Different compartment', icon: 'ri-swap-line' },
  { value: 'product_unavailable', label: 'Product unavailable', icon: 'ri-close-circle-line' },
  { value: 'skipped', label: 'Skip this drop', icon: 'ri-skip-forward-line' },
  { value: 'other', label: 'Other', icon: 'ri-more-line' },
];

function compartmentLabel(id: string): string {
  if (!id) return '';
  const match = id.match(/\d+/);
  return match ? `Compartment ${match[0]}` : id;
}

/** Fallback for legacy stops without an explicit compartment map: a single drop. */
function productsForStop(stop: Stop): DeliveryProduct[] {
  if (stop.deliveryProducts && stop.deliveryProducts.length > 0) {
    return stop.deliveryProducts;
  }
  const total = parseLiters(stop.quantity);
  return [
    {
      product: stop.fuelType,
      compartmentId: '',
      capacityL: null,
      currentL: null,
      plannedQuantity: total,
      expectedGrossQuantity: total,
      actualDeliveredQuantity: null,
      grossQuantity: null,
      netQuantity: null,
      retainedQuantity: null,
      tankSerialNumber: null,
      initialTankVolume: null,
      finalTankVolume: null,
      waterInTank: null,
      deviation: null,
    },
  ];
}

export default function DeliveryFlow({
  run,
  stop,
  onUnable,
}: {
  run: DriverRun;
  stop: Stop;
  onUnable?: () => void;
}) {
  const { completeDelivery } = useDriverApp();

  const products = productsForStop(stop);
  const totalCompartments = products.length;
  const hasTank = products.some((product) => product.tankSerialNumber != null);
  const tankSerial = products.find((product) => product.tankSerialNumber != null)?.tankSerialNumber ?? null;

  const [stage, setStage] = useState<Stage>(hasTank ? 'tank-initial' : 'deliver');
  const [deliveredIndex, setDeliveredIndex] = useState(0);
  const [results, setResults] = useState<DeliveryResult[]>([]);

  // deviation form
  const [showDeviation, setShowDeviation] = useState(false);
  const [deviationReason, setDeviationReason] = useState<LoadDeviationReason | null>(null);
  const [deviationActual, setDeviationActual] = useState('');
  const [deviationNote, setDeviationNote] = useState('');

  // tank form
  const [tankInitial, setTankInitial] = useState('');
  const [tankFinal, setTankFinal] = useState('');
  const [waterInTank, setWaterInTank] = useState('');

  // ticket step
  const [ticketStep, setTicketStep] = useState<'capture' | 'extracting' | 'confirm'>('capture');
  const [ticketPhoto, setTicketPhoto] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState('');
  const [ticketLines, setTicketLines] = useState<TicketLine[]>([]);
  const [aggregateNet, setAggregateNet] = useState(0);
  const [manual, setManual] = useState(false);
  const [manualTicket, setManualTicket] = useState('');
  const [manualNet, setManualNet] = useState('');

  // pod step
  const [podPhoto, setPodPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [completing, setCompleting] = useState(false);

  const customerElapsed = useElapsed(stop.status === 'Arrived' ? stop.arrivedAt : null);

  function plannedOf(product: DeliveryProduct): number {
    return product.plannedQuantity ?? product.expectedGrossQuantity ?? 0;
  }

  function advance(result: DeliveryResult) {
    const next = [...results];
    next[deliveredIndex] = result;
    setResults(next);
    setShowDeviation(false);
    setDeviationReason(null);
    setDeviationActual('');
    setDeviationNote('');
    if (deliveredIndex === totalCompartments - 1) {
      setStage(hasTank ? 'tank-final' : 'ticket');
      setTicketStep('capture');
    } else {
      setDeliveredIndex((index) => index + 1);
    }
  }

  function handleDeliveredAsPlanned() {
    const product = products[deliveredIndex];
    advance({ actualDeliveredQuantity: plannedOf(product), deviation: null, deviationNote: '' });
  }

  function handleDeviationSubmit() {
    if (!deviationReason) return;
    const product = products[deliveredIndex];
    let actual: number | null = null;
    if (deviationReason === 'skipped') {
      actual = 0;
    } else if (deviationReason === 'different_quantity') {
      const parsed = parseLiters(deviationActual);
      actual = parsed > 0 ? parsed : null;
    }
    advance({ actualDeliveredQuantity: actual, deviation: deviationReason, deviationNote: deviationNote.trim() });
  }

  function handleTicketPhoto(fileName: string) {
    setTicketPhoto(fileName);
    setTicketStep('extracting');
    window.setTimeout(() => {
      const number = fileName || 'DT-88412';
      const lines: TicketLine[] = products.map((product, index) => {
        const planned = plannedOf(product);
        const actual = results[index]?.actualDeliveredQuantity ?? planned;
        return {
          compartmentId: product.compartmentId,
          product: product.product,
          gross: actual + 20,
          net: actual,
        };
      });
      const net = lines.reduce((sum, line) => sum + line.net, 0);
      setTicketNumber(number);
      setTicketLines(lines);
      setAggregateNet(net);
      setManualTicket(number);
      setManualNet(formatLiters(net));
      setTicketStep('confirm');
    }, 1000);
  }

  function confirmDelivery() {
    if (completing) return;
    setCompleting(true);
    const ticket = manual ? manualTicket.trim() : ticketNumber;
    const net = manual ? manualNet.trim() : formatLiters(aggregateNet);
    const pod = podPhoto ?? `POD-${run.orderId.replace('#', '')}`;
    window.setTimeout(() => {
      completeDelivery(run.id, stop.id, {
        actualQuantity: net,
        notes: notes.trim(),
        pod,
        discrepancy: '',
        deliveryTicket: ticket,
        tank: hasTank
          ? {
              initialVolume: parseLiters(tankInitial) || null,
              finalVolume: parseLiters(tankFinal) || null,
              waterInTank: parseLiters(waterInTank) || null,
            }
          : null,
        products: products.map((product, index) => {
          const result = results[index];
          const line = ticketLines[index];
          return {
            compartmentId: product.compartmentId,
            actualDeliveredQuantity: result?.actualDeliveredQuantity ?? plannedOf(product),
            deviation: result?.deviation ?? null,
            deviationNote: result?.deviationNote || null,
            grossQuantity: line?.gross ?? null,
            netQuantity: line?.net ?? null,
          };
        }),
      });
    }, 400);
  }

  function renderTankInitial() {
    return (
      <>
        <div className="flex items-center gap-2 text-[12px] text-foreground-500">
          <i className="ri-drop-line text-sm leading-none" />
          <span>Customer tank · {tankSerial}</span>
        </div>

        <div className="rounded-md border border-primary-300 bg-primary-50 p-5 text-center">
          <p className="text-[13px] font-semibold text-foreground-600">Record tank before unloading</p>
          <p className="mt-1 text-[12px] text-foreground-500">Dip the tank and note the opening level.</p>
        </div>

        <div className="space-y-2.5 rounded-md border border-background-200 bg-background-50 p-3">
          <label className="block">
            <span className="text-[13px] font-semibold text-foreground-700">Initial tank volume (L)</span>
            <input
              type="text"
              inputMode="numeric"
              value={tankInitial}
              onChange={(e) => setTankInitial(e.target.value)}
              placeholder="e.g. 8,000"
              className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 focus:border-primary-400 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-[13px] font-semibold text-foreground-700">Water in tank (L)</span>
            <input
              type="text"
              inputMode="numeric"
              value={waterInTank}
              onChange={(e) => setWaterInTank(e.target.value)}
              placeholder="Optional — 0 if none"
              className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 focus:border-primary-400 focus:outline-none"
            />
          </label>
        </div>

        <button
          type="button"
          disabled={tankInitial.trim().length === 0}
          onClick={() => setStage('deliver')}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-md text-base font-semibold px-4 py-4 whitespace-nowrap transition-colors ${
            tankInitial.trim().length === 0
              ? 'bg-background-200 text-foreground-400 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600 text-background-50 cursor-pointer'
          }`}
        >
          <i className="ri-arrow-right-line text-lg leading-none" />
          Begin Unload
        </button>
      </>
    );
  }

  function renderTankFinal() {
    return (
      <>
        <div className="flex items-center gap-2 text-[12px] text-foreground-500">
          <i className="ri-drop-line text-sm leading-none" />
          <span>Customer tank · {tankSerial}</span>
        </div>

        <div className="rounded-md border border-primary-300 bg-primary-50 p-5 text-center">
          <p className="text-[13px] font-semibold text-foreground-600">Record tank after unloading</p>
          <p className="mt-1 text-[12px] text-foreground-500">Dip the tank again to confirm the delivered amount.</p>
        </div>

        <div className="space-y-2.5 rounded-md border border-background-200 bg-background-50 p-3">
          <label className="block">
            <span className="text-[13px] font-semibold text-foreground-700">Final tank volume (L)</span>
            <input
              type="text"
              inputMode="numeric"
              value={tankFinal}
              onChange={(e) => setTankFinal(e.target.value)}
              placeholder="e.g. 28,000"
              className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 focus:border-primary-400 focus:outline-none"
            />
          </label>
        </div>

        <button
          type="button"
          disabled={tankFinal.trim().length === 0}
          onClick={() => {
            setStage('ticket');
            setTicketStep('capture');
          }}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-md text-base font-semibold px-4 py-4 whitespace-nowrap transition-colors ${
            tankFinal.trim().length === 0
              ? 'bg-background-200 text-foreground-400 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600 text-background-50 cursor-pointer'
          }`}
        >
          <i className="ri-arrow-right-line text-lg leading-none" />
          Continue to Delivery Ticket
        </button>
      </>
    );
  }

  function renderDeliver() {
    const current = products[deliveredIndex];
    const planned = plannedOf(current);
    const compartment = compartmentLabel(current.compartmentId);

    return (
      <>
        {stop.poNumber && (
          <div className="flex items-center gap-2 text-[12px] text-foreground-500">
            <i className="ri-file-list-3-line text-sm leading-none" />
            <span>PO · {stop.poNumber}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold text-foreground-500">
            Compartment {deliveredIndex + 1} of {totalCompartments}
          </p>
          <span className="flex gap-1">
            {products.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-5 rounded-full ${index < deliveredIndex ? 'bg-accent-500' : 'bg-background-200'}`}
              />
            ))}
          </span>
        </div>

        <div className="rounded-md border border-accent-300 bg-accent-50 p-5 text-center">
          <p className="text-[13px] font-semibold text-foreground-600">Deliver this now</p>
          <p className="mt-1.5 text-xl font-bold text-foreground-950">{current.product}</p>
          <p className="mt-2 text-3xl font-bold text-foreground-950 tabular">{formatLiters(planned)}</p>
          {compartment && (
            <p className="mt-1 text-sm font-semibold text-accent-700">from {compartment}</p>
          )}
          {current.tankSerialNumber && (
            <p className="mt-1 text-[12px] text-foreground-500">into Tank {current.tankSerialNumber}</p>
          )}
          {(current.capacityL != null || current.currentL != null) && (
            <p className="mt-2 text-[12px] text-foreground-500">
              Capacity {current.capacityL != null ? formatLiters(current.capacityL) : '—'} · Currently{' '}
              {current.currentL != null ? formatLiters(current.currentL) : '—'} onboard
            </p>
          )}
          {current.retainedQuantity != null && current.retainedQuantity > 0 && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-2.5 py-1 text-[12px] font-semibold text-accent-800">
              <i className="ri-arrow-go-back-line text-sm leading-none" />
              Retain {formatLiters(current.retainedQuantity)} onboard
            </p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-md border border-background-200 bg-background-50 px-3.5 py-2.5">
          <p className="text-[13px] font-semibold text-foreground-700">Time at customer</p>
          <span className="font-heading text-lg font-bold text-foreground-950 tabular">
            {formatClock(customerElapsed)}
          </span>
        </div>

        {showDeviation ? (
          <div className="space-y-3 rounded-md border border-background-200 bg-background-50 p-3">
            <p className="text-[13px] font-semibold text-foreground-800">Delivery differs from plan</p>
            <div className="space-y-1.5">
              {DEVIATION_REASONS.map((reason) => (
                <button
                  key={reason.value}
                  type="button"
                  onClick={() => setDeviationReason(reason.value)}
                  className={`flex w-full items-center gap-2.5 rounded-md border px-3 py-2.5 text-left text-[13px] font-semibold transition-colors cursor-pointer ${
                    deviationReason === reason.value
                      ? 'border-accent-400 bg-accent-50 text-accent-700'
                      : 'border-background-200 bg-background-50 text-foreground-700 hover:bg-background-100'
                  }`}
                >
                  <i className={`${reason.icon} text-base leading-none`} />
                  {reason.label}
                </button>
              ))}
            </div>

            {deviationReason === 'different_quantity' && (
              <label className="block">
                <span className="text-[13px] font-semibold text-foreground-700">Actual delivered quantity (L)</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={deviationActual}
                  onChange={(e) => setDeviationActual(e.target.value)}
                  placeholder={`Planned ${formatLiters(planned)}`}
                  className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 focus:border-primary-400 focus:outline-none"
                />
              </label>
            )}

            {deviationReason === 'skipped' && (
              <p className="text-[12px] text-foreground-500">
                This drop will be marked as skipped and reported to dispatch.
              </p>
            )}

            <label className="block">
              <span className="text-[13px] font-semibold text-foreground-700">Note</span>
              <textarea
                value={deviationNote}
                onChange={(e) => setDeviationNote(e.target.value)}
                maxLength={500}
                rows={2}
                placeholder="Optional — explain what's different"
                className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 placeholder:text-foreground-400 focus:border-primary-400 focus:outline-none resize-none"
              />
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDeviation(false)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!deviationReason}
                onClick={handleDeviationSubmit}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-md text-sm font-semibold px-4 py-3 whitespace-nowrap transition-colors ${
                  deviationReason
                    ? 'bg-accent-500 hover:bg-accent-600 text-background-50 cursor-pointer'
                    : 'bg-background-200 text-foreground-400 cursor-not-allowed'
                }`}
              >
                Save & Continue
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleDeliveredAsPlanned}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 text-background-50 text-base font-semibold px-4 py-4 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-check-double-line text-lg leading-none" />
              Compartment Delivered
            </button>

            <button
              type="button"
              onClick={() => setShowDeviation(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-arrow-left-right-line text-base leading-none" />
              Delivery differs from plan
            </button>

            {onUnable && (
              <button
                type="button"
                onClick={onUnable}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
              >
                <i className="ri-error-warning-line text-base leading-none" />
                Unable to Complete
              </button>
            )}
          </>
        )}
      </>
    );
  }

  function renderTicket() {
    return (
      <>
        <div className="flex items-center gap-2 text-[12px] text-foreground-500">
          <i className="ri-receipt-line text-sm leading-none" />
          <span>
            {totalCompartments} compartment{totalCompartments !== 1 ? 's' : ''} delivered · confirm the ticket
          </span>
        </div>

        {ticketStep === 'capture' && (
          <div className="space-y-3">
            <div className="rounded-md border border-accent-300 bg-accent-50 p-4 text-center">
              <p className="text-[13px] font-semibold text-foreground-600">Take the delivery ticket photo</p>
              <p className="mt-1 text-[12px] text-foreground-500">
                We'll read the meter reading and delivered quantities automatically.
              </p>
            </div>
            <PoDUploader mock pod={ticketPhoto} onUpload={handleTicketPhoto} />
          </div>
        )}

        {ticketStep === 'extracting' && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-background-200 bg-background-50 p-6">
            <i className="ri-loader-4-line text-accent-600 text-3xl leading-none animate-spin" />
            <p className="text-[13px] font-semibold text-foreground-700">Reading the ticket…</p>
            <p className="text-[12px] text-foreground-400">Extracting ticket number and delivered quantities</p>
          </div>
        )}

        {ticketStep === 'confirm' && (
          <div className="space-y-3">
            {!manual ? (
              <>
                <div className="rounded-md border border-background-200 bg-background-50 p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-foreground-500">
                    Extracted from ticket
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[13px] text-foreground-500">Ticket number</span>
                    <span className="text-[13px] font-semibold text-foreground-900 tabular">{ticketNumber}</span>
                  </div>

                  <div className="mt-3 space-y-2 border-t border-background-200 pt-3">
                    {ticketLines.map((line) => (
                      <div key={line.compartmentId || line.product} className="flex items-center justify-between text-[13px]">
                        <span className="text-foreground-600">
                          {line.compartmentId ? `${compartmentLabel(line.compartmentId)} · ` : ''}
                          {line.product}
                        </span>
                        <span className="text-foreground-900 tabular">
                          Gross {formatLiters(line.gross)} · Net {formatLiters(line.net)}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between border-t border-background-200 pt-2 text-[13px] font-semibold">
                      <span className="text-foreground-700">Total</span>
                      <span className="text-accent-700 tabular">Net {formatLiters(aggregateNet)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStage('pod')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-base font-semibold px-4 py-4 whitespace-nowrap cursor-pointer transition-colors"
                >
                  <i className="ri-arrow-right-line text-lg leading-none" />
                  Continue to Proof of Delivery
                </button>

                <button
                  type="button"
                  onClick={() => setManual(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
                >
                  <i className="ri-edit-line text-base leading-none" />
                  Something's off? Enter manually
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2.5 rounded-md border border-background-200 bg-background-50 p-3">
                  <label className="block">
                    <span className="text-[13px] font-semibold text-foreground-700">Ticket number</span>
                    <input
                      type="text"
                      value={manualTicket}
                      onChange={(e) => setManualTicket(e.target.value)}
                      className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 focus:border-primary-400 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[13px] font-semibold text-foreground-700">Delivered quantity (L)</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={manualNet}
                      onChange={(e) => setManualNet(e.target.value)}
                      className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 focus:border-primary-400 focus:outline-none"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  disabled={manualTicket.trim().length === 0}
                  onClick={() => setStage('pod')}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-md text-base font-semibold px-4 py-4 whitespace-nowrap transition-colors ${
                    manualTicket.trim().length === 0
                      ? 'bg-background-200 text-foreground-400 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600 text-background-50 cursor-pointer'
                  }`}
                >
                  <i className="ri-arrow-right-line text-lg leading-none" />
                  Continue to Proof of Delivery
                </button>

                <button
                  type="button"
                  onClick={() => setManual(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
                >
                  <i className="ri-arrow-go-back-line text-base leading-none" />
                  Back to extracted values
                </button>
              </>
            )}
          </div>
        )}
      </>
    );
  }

  function renderPod() {
    return (
      <>
        <div className="flex items-center gap-2 text-[12px] text-foreground-500">
          <i className="ri-file-shield-2-line text-sm leading-none" />
          <span>Ticket {ticketNumber || manualTicket} · attach Proof of Delivery</span>
        </div>

        <div className="space-y-2.5 rounded-md border border-background-200 bg-background-50 p-3">
          <div>
            <span className="text-[13px] font-semibold text-foreground-700">Proof of Delivery</span>
            <div className="mt-1">
              <PoDUploader mock pod={podPhoto} onUpload={setPodPhoto} />
            </div>
          </div>
          <label className="block">
            <span className="text-[13px] font-semibold text-foreground-700">Delivery notes</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="Optional"
              className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 placeholder:text-foreground-400 focus:border-primary-400 focus:outline-none resize-none"
            />
          </label>
        </div>

        <button
          type="button"
          disabled={podPhoto == null || completing}
          onClick={confirmDelivery}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-md text-base font-semibold px-4 py-4 whitespace-nowrap transition-colors ${
            completing
              ? 'bg-accent-500 text-background-50 cursor-default animate-confirm-flash'
              : podPhoto == null
                ? 'bg-background-200 text-foreground-400 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 text-background-50 cursor-pointer'
          }`}
        >
          {completing ? (
            <>
              <i className="ri-checkbox-circle-fill text-lg leading-none" />
              Delivery Completed
            </>
          ) : (
            <>
              <i className="ri-check-line text-lg leading-none" />
              Complete Delivery
            </>
          )}
        </button>
        {podPhoto == null && (
          <p className="text-center text-[11px] text-foreground-400">
            Attach the Proof of Delivery to complete this delivery.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      {stage === 'tank-initial' && renderTankInitial()}
      {stage === 'deliver' && renderDeliver()}
      {stage === 'tank-final' && renderTankFinal()}
      {stage === 'ticket' && renderTicket()}
      {stage === 'pod' && renderPod()}
    </>
  );
}