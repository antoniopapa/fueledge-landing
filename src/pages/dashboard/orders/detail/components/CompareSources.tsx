import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Order } from '@/mocks/orders';
import { sourceCandidates, type SourceCandidate, type SourceRank } from '@/mocks/sourcing';

const rankStyle: Record<SourceRank, string> = {
  Recommended: 'text-accent-700 bg-accent-100',
  Available: 'text-primary-700 bg-primary-100',
  'At Risk': 'text-secondary-700 bg-secondary-100',
  'Not Feasible': 'text-foreground-500 bg-background-200',
};

const rankDot: Record<SourceRank, string> = {
  Recommended: 'bg-accent-500',
  Available: 'bg-primary-500',
  'At Risk': 'bg-secondary-500',
  'Not Feasible': 'bg-background-400',
};

function FactorRow({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <span className="text-[11px] text-foreground-500 whitespace-nowrap">{label}</span>
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-foreground-800 tabular">
        {ok !== undefined && (
          <i
            className={`${ok ? 'ri-checkbox-circle-fill text-accent-500' : 'ri-close-circle-fill text-secondary-500'} text-[12px] leading-none`}
          />
        )}
        {value}
      </span>
    </div>
  );
}

export default function CompareSources({ order, onClose }: { order: Order; onClose: () => void }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  function handleContinue() {
    if (!selected) return;
    onClose();
    navigate('/dispatch');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground-950/40" onClick={onClose} />
      <div className="relative w-full max-w-5xl rounded-lg border border-background-200 bg-background-50 p-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground-950">Compare Sources</h2>
            <p className="text-[12px] text-foreground-500 mt-0.5">
              Order #{order.id} · {order.product} · {order.volume} → {order.destination}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 cursor-pointer"
            aria-label="Close"
          >
            <i className="ri-close-line text-lg leading-none" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sourceCandidates.map((c: SourceCandidate) => {
            const isSel = selected === c.terminalId;
            return (
              <button
                key={c.terminalId}
                type="button"
                onClick={() => setSelected(c.terminalId)}
                className={`rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                  isSel ? 'border-primary-400 bg-primary-50/50' : 'border-background-200 bg-background-50 hover:border-background-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[14px] font-semibold text-foreground-950">{c.terminal}</p>
                    <p className="text-[11px] text-foreground-400">{c.country} · {c.distance}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${rankStyle[c.rank]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${rankDot[c.rank]}`} />
                    {c.rank}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-3 divide-y divide-background-100">
                  <FactorRow label="Fuel price" value={c.fuelPrice} />
                  <FactorRow label="Contract price" value={c.contractPrice} />
                  <FactorRow label="Discount" value={c.discount} />
                  <FactorRow label="Freight" value={c.freight} />
                  <FactorRow label="Allocation" value={c.allocation} />
                  <FactorRow label="Product availability" value={c.productAvailable ? 'Yes' : 'No'} ok={c.productAvailable} />
                  <FactorRow label="Terminal availability" value={c.terminalAvailable ? 'Open' : 'Closed'} ok={c.terminalAvailable} />
                  <FactorRow label="Wait time" value={c.waitTime} />
                  <FactorRow label="Loading cutoff" value={c.cutoff} />
                  <FactorRow label="Traffic" value={c.traffic} />
                  <FactorRow label="Truck available" value={c.truckAvailable ? 'Yes' : 'No'} ok={c.truckAvailable} />
                  <FactorRow label="Driver available" value={c.driverAvailable ? 'Yes' : 'No'} ok={c.driverAvailable} />
                  <FactorRow label="Driver shift" value={c.driverShift} />
                  <FactorRow label="Delivery window" value={c.windowFit} />
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-background-200 pt-3">
                  <span className="text-[12px] font-semibold text-foreground-900 tabular">{c.totalCost}</span>
                  <span className="text-[11px] text-foreground-500">{c.notes}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-foreground-600 hover:bg-background-100 whitespace-nowrap cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selected}
            className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              selected
                ? 'bg-primary-500 hover:bg-primary-600 text-background-50'
                : 'bg-background-200 text-foreground-400 cursor-not-allowed'
            }`}
          >
            <i className="ri-send-plane-line text-sm leading-none" />
            Select Source &amp; Continue to Dispatch
          </button>
        </div>
      </div>
    </div>
  );
}