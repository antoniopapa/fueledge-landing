import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { sourcingNav } from '@/pages/dashboard/nav';
import { contracts } from '@/mocks/sourcing';

const statusStyle: Record<string, string> = {
  Active: 'text-accent-700 bg-accent-100',
  Expiring: 'text-secondary-700 bg-secondary-100',
  'At risk': 'text-red-600 bg-red-100',
};

export default function ContractsPage() {
  return (
    <ModuleShell
      title="Contracts"
      description="Track fuel supply contracts and terms."
      icon="ri-file-text-line"
      subNav={sourcingNav}
    >
      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1120px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Contract</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Supplier</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Terminals</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Period</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Price / Discount</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Commitment</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Lifted</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Remaining</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3 text-[12px] font-semibold text-primary-700 whitespace-nowrap">{c.id}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-800 whitespace-nowrap">{c.supplier}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{c.product}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{c.terminals.join(', ')}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-500 whitespace-nowrap">{c.period}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 tabular whitespace-nowrap">{c.priceDiscount}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{c.commitment}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{c.liftedVolume}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{c.remainingAllocation}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[c.status] ?? 'text-foreground-500 bg-background-200'}`}>
                      {c.status}
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