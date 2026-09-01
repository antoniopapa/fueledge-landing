import { useState } from 'react';
import type { DriverRun, PickupProduct, Stop, LoadDeviationReason } from '@/mocks/driver';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import { useElapsed } from '@/pages/driver/useElapsed';
import { parseLiters, formatLiters, formatClock } from '@/pages/driver/driverUtils';
import BoLUploader from '@/pages/driver/components/BoLUploader';

interface BolLine {
  compartmentId: string;
  product: string;
  gross: number;
  net: number;
}

interface ExtractedBol {
  bol: string;
  loadingNumber: string;
  lines: BolLine[];
  hasCompartmentLines: boolean;
  aggregateGross: number;
  aggregateNet: number;
}

interface LoadResult {
  actualLoadedQuantity: number | null;
  deviation: LoadDeviationReason | null;
  deviationNote: string;
}

const DEVIATION_REASONS: { value: LoadDeviationReason; label: string; icon: string }[] = [
  { value: 'different_quantity', label: 'Different quantity', icon: 'ri-scales-3-line' },
  { value: 'different_compartment', label: 'Different compartment', icon: 'ri-swap-line' },
  { value: 'product_unavailable', label: 'Product unavailable', icon: 'ri-close-circle-line' },
  { value: 'skipped', label: 'Skip this load', icon: 'ri-skip-forward-line' },
  { value: 'other', label: 'Other', icon: 'ri-more-line' },
];

/** "C2" → "Compartment 2". */
function compartmentLabel(id: string): string {
  const match = id.match(/\d+/);
  return match ? `Compartment ${match[0]}` : id;
}

/**
 * Fallback: when a pickup has no explicit compartment mapping, split its total
 * quantity into realistic ~7,000 L chunks so the flow still works. In production
 * this mapping always arrives from dispatch — dispatch sends only the compartments
 * actually planned, so the driver never sees unused ones.
 */
function compartmentsForStop(stop: Stop): PickupProduct[] {
  if (stop.pickupProducts && stop.pickupProducts.length > 0) {
    return stop.pickupProducts;
  }
  const total = parseLiters(stop.quantity);
  const result: PickupProduct[] = [];
  const chunk = 7000;
  let remaining = total;
  let index = 1;
  while (remaining > 0) {
    const amount = Math.min(chunk, remaining);
    result.push({
      product: stop.fuelType,
      compartmentId: `C${index}`,
      capacityL: null,
      currentL: null,
      plannedQuantity: amount,
      expectedGrossQuantity: amount,
      actualLoadedQuantity: null,
      grossQuantity: null,
      netQuantity: null,
      retainedQuantity: null,
      deviation: null,
    });
    remaining -= amount;
    index += 1;
  }
  return result;
}

export default function PickupFlow({
  run,
  stop,
  onUnable,
}: {
  run: DriverRun;
  stop: Stop;
  onUnable?: () => void;
}) {
  const { markLoadCompleted, completePickup } = useDriverApp();

  const products = compartmentsForStop(stop);
  const totalCompartments = products.length;

  const [stage, setStage] = useState<'loading' | 'bol'>('loading');
  const [loadedIndex, setLoadedIndex] = useState(0);
  const [results, setResults] = useState<LoadResult[]>([]);

  // Deviation form state
  const [showDeviation, setShowDeviation] = useState(false);
  const [deviationReason, setDeviationReason] = useState<LoadDeviationReason | null>(null);
  const [deviationActual, setDeviationActual] = useState('');
  const [deviationNote, setDeviationNote] = useState('');

  // BOL state
  const [bolStep, setBolStep] = useState<'capture' | 'extracting' | 'confirm'>('capture');
  const [bolPhoto, setBolPhoto] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ExtractedBol | null>(null);
  const [manual, setManual] = useState(false);
  const [manualBol, setManualBol] = useState('');
  const [manualLoading, setManualLoading] = useState('');
  const [manualGross, setManualGross] = useState('');
  const [manualNet, setManualNet] = useState('');
  const [completing, setCompleting] = useState(false);

  const terminalElapsed = useElapsed(stop.status === 'Arrived' ? stop.arrivedAt : null);

  function plannedOf(product: PickupProduct): number {
    return product.plannedQuantity ?? product.expectedGrossQuantity ?? 0;
  }

  function advance(result: LoadResult) {
    const nextResults = [...results];
    nextResults[loadedIndex] = result;
    setResults(nextResults);
    setShowDeviation(false);
    setDeviationReason(null);
    setDeviationActual('');
    setDeviationNote('');
    if (loadedIndex === totalCompartments - 1) {
      markLoadCompleted(run.id, stop.id);
      setStage('bol');
    } else {
      setLoadedIndex((index) => index + 1);
    }
  }

  function handleLoadedAsPlanned() {
    const product = products[loadedIndex];
    advance({ actualLoadedQuantity: plannedOf(product), deviation: null, deviationNote: '' });
  }

  function handleDeviationSubmit() {
    if (!deviationReason) return;
    const product = products[loadedIndex];
    let actual: number | null = null;
    if (deviationReason === 'skipped') {
      actual = 0;
    } else if (deviationReason === 'different_quantity') {
      const parsed = parseLiters(deviationActual);
      actual = parsed > 0 ? parsed : null;
    }
    advance({
      actualLoadedQuantity: actual,
      deviation: deviationReason,
      deviationNote: deviationNote.trim(),
    });
  }

  function handleBolPhoto(fileName: string) {
    setBolPhoto(fileName);
    setBolStep('extracting');
    window.setTimeout(() => {
      const bol = fileName || 'BOL-88412';
      const loadingNumber = stop.loadingNumber ?? 'LN-88412';
      // Per-compartment extraction: each planned compartment gets its own gross/net line.
      const lines: BolLine[] = products.map((product, index) => {
        const planned = plannedOf(product);
        const actual =
          results[index]?.actualLoadedQuantity ?? planned;
        const gross = actual + 40;
        const net = actual + 2;
        return {
          compartmentId: product.compartmentId,
          product: product.product,
          gross,
          net,
        };
      });
      const aggregateGross = lines.reduce((sum, line) => sum + line.gross, 0);
      const aggregateNet = lines.reduce((sum, line) => sum + line.net, 0);
      setExtracted({
        bol,
        loadingNumber,
        lines,
        hasCompartmentLines: totalCompartments > 1,
        aggregateGross,
        aggregateNet,
      });
      setManualBol(bol);
      setManualLoading(loadingNumber);
      setManualGross(formatLiters(aggregateGross));
      setManualNet(formatLiters(aggregateNet));
      setBolStep('confirm');
    }, 1100);
  }

  function confirmPickup() {
    if (completing) return;
    setCompleting(true);
    const bol = manual ? manualBol.trim() : extracted?.bol ?? '';
    const loadingNumber = manual ? manualLoading.trim() : extracted?.loadingNumber ?? '';
    const net = manual ? manualNet.trim() : formatLiters(extracted?.aggregateNet ?? 0);
    const gross = manual ? manualGross.trim() : formatLiters(extracted?.aggregateGross ?? 0);
    window.setTimeout(() => {
      completePickup(run.id, stop.id, {
        actualQuantity: net,
        bol,
        loadingNumber: loadingNumber || null,
        grossQuantity: gross || null,
        netQuantity: net || null,
        discrepancy: '',
        products: products.map((product, index) => {
          const result = results[index];
          const line = extracted?.lines[index];
          return {
            compartmentId: product.compartmentId,
            actualLoadedQuantity: result?.actualLoadedQuantity ?? plannedOf(product),
            deviation: result?.deviation ?? null,
            deviationNote: result?.deviationNote || null,
            grossQuantity: line?.gross ?? null,
            netQuantity: line?.net ?? null,
          };
        }),
      });
    }, 400);
  }

  if (stage === 'loading') {
    const current = products[loadedIndex];
    const planned = plannedOf(current);

    return (
      <>
        {stop.supplier && (
          <div className="flex items-center gap-2 text-[12px] text-foreground-500">
            <i className="ri-store-2-line text-sm leading-none" />
            <span>Supplier · {stop.supplier}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold text-foreground-500">
            Compartment {loadedIndex + 1} of {totalCompartments}
          </p>
          <span className="flex gap-1">
            {products.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-5 rounded-full ${index < loadedIndex ? 'bg-primary-500' : 'bg-background-200'}`}
              />
            ))}
          </span>
        </div>

        <div className="rounded-md border border-primary-300 bg-primary-50 p-5 text-center">
          <p className="text-[13px] font-semibold text-foreground-600">Load this now</p>
          <p className="mt-1.5 text-xl font-bold text-foreground-950">{current.product}</p>
          <p className="mt-2 text-3xl font-bold text-foreground-950 tabular">
            {formatLiters(planned)}
          </p>
          <p className="mt-1 text-sm font-semibold text-primary-700">
            → {compartmentLabel(current.compartmentId)}
          </p>
          {(current.capacityL != null || current.currentL != null) && (
            <p className="mt-2 text-[12px] text-foreground-500">
              Capacity {current.capacityL != null ? formatLiters(current.capacityL) : '—'} · Currently{' '}
              {current.currentL != null ? formatLiters(current.currentL) : '—'} onboard
            </p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-md border border-background-200 bg-background-50 px-3.5 py-2.5">
          <p className="text-[13px] font-semibold text-foreground-700">Time at terminal</p>
          <span className="font-heading text-lg font-bold text-foreground-950 tabular">
            {formatClock(terminalElapsed)}
          </span>
        </div>

        {showDeviation ? (
          <div className="space-y-3 rounded-md border border-background-200 bg-background-50 p-3">
            <p className="text-[13px] font-semibold text-foreground-800">Loading differs from plan</p>
            <div className="space-y-1.5">
              {DEVIATION_REASONS.map((reason) => (
                <button
                  key={reason.value}
                  type="button"
                  onClick={() => setDeviationReason(reason.value)}
                  className={`flex w-full items-center gap-2.5 rounded-md border px-3 py-2.5 text-left text-[13px] font-semibold transition-colors cursor-pointer ${
                    deviationReason === reason.value
                      ? 'border-primary-400 bg-primary-50 text-primary-700'
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
                <span className="text-[13px] font-semibold text-foreground-700">Actual loaded quantity (L)</span>
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
                This load will be marked as skipped and reported to dispatch.
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
                    ? 'bg-primary-500 hover:bg-primary-600 text-background-50 cursor-pointer'
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
              onClick={handleLoadedAsPlanned}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-base font-semibold px-4 py-4 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-check-double-line text-lg leading-none" />
              Loading Complete
            </button>

            <button
              type="button"
              onClick={() => setShowDeviation(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-background-300 bg-background-50 text-foreground-600 hover:bg-background-100 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-arrow-left-right-line text-base leading-none" />
              Loading differs from plan
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

  return (
    <>
      <div className="flex items-center gap-2 text-[12px] text-foreground-500">
        <i className="ri-file-text-line text-sm leading-none" />
        <span>
          {totalCompartments} compartment{totalCompartments !== 1 ? 's' : ''} loaded · confirm the BoL
        </span>
      </div>

      {bolStep === 'capture' && (
        <div className="space-y-3">
          <div className="rounded-md border border-primary-300 bg-primary-50 p-4 text-center">
            <p className="text-[13px] font-semibold text-foreground-600">Take the Bill of Lading photo</p>
            <p className="mt-1 text-[12px] text-foreground-500">
              We'll read the BoL number, loading number and quantities automatically.
            </p>
          </div>
          <BoLUploader mock bol={bolPhoto} onUpload={handleBolPhoto} />
        </div>
      )}

      {bolStep === 'extracting' && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-background-200 bg-background-50 p-6">
          <i className="ri-loader-4-line text-primary-600 text-3xl leading-none animate-spin" />
          <p className="text-[13px] font-semibold text-foreground-700">Reading the BoL…</p>
          <p className="text-[12px] text-foreground-400">Extracting BoL number, loading number and quantities</p>
        </div>
      )}

      {bolStep === 'confirm' && extracted && (
        <div className="space-y-3">
          {!manual ? (
            <>
              <div className="rounded-md border border-background-200 bg-background-50 p-4">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-foreground-500">
                  Extracted from BoL
                </p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-foreground-500">BoL number</span>
                    <span className="text-[13px] font-semibold text-foreground-900 tabular">{extracted.bol}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-foreground-500">Loading number</span>
                    <span className="text-[13px] font-semibold text-foreground-900 tabular">{extracted.loadingNumber}</span>
                  </div>
                </div>

                <div className="mt-3 space-y-2 border-t border-background-200 pt-3">
                  {extracted.hasCompartmentLines ? (
                    <>
                      {extracted.lines.map((line) => (
                        <div key={line.compartmentId} className="flex items-center justify-between text-[13px]">
                          <span className="text-foreground-600">
                            {compartmentLabel(line.compartmentId)} · {line.product}
                          </span>
                          <span className="text-foreground-900 tabular">
                            Gross {formatLiters(line.gross)} · Net {formatLiters(line.net)}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between border-t border-background-200 pt-2 text-[13px] font-semibold">
                        <span className="text-foreground-700">Total</span>
                        <span className="text-primary-700 tabular">
                          Gross {formatLiters(extracted.aggregateGross)} · Net {formatLiters(extracted.aggregateNet)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-foreground-500">Expected</span>
                        <span className="text-[13px] text-foreground-500 tabular">
                          {formatLiters(products.reduce((sum, p) => sum + plannedOf(p), 0))}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-foreground-500">Gross</span>
                        <span className="text-[13px] font-semibold text-foreground-900 tabular">
                          {formatLiters(extracted.aggregateGross)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-foreground-500">Net</span>
                        <span className="text-[15px] font-bold text-primary-700 tabular">
                          {formatLiters(extracted.aggregateNet)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                type="button"
                disabled={completing}
                onClick={confirmPickup}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-md text-base font-semibold px-4 py-4 whitespace-nowrap transition-colors ${
                  completing
                    ? 'bg-accent-500 text-background-50 cursor-default animate-confirm-flash'
                    : 'bg-primary-500 hover:bg-primary-600 text-background-50 cursor-pointer'
                }`}
              >
                {completing ? (
                  <>
                    <i className="ri-checkbox-circle-fill text-lg leading-none" />
                    Pickup Completed
                  </>
                ) : (
                  <>
                    <i className="ri-check-line text-lg leading-none" />
                    Confirm Quantities
                  </>
                )}
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
                  <span className="text-[13px] font-semibold text-foreground-700">BoL number</span>
                  <input
                    type="text"
                    value={manualBol}
                    onChange={(e) => setManualBol(e.target.value)}
                    className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 focus:border-primary-400 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-[13px] font-semibold text-foreground-700">Loading number</span>
                  <input
                    type="text"
                    value={manualLoading}
                    onChange={(e) => setManualLoading(e.target.value)}
                    className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 focus:border-primary-400 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-[13px] font-semibold text-foreground-700">Gross (L)</span>
                  <input
                    type="text"
                    value={manualGross}
                    onChange={(e) => setManualGross(e.target.value)}
                    className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 focus:border-primary-400 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-[13px] font-semibold text-foreground-700">Net (L)</span>
                  <input
                    type="text"
                    value={manualNet}
                    onChange={(e) => setManualNet(e.target.value)}
                    className="mt-1 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-base text-foreground-900 focus:border-primary-400 focus:outline-none"
                  />
                </label>
              </div>

              <button
                type="button"
                disabled={manualBol.trim().length === 0 || completing}
                onClick={confirmPickup}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-md text-base font-semibold px-4 py-4 whitespace-nowrap transition-colors ${
                  completing
                    ? 'bg-accent-500 text-background-50 cursor-default animate-confirm-flash'
                    : manualBol.trim().length === 0
                      ? 'bg-background-200 text-foreground-400 cursor-not-allowed'
                      : 'bg-primary-500 hover:bg-primary-600 text-background-50 cursor-pointer'
                }`}
              >
                <i className="ri-check-line text-lg leading-none" />
                Confirm & Complete Pickup
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