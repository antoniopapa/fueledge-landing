import { useEffect, useState } from 'react';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import type { Driver } from '@/mocks/drivers';
import { createDriver, deleteDriver, fetchDrivers, updateDriver } from '@/mocks/schedule';

function initialsFromName(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}

function makeDriver(firstName: string, lastName: string, email: string, phone: string, active: boolean): Driver {
  const name = `${firstName} ${lastName}`.trim();
  return {
    id: name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') || `driver-${Date.now()}`,
    name,
    initials: initialsFromName(name),
    status: active ? 'Available' : 'Off Duty',
    exceptions: [],
    truck: null,
    currentAssignment: email || null,
    product: 'Diesel EN590',
    volume: '—',
    route: '—',
    location: email || '—',
    shift: '—',
    todayRuns: '0/0',
    nextAssignment: '—',
    eta: null,
    phone,
    schedule: [],
    history: [],
  };
}

function apiPayloadFromDriver(driver: Driver, active = driver.status !== 'Off Duty') {
  const { firstName, lastName } = splitName(driver.name);

  return {
    id: driver.id,
    firstName,
    lastName,
    email: driver.location !== '—' ? driver.location : driver.currentAssignment ?? '',
    phone: driver.phone !== '—' ? driver.phone : '',
    active,
  };
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchDrivers()
      .then((apiDrivers) => {
        if (active) setDrivers(apiDrivers);
      })
      .catch(() => {
        if (active) setToast('Unable to load drivers.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }

  async function handleAdd() {
    const firstName = window.prompt('First name')?.trim();
    if (!firstName) return;

    const lastName = window.prompt('Last name')?.trim() ?? '';
    const email = window.prompt('Email')?.trim() ?? '';
    const phone = window.prompt('Phone')?.trim() ?? '';
    const active = window.confirm('Should this driver be active?');

    const draft = makeDriver(firstName, lastName, email, phone, active);
    try {
      const created = await createDriver(apiPayloadFromDriver(draft, active));
      setDrivers((items) => [...items, created]);
      showToast(`${created.name} added`);
    } catch {
      setDrivers((items) => [...items, draft]);
      showToast(`${draft.name} added locally`);
    }
  }

  async function handleEdit(driver: Driver) {
    const current = splitName(driver.name);
    const firstName = window.prompt('First name', current.firstName)?.trim();
    if (!firstName) return;

    const lastName = window.prompt('Last name', current.lastName)?.trim() ?? '';
    const email = window.prompt('Email', driver.location === '—' ? '' : driver.location)?.trim() ?? '';
    const phone = window.prompt('Phone', driver.phone === '—' ? '' : driver.phone)?.trim() ?? '';
    const active = window.confirm('Should this driver be active?');
    const name = `${firstName} ${lastName}`.trim();
    const patch: Partial<Driver> = {
      name,
      initials: initialsFromName(name),
      status: active ? 'Available' : 'Off Duty',
      phone,
      currentAssignment: email || null,
      location: email || '—',
    };

    try {
      const updated = await updateDriver(driver.id, {
        ...apiPayloadFromDriver({ ...driver, ...patch }, active),
        id: driver.id,
      });
      setDrivers((items) => items.map((item) => (item.id === driver.id ? updated : item)));
      showToast(`${updated.name} updated`);
    } catch {
      setDrivers((items) => items.map((item) => (item.id === driver.id ? { ...item, ...patch } : item)));
      showToast(`${name} updated locally`);
    }
  }

  async function handleRemove(driver: Driver) {
    if (!window.confirm(`Remove ${driver.name}?`)) return;
    const previous = drivers;
    setDrivers((items) => items.filter((item) => item.id !== driver.id));

    try {
      await deleteDriver(driver.id);
      showToast(`${driver.name} removed`);
    } catch {
      setDrivers(previous);
      showToast(`Unable to remove ${driver.name}`);
    }
  }

  return (
    <DashboardShell>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground-950">Drivers</h1>
          <p className="mt-0.5 text-sm text-foreground-500">{loading ? 'Loading drivers...' : 'Manage driver records.'}</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-4 py-2.5 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600"
        >
          <i className="ri-add-line text-sm leading-none" />
          Add
        </button>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Driver</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Email</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Phone</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Active</th>
                <th className="px-4 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {drivers.map((driver) => (
                <tr key={driver.id} className="transition-colors hover:bg-background-100/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-700">
                        {driver.initials}
                      </span>
                      <span className="whitespace-nowrap text-[12px] font-semibold text-foreground-900">{driver.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700">{driver.location}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700">{driver.phone}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700">{driver.status === 'Off Duty' ? 'No' : 'Yes'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(driver)}
                        className="inline-flex items-center gap-1 rounded-md border border-background-200 px-2.5 py-1.5 text-[12px] font-medium text-foreground-700 transition-colors hover:bg-background-100"
                      >
                        <i className="ri-edit-line text-sm leading-none" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(driver)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2.5 py-1.5 text-[12px] font-medium text-red-700 transition-colors hover:bg-red-50"
                      >
                        <i className="ri-delete-bin-line text-sm leading-none" />
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          {toast}
        </div>
      )}
    </DashboardShell>
  );
}
