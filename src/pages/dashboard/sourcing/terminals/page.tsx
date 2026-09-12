import { useNavigate } from 'react-router-dom';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { terminals } from '@/mocks/sourcing';
import TerminalStatusBadge from '@/pages/dashboard/sourcing/components/TerminalStatusBadge';

export default function TerminalsPage() {
  const navigate = useNavigate();

  return (
    <ModuleShell
      title="Terminals"
      description="Manage and compare fuel terminals across Europe."
      icon="ri-building-4-line"
    >
      <div className="flex justify-end mb-4">
        <span className="text-[12px] text-foreground-400">{terminals.length} terminals</span>
      </div>

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
                  onClick={() => navigate(`/terminals/${t.id}`)}
                  className="hover:bg-background-100/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/terminals/${t.id}`);
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
    </ModuleShell>
  );
}
