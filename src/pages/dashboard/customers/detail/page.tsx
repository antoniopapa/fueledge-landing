import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import CustomerHeader from './components/CustomerHeader';
import CustomerOverviewTab from './components/CustomerOverviewTab';
import CustomerLocationsTab from './components/CustomerLocationsTab';
import CustomerOrdersTab from './components/CustomerOrdersTab';
import CustomerPricingTab from './components/CustomerPricingTab';
import CustomerDeliveriesTab from './components/CustomerDeliveriesTab';
import CustomerBillingTab from './components/CustomerBillingTab';
import CustomerDocumentsTab from './components/CustomerDocumentsTab';
import { customers as mockCustomers, type Customer } from '@/mocks/customers';
import { fetchCustomers } from '@/mocks/schedule';

type TabKey = 'overview' | 'locations' | 'orders' | 'pricing' | 'deliveries' | 'billing' | 'documents';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'locations', label: 'Locations' },
  { key: 'orders', label: 'Orders' },
  { key: 'pricing', label: 'Pricing & Contracts' },
  { key: 'deliveries', label: 'Deliveries' },
  { key: 'billing', label: 'Billing' },
  { key: 'documents', label: 'Documents' },
];

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [tab, setTab] = useState<TabKey>('overview');
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const customer = customers.find((c) => c.id === id);

  useEffect(() => {
    let active = true;

    fetchCustomers()
      .then((apiCustomers) => {
        if (active) setCustomers(apiCustomers);
      })
      .catch((error) => {
        console.error('Failed to load customer details', error);
      });

    return () => {
      active = false;
    };
  }, []);

  if (!customer) {
    return (
      <DashboardShell>
        <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-16 text-center">
          <i className="ri-team-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">Customer not found</p>
          <Link
            to="/customers"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-line text-sm leading-none" />
            Back to customers
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <CustomerHeader customer={customer} />

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
        {tab === 'overview' && <CustomerOverviewTab customer={customer} />}
        {tab === 'locations' && <CustomerLocationsTab customer={customer} />}
        {tab === 'orders' && <CustomerOrdersTab customer={customer} />}
        {tab === 'pricing' && <CustomerPricingTab customer={customer} />}
        {tab === 'deliveries' && <CustomerDeliveriesTab customer={customer} />}
        {tab === 'billing' && <CustomerBillingTab customer={customer} />}
        {tab === 'documents' && <CustomerDocumentsTab customer={customer} />}
      </div>
    </DashboardShell>
  );
}
