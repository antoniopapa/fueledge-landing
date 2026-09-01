import { useNavigate } from 'react-router-dom';
import type { Truck } from '@/mocks/fleet';
import { trailers } from '@/mocks/fleet';

export default function TruckOverviewTab({ truck }: { truck: Truck }) {
  const navigate = useNavigate();
  const trailer = truck.trailerId ? trailers.find((t) => t.id === truck.trailerId) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* left */}
      <div className="lg:col-span-2 space-y-4">
        {/* specs */}
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-3">Vehicle Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Capacity</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{truck.capacity}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Compartments</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{truck.compartments}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Product</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900">{truck.product}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">ADR Class</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900">{truck.adrClass}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Year</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{truck.year}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Mileage</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{truck.mileage}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Last Inspection</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900">{truck.lastInspection}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Next Service</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900">{truck.nextService}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Linked Trailer</p>
              <p className="mt-1 text-[13px] font-semibold text-foreground-900">
                {trailer ? `${trailer.plate} · ${trailer.capacity}` : 'None'}
              </p>
            </div>
          </div>
        </div>

        {/* live map */}
        <div className="rounded-lg border border-background-200 overflow-hidden bg-background-100">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-background-200 bg-background-100/40">
            <span className="text-[12px] font-semibold text-foreground-900">Current Position</span>
            <span className="text-[11px] font-medium text-foreground-400">{truck.location}</span>
          </div>
          <div className="relative h-64 md:h-80">
            <iframe
              title={`${truck.plate} position map`}
              src="https://maps.google.com/maps?q=Germany&z=6&output=embed"
              className="absolute inset-0 w-full h-full border-0 [filter:saturate(0.72)_contrast(1.02)]"
              loading="lazy"
              aria-label="Live map showing current truck position"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center ring-2 ring-background-50" style={{ left: '50%', top: '44%' }}>
                <i className="ri-truck-line text-background-50 text-[11px] leading-none" />
              </div>
              <div className="absolute left-3 top-3 bg-background-50/95 rounded-md px-2.5 py-1.5 border border-background-200">
                <span className="text-[9px] font-medium text-foreground-500">Live · {truck.plate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* right */}
      <div className="space-y-4">
        {/* assignment */}
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-3">Assignment</h2>
          {truck.orderId ? (
            <button
              type="button"
              onClick={() => navigate(`/orders/${truck.orderId}`)}
              className="w-full text-left rounded-md border border-background-200 px-3 py-3 hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer"
            >
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Current Run</p>
              <p className="mt-1 text-[13px] font-semibold text-primary-700">{truck.currentAssignment}</p>
              <p className="mt-1 text-[11px] text-foreground-500">
                Driver: {truck.currentDriver ?? '—'}
              </p>
            </button>
          ) : (
            <p className="text-[13px] text-foreground-500">No active run assigned.</p>
          )}

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground-500">Status</span>
              <span className="text-[12px] font-semibold text-foreground-900">{truck.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground-500">Location</span>
              <span className="text-[12px] font-semibold text-foreground-900">{truck.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground-500">Base depot</span>
              <span className="text-[12px] font-semibold text-foreground-900">{truck.base}</span>
            </div>
          </div>
        </div>

        {/* quick stats */}
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-3">Fleet Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-background-100 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Capacity</p>
              <p className="mt-1 text-lg font-bold text-foreground-950 tabular">{truck.capacity}</p>
            </div>
            <div className="rounded-md bg-background-100 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Compartments</p>
              <p className="mt-1 text-lg font-bold text-foreground-950 tabular">{truck.compartments}</p>
            </div>
            <div className="rounded-md bg-background-100 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Mileage</p>
              <p className="mt-1 text-[15px] font-bold text-foreground-950 tabular">{truck.mileage}</p>
            </div>
            <div className="rounded-md bg-background-100 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">ADR</p>
              <p className="mt-1 text-lg font-bold text-foreground-950 tabular">{truck.adrClass.replace('ADR Class ', '')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}