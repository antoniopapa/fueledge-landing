import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { terminals as mockTerminals, type Terminal, type TerminalStatus } from '@/mocks/sourcing';
import { createTerminal, deleteTerminal, fetchTerminals, updateTerminal } from '@/mocks/schedule';
import TerminalStatusBadge from '@/pages/dashboard/sourcing/components/TerminalStatusBadge';

const terminalStatuses: TerminalStatus[] = ['Operational', 'Busy', 'Limited', 'Issue'];

export default function TerminalsPage() {
  const navigate = useNavigate();
  const [terminals, setTerminals] = useState<Terminal[]>(mockTerminals);

  useEffect(() => {
    let active = true;

    fetchTerminals()
      .then((apiTerminals) => {
        if (active) setTerminals(apiTerminals);
      })
      .catch((error) => {
        console.error('Failed to load terminals', error);
      });

    return () => {
      active = false;
    };
  }, []);

  function terminalPayload(existing?: Terminal): Partial<Terminal> | null {
    const name = window.prompt('Terminal name', existing?.name ?? '');
    if (!name) return null;

    const city = window.prompt('City', existing?.city ?? '') ?? existing?.city ?? '';
    const country = window.prompt('Country', existing?.country ?? '') ?? existing?.country ?? '';
    const statusInput = window.prompt('Status: Operational, Busy, Limited, Issue', existing?.status ?? 'Operational') ?? existing?.status ?? 'Operational';
    const status = terminalStatuses.includes(statusInput as TerminalStatus) ? (statusInput as TerminalStatus) : 'Operational';
    const products = (window.prompt('Products, comma separated', existing?.products.join(', ') ?? '') ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const basePrice = window.prompt('Base price', existing?.basePrice ?? '€0.000') ?? existing?.basePrice ?? '€0.000';
    const waitTime = window.prompt('Wait time', existing?.waitTime ?? '0 min') ?? existing?.waitTime ?? '0 min';
    const allocation = window.prompt('Allocation', existing?.allocation ?? '0%') ?? existing?.allocation ?? '0%';
    const cutoff = window.prompt('Cutoff', existing?.cutoff ?? '—') ?? existing?.cutoff ?? '—';

    return {
      ...(existing ?? {}),
      name,
      city,
      country,
      status,
      products,
      basePrice,
      waitTime,
      allocation,
      cutoff,
      otif: existing?.otif ?? '—',
      avgWait: existing?.avgWait ?? waitTime,
      dailyThroughput: existing?.dailyThroughput ?? '—',
      pickups: existing?.pickups ?? [],
      pricing: existing?.pricing ?? products.map((product) => ({ product, price: basePrice, change: 'flat' })),
    };
  }

  async function handleCreateTerminal() {
    const payload = terminalPayload();
    if (!payload) return;

    const terminal = await createTerminal(payload);
    setTerminals((items) => [...items, terminal]);
  }

  async function handleEditTerminal(terminal: Terminal) {
    const payload = terminalPayload(terminal);
    if (!payload) return;

    const updated = await updateTerminal(terminal.id, payload);
    setTerminals((items) => items.map((item) => (item.id === terminal.id ? updated : item)));
  }

  async function handleDeleteTerminal(terminal: Terminal) {
    if (!window.confirm(`Delete ${terminal.name}?`)) return;

    await deleteTerminal(terminal.id);
    setTerminals((items) => items.filter((item) => item.id !== terminal.id));
  }

  return (
    <ModuleShell
      title="Terminals"
      description="Manage and compare fuel terminals across Europe."
      icon="ri-building-4-line"
    >
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-foreground-400">{terminals.length} terminals</span>
          <button
            type="button"
            onClick={handleCreateTerminal}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-3 py-2 text-xs font-semibold text-background-50 transition-colors hover:bg-primary-600"
          >
            <i className="ri-add-line text-sm leading-none" />
            Add terminal
          </button>
        </div>
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
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400 text-right">Actions</th>
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
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditTerminal(t);
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-500 transition-colors hover:bg-background-100 hover:text-foreground-900"
                        aria-label={`Edit ${t.name}`}
                      >
                        <i className="ri-edit-line text-base leading-none" />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteTerminal(t);
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-500 transition-colors hover:bg-secondary-50 hover:text-secondary-700"
                        aria-label={`Delete ${t.name}`}
                      >
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
