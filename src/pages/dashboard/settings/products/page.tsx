import { useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { settingsNav } from '@/pages/dashboard/nav';
import Toggle from '@/pages/dashboard/settings/components/Toggle';
import { products, type Product } from '@/mocks/settings';

export default function SettingsProductsPage() {
  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(products.map((p) => [p.id, p.active])),
  );
  const [toast, setToast] = useState<string | null>(null);

  function addProduct() {
    setToast('Product added to catalogue');
    window.setTimeout(() => setToast(null), 2400);
  }

  return (
    <ModuleShell
      title="Products"
      description="Manage fuel products and default margins."
      icon="ri-drop-line"
      subNav={settingsNav}
    >
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={addProduct}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
        >
          <i className="ri-add-line text-sm leading-none" />
          Add product
        </button>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[720px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Category</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Description</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Default margin</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {products.map((p: Product) => (
                <tr key={p.id} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3 text-[13px] font-medium text-foreground-900 whitespace-nowrap">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-medium text-foreground-700 bg-background-100 rounded-md px-2 py-1 whitespace-nowrap">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-500">{p.description}</td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">{p.defaultMargin}</td>
                  <td className="px-4 py-3">
                    <Toggle checked={active[p.id]} onChange={(v) => setActive((s) => ({ ...s, [p.id]: v }))} label={p.name} />
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
    </ModuleShell>
  );
}