import { useEffect, useMemo, useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import CustomersTable from './components/CustomersTable';
import { customers as mockCustomers, type AccountStatus, type Customer } from '@/mocks/customers';
import { createCustomer, deleteCustomer, fetchCustomers, updateCustomer } from '@/mocks/schedule';
import { customersNav } from '@/pages/dashboard/nav';

const statuses: AccountStatus[] = ['Active', 'Credit Warning', 'On Hold', 'Inactive'];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [status, setStatus] = useState<AccountStatus | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;

    fetchCustomers()
      .then((apiCustomers) => {
        if (active) setCustomers(apiCustomers);
      })
      .catch((error) => {
        console.error('Failed to load customers', error);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      customers.filter((c) => {
        if (status && c.accountStatus !== status) return false;
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          const hay = `${c.name} ${c.type} ${c.products.join(' ')}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      }),
    [customers, status, search],
  );

  const active = customers.filter((c) => c.accountStatus === 'Active').length;
  const warnings = customers.filter((c) => c.accountStatus === 'Credit Warning').length;
  const openOrders = customers.reduce((sum, c) => sum + c.openOrders, 0);
  const outstanding = customers.filter((c) => c.billingStatus.toLowerCase().includes('overdue')).length;

  function customerPayload(existing?: Customer): Partial<Customer> | null {
    const name = window.prompt('Customer name', existing?.name ?? '');
    if (!name) return null;

    const statusInput = window.prompt('Account status: Active, Credit Warning, On Hold, Inactive', existing?.accountStatus ?? 'Active') ?? existing?.accountStatus ?? 'Active';
    const accountStatus = statuses.includes(statusInput as AccountStatus) || statusInput === 'On Hold' || statusInput === 'Inactive'
      ? (statusInput as AccountStatus)
      : 'Active';
    const products = (window.prompt('Products, comma separated', existing?.products.join(', ') ?? '') ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    return {
      ...(existing ?? {}),
      name,
      type: window.prompt('Customer type', existing?.type ?? 'Customer') ?? existing?.type ?? 'Customer',
      accountStatus,
      creditLimit: window.prompt('Credit limit', existing?.creditLimit ?? '—') ?? existing?.creditLimit ?? '—',
      creditStatus: window.prompt('Credit status', existing?.creditStatus ?? '—') ?? existing?.creditStatus ?? '—',
      products,
      pricingAgreement: window.prompt('Pricing agreement', existing?.pricingAgreement ?? '—') ?? existing?.pricingAgreement ?? '—',
      contract: window.prompt('Contract', existing?.contract ?? '—') ?? existing?.contract ?? '—',
      openOrders: Number(window.prompt('Open orders', String(existing?.openOrders ?? 0)) ?? existing?.openOrders ?? 0),
      outstandingBalance: window.prompt('Outstanding balance', existing?.outstandingBalance ?? '—') ?? existing?.outstandingBalance ?? '—',
      billingStatus: window.prompt('Billing status', existing?.billingStatus ?? '—') ?? existing?.billingStatus ?? '—',
      lastDelivery: window.prompt('Last delivery', existing?.lastDelivery ?? '—') ?? existing?.lastDelivery ?? '—',
      totalVolume: existing?.totalVolume ?? '—',
      revenue: existing?.revenue ?? '—',
      grossMargin: existing?.grossMargin ?? '—',
      openInvoices: existing?.openInvoices ?? 0,
      mainContacts: existing?.mainContacts ?? [],
      billingContact: existing?.billingContact ?? { name: '—', role: 'Billing', email: '', phone: '' },
      locations: existing?.locations ?? [],
    };
  }

  async function handleCreateCustomer() {
    const payload = customerPayload();
    if (!payload) return;

    const customer = await createCustomer(payload);
    setCustomers((items) => [...items, customer]);
  }

  async function handleEditCustomer(customer: Customer) {
    const payload = customerPayload(customer);
    if (!payload) return;

    const updated = await updateCustomer(customer.id, payload);
    setCustomers((items) => items.map((item) => (item.id === customer.id ? updated : item)));
  }

  async function handleDeleteCustomer(customer: Customer) {
    if (!window.confirm(`Delete ${customer.name}?`)) return;

    await deleteCustomer(customer.id);
    setCustomers((items) => items.filter((item) => item.id !== customer.id));
  }

  return (
    <ModuleShell
      title="Customers"
      description="Manage B2B customer accounts, pricing agreements, and delivery locations."
      icon="ri-team-line"
      subNav={customersNav}
    >
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleCreateCustomer}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-3 py-2 text-xs font-semibold text-background-50 transition-colors hover:bg-primary-600"
        >
          <i className="ri-add-line text-sm leading-none" />
          Add customer
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-background-200 bg-background-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Total Customers</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-foreground-950">{customers.length}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">13 active accounts</p>
        </div>
        <div className="rounded-lg border border-accent-200 bg-accent-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Active</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-accent-700">{active}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">in good standing</p>
        </div>
        <div className="rounded-lg border border-secondary-200 bg-secondary-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Credit Warnings</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-secondary-700">{warnings}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">need attention</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 px-3.5 py-3">
          <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">Open Orders</p>
          <p className="mt-1.5 text-2xl font-bold tabular leading-none text-foreground-950">{openOrders}</p>
          <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">{outstanding} overdue invoice</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-background-200 bg-background-50 p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setStatus(null)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              status === null
                ? 'bg-primary-500 text-background-50'
                : 'bg-background-100 text-foreground-600 hover:bg-background-200'
            }`}
          >
            All
          </button>
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                status === s
                  ? 'bg-primary-500 text-background-50'
                  : 'bg-background-100 text-foreground-600 hover:bg-background-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-background-200">
          <div className="relative flex-1 min-w-0 sm:max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-foreground-400 text-sm leading-none" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, type, product…"
              className="w-full rounded-md border border-background-200 bg-background-50 pl-9 pr-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
            />
          </div>
          <span className="sm:ml-auto text-[11px] text-foreground-400 whitespace-nowrap">
            {filtered.length} customer{filtered.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div className="mt-4">
        {filtered.length > 0 ? (
          <CustomersTable customers={filtered} onEdit={handleEditCustomer} onDelete={handleDeleteCustomer} />
        ) : (
          <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-12 text-center">
            <i className="ri-user-search-line text-foreground-300 text-3xl leading-none" />
            <p className="mt-3 text-sm font-medium text-foreground-600">No customers match your filters</p>
            <p className="text-xs text-foreground-400 mt-1">Try adjusting your search or clearing a filter.</p>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
