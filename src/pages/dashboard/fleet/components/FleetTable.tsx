import { useNavigate } from 'react-router-dom';
import type { Truck } from '@/mocks/fleet';
import TruckStatusBadge from './TruckStatusBadge';

export default function FleetTable({ trucks }: { trucks: Truck[] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1120px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Truck</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Make &amp; Model</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Type</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Capacity</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Current Driver</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Assignment</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Location</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Next Service</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {trucks.map((t) => (
              <tr
                key={t.id}
                onClick={() => navigate(`/trucks/${t.id}`)}
                className="hover:bg-background-100/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-md bg-background-200 flex items-center justify-center shrink-0">
                      <i className="ri-truck-line text-foreground-500 text-[15px] leading-none" />
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{t.plate}</p>
                      <p className="text-[10px] text-foreground-400 whitespace-nowrap">{t.year} · {t.mileage}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <TruckStatusBadge status={t.status} />
                </td>

                <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">
                  {t.make} {t.model}
                </td>

                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{t.type}</td>

                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{t.capacity}</td>

                <td className="px-4 py-3">
                  {t.currentDriver ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (t.currentDriverId) navigate(`/drivers/${t.currentDriverId}`);
                      }}
                      className={`text-[12px] font-medium whitespace-nowrap ${
                        t.currentDriverId
                          ? 'text-primary-700 hover:underline cursor-pointer'
                          : 'text-foreground-700'
                      }`}
                    >
                      {t.currentDriver}
                    </button>
                  ) : (
                    <span className="text-[12px] text-foreground-400 whitespace-nowrap">—</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  {t.orderId ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${t.orderId}`);
                      }}
                      className="text-[12px] font-medium text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
                    >
                      {t.currentAssignment}
                    </button>
                  ) : (
                    <span className="text-[12px] text-foreground-400 whitespace-nowrap">—</span>
                  )}
                </td>

                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{t.location}</td>

                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{t.nextService}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}