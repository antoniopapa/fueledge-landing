import { useEffect, useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { fetchTrailers, type ApiTrailer } from '@/mocks/schedule';

function statusClass(status: string) {
  if (status === 'Available') return 'bg-accent-100 text-accent-700';
  if (status === 'Maintenance') return 'bg-secondary-100 text-secondary-700';
  return 'bg-primary-100 text-primary-700';
}

function formatLiters(value: number) {
  return `${value.toLocaleString()} L`;
}

export default function TrailersPage() {
  const [trailers, setTrailers] = useState<ApiTrailer[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchTrailers()
      .then((apiTrailers) => {
        if (active) setTrailers(apiTrailers);
      })
      .catch(() => {
        if (active) setToast('Unable to load trailers.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ModuleShell
      title="Trailers"
      description={loading ? 'Loading trailers...' : 'Manage fuel tanker trailers.'}
      icon="ri-truck-line"
    >
      <div className="mb-4 flex justify-end">
        <span className="text-[12px] text-foreground-400">{trailers.length} trailers</span>
      </div>

      <div className="overflow-hidden rounded-lg border border-background-200 bg-background-50">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Number</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Plate</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Type</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Compartments</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Capacity</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {trailers.map((trailer) => (
                <tr key={trailer.id} className="transition-colors hover:bg-background-100/50">
                  <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{trailer.number}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{trailer.plate}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{trailer.type}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 tabular whitespace-nowrap">{trailer.compartments}</td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">
                    {formatLiters(trailer.capacityLiters)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${statusClass(trailer.status)}`}>
                      {trailer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700">{trailer.active ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-secondary-300 bg-secondary-50 px-4 py-3 text-[13px] font-medium text-secondary-800">
          <i className="ri-error-warning-line text-secondary-600 text-base leading-none" />
          {toast}
        </div>
      )}
    </ModuleShell>
  );
}
