import { useMemo, useState } from 'react';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import FleetKpis from '@/pages/dashboard/fleet/components/FleetKpis';
import FleetFilters from '@/pages/dashboard/fleet/components/FleetFilters';
import FleetTable from '@/pages/dashboard/fleet/components/FleetTable';
import { trucks, type TruckStatus } from '@/mocks/fleet';

export default function FleetPage() {
  const [status, setStatus] = useState<TruckStatus | null>(null);
  const [search, setSearch] = useState('');
  const [make, setMake] = useState('');
  const [type, setType] = useState('');
  const [base, setBase] = useState('');

  const makeOptions = useMemo(
    () => Array.from(new Set(trucks.map((t) => t.make))).sort(),
    [],
  );
  const typeOptions = useMemo(
    () => Array.from(new Set(trucks.map((t) => t.type))).sort(),
    [],
  );
  const baseOptions = useMemo(
    () => Array.from(new Set(trucks.map((t) => t.base))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    return trucks.filter((t) => {
      if (status && t.status !== status) return false;
      if (make && t.make !== make) return false;
      if (type && t.type !== type) return false;
      if (base && t.base !== base) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = `${t.plate} ${t.make} ${t.model} ${t.currentDriver ?? ''} ${t.location} ${t.base}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [status, make, type, base, search]);

  return (
    <DashboardShell>
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground-950">Trucks</h1>
          <p className="text-sm text-foreground-500 mt-0.5">
            Track tanker trucks, their assignments, and maintenance status.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
        >
          <i className="ri-add-line text-sm leading-none" />
          Add Truck
        </button>
      </div>

      {/* KPIs */}
      <FleetKpis />

      {/* filters */}
      <div className="mt-4">
        <FleetFilters
          status={status}
          onStatus={setStatus}
          search={search}
          onSearch={setSearch}
          make={make}
          onMake={setMake}
          type={type}
          onType={setType}
          base={base}
          onBase={setBase}
          makeOptions={makeOptions}
          typeOptions={typeOptions}
          baseOptions={baseOptions}
          resultCount={filtered.length}
        />
      </div>

      {/* table */}
      <div className="mt-4">
        {filtered.length > 0 ? (
          <FleetTable trucks={filtered} />
        ) : (
          <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-12 text-center">
            <i className="ri-truck-line text-foreground-300 text-3xl leading-none" />
            <p className="mt-3 text-sm font-medium text-foreground-600">No trucks match your filters</p>
            <p className="text-xs text-foreground-400 mt-1">Try adjusting your search or clearing a filter.</p>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}