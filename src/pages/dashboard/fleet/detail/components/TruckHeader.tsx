import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Truck } from '@/mocks/fleet';
import { trailers } from '@/mocks/fleet';
import TruckStatusBadge from '../../components/TruckStatusBadge';
import EditTruckModal from './EditTruckModal';

export default function TruckHeader({ truck }: { truck: Truck }) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const trailer = truck.trailerId ? trailers.find((t) => t.id === truck.trailerId) : null;

  function handleSaved(msg: string) {
    setEditOpen(false);
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  }

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
      <button
        type="button"
        onClick={() => navigate('/trucks')}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground-500 hover:text-foreground-900 mb-4 cursor-pointer transition-colors whitespace-nowrap"
      >
        <i className="ri-arrow-left-line text-[13px] leading-none" />
        All trucks
      </button>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="w-14 h-14 rounded-md bg-primary-100 flex items-center justify-center shrink-0">
            <i className="ri-truck-line text-primary-700 text-2xl leading-none" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground-950">{truck.plate}</h1>
              <TruckStatusBadge status={truck.status} />
            </div>
            <p className="mt-0.5 text-[13px] text-foreground-500">
              {truck.make} {truck.model} · {truck.type} · {truck.year}
            </p>
            <p className="mt-0.5 text-[12px] text-foreground-500 flex items-center gap-1.5">
              <i className="ri-truck-line text-foreground-400 text-[13px]" />
              Trailer ·{' '}
              {trailer ? (
                <span className="font-semibold text-foreground-700">
                  {trailer.plate} · {trailer.capacity}
                </span>
              ) : (
                <span className="text-foreground-400">None</span>
              )}
            </p>
            <div className="mt-1.5 flex items-center gap-3 text-[12px] text-foreground-500 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <i className="ri-map-pin-line text-foreground-400 text-[13px]" />
                {truck.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="ri-building-4-line text-foreground-400 text-[13px]" />
                {truck.base}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Current Driver</p>
            {truck.currentDriver ? (
              truck.currentDriverId ? (
                <button
                  type="button"
                  onClick={() => navigate(`/drivers/${truck.currentDriverId}`)}
                  className="text-[14px] font-semibold text-primary-700 hover:underline cursor-pointer whitespace-nowrap"
                >
                  {truck.currentDriver}
                </button>
              ) : (
                <span className="text-[14px] font-semibold text-foreground-700 whitespace-nowrap">
                  {truck.currentDriver}
                </span>
              )
            ) : (
              <span className="text-[14px] text-foreground-400">Unassigned</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-background-200 bg-background-50 px-3 py-2 text-[12px] font-medium text-foreground-700 hover:bg-background-100 whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-edit-line text-[13px] leading-none" />
            Edit
          </button>
        </div>
      </div>

      {editOpen && <EditTruckModal truck={truck} onClose={() => setEditOpen(false)} onSaved={handleSaved} />}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          {toast}
        </div>
      )}
    </div>
  );
}