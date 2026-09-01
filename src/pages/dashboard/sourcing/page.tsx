import { Link } from 'react-router-dom';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { sourcingNav } from '@/pages/dashboard/nav';
import {
  sourcingKpis,
  awaitingSourceOrders,
  sourcingOpportunities,
  priceMovements,
  terminalIssues,
  allocationWarnings,
  contractWarnings,
} from '@/mocks/sourcing';

const kpiTone: Record<string, string> = {
  neutral: 'border-background-200 bg-background-50',
  accent: 'border-accent-200 bg-accent-50',
  secondary: 'border-secondary-200 bg-secondary-50',
};

const kpiValue: Record<string, string> = {
  neutral: 'text-foreground-950',
  accent: 'text-accent-700',
  secondary: 'text-secondary-700',
};

export default function SourcingPage() {
  return (
    <ModuleShell
      title="Sourcing"
      description="Source fuel at the best price across European terminals and suppliers."
      icon="ri-flask-line"
      subNav={sourcingNav}
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {sourcingKpis.map((k) => (
          <div key={k.label} className={`rounded-lg border px-3.5 py-3 ${kpiTone[k.tone]}`}>
            <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">{k.label}</p>
            <p className={`mt-1.5 text-2xl font-bold tabular leading-none ${kpiValue[k.tone]}`}>{k.value}</p>
            <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* left 2/3 */}
        <div className="xl:col-span-2 space-y-4">
          {/* orders awaiting sourcing */}
          <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-background-200">
              <h2 className="text-sm font-semibold text-foreground-950">Orders Awaiting Sourcing</h2>
              <p className="text-[11px] text-foreground-400">{awaitingSourceOrders.length} orders need a terminal</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[720px]">
                <thead>
                  <tr className="border-b border-background-200 bg-background-100/40">
                    <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Order</th>
                    <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Customer</th>
                    <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Destination</th>
                    <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
                    <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Volume</th>
                    <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Window</th>
                    <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background-200">
                  {awaitingSourceOrders.map((o) => (
                    <tr key={o.order} className="hover:bg-background-100/50 transition-colors">
                      <td className="px-4 py-3 text-[12px] font-semibold text-primary-700 whitespace-nowrap">{o.order}</td>
                      <td className="px-4 py-3 text-[12px] text-foreground-800 whitespace-nowrap">{o.customer}</td>
                      <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{o.destination}</td>
                      <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{o.product}</td>
                      <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{o.volume}</td>
                      <td className="px-4 py-3 text-[12px] text-foreground-500 tabular whitespace-nowrap">{o.window}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/orders/${o.order.replace('#', '')}`}
                          className="inline-flex items-center gap-1 text-[12px] font-medium text-primary-700 hover:underline whitespace-nowrap"
                        >
                          Compare
                          <i className="ri-arrow-right-line text-xs leading-none" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* recommended opportunities */}
          <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-background-200">
              <h2 className="text-sm font-semibold text-foreground-950">Recommended Opportunities</h2>
            </div>
            <div className="divide-y divide-background-100">
              {sourcingOpportunities.map((opp) => (
                <div key={opp.order} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-md bg-accent-100 flex items-center justify-center shrink-0">
                      <i className="ri-star-line text-accent-600 text-base leading-none" />
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-foreground-900">
                        {opp.order} · {opp.route}
                      </p>
                      <p className="text-[11px] text-foreground-400 tabular">{opp.volume}</p>
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-accent-700 tabular">+{opp.saving}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right 1/3 */}
        <div className="space-y-4">
          {/* potential savings */}
          <div className="rounded-lg border border-accent-200 bg-accent-50 p-4">
            <p className="text-[11px] uppercase tracking-wide text-accent-700 font-semibold">Potential Savings</p>
            <p className="mt-2 text-3xl font-bold text-accent-700 tabular leading-none">€1,210</p>
            <p className="mt-1.5 text-[12px] text-foreground-600">Across 4 unsourced orders today</p>
          </div>

          {/* price movements */}
          <div className="rounded-lg border border-background-200 bg-background-50 p-4">
            <h2 className="text-sm font-semibold text-foreground-950 mb-3">Price Movements</h2>
            <div className="space-y-2.5">
              {priceMovements.map((pm, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-medium text-foreground-900">{pm.product}</p>
                    <p className="text-[11px] text-foreground-400">{pm.terminal}</p>
                  </div>
                  <span
                    className={`text-[12px] font-semibold tabular ${
                      pm.direction === 'down' ? 'text-accent-700' : 'text-secondary-700'
                    }`}
                  >
                    {pm.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* terminal issues */}
          <div className="rounded-lg border border-background-200 bg-background-50 p-4">
            <h2 className="text-sm font-semibold text-foreground-950 mb-3">Terminal Issues</h2>
            <div className="space-y-2.5">
              {terminalIssues.map((ti, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <i
                    className={`${ti.severity === 'critical' ? 'ri-close-circle-fill text-red-500' : 'ri-alert-fill text-secondary-500'} text-base leading-none mt-0.5`}
                  />
                  <div>
                    <p className="text-[12px] font-medium text-foreground-900">{ti.terminal}</p>
                    <p className="text-[11px] text-foreground-500">{ti.issue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* allocation warnings */}
          <div className="rounded-lg border border-background-200 bg-background-50 p-4">
            <h2 className="text-sm font-semibold text-foreground-950 mb-3">Allocation Warnings</h2>
            <div className="space-y-2">
              {allocationWarnings.map((aw, i) => (
                <div key={i} className="flex items-center justify-between text-[12px]">
                  <span className="text-foreground-700">{aw.terminal} · {aw.product}</span>
                  <span className="font-semibold text-secondary-700 whitespace-nowrap">{aw.remaining}</span>
                </div>
              ))}
            </div>
          </div>

          {/* contract warnings */}
          <div className="rounded-lg border border-background-200 bg-background-50 p-4">
            <h2 className="text-sm font-semibold text-foreground-950 mb-3">Contract Warnings</h2>
            <div className="space-y-2.5">
              {contractWarnings.map((cw, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <i className="ri-file-warning-line text-secondary-500 text-base leading-none mt-0.5" />
                  <div>
                    <p className="text-[12px] font-medium text-foreground-900">{cw.supplier}</p>
                    <p className="text-[11px] text-foreground-500">{cw.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}