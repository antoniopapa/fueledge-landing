import { useState, type FormEvent } from 'react';

type AddDriverModalProps = {
  onClose: () => void;
  onAdded: (name: string) => void;
};

export default function AddDriverModal({ onClose, onAdded }: AddDriverModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [truck, setTruck] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onAdded(name || 'New driver');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground-950/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-lg border border-background-200 bg-background-50 p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground-950">Add Driver</h2>
            <p className="text-[12px] text-foreground-500 mt-0.5">Create a new driver profile in your fleet.</p>
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
              placeholder="e.g. Anna Schmidt"
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
              placeholder="+49 170 000 0000"
              className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Assign truck (optional)</label>
            <input
              type="text"
              value={truck}
              onChange={(e) => setTruck(e.target.value)}
              placeholder="e.g. DE-XX-123"
              className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
            />
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
              <i className="ri-add-line text-sm leading-none" />
              Add Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}