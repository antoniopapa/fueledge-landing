import type { Compartment, Truck } from '@/mocks/fleet';

function parseLiters(s: string): number {
  return parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;
}

function generateCompartments(truck: Truck): Compartment[] {
  const total = parseLiters(truck.capacity);
  const n = Math.max(truck.compartments, 1);
  const per = Math.floor(total / n);
  const idle =
    truck.status === 'Available' || truck.status === 'Maintenance' || truck.status === 'Out of Service';
  return Array.from({ length: n }, (_, i) => {
    const empty = idle || i === n - 1;
    return {
      capacity: `${per.toLocaleString('en-US')} L`,
      product: empty ? 'Empty' : truck.product,
      volume: empty ? '0 L' : `${per.toLocaleString('en-US')} L`,
      state: empty ? ('Empty' as const) : ('Full' as const),
    };
  });
}

const stateStyle: Record<Compartment['state'], string> = {
  Full: 'text-accent-700 bg-accent-100',
  Partial: 'text-secondary-700 bg-secondary-100',
  Empty: 'text-foreground-500 bg-background-200',
};

export default function TruckCompartmentsTab({ truck }: { truck: Truck }) {
  const compartments =
    truck.compartmentsDetail && truck.compartmentsDetail.length > 0
      ? truck.compartmentsDetail
      : generateCompartments(truck);

  const totalCapacity = parseLiters(truck.capacity);
  const filled = compartments.reduce((sum, c) => sum + parseLiters(c.volume), 0);
  const empty = Math.max(totalCapacity - filled, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Total Capacity</p>
          <p className="mt-1 text-xl font-bold text-foreground-950 tabular">{truck.capacity}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Compartments</p>
          <p className="mt-1 text-xl font-bold text-foreground-950 tabular">{compartments.length}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Onboard Volume</p>
          <p className="mt-1 text-xl font-bold text-accent-700 tabular">{filled.toLocaleString('en-US')} L</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-4">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Empty Capacity</p>
          <p className="mt-1 text-xl font-bold text-foreground-950 tabular">{empty.toLocaleString('en-US')} L</p>
        </div>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-background-200">
          <h2 className="text-sm font-semibold text-foreground-950">Compartments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[720px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Compartment</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Capacity</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Current Product</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Current Volume</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Empty Capacity</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {compartments.map((c, i) => {
                const cap = parseLiters(c.capacity);
                const vol = parseLiters(c.volume);
                const emptyAmt = Math.max(cap - vol, 0);
                return (
                  <tr key={i} className="hover:bg-background-100/50 transition-colors">
                    <td className="px-4 py-3 text-[12px] font-semibold text-foreground-900 whitespace-nowrap">
                      Compartment {i + 1}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{c.capacity}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{c.product}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{c.volume}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-500 tabular whitespace-nowrap">
                      {emptyAmt.toLocaleString('en-US')} L
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${stateStyle[c.state]}`}
                      >
                        {c.state}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}