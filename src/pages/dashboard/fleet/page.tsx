import { useEffect, useState } from 'react';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import { fetchTrucks, type ApiTruck } from '@/mocks/schedule';

export default function FleetPage() {
  const [trucks, setTrucks] = useState<ApiTruck[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetchTrucks()
      .then((apiTrucks) => {
        if (active) setTrucks(apiTrucks);
      })
      .catch(() => {
        if (active) setToast('Unable to load trucks.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardShell>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground-950">Trucks</h1>
          <p className="mt-0.5 text-sm text-foreground-500">{loading ? 'Loading trucks...' : 'Manage truck records.'}</p>
        </div>
        <span className="text-[12px] text-foreground-400">{trucks.length} trucks</span>
      </div>

      <div className="overflow-hidden rounded-lg border border-background-200 bg-background-50">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">ID</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Serial Number</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Tractor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {trucks.map((truck) => (
                <tr key={truck.id} className="transition-colors hover:bg-background-100/50">
                  <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{truck.id}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{truck.serialNumber}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{truck.tractor}</td>
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
    </DashboardShell>
  );
}
