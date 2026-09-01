import { useState } from 'react';
import type { Order } from '@/mocks/orders';
import { sourceCandidates, terminals } from '@/mocks/sourcing';
import CompareSources from './CompareSources';

export default function OrderSourcingTab({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const isSourced = order.source !== '—';
  const terminal = terminals.find((t) => t.id === order.sourceTerminalId);
  const recommended = sourceCandidates[0];

  return (
    <div className="space-y-4">
      {/* source status */}
      <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground-950 mb-1">Source Terminal</h2>
            {isSourced ? (
              <>
                <p className="text-[15px] font-semibold text-foreground-900">{order.source}</p>
                <p className="text-[12px] text-foreground-500">
                  {terminal ? `${terminal.city}, ${terminal.country} · ${terminal.basePrice}/L · ${terminal.allocation} allocation` : 'Terminal details'}
                </p>
              </>
            ) : (
              <p className="text-[13px] text-foreground-500">No source selected yet.</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-flask-line text-sm leading-none" />
            Compare Sources
          </button>
        </div>

        {terminal && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-background-200 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Base Price</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{terminal.basePrice}/L</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Wait Time</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900">{terminal.waitTime}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Loading Cutoff</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{terminal.cutoff}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Status</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900">{terminal.status}</p>
            </div>
          </div>
        )}
      </div>

      {/* recommended opportunity */}
      {!isSourced && (
        <div className="rounded-lg border border-accent-200 bg-accent-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-md bg-accent-100 flex items-center justify-center">
              <i className="ri-star-fill text-accent-600 text-sm leading-none" />
            </span>
            <h2 className="text-sm font-semibold text-foreground-950">Recommended Source</h2>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-[14px] font-semibold text-foreground-900">{recommended.terminal}</p>
              <p className="text-[12px] text-foreground-500">
                {recommended.country} · {recommended.distance} · total {recommended.totalCost}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent-500 hover:bg-accent-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-flask-line text-sm leading-none" />
              Review all options
            </button>
          </div>
        </div>
      )}

      {open && <CompareSources order={order} onClose={() => setOpen(false)} />}
    </div>
  );
}