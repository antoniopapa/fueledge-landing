type NavItem = { label: string; icon: string };

const navItems: NavItem[] = [
  { label: 'Overview', icon: 'ri-dashboard-line' },
  { label: 'Orders', icon: 'ri-file-list-3-line' },
  { label: 'Fuel Sourcing', icon: 'ri-flask-line' },
  { label: 'Dispatch', icon: 'ri-send-plane-line' },
  { label: 'Deliveries', icon: 'ri-truck-line' },
  { label: 'Fleet', icon: 'ri-car-line' },
  { label: 'Drivers', icon: 'ri-user-star-line' },
  { label: 'Terminals', icon: 'ri-building-4-line' },
  { label: 'Analytics', icon: 'ri-bar-chart-line' },
];

type Kpi = { label: string; value: string; icon: string; accent?: boolean };

const kpis: Kpi[] = [
  { label: 'Active Loads', value: '24', icon: 'ri-archive-line' },
  { label: 'Awaiting Source', value: '6', icon: 'ri-timer-line' },
  { label: 'In Transit', value: '11', icon: 'ri-truck-line' },
  { label: 'Potential Savings Today', value: '€2,840', icon: 'ri-funds-line', accent: true },
];

type Terminal = {
  name: string;
  location: string;
  distance: string;
  price: string;
  deliveryCost: string;
  total: string;
  best?: boolean;
};

const terminals: Terminal[] = [
  { name: 'Rotterdam', location: 'NL · 440 km', distance: '440 km', price: '€1.299', deliveryCost: '€1,140', total: '€42,708' },
  { name: 'Mannheim', location: 'DE · 92 km', distance: '92 km', price: '€1.309', deliveryCost: '€552', total: '€42,440', best: true },
  { name: 'Burghausen', location: 'DE · 450 km', distance: '450 km', price: '€1.339', deliveryCost: '€1,090', total: '€43,938' },
];

type Delivery = {
  route: string;
  status: 'In Transit' | 'Loading' | 'Delivered';
  driver: string;
  eta: string;
  icon: string;
};

const deliveries: Delivery[] = [
  { route: 'Rotterdam → Frankfurt', status: 'In Transit', driver: 'Jan Vos', eta: 'ETA 14:20', icon: 'ri-truck-line' },
  { route: 'Antwerp → Cologne', status: 'Loading', driver: 'Pieter Maes', eta: 'ETA 16:05', icon: 'ri-truck-line' },
  { route: 'Hamburg → Bremen', status: 'Delivered', driver: 'Sven Brandt', eta: '11:40', icon: 'ri-truck-line' },
];

const statusStyle: Record<Delivery['status'], string> = {
  'In Transit': 'text-primary-700 bg-primary-100',
  Loading: 'text-secondary-700 bg-secondary-100',
  Delivered: 'text-accent-700 bg-accent-100',
};

type Point = { x: number; y: number };

const routeSegments: { a: Point; b: Point; kind: 'transit' | 'loading' | 'delivered' | 'recommended' }[] = [
  { a: { x: 22, y: 30 }, b: { x: 44, y: 55 }, kind: 'transit' },
  { a: { x: 30, y: 38 }, b: { x: 34, y: 42 }, kind: 'loading' },
  { a: { x: 52, y: 14 }, b: { x: 48, y: 20 }, kind: 'delivered' },
  { a: { x: 44, y: 55 }, b: { x: 62, y: 78 }, kind: 'recommended' },
];

const routeKindClass: Record<string, string> = {
  transit: 'bg-primary-500',
  loading: 'bg-secondary-500',
  delivered: 'bg-accent-500',
  recommended: 'bg-accent-500',
};

const terminalMarkers: { p: Point; label?: string }[] = [
  { p: { x: 22, y: 30 }, label: 'Rotterdam' },
  { p: { x: 30, y: 38 }, label: 'Antwerp' },
  { p: { x: 52, y: 14 }, label: 'Hamburg' },
  { p: { x: 48, y: 20 }, label: 'Bremen' },
  { p: { x: 34, y: 42 }, label: 'Cologne' },
  { p: { x: 62, y: 78 }, label: 'Munich' },
];

const truckMarkers: { p: Point }[] = [
  { p: { x: 34, y: 43 } },
  { p: { x: 31, y: 40 } },
];

function lineStyle(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return {
    left: `${a.x}%`,
    top: `${a.y}%`,
    width: `${length}%`,
    transform: `rotate(${angle}deg)`,
  };
}

export default function HeroDashboard() {
  return (
    <div className="relative w-full rounded-xl border border-foreground-200/80 bg-background-50 text-left overflow-hidden select-none">
      {/* top app bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-background-200 bg-background-100/50">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-primary-500 flex items-center justify-center">
            <i className="ri-arrow-up-fill text-background-50 text-xs leading-none" />
          </span>
          <span className="font-heading font-bold text-[13px] tracking-tight text-foreground-950">FuelEdge</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 ml-2 text-[11px] font-medium text-foreground-400 border border-background-200 rounded-md px-2 py-1 bg-background-50">
            <i className="ri-search-line text-xs" />
            <span>Search orders, terminals…</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-background-200 flex items-center justify-center">
            <i className="ri-notification-3-line text-foreground-500 text-sm" />
          </span>
          <span className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-[11px] font-bold text-primary-700">MK</span>
          </span>
        </div>
      </div>

      <div className="flex">
        {/* sidebar */}
        <aside className="hidden lg:flex flex-col w-44 shrink-0 border-r border-background-200 bg-background-100/30 py-3">
          <nav className="flex flex-col gap-0.5 px-2">
            {navItems.map((item, i) => {
              const active = i === 0;
              return (
                <a
                  key={item.label}
                  href="#top"
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    active
                      ? 'bg-primary-500 text-background-50'
                      : 'text-foreground-600 hover:bg-background-200/60 hover:text-foreground-900'
                  }`}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    <i className={`${item.icon} text-[13px] leading-none`} />
                  </span>
                  {item.label}
                </a>
              );
            })}
          </nav>
        </aside>

        {/* main */}
        <div className="flex-1 min-w-0 p-3 md:p-4 space-y-3">
          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
            {kpis.map((k) => (
              <div
                key={k.label}
                className={`rounded-lg border px-3 py-2.5 ${
                  k.accent ? 'border-accent-200 bg-accent-50' : 'border-background-200 bg-background-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">
                    {k.label}
                  </span>
                  <span className="w-4 h-4 flex items-center justify-center">
                    <i className={`${k.icon} text-foreground-400 text-xs`} />
                  </span>
                </div>
                <p className={`mt-1 text-lg font-bold tabular leading-none ${k.accent ? 'text-accent-700' : 'text-foreground-950'}`}>
                  {k.value}
                </p>
              </div>
            ))}
          </div>

          {/* map + sourcing + deliveries */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-2.5">
            {/* map — largest element */}
            <div className="xl:col-span-2 rounded-lg border border-background-200 overflow-hidden relative bg-background-100">
              <div className="relative h-56 md:h-64">
                <iframe
                  title="FuelEdge European operations map"
                  src="https://maps.google.com/maps?q=Germany&z=6&output=embed"
                  className="absolute inset-0 w-full h-full border-0 [filter:saturate(0.72)_contrast(1.02)]"
                  loading="lazy"
                  aria-label="European fuel operations map showing terminals and delivery routes"
                />
                {/* route overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {routeSegments.map((s, i) => (
                    <div
                      key={i}
                      className={`absolute h-[2px] rounded-full origin-left ${routeKindClass[s.kind]} ${
                        s.kind === 'recommended' ? 'opacity-80' : 'opacity-70'
                      }`}
                      style={lineStyle(s.a, s.b)}
                    />
                  ))}

                  {/* terminal markers */}
                  {terminalMarkers.map((m) => (
                    <div
                      key={m.label}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                      style={{ left: `${m.p.x}%`, top: `${m.p.y}%` }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-500 ring-2 ring-background-50" />
                      {m.label && (
                        <span className="mt-0.5 text-[8px] font-semibold text-foreground-700 bg-background-50/90 px-1 rounded whitespace-nowrap leading-tight">
                          {m.label}
                        </span>
                      )}
                    </div>
                  ))}

                  {/* truck markers */}
                  {truckMarkers.map((m, i) => (
                    <div
                      key={i}
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-secondary-500 flex items-center justify-center ring-2 ring-background-50"
                      style={{ left: `${m.p.x}%`, top: `${m.p.y}%` }}
                    >
                      <i className="ri-truck-line text-background-50 text-[9px] leading-none" />
                    </div>
                  ))}

                  {/* delivery target marker — Frankfurt */}
                  <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: '44%', top: '55%' }}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-accent-500 ring-4 ring-accent-500/25" />
                    <span className="mt-1 text-[8px] font-bold text-foreground-900 bg-background-50 px-1 rounded whitespace-nowrap leading-tight">
                      Frankfurt · Delivery
                    </span>
                  </div>

                  {/* legend */}
                  <div className="absolute left-2 top-2 bg-background-50/95 rounded-md px-2 py-1.5 flex flex-col gap-1 border border-background-200">
                    <span className="flex items-center gap-1.5 text-[9px] text-foreground-600">
                      <span className="w-2 h-2 rounded-full bg-primary-500" /> Terminal
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] text-foreground-600">
                      <span className="w-3 h-[2px] rounded-full bg-accent-500" /> Route
                    </span>
                    <span className="flex items-center gap-1.5 text-[9px] text-foreground-600">
                      <i className="ri-truck-line text-secondary-600 text-[10px]" /> Truck
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* right column: sourcing + deliveries */}
            <div className="space-y-2.5">
              {/* fuel sourcing panel */}
              <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-background-200 bg-background-100/40">
                  <span className="text-[11px] font-semibold text-foreground-900">Fuel Sourcing</span>
                  <span className="text-[10px] font-medium text-foreground-400">Order #2841</span>
                </div>

                <div className="px-3 py-2 border-b border-background-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground-950">32,000 L Diesel</p>
                    <p className="text-[10px] text-foreground-400">Delivery: Frankfurt</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary-700 bg-primary-100 px-2 py-1 rounded-full whitespace-nowrap">
                    <i className="ri-radar-line text-[10px]" />
                    Sourcing
                  </span>
                </div>

                <div className="p-2 space-y-1.5">
                  {terminals.map((t) => (
                    <div
                      key={t.name}
                      className={`rounded-md border px-2.5 py-2 ${
                        t.best ? 'border-accent-300 bg-accent-50' : 'border-background-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              t.best ? 'bg-accent-500' : 'bg-background-200'
                            }`}
                          >
                            <i
                              className={`text-background-50 text-[10px] leading-none ${
                                t.best ? 'ri-check-line' : 'ri-building-4-line text-foreground-400'
                              }`}
                            />
                          </span>
                          <div>
                            <p className="text-[11px] font-semibold text-foreground-900 leading-tight">
                              {t.name}
                              {t.best && (
                                <span className="ml-1.5 inline-block text-[8px] font-bold text-accent-700 bg-accent-500/15 px-1.5 py-0.5 rounded-full whitespace-nowrap align-middle">
                                  Best Source
                                </span>
                              )}
                            </p>
                            <p className="text-[9px] text-foreground-400">{t.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-1.5 grid grid-cols-3 gap-1 text-center">
                        <div>
                          <p className="text-[8px] uppercase text-foreground-400">€/L</p>
                          <p className="text-[11px] font-semibold tabular text-foreground-800">{t.price}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase text-foreground-400">Distance</p>
                          <p className="text-[11px] font-semibold tabular text-foreground-800">{t.distance}</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase text-foreground-400">Delivery</p>
                          <p className="text-[11px] font-semibold tabular text-foreground-800">{t.deliveryCost}</p>
                        </div>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[9px] uppercase text-foreground-400">Total delivered</span>
                        <span className={`text-[12px] font-bold tabular ${t.best ? 'text-accent-700' : 'text-foreground-900'}`}>
                          {t.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-3 py-2.5 border-t border-background-200 bg-background-100/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[10px] text-foreground-600">
                    <i className="ri-arrow-down-line text-accent-600 text-xs" />
                    <span>
                      Saving <span className="font-bold text-accent-700">€268</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-background-50 bg-primary-500 hover:bg-primary-600 rounded-md px-2.5 py-1.5 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    <i className="ri-send-plane-line text-[11px]" />
                    Select &amp; Dispatch
                  </button>
                </div>
              </div>

              {/* active deliveries */}
              <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-background-200 bg-background-100/40">
                  <span className="text-[11px] font-semibold text-foreground-900">Active Deliveries</span>
                  <span className="text-[10px] font-medium text-primary-700 cursor-pointer whitespace-nowrap">
                    View all
                  </span>
                </div>
                <div className="divide-y divide-background-200">
                  {deliveries.map((d) => (
                    <div key={d.route} className="flex items-center gap-2.5 px-3 py-2">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          d.status === 'In Transit'
                            ? 'bg-primary-100 text-primary-700'
                            : d.status === 'Loading'
                              ? 'bg-secondary-100 text-secondary-700'
                              : 'bg-foreground-100 text-foreground-500'
                        }`}
                      >
                        <i className={`${d.icon} text-[13px] leading-none`} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-foreground-900 leading-tight whitespace-nowrap">
                          {d.route}
                        </p>
                        <p className="text-[9px] text-foreground-400">
                          {d.driver} · {d.eta}
                        </p>
                      </div>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[d.status]}`}>
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}