import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { trailers } from '@/mocks/fleet';

function statusClass(status: string) {
  if (status === 'Available') return 'bg-accent-100 text-accent-700';
  if (status === 'Maintenance') return 'bg-secondary-100 text-secondary-700';
  return 'bg-primary-100 text-primary-700';
}

export default function TrailersPage() {
  return (
    <ModuleShell
      title="Trailers"
      description="Manage fuel tanker trailers, compartments, assignments, and service status."
      icon="ri-truck-line"
    >
      <div className="flex justify-end mb-4">
        <span className="text-[12px] text-foreground-400">{trailers.length} trailers</span>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[860px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Trailer</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Type</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Capacity</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Compartments</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Product</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Base</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {trailers.map((trailer) => (
                <tr key={trailer.id} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-[13px] font-semibold text-foreground-900 whitespace-nowrap">{trailer.plate}</div>
                    <div className="text-[11px] text-foreground-400 whitespace-nowrap">{trailer.id}</div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{trailer.type}</td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">{trailer.capacity}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 tabular whitespace-nowrap">{trailer.compartments}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{trailer.product}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{trailer.base}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusClass(trailer.status)}`}>
                      {trailer.status}
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
