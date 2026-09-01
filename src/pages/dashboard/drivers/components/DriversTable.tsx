import { useNavigate } from 'react-router-dom';
import type { Driver } from '@/mocks/drivers';
import { StatusBadge, ExceptionBadge } from './StatusBadge';

export default function DriversTable({ drivers }: { drivers: Driver[] }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1080px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Driver</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Truck</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Current Assignment</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Location</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Shift</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Today</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Next Assignment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {drivers.map((d) => (
              <tr
                key={d.id}
                onClick={() => navigate(`/drivers/${d.id}`)}
                className="hover:bg-background-100/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-primary-700">{d.initials}</span>
                    </span>
                    <span className="text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{d.name}</span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <StatusBadge status={d.status} />
                    {d.exceptions.map((e) => (
                      <ExceptionBadge key={e.kind} kind={e.kind} detail={e.detail} />
                    ))}
                  </div>
                </td>

                <td className="px-4 py-3">
                  {d.truck ? (
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trucks/${d.truck}`);
                        }}
                        className="text-[12px] font-semibold text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
                      >
                        {d.truck}
                      </button>
                      {d.truckChangedFrom && (
                        <span className="text-[10px] text-foreground-400 whitespace-nowrap">
                          From {d.truckChangedFrom.from} · {d.truckChangedFrom.at}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[12px] text-foreground-400 whitespace-nowrap">Unassigned</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[12px] text-foreground-700 whitespace-nowrap">
                      {d.currentAssignment ?? '—'}
                    </span>
                    {d.eta && (
                      <span className="text-[10px] text-foreground-400 tabular whitespace-nowrap">ETA {d.eta}</span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{d.location}</td>

                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{d.shift}</td>

                <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{d.todayRuns}</td>

                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{d.nextAssignment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}