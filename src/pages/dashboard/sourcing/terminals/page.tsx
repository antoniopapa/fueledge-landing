import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { sourcingNav } from '@/pages/dashboard/nav';
import { terminals } from '@/mocks/sourcing';
import TerminalStatusBadge from '@/pages/dashboard/sourcing/components/TerminalStatusBadge';

export default function TerminalsPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'map'>('list');

  return (
    <ModuleShell
      title="Terminals"
      description="Manage and compare fuel terminals across Europe."
      icon="ri-building-4-line"
      subNav={sourcingNav}
    >
      {/* toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center rounded-full bg-background-200 p-1">
          <button
            type="button"
            onClick={() => setView('list')}
            className={`px-4 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              view === 'list' ? 'bg-background-50 text-foreground-900' : 'text-foreground-500 hover:text-foreground-800'
            }`}
          >
            <i className="ri-list-check-2 mr-1.5" />
            List
          </button>
          <button
            type="button"
            onClick={() => setView('map')}
            className={`px-4 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              view === 'map' ? 'bg-background-50 text-foreground-900' : 'text-foreground-500 hover:text-foreground-800'
            }`}
          >
            <i className="ri-map-pin-line mr-1.5" />
            Map
          </button>
        </div>
        <span className="text-[12px] text-foreground-400">{terminals.length} terminals</span>
      </div>

      {view === 'map' ? (
        <div className="relative h-[520px] rounded-lg border border-background-200 overflow-hidden bg-background-100">
          <iframe
            title="Terminals map"
            src="https://maps.google.com/maps?q=Europe&z=5&output=embed"
            className="absolute inset-0 w-full h-full border-0 [filter:saturate(0.72)_contrast(1.02)]"
            loading="lazy"
            aria-label="European terminals map"
          />
          <div className="absolute inset-0 pointer-events-none">
            {[
              { name: 'Rotterdam', left: '22%', top: '38%' },
              { name: 'Antwerp', left: '28%', top: '44%' },
              { name: 'Hamburg', left: '38%', top: '28%' },
              { name: 'Mannheim', left: '42%', top: '52%' },
              { name: 'Basel', left: '46%', top: '60%' },
              { name: 'Lyon', left: '42%', top: '68%' },
              { name: 'Gdańsk', left: '52%', top: '24%' },
              { name: 'Vienna', left: '58%', top: '56%' },
              { name: 'Arad', left: '66%', top: '60%' },
              { name: 'Stockholm', left: '48%', top: '14%' },
            ].map((m) => (
              <div
                key={m.name}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: m.left, top: m.top }}
              >
                <span className="w-3 h-3 rounded-full bg-primary-500 ring-2 ring-background-50" />
                <span className="mt-1 text-[9px] font-semibold text-foreground-900 bg-background-50/90 px-1 rounded whitespace-nowrap leading-tight">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1080px]">
              <thead>
                <tr className="border-b border-background-200 bg-background-100/40">
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Terminal</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Products</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Base Price</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Wait Time</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Allocation</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Cutoff</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Upcoming Pickups</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">OTIF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-200">
                {terminals.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/sourcing/terminals/${t.id}`)}
                    className="hover:bg-background-100/50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sourcing/terminals/${t.id}`);
                        }}
                        className="text-[12px] font-semibold text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
                      >
                        {t.name}
                      </button>
                      <span className="block text-[10px] text-foreground-400">{t.city}, {t.country}</span>
                    </td>
                    <td className="px-4 py-3">
                      <TerminalStatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">
                      {t.products.join(', ')}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{t.basePrice}/L</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{t.waitTime}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-background-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary-500"
                            style={{ width: t.allocation }}
                          />
                        </div>
                        <span className="text-[11px] text-foreground-500 tabular">{t.allocation}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{t.cutoff}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{t.pickups.length}</td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">{t.otif}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}