import { useState, type FormEvent } from 'react';
import type { Driver, DriverStatus } from '@/mocks/drivers';

const statuses: DriverStatus[] = [
  'Available',
  'Assigned',
  'Loading',
  'In Transit',
  'Delivering',
  'Break',
  'Off Duty',
];

type EditDriverModalProps = {
  driver: Driver;
  onClose: () => void;
  onSaved: (msg: string) => void;
};

export default function EditDriverModal({ driver, onClose, onSaved }: EditDriverModalProps) {
  const [name, setName] = useState(driver.name);
  const [phone, setPhone] = useState(driver.phone);
  const [status, setStatus] = useState<DriverStatus>(driver.status);
  const [shift, setShift] = useState(driver.shift);
  const [truck, setTruck] = useState(driver.truck ?? '');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSaved('Driver updated');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground-950/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-lg border border-background-200 bg-background-50 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground-950">Edit Driver</h2>
            <p className="text-[12px] text-foreground-500 mt-0.5">Update {driver.name}&apos;s profile and assignment.</p>
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
            <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
            />
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Shift</label>
              <input
                type="text"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                placeholder="06:00–16:00"
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Truck</label>
              <input
                type="text"
                value={truck}
                onChange={(e) => setTruck(e.target.value)}
                placeholder="e.g. TR-76-BX"
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
              />
            </div>
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