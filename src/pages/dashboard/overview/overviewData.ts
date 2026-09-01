import { orders, type OrderStatus } from '@/mocks/orders';
import { deliveries, type Delivery, type DeliveryStatus } from '@/mocks/deliveries';
import { trucks, type TruckStatus } from '@/mocks/fleet';
import { drivers } from '@/mocks/drivers';
import {
  terminals,
  sourcingOpportunities,
  terminalIssues,
  allocationWarnings,
  contractWarnings,
  type TerminalStatus,
} from '@/mocks/sourcing';

// ---------------------------------------------------------------------------
// numeric helpers
// ---------------------------------------------------------------------------
const parseNumber = (value: string): number => parseInt(value.replace(/[^\d]/g, ''), 10) || 0;

const formatLitres = (n: number): string =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace('.0', '')}M L` : `${Math.round(n / 1000)}k L`;

const formatEuro = (n: number): string => `€${n.toLocaleString('en-US')}`;

// ---------------------------------------------------------------------------
// order lifecycle
// ---------------------------------------------------------------------------
const countStatus = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

const newOrders = countStatus('New');
const readyToSource = countStatus('Ready to Source');
const sourced = countStatus('Sourced');
const scheduled = countStatus('Scheduled');
const inProgress = countStatus('In Progress');
const completed = countStatus('Completed');

const openOrders = newOrders + readyToSource + sourced + scheduled + inProgress;
const awaitingSourcing = readyToSource;
const awaitingDispatch = sourced;

// ---------------------------------------------------------------------------
// deliveries
// ---------------------------------------------------------------------------
const activeDeliveries = deliveries.filter((d) => d.status !== 'Completed');
const atRiskDeliveries = deliveries.filter((d) => d.exception);
const inTransitDeliveries = activeDeliveries.filter((d) => d.status === 'In Transit').length;
const loadingDeliveries = activeDeliveries.filter((d) => d.status === 'Loading').length;

// ---------------------------------------------------------------------------
// resources
// ---------------------------------------------------------------------------
const availableTrucks = trucks.filter((t) => t.status === 'Available');
const availableDrivers = drivers.filter((d) => d.status === 'Available');

// fleet & driver availability (dispatcher at-a-glance strip)
export const fleetAvailability = {
  total: trucks.length,
  available: availableTrucks.length,
  inTransit: trucks.filter((t) => t.status === 'In Transit').length,
  loading: trucks.filter((t) => t.status === 'Loading').length,
  atCustomer: trucks.filter((t) => t.status === 'At Customer').length,
  maintenance: trucks.filter((t) => t.status === 'Maintenance').length,
};

export const driverAvailability = {
  total: drivers.length,
  available: availableDrivers.length,
  onShift: drivers.filter((d) => d.status !== 'Off Duty').length,
  offDuty: drivers.filter((d) => d.status === 'Off Duty').length,
  onBreak: drivers.filter((d) => d.status === 'Break').length,
};

// on-time delivery rate (share of active deliveries without an exception)
const onTimePct =
  activeDeliveries.length > 0
    ? Math.round(((activeDeliveries.length - atRiskDeliveries.length) / activeDeliveries.length) * 100)
    : 100;

// ---------------------------------------------------------------------------
// volume & financials
// ---------------------------------------------------------------------------
const todayVolumeLitres = activeDeliveries.reduce((sum, d) => sum + parseNumber(d.volume), 0);
const sourcingSavings = sourcingOpportunities.reduce((sum, o) => sum + parseNumber(o.saving), 0);
const deliveredMargin = orders
  .filter((o) => o.status === 'Completed')
  .reduce((sum, o) => sum + parseNumber(o.margin), 0);

// ---------------------------------------------------------------------------
// KPIs
// ---------------------------------------------------------------------------
export type OverviewTone = 'neutral' | 'accent' | 'primary' | 'secondary' | 'danger';

export interface OverviewKpi {
  label: string;
  value: string;
  delta: string;
  icon: string;
  tone: OverviewTone;
  spark: number[];
}

export const overviewKpis: OverviewKpi[] = [
  {
    label: 'Open Orders',
    value: String(openOrders),
    delta: `${awaitingSourcing + awaitingDispatch} need action`,
    icon: 'ri-file-list-3-line',
    tone: 'neutral',
    spark: [17, 20, 18, 22, openOrders],
  },
  {
    label: 'Active Deliveries',
    value: String(activeDeliveries.length),
    delta: `${inTransitDeliveries} in transit · ${loadingDeliveries} loading`,
    icon: 'ri-truck-line',
    tone: 'neutral',
    spark: [13, 11, 12, 10, activeDeliveries.length],
  },
  {
    label: 'On-Time Delivery',
    value: `${onTimePct}%`,
    delta: `${atRiskDeliveries.length} with exceptions`,
    icon: 'ri-timer-flash-line',
    tone: 'accent',
    spark: [82, 80, 76, 72, onTimePct],
  },
  {
    label: 'Sourcing Savings',
    value: formatEuro(sourcingSavings),
    delta: `${sourcingOpportunities.length} open opportunities`,
    icon: 'ri-funds-line',
    tone: 'secondary',
    spark: [430, 540, 610, 690, sourcingSavings],
  },
  {
    label: 'Delivered Margin',
    value: formatEuro(deliveredMargin),
    delta: `${completed} completed runs`,
    icon: 'ri-line-chart-line',
    tone: 'primary',
    spark: [980, 1120, 1290, 1340, deliveredMargin],
  },
];

// ---------------------------------------------------------------------------
// needs attention
// ---------------------------------------------------------------------------
export type AttentionTone = 'primary' | 'secondary' | 'accent' | 'danger';

export interface AttentionItem {
  label: string;
  count: number;
  icon: string;
  tone: AttentionTone;
  link: string;
  detail: string;
}

// oldest waiting time across a set of orders (derived from createdAt time-of-day)
const oldestSince = (list: { createdAt: string }[]): string => {
  const times = list
    .map((o) => o.createdAt.split('·')[1]?.trim())
    .filter((t): t is string => Boolean(t));
  if (!times.length) return '—';
  return times.sort()[0];
};

const readyToSourceOrders = orders.filter((o) => o.status === 'Ready to Source');
const sourcedOrders = orders.filter((o) => o.status === 'Sourced');
const criticalTerminalIssues = terminalIssues.filter((i) => i.severity === 'critical').length;

export const attentionItems: AttentionItem[] = [
  {
    label: 'Runs need sourcing',
    count: awaitingSourcing,
    icon: 'ri-flask-line',
    tone: 'secondary',
    link: '/sourcing',
    detail: `oldest since ${oldestSince(readyToSourceOrders)}`,
  },
  {
    label: 'Runs need dispatch',
    count: awaitingDispatch,
    icon: 'ri-send-plane-line',
    tone: 'primary',
    link: '/dispatch',
    detail: `oldest since ${oldestSince(sourcedOrders)}`,
  },
  {
    label: 'Terminal issues',
    count: terminalIssues.length,
    icon: 'ri-building-4-line',
    tone: 'secondary',
    link: '/sourcing/terminals',
    detail: `${criticalTerminalIssues} critical`,
  },
  {
    label: 'Deliveries at risk',
    count: atRiskDeliveries.length,
    icon: 'ri-alarm-warning-line',
    tone: 'danger',
    link: '/deliveries/exceptions',
    detail: `${atRiskDeliveries.length} with exceptions`,
  },
  {
    label: 'Allocation warnings',
    count: allocationWarnings.length,
    icon: 'ri-pie-chart-line',
    tone: 'accent',
    link: '/sourcing',
    detail: `${allocationWarnings.length} terminals`,
  },
  {
    label: 'Contract warnings',
    count: contractWarnings.length,
    icon: 'ri-file-text-line',
    tone: 'accent',
    link: '/sourcing/contracts',
    detail: `${contractWarnings[0]?.supplier ?? ''} expiring`,
  },
];

export const attentionOpenCount = attentionItems.reduce((sum, i) => sum + i.count, 0);

// ---------------------------------------------------------------------------
// live map
// ---------------------------------------------------------------------------
export interface MapPoint {
  x: number;
  y: number;
}

export interface MapTerminal {
  id: string;
  city: string;
  x: number;
  y: number;
  status: TerminalStatus;
}

export interface MapTruck {
  id: string;
  plate: string;
  x: number;
  y: number;
}

export interface MapRoute {
  from: MapPoint;
  to: MapPoint;
  kind: 'transit' | 'loading' | 'risk';
}

export interface MapDestination {
  city: string;
  x: number;
  y: number;
}

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Rotterdam: { lat: 51.92, lng: 4.48 },
  Antwerp: { lat: 51.22, lng: 4.4 },
  Mannheim: { lat: 49.49, lng: 8.47 },
  Hamburg: { lat: 53.55, lng: 9.99 },
  Lyon: { lat: 45.76, lng: 4.84 },
  Basel: { lat: 47.56, lng: 7.59 },
  'Gdańsk': { lat: 54.35, lng: 18.65 },
  Pardubice: { lat: 50.04, lng: 15.78 },
  Arad: { lat: 46.19, lng: 21.31 },
  Stockholm: { lat: 59.33, lng: 18.07 },
  Aalborg: { lat: 57.05, lng: 9.92 },
  Vienna: { lat: 48.21, lng: 16.37 },
  Cologne: { lat: 50.94, lng: 6.96 },
  Eindhoven: { lat: 51.44, lng: 5.47 },
  Karlsruhe: { lat: 49.01, lng: 8.4 },
  'Toruń': { lat: 53.01, lng: 18.6 },
  'Győr': { lat: 47.68, lng: 17.63 },
  Koblenz: { lat: 50.36, lng: 7.6 },
  Frankfurt: { lat: 50.11, lng: 8.68 },
  Prague: { lat: 50.08, lng: 14.44 },
  Strasbourg: { lat: 48.57, lng: 7.75 },
  Warsaw: { lat: 52.23, lng: 21.01 },
  Uppsala: { lat: 59.86, lng: 17.64 },
  Bremen: { lat: 53.08, lng: 8.8 },
  Aarhus: { lat: 56.16, lng: 10.2 },
};

const LNG_MIN = -4;
const LNG_MAX = 24;
const LAT_MIN = 43;
const LAT_MAX = 61;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const mercX = (lng: number): number => (lng + 180) / 360;
const mercY = (lat: number): number => {
  const r = (lat * Math.PI) / 180;
  return (1 - Math.log(Math.tan(Math.PI / 4 + r / 2)) / Math.PI) / 2;
};

const X_MIN = mercX(LNG_MIN);
const X_MAX = mercX(LNG_MAX);
const Y_MIN = mercY(LAT_MAX);
const Y_MAX = mercY(LAT_MIN);

const project = (lat: number, lng: number): MapPoint => ({
  x: clamp(((mercX(lng) - X_MIN) / (X_MAX - X_MIN)) * 100, 2, 98),
  y: clamp(((mercY(lat) - Y_MIN) / (Y_MAX - Y_MIN)) * 100, 2, 98),
});

const resolveCity = (label: string): string =>
  label
    .replace(/\s*Terminal$/i, '')
    .replace(/\s*Depot$/i, '')
    .replace(/^Customer site ·\s*/i, '')
    .trim();

const cityPoint = (label: string): MapPoint => {
  const coord = CITY_COORDS[resolveCity(label)];
  return coord ? project(coord.lat, coord.lng) : { x: 50, y: 50 };
};

export const mapTerminals: MapTerminal[] = terminals.map((t) => {
  const p = cityPoint(t.city);
  return { id: t.id, city: t.city, x: p.x, y: p.y, status: t.status };
});

const ACTIVE_TRUCK_STATUSES: TruckStatus[] = ['Heading to Terminal', 'Loading', 'In Transit', 'At Customer', 'Assigned'];

export const mapTrucks: MapTruck[] = trucks
  .filter((t) => ACTIVE_TRUCK_STATUSES.includes(t.status) && t.location)
  .map((t) => {
    const p = cityPoint(t.location);
    return { id: t.id, plate: t.plate, x: p.x, y: p.y };
  });

export const mapRoutes: MapRoute[] = activeDeliveries.map((d) => {
  const [fromCity, toCity] = d.route.split('→').map((s) => s.trim());
  const kind: MapRoute['kind'] = d.exception
    ? 'risk'
    : d.status === 'Loading'
      ? 'loading'
      : 'transit';
  return { from: cityPoint(fromCity), to: cityPoint(toCity), kind };
});

export const mapDestinations: MapDestination[] = (() => {
  const seen = new Set<string>();
  const result: MapDestination[] = [];
  activeDeliveries.forEach((d) => {
    const city = d.route.split('→')[1].trim();
    if (seen.has(city)) return;
    seen.add(city);
    const p = cityPoint(city);
    result.push({ city, x: p.x, y: p.y });
  });
  return result;
})();

// ---------------------------------------------------------------------------
// unified map deliveries (terminal → truck → customer)
// ---------------------------------------------------------------------------
export interface MapLocation {
  city: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
}

export type RouteHealth = 'ontime' | 'warning' | 'risk' | 'scheduled';

export interface MapDelivery {
  id: string;
  order: string;
  customer: string;
  route: string;
  product: string;
  volume: string;
  driver: string;
  truck: string;
  status: DeliveryStatus;
  eta: string;
  exception?: string;
  health: RouteHealth;
  origin: MapLocation;
  truckPos: MapLocation;
  destination: MapLocation;
  path: MapLocation[];
}

const locationOf = (label: string): MapLocation => {
  const city = resolveCity(label);
  const coord = CITY_COORDS[city];
  const lat = coord ? coord.lat : 50;
  const lng = coord ? coord.lng : 8;
  const p = project(lat, lng);
  return { city, lat, lng, x: p.x, y: p.y };
};

const routeHealthOf = (d: Delivery): RouteHealth => {
  if (d.status === 'Heading to Terminal' || d.status === 'Waiting') return 'scheduled';
  const ex = d.exception?.toLowerCase() ?? '';
  if (ex.includes('issue') || ex.includes('fault') || ex.includes('breakdown')) return 'risk';
  if (d.exception) return 'warning';
  return 'ontime';
};

const pathOf = (points: [number, number][]): MapLocation[] =>
  points.map(([lat, lng]) => {
    const p = project(lat, lng);
    return { city: '', lat, lng, x: p.x, y: p.y };
  });

const ROUTE_PATHS: Record<string, [number, number][]> = {
  '2841': [[51.22, 4.4], [51.3, 4.71], [51.44, 5.47], [51.37, 6.17], [51.21, 6.67], [50.94, 6.96], [50.86, 7.05], [50.73, 7.1], [50.32, 7.6], [50.08, 8.24], [50.11, 8.68]],
  '2844': [[51.22, 4.4], [51.3, 4.71], [51.44, 5.47], [51.37, 6.17], [51.21, 6.67], [50.94, 6.96]],
  '2839': [[51.92, 4.48], [51.7, 4.55], [51.58, 4.79], [51.56, 5.09], [51.44, 5.47]],
  '2854': [[50.04, 15.78], [50.1, 15.62], [50.03, 15.2], [50.02, 14.85], [50.08, 14.44]],
  '2852': [[47.56, 7.59], [47.99, 7.85], [48.47, 7.94], [49.01, 8.4], [48.8, 8.0], [48.57, 7.75]],
  '2855': [[54.35, 18.65], [53.83, 18.8], [53.49, 18.75], [53.01, 18.6], [52.65, 19.07], [52.55, 19.7], [52.23, 21.01]],
  '2856': [[59.33, 18.07], [59.41, 17.93], [59.62, 17.84], [59.86, 17.64]],
  '2850': [[53.55, 9.99], [53.45, 9.5], [53.25, 9.0], [53.08, 8.8]],
  '2858': [[57.05, 9.92], [56.75, 10.0], [56.46, 10.03], [56.16, 10.2]],
};

export const mapDeliveries: MapDelivery[] = activeDeliveries.map((d) => {
  const [originCity, destCity] = d.route.split('→').map((s) => s.trim());
  const fallback: [number, number][] = [
    [locationOf(originCity).lat, locationOf(originCity).lng],
    [locationOf(d.location).lat, locationOf(d.location).lng],
    [locationOf(destCity).lat, locationOf(destCity).lng],
  ];
  return {
    id: d.id,
    order: d.order,
    customer: d.customer,
    route: d.route,
    product: d.product,
    volume: d.volume,
    driver: d.driver,
    truck: d.truck,
    status: d.status,
    eta: d.eta,
    exception: d.exception,
    health: routeHealthOf(d),
    origin: locationOf(originCity),
    truckPos: locationOf(d.location),
    destination: locationOf(destCity),
    path: pathOf(ROUTE_PATHS[d.id] ?? fallback),
  };
});

// ---------------------------------------------------------------------------
// operational columns
// ---------------------------------------------------------------------------
export interface ActiveDeliveryRow {
  route: string;
  status: DeliveryStatus;
  driver: string;
  plate: string;
  eta: string;
}

export const activeDeliveriesList: ActiveDeliveryRow[] = activeDeliveries.map((d) => ({
  route: d.route,
  status: d.status,
  driver: d.driver,
  plate: d.truck,
  eta: d.eta,
}));

export interface UpcomingDispatchRow {
  time: string;
  route: string;
  product: string;
  driver: string;
  plate: string;
}

export const upcomingDispatches: UpcomingDispatchRow[] = orders
  .filter((o) => o.status === 'Scheduled' || o.status === 'Sourced')
  .map((o) => ({
    time: o.eta,
    route: o.route,
    product: `${o.volume} ${o.product}`,
    driver: o.driver,
    plate: o.truck ?? '—',
  }));

export interface SourcingOpportunityRow {
  order: string;
  route: string;
  volume: string;
  saving: string;
}

export const sourcingOpportunitiesList: SourcingOpportunityRow[] = sourcingOpportunities.map((s) => ({
  order: s.order,
  route: s.route,
  volume: s.volume,
  saving: s.saving,
}));

export interface RunRow {
  id: string;
  route: string;
  product: string;
  driver: string;
  source: string;
  status: OrderStatus;
  eta: string;
  cost: string;
}

export const runRows: RunRow[] = orders
  .filter((o) => o.status === 'In Progress' || o.status === 'Scheduled')
  .map((o) => ({
    id: `#${o.id}`,
    route: o.route,
    product: `${o.volume} ${o.product}`,
    driver: o.driver,
    source: o.source,
    status: o.status,
    eta: o.eta,
    cost: o.deliveredCost,
  }));

export const runSummary = { open: openOrders, awaitingSource: awaitingSourcing };