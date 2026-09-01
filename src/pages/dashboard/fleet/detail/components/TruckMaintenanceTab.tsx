import type { Truck } from '@/mocks/fleet';

export default function TruckMaintenanceTab({ truck }: { truck: Truck }) {
  const inWorkshop = truck.nextService.toLowerCase().includes('now');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        {/* service history */}
        <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-background-200">
            <div>
              <h2 className="text-sm font-semibold text-foreground-950">Service History</h2>
              <p className="text-[11px] text-foreground-400">{truck.serviceHistory.length} records on file</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[560px]">
              <thead>
                <tr className="border-b border-background-200 bg-background-100/40">
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Date</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Service</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Mileage</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-200">
                {truck.serviceHistory.map((s) => (
                  <tr key={`${s.date}-${s.type}`} className="hover:bg-background-100/50 transition-colors">
                    <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{s.date}</td>
                    <td className="px-4 py-3 text-[12px] font-medium text-foreground-900 whitespace-nowrap">{s.type}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{s.mileage}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600">{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* right */}
      <div className="space-y-4">
        {/* compliance */}
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <h2 className="text-sm font-semibold text-foreground-950 mb-3">Compliance</h2>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground-500">ADR Class</span>
              <span className="text-[12px] font-semibold text-foreground-900">{truck.adrClass}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground-500">Last Inspection</span>
              <span className="text-[12px] font-semibold text-foreground-900">{truck.lastInspection}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-foreground-500">Next Service</span>
              <span className={`text-[12px] font-semibold ${inWorkshop ? 'text-secondary-700' : 'text-foreground-900'}`}>
                {truck.nextService}
              </span>
            </div>
          </div>
        </div>

        {/* alert */}
        {inWorkshop && (
          <div className="rounded-lg border border-secondary-200 bg-secondary-50 p-4">
            <div className="flex items-start gap-2.5">
              <span className="w-8 h-8 rounded-md bg-secondary-500 flex items-center justify-center shrink-0">
                <i className="ri-alert-line text-background-50 text-base leading-none" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-secondary-800">Vehicle in workshop</p>
                <p className="text-[12px] text-secondary-700 mt-0.5">
                  This truck is currently under repair and unavailable for dispatch.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}