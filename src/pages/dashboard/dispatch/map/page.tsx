import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { dispatchNav } from '@/pages/dashboard/nav';
import { trucks } from '@/mocks/fleet';
import { drivers } from '@/mocks/drivers';
import { terminals } from '@/mocks/sourcing';

const legend = [
  { label: 'Trucks', color: 'bg-primary-500', count: trucks.filter((t) => t.status === 'On Route' || t.status === 'Loading').length },
  { label: 'Drivers', color: 'bg-accent-500', count: drivers.filter((d) => d.status === 'In Transit' || d.status === 'Delivering').length },
  { label: 'Terminals', color: 'bg-secondary-500', count: terminals.length },
  { label: 'Pickups', color: 'bg-primary-300', count: 8 },
  { label: 'Destinations', color: 'bg-accent-300', count: 9 },
  { label: 'Routes', color: 'bg-primary-700', count: 9 },
  { label: 'Exceptions', color: 'bg-red-500', count: 3 },
];

const markers = [
  { name: 'Rotterdam', left: '22%', top: '38%', tone: 'bg-secondary-500' },
  { name: 'Antwerp', left: '28%', top: '44%', tone: 'bg-secondary-500' },
  { name: 'Hamburg', left: '38%', top: '28%', tone: 'bg-primary-500' },
  { name: 'Mannheim', left: '42%', top: '52%', tone: 'bg-secondary-500' },
  { name: 'Cologne', left: '38%', top: '46%', tone: 'bg-primary-500' },
  { name: 'Frankfurt', left: '42%', top: '49%', tone: 'bg-accent-300' },
  { name: 'Lyon', left: '42%', top: '68%', tone: 'bg-secondary-500' },
  { name: 'Marseille', left: '46%', top: '74%', tone: 'bg-red-500' },
  { name: 'Gdańsk', left: '52%', top: '24%', tone: 'bg-primary-500' },
  { name: 'Warsaw', left: '58%', top: '34%', tone: 'bg-accent-300' },
  { name: 'Vienna', left: '58%', top: '56%', tone: 'bg-primary-500' },
  { name: 'Budapest', left: '64%', top: '58%', tone: 'bg-accent-300' },
];

export default function DispatchMapPage() {
  return (
    <ModuleShell
      title="Dispatch Map"
      description="Live map of active dispatches, trucks, and exceptions."
      icon="ri-map-pin-line"
      subNav={dispatchNav}
    >
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* legend */}
        <div className="xl:col-span-1 rounded-lg border border-background-200 bg-background-50 p-4 h-fit">
          <h2 className="text-sm font-semibold text-foreground-950 mb-3">Legend</h2>
          <div className="space-y-2.5">
            {legend.map((l) => (
              <div key={l.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[12px] text-foreground-700">
                  <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                  {l.label}
                </span>
                <span className="text-[12px] font-semibold text-foreground-900 tabular">{l.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* map */}
        <div className="xl:col-span-3 relative h-[560px] rounded-lg border border-background-200 overflow-hidden bg-background-100">
          <iframe
            title="Dispatch map"
            src="https://maps.google.com/maps?q=Europe&z=5&output=embed"
            className="absolute inset-0 w-full h-full border-0 [filter:saturate(0.72)_contrast(1.02)]"
            loading="lazy"
            aria-label="Live dispatch map of Europe"
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute h-[2px] rounded-full bg-primary-700 opacity-60 origin-left" style={{ left: '22%', top: '38%', width: '20%', transform: 'rotate(12deg)' }} />
            <div className="absolute h-[2px] rounded-full bg-primary-700 opacity-60 origin-left" style={{ left: '42%', top: '52%', width: '0%' }} />
            {markers.map((m) => (
              <div
                key={m.name}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: m.left, top: m.top }}
              >
                <span className={`w-3 h-3 rounded-full ${m.tone} ring-2 ring-background-50`} />
                <span className="mt-1 text-[9px] font-semibold text-foreground-900 bg-background-50/90 px-1 rounded whitespace-nowrap leading-tight">
                  {m.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleShell>
  );
}