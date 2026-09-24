import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import LocationHeader from './components/LocationHeader';
import LocationOverviewTab from './components/LocationOverviewTab';
import LocationOrdersTab from './components/LocationOrdersTab';
import LocationDeliveriesTab from './components/LocationDeliveriesTab';
import LocationTanksTab from './components/LocationTanksTab';
import LocationInstructionsTab from './components/LocationInstructionsTab';
import { customers as mockCustomers, type Customer, type CustomerLocation } from '@/mocks/customers';
import { fetchCustomers } from '@/mocks/schedule';

type TabKey = 'overview' | 'orders' | 'deliveries' | 'tanks' | 'instructions';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'orders', label: 'Orders' },
  { key: 'deliveries', label: 'Deliveries' },
  { key: 'tanks', label: 'Tanks' },
  { key: 'instructions', label: 'Instructions' },
];

export default function LocationDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState<TabKey>('overview');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);

  useEffect(() => {
    let active = true;

    fetchCustomers()
      .then((apiCustomers) => {
        if (active) setCustomers(apiCustomers);
      })
      .catch((error) => {
        console.error('Failed to load customer location details', error);
      });

    return () => {
      active = false;
    };
  }, []);

  let found: { customer: Customer; location: CustomerLocation } | null = null;
  for (const c of customers) {
    const loc = c.locations.find((l) => l.id === id);
    if (loc) {
      found = { customer: c, location: loc };
      break;
    }
  }

  if (!found) {
    return (
      <DashboardShell>
        <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-16 text-center">
          <i className="ri-map-pin-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">Location not found</p>
          <Link
            to="/customers/locations"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-line text-sm leading-none" />
            Back to locations
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const { customer, location } = found;

  return (
    <DashboardShell>
      <LocationHeader customer={customer} location={location} />

      <div className="mt-4 flex items-center gap-1 border-b border-background-200 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              tab === t.key ? 'text-primary-700' : 'text-foreground-500 hover:text-foreground-900'
            }`}
          >
            {t.label}
            {tab === t.key && <span className="absolute left-3 right-3 bottom-0 h-0.5 rounded-full bg-primary-500" />}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'overview' && <LocationOverviewTab location={location} />}
        {tab === 'orders' && <LocationOrdersTab customer={customer} location={location} />}
        {tab === 'deliveries' && <LocationDeliveriesTab customer={customer} location={location} />}
        {tab === 'tanks' && <LocationTanksTab location={location} />}
        {tab === 'instructions' && <LocationInstructionsTab location={location} />}
      </div>
    </DashboardShell>
  );
}
