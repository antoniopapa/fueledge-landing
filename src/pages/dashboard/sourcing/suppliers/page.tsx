import { useEffect, useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { suppliers as mockSuppliers, type Supplier } from '@/mocks/sourcing';
import { createSupplier, deleteSupplier, fetchSuppliers, updateSupplier } from '@/mocks/schedule';

const contractStatusStyle: Record<string, string> = {
  Active: 'text-accent-700 bg-accent-100',
  Expiring: 'text-secondary-700 bg-secondary-100',
  Renegotiating: 'text-primary-700 bg-primary-100',
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);

  useEffect(() => {
    let active = true;

    fetchSuppliers()
      .then((apiSuppliers) => {
        if (active) setSuppliers(apiSuppliers);
      })
      .catch((error) => {
        console.error('Failed to load suppliers', error);
      });

    return () => {
      active = false;
    };
  }, []);

  function listFromPrompt(label: string, values?: string[]) {
    return (window.prompt(label, values?.join(', ') ?? '') ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function supplierPayload(existing?: Supplier): Partial<Supplier> | null {
    const name = window.prompt('Supplier name', existing?.name ?? '');
    if (!name) return null;

    return {
      ...(existing ?? {}),
      name,
      country: window.prompt('Country', existing?.country ?? '') ?? existing?.country ?? '',
      activeTerminals: listFromPrompt('Active terminals, comma separated', existing?.activeTerminals),
      products: listFromPrompt('Products, comma separated', existing?.products),
      contractStatus: window.prompt('Contract status', existing?.contractStatus ?? 'Active') ?? existing?.contractStatus ?? 'Active',
      spend: window.prompt('Spend', existing?.spend ?? '—') ?? existing?.spend ?? '—',
      volume: window.prompt('Volume', existing?.volume ?? '—') ?? existing?.volume ?? '—',
      allocation: window.prompt('Allocation', existing?.allocation ?? '0%') ?? existing?.allocation ?? '0%',
      pricingStatus: window.prompt('Pricing status', existing?.pricingStatus ?? '—') ?? existing?.pricingStatus ?? '—',
    };
  }

  async function handleCreateSupplier() {
    const payload = supplierPayload();
    if (!payload) return;

    const supplier = await createSupplier(payload);
    setSuppliers((items) => [...items, supplier]);
  }

  async function handleEditSupplier(supplier: Supplier) {
    const payload = supplierPayload(supplier);
    if (!payload) return;

    const updated = await updateSupplier(supplier.id, payload);
    setSuppliers((items) => items.map((item) => (item.id === supplier.id ? updated : item)));
  }

  async function handleDeleteSupplier(supplier: Supplier) {
    if (!window.confirm(`Delete ${supplier.name}?`)) return;

    await deleteSupplier(supplier.id);
    setSuppliers((items) => items.filter((item) => item.id !== supplier.id));
  }

  return (
    <ModuleShell
      title="Suppliers"
      description="Manage fuel suppliers and their agreements."
      icon="ri-store-2-line"
    >
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={handleCreateSupplier}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-3 py-2 text-xs font-semibold text-background-50 transition-colors hover:bg-primary-600"
        >
          <i className="ri-add-line text-sm leading-none" />
          Add supplier
        </button>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1120px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Supplier</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Active Terminals</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Products</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Contract Status</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400 text-right">Spend</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400 text-right">Volume</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Allocation</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Pricing Status</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{s.name}</span>
                    <span className="block text-[10px] text-foreground-400">{s.country}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{s.activeTerminals.join(', ')}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{s.products.join(', ')}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${contractStatusStyle[s.contractStatus] ?? 'text-foreground-500 bg-background-200'}`}>
                      {s.contractStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular text-right whitespace-nowrap">{s.spend}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 tabular text-right whitespace-nowrap">{s.volume}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full bg-background-200 overflow-hidden">
                        <div className="h-full rounded-full bg-primary-500" style={{ width: s.allocation }} />
                      </div>
                      <span className="text-[11px] text-foreground-500 tabular">{s.allocation}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{s.pricingStatus}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button type="button" onClick={() => handleEditSupplier(s)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-500 transition-colors hover:bg-background-100 hover:text-foreground-900" aria-label={`Edit ${s.name}`}>
                        <i className="ri-edit-line text-base leading-none" />
                      </button>
                      <button type="button" onClick={() => handleDeleteSupplier(s)} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-500 transition-colors hover:bg-secondary-50 hover:text-secondary-700" aria-label={`Delete ${s.name}`}>
                        <i className="ri-delete-bin-line text-base leading-none" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModuleShell>
  );
}
