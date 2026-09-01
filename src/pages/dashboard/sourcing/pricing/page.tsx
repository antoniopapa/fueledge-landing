import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { sourcingNav } from '@/pages/dashboard/nav';
import { pricingRecords } from '@/mocks/sourcing';

export default function PricingPage() {
  return (
    <ModuleShell
      title="Pricing"
      description="Monitor and manage fuel pricing across markets."
      icon="ri-price-tag-3-line"
      subNav={sourcingNav}
    >
      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1080px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Supplier</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Terminal</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Base Price</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Contract Adj.</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Effective Price</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Change</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Updated</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Data Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {pricingRecords.map((p, i) => (
                <tr key={i} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{p.product}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{p.supplier}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{p.terminal}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{p.basePrice}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-500 tabular whitespace-nowrap">{p.contractAdjustment}</td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">{p.effectivePrice}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[12px] font-medium tabular ${
                        p.changeDir === 'up'
                          ? 'text-secondary-700'
                          : p.changeDir === 'down'
                            ? 'text-accent-700'
                            : 'text-foreground-500'
                      }`}
                    >
                      {p.change}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-500 tabular whitespace-nowrap">{p.updated}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-500 whitespace-nowrap">{p.dataSource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModuleShell>
  );
}