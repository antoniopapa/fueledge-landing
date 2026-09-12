import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { terminals } from '@/mocks/sourcing';
import { orders } from '@/mocks/orders';
import TerminalStatusBadge from '@/pages/dashboard/sourcing/components/TerminalStatusBadge';

type TabKey = 'overview' | 'pricing' | 'sourcing' | 'activity' | 'performance';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'sourcing', label: 'Sourcing' },
  { key: 'activity', label: 'Activity' },
  { key: 'performance', label: 'Performance' },
];

export default function TerminalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('overview');
  const terminal = terminals.find((t) => t.id === id);

  if (!terminal) {
    return (
      <ModuleShell title="Terminal Details" description="Terminal details, availability, and pricing." icon="ri-building-4-line">
        <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-14 text-center">
          <i className="ri-building-4-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">Terminal not found</p>
          <Link
            to="/terminals"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-line text-sm leading-none" />
            Back to terminals
          </Link>
        </div>
      </ModuleShell>
    );
  }

  const sourcedOrders = orders.filter((o) => o.sourceTerminalId === terminal.id);

  return (
    <ModuleShell
      title={terminal.name}
      description={`${terminal.city}, ${terminal.country}`}
      icon="ri-building-4-line"
    >
      <button
        type="button"
        onClick={() => navigate('/terminals')}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground-500 hover:text-foreground-900 mb-4 cursor-pointer transition-colors whitespace-nowrap"
      >
        <i className="ri-arrow-left-line text-[13px] leading-none" />
        All terminals
      </button>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <TerminalStatusBadge status={terminal.status} />
        <span className="text-[12px] text-foreground-500">
          {terminal.products.join(' · ')} · {terminal.basePrice}/L diesel
        </span>
      </div>

      <div className="flex items-center gap-1 border-b border-background-200 overflow-x-auto">
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
            {tab === t.key && (
              <span className="absolute left-3 right-3 bottom-0 h-0.5 rounded-full bg-primary-500" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Base Price', value: `${terminal.basePrice}/L` },
              { label: 'Wait Time', value: terminal.waitTime },
              { label: 'Allocation', value: terminal.allocation },
              { label: 'Loading Cutoff', value: terminal.cutoff },
            ].map((f) => (
              <div key={f.label} className="rounded-lg border border-background-200 bg-background-50 p-3.5">
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">{f.label}</p>
                <p className="mt-1.5 text-lg font-bold text-foreground-950 tabular leading-none">{f.value}</p>
              </div>
            ))}

            <div className="col-span-2 md:col-span-4 rounded-lg border border-background-200 bg-background-50 p-4">
              <h2 className="text-sm font-semibold text-foreground-950 mb-3">Upcoming Pickups</h2>
              {terminal.pickups.length > 0 ? (
                <div className="divide-y divide-background-100">
                  {terminal.pickups.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5">
                      <span className="text-[13px] text-foreground-700">{p.order}</span>
                      <span className="text-[12px] text-foreground-500 tabular">{p.volume}</span>
                      <span className="text-[12px] font-medium text-foreground-900 tabular">{p.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-foreground-400">No pickups scheduled.</p>
              )}
            </div>
          </div>
        )}

        {tab === 'pricing' && (
          <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="border-b border-background-200 bg-background-100/40">
                    <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
                    <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Price</th>
                    <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-background-200">
                  {terminal.pricing.map((p, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-[12px] text-foreground-800 whitespace-nowrap">{p.product}</td>
                      <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">{p.price}/L</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[12px] font-medium tabular ${
                            p.change.startsWith('+')
                              ? 'text-secondary-700'
                              : p.change === 'flat'
                                ? 'text-foreground-500'
                                : 'text-accent-700'
                          }`}
                        >
                          {p.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'sourcing' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-background-200 bg-background-50 p-4">
              <h2 className="text-sm font-semibold text-foreground-950 mb-3">Availability</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Products</p>
                  <p className="mt-1 text-[13px] font-semibold text-foreground-900">{terminal.products.join(', ')}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Allocation</p>
                  <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{terminal.allocation}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Wait Time</p>
                  <p className="mt-1 text-[13px] font-semibold text-foreground-900">{terminal.waitTime}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Cutoff</p>
                  <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{terminal.cutoff}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-background-200">
                <h2 className="text-sm font-semibold text-foreground-950">Orders Sourced Here</h2>
              </div>
              {sourcedOrders.length > 0 ? (
                <div className="divide-y divide-background-100">
                  {sourcedOrders.map((o) => (
                    <Link key={o.id} to={`/orders/${o.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-background-100/50 transition-colors">
                      <div>
                        <p className="text-[13px] font-medium text-foreground-900">#{o.id} · {o.destination}</p>
                        <p className="text-[11px] text-foreground-400">{o.product} · {o.volume}</p>
                      </div>
                      <span className="text-[12px] text-foreground-500 tabular">{o.deliveryWindow}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-6 text-[13px] text-foreground-400">No orders currently sourced at this terminal.</p>
              )}
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
            <h2 className="text-sm font-semibold text-foreground-950 mb-4">Recent Activity</h2>
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-background-200" />
              <ul className="space-y-4">
                {[
                  { time: '08:00', label: 'Daily cutoffs refreshed', tone: 'info' },
                  { time: '07:30', label: 'Allocation updated to ' + terminal.allocation, tone: 'info' },
                  { time: '06:45', label: terminal.status === 'Issue' ? 'Issue flagged by operations' : 'Status reported ' + terminal.status, tone: terminal.status === 'Issue' ? 'danger' : 'success' },
                ].map((ev, i) => (
                  <li key={i} className="relative flex items-start gap-3 pl-6">
                    <span
                      className={`absolute left-0 top-1 w-3.5 h-3.5 rounded-full ${
                        ev.tone === 'danger' ? 'bg-red-500' : ev.tone === 'success' ? 'bg-accent-500' : 'bg-primary-500'
                      }`}
                    />
                    <div>
                      <p className="text-[13px] text-foreground-800">{ev.label}</p>
                      <p className="text-[11px] text-foreground-400 tabular">{ev.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: 'On-Time In-Full (OTIF)', value: terminal.otif, icon: 'ri-checkbox-circle-line' },
              { label: 'Average Wait', value: terminal.avgWait, icon: 'ri-time-line' },
              { label: 'Daily Throughput', value: terminal.dailyThroughput, icon: 'ri-drop-line' },
            ].map((m) => (
              <div key={m.label} className="rounded-lg border border-background-200 bg-background-50 p-4">
                <span className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center">
                  <i className={`${m.icon} text-primary-700 text-lg leading-none`} />
                </span>
                <p className="mt-3 text-[11px] uppercase tracking-wide text-foreground-400 font-medium">{m.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground-950 tabular leading-none">{m.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
