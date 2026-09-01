import { useMemo, useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import LocationsTable, { type LocationRow } from './components/LocationsTable';
import { customers } from '@/mocks/customers';
import { customersNav } from '@/pages/dashboard/nav';

export default function LocationsPage() {
  const [search, setSearch] = useState('');

  const allLocations: LocationRow[] = useMemo(
    () =>
      customers.flatMap((c) =>
        c.locations.map((l) => ({ ...l, customer: c.name, customerId: c.id })),
      ),
    [],
  );

  const filtered = useMemo(
    () =>
      allLocations.filter((l) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        const hay = `${l.name} ${l.customer} ${l.address} ${l.city} ${l.country} ${l.products.join(' ')}`.toLowerCase();
        return hay.includes(q);
      }),
    [allLocations, search],
  );

  const tankCount = allLocations.reduce((sum, l) => sum + l.tanks.length, 0);

  return (
    <ModuleShell
      title="Locations"
      description="Customer delivery sites, delivery windows, and tank details."
      icon="ri-map-pin-2-line"
      subNav={customersNav}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-lg border border-background-200 bg-background-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Total Sites</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-foreground-950">{allLocations.length}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">across all customers</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Tanks</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-foreground-950">{tankCount}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">installed on site</p>
        </div>
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Next Deliveries</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-accent-700">{allLocations.length}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">planned this week</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-background-200 bg-background-50 p-3">
        <div className="relative flex-1 min-w-0 sm:max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
            <i className="ri-search-line text-foreground-400 text-sm leading-none" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search location, customer, city…"
            className="w-full rounded-md border border-background-200 bg-background-50 pl-9 pr-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
          />
        </div>
      </div>

      <div className="mt-4">
        {filtered.length > 0 ? (
          <LocationsTable rows={filtered} />
        ) : (
          <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-12 text-center">
            <i className="ri-map-pin-line text-foreground-300 text-3xl leading-none" />
            <p className="mt-3 text-sm font-medium text-foreground-600">No locations match your search</p>
            <p className="text-xs text-foreground-400 mt-1">Try a different search term.</p>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}