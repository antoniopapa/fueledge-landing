import { useMemo, useState } from 'react';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import DriverKpis from '@/pages/dashboard/drivers/components/DriverKpis';
import DriverFilters from '@/pages/dashboard/drivers/components/DriverFilters';
import DriversTable from '@/pages/dashboard/drivers/components/DriversTable';
import AddDriverModal from '@/pages/dashboard/drivers/components/AddDriverModal';
import { drivers, type DriverStatus } from '@/mocks/drivers';

export default function DriversPage() {
  const [status, setStatus] = useState<DriverStatus | null>(null);
  const [search, setSearch] = useState('');
  const [truck, setTruck] = useState('');
  const [location, setLocation] = useState('');
  const [shift, setShift] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const truckOptions = useMemo(
    () => Array.from(new Set(drivers.map((d) => d.truck).filter((t): t is string => Boolean(t)))).sort(),
    [],
  );
  const locationOptions = useMemo(
    () => Array.from(new Set(drivers.map((d) => d.location).filter((l) => l !== '—'))).sort(),
    [],
  );
  const shiftOptions = useMemo(
    () => Array.from(new Set(drivers.map((d) => d.shift).filter((s) => s !== '—'))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    return drivers.filter((d) => {
      if (status && d.status !== status) return false;
      if (truck && d.truck !== truck) return false;
      if (location && d.location !== location) return false;
      if (shift && d.shift !== shift) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = `${d.name} ${d.currentAssignment ?? ''} ${d.location} ${d.truck ?? ''} ${d.nextAssignment}`
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [status, truck, location, shift, search]);

  function handleAdded(name: string) {
    setModalOpen(false);
    setToast(`${name} added to the roster`);
    window.setTimeout(() => setToast(null), 2800);
  }

  return (
    <DashboardShell>
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground-950">Drivers</h1>
          <p className="text-sm text-foreground-500 mt-0.5">
            Manage driver availability, assignments, shifts, and delivery activity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
        >
          <i className="ri-add-line text-sm leading-none" />
          Add Driver
        </button>
      </div>

      {/* KPIs */}
      <DriverKpis />

      {/* filters */}
      <div className="mt-4">
        <DriverFilters
          status={status}
          onStatus={setStatus}
          search={search}
          onSearch={setSearch}
          truck={truck}
          onTruck={setTruck}
          location={location}
          onLocation={setLocation}
          shift={shift}
          onShift={setShift}
          truckOptions={truckOptions}
          locationOptions={locationOptions}
          shiftOptions={shiftOptions}
          resultCount={filtered.length}
        />
      </div>

      {/* table */}
      <div className="mt-4">
        {filtered.length > 0 ? (
          <DriversTable drivers={filtered} />
        ) : (
          <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-12 text-center">
            <i className="ri-user-search-line text-foreground-300 text-3xl leading-none" />
            <p className="mt-3 text-sm font-medium text-foreground-600">No drivers match your filters</p>
            <p className="text-xs text-foreground-400 mt-1">Try adjusting your search or clearing a filter.</p>
          </div>
        )}
      </div>

      {/* add driver modal */}
      {modalOpen && <AddDriverModal onClose={() => setModalOpen(false)} onAdded={handleAdded} />}

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          {toast}
        </div>
      )}
    </DashboardShell>
  );
}