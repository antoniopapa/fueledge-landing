import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { suppliers } from '@/mocks/sourcing';

const contractStatusStyle: Record<string, string> = {
  Active: 'text-accent-700 bg-accent-100',
  Expiring: 'text-secondary-700 bg-secondary-100',
  Renegotiating: 'text-primary-700 bg-primary-100',
};

export default function SuppliersPage() {
  return (
    <ModuleShell
      title="Suppliers"
      description="Manage fuel suppliers and their agreements."
      icon="ri-store-2-line"
    >
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModuleShell>
  );
}
