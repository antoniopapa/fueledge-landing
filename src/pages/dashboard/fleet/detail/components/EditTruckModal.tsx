import { useState, type FormEvent } from 'react';
import type { Truck, TruckStatus } from '@/mocks/fleet';
import { trailers } from '@/mocks/fleet';

const statuses: TruckStatus[] = [
  'Available',
  'Assigned',
  'Loading',
  'On Route',
  'Maintenance',
  'Off Duty',
];

type EditTruckModalProps = {
  truck: Truck;
  onClose: () => void;
  onSaved: (msg: string) => void;
};

export default function EditTruckModal({ truck, onClose, onSaved }: EditTruckModalProps) {
  const [status, setStatus] = useState<TruckStatus>(truck.status);
  const [driver, setDriver] = useState(truck.currentDriver ?? '');
  const [location, setLocation] = useState(truck.location);
  const [trailerId, setTrailerId] = useState(truck.trailerId ?? '');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const changed =
      status !== truck.status ||
      driver !== (truck.currentDriver ?? '') ||
      location !== truck.location ||
      trailerId !== (truck.trailerId ?? '');
    onSaved(changed ? 'Truck details updated' : 'No changes made');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground-950/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-lg border border-background-200 bg-background-50 p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground-950">Edit Truck</h2>
            <p className="text-[12px] text-foreground-500 mt-0.5">{truck.plate} · {truck.make} {truck.model}</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`px-2.5 py-1.5 rounded-md text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    status === s
                      ? 'bg-primary-500 text-background-50'
                      : 'bg-background-100 text-foreground-600 hover:bg-background-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Assigned driver</label>
            <input
              type="text"
              value={driver}
              onChange={(e) => setDriver(e.target.value)}
              placeholder="Driver name"
              className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Current location"
              className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Linked trailer</label>
            <select
              value={trailerId}
              onChange={(e) => setTrailerId(e.target.value)}
              className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 cursor-pointer"
            >
              <option value="">None</option>
              {trailers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.plate} · {t.capacity}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-foreground-600 hover:bg-background-100 whitespace-nowrap cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-check-line text-sm leading-none" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}