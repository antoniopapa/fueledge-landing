import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { products } from '@/mocks/settings';
import { suppliers, terminals } from '@/mocks/sourcing';

function terminalCount(productName: string) {
  return terminals.filter((terminal) => terminal.products.includes(productName)).length;
}

function supplierCount(productName: string) {
  return suppliers.filter((supplier) => supplier.products.includes(productName)).length;
}

function productStatus(active: boolean) {
  return active
    ? 'bg-accent-100 text-accent-700'
    : 'bg-background-200 text-foreground-500';
}

export default function ProductsPage() {
  return (
    <ModuleShell
      title="Products"
      description="Fuel type products available for sourcing, dispatch, and delivery."
      icon="ri-drop-line"
    >
      <div className="flex justify-end mb-4">
        <span className="text-[12px] text-foreground-400">{products.length} fuel products</span>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Fuel Type</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Category</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Description</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Terminals</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Suppliers</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Default Margin</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3 text-[13px] font-semibold text-foreground-900 whitespace-nowrap">{product.name}</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-medium text-foreground-700 bg-background-100 rounded-md px-2 py-1 whitespace-nowrap">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-500">{product.description}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 tabular whitespace-nowrap">{terminalCount(product.name)}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 tabular whitespace-nowrap">{supplierCount(product.name)}</td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">{product.defaultMargin}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${productStatus(product.active)}`}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
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
