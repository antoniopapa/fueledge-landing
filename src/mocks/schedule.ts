export type ScheduleStatus = 'Scheduled' | 'Dispatched' | 'Completed' | 'Delayed' | 'Conflict';

export type ResourceAvailability = 'Available' | 'On Shift' | 'Break' | 'Unavailable';

export interface ScheduleResource {
  driverName: string;
  driverInitials: string;
  truckPlate: string;
  availability: ResourceAvailability;
}

export interface ScheduleRun {
  id: string;
  driverName: string;
  truckPlate: string;
  route: string;
  product: string;
  volume: string;
  day: number; // 0 = Thu .. 6 = Wed within the visible week
  startTime: string; // '13:30'
  endTime: string; // '16:00'
  status: ScheduleStatus;
  pickup: string;
  delivery: string;
  conflict?: boolean;
  conflictNote?: string;
}

export interface DispatchStop {
  kind: 'pickup' | 'delivery';
  name: string;
  city: string;
  fuelType: string;
  quantityL: number;
  window: string;
}

export interface UnscheduledRun {
  id: string;
  sourceTerminal: string;
  destination: string;
  product: string;
  volume: string;
  pickupWindow: string;
  deliveryWindow: string;
  recommendedDriver: string;
  recommendedTruck: string;
  reason: string;
  stops?: DispatchStop[];
  requiredFuelL?: number;
  deliveryFirst?: boolean;
}

export interface AssignmentCheck {
  label: string;
  ok: boolean;
}

export interface AssignmentOption {
  driverName: string;
  truckPlate: string;
  available: string;
  distance: string;
  checks: AssignmentCheck[];
}

const scheduleLoadsUrl = 'https://fueledge-api.vercel.app/api/loads';

function isScheduleStatus(status: string): status is ScheduleStatus {
  return ['Scheduled', 'Dispatched', 'Completed', 'Delayed', 'Conflict'].includes(status);
}

function normalizeScheduleRun(run: Partial<ScheduleRun>): ScheduleRun | null {
  if (
    !run.id ||
    !run.driverName ||
    !run.truckPlate ||
    !run.route ||
    !run.product ||
    !run.volume ||
    typeof run.day !== 'number' ||
    !run.startTime ||
    !run.endTime ||
    !run.status ||
    !isScheduleStatus(run.status) ||
    !run.pickup ||
    !run.delivery
  ) {
    return null;
  }

  return {
    id: String(run.id),
    driverName: run.driverName,
    truckPlate: run.truckPlate,
    route: run.route,
    product: run.product,
    volume: run.volume,
    day: run.day,
    startTime: run.startTime,
    endTime: run.endTime,
    status: run.status,
    pickup: run.pickup,
    delivery: run.delivery,
    ...(run.conflict !== undefined ? { conflict: run.conflict } : {}),
    ...(run.conflictNote ? { conflictNote: run.conflictNote } : {}),
  };
}

export async function fetchScheduleRuns(): Promise<ScheduleRun[]> {
  const response = await fetch(scheduleLoadsUrl);
  if (!response.ok) {
    throw new Error(`Unable to retrieve scheduled runs: ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('Scheduled runs response must be an array');
  }

  return payload
    .map((run) => normalizeScheduleRun(run))
    .filter((run): run is ScheduleRun => run !== null);
}

export const unassignedRuns: UnscheduledRun[] = [
  {
    id: '2865',
    sourceTerminal: 'Lyon Terminal',
    destination: 'Marseille',
    product: 'Diesel EN590',
    volume: '31,000 L',
    pickupWindow: '14:00 – 16:00',
    deliveryWindow: '17:30 – 19:00',
    recommendedDriver: 'Markus Wagner',
    recommendedTruck: 'TR-76-BX',
    reason: 'Truck fault · replacement dispatched',
  },
  {
    id: '2864',
    sourceTerminal: 'Rotterdam Terminal',
    destination: 'Mannheim',
    product: 'Diesel EN590',
    volume: '30,000 L',
    pickupWindow: '09:00 – 11:00',
    deliveryWindow: '15:00 – 17:00',
    recommendedDriver: 'Pieter Jansen',
    recommendedTruck: 'NL-34-RT',
    reason: 'Sourced · awaiting assignment',
  },
  {
    id: '2910',
    sourceTerminal: '—',
    destination: 'Frankfurt',
    product: 'Diesel EN590',
    volume: '18,000 L',
    pickupWindow: '—',
    deliveryWindow: '07:30 – 09:40',
    recommendedDriver: 'Markus Wagner',
    recommendedTruck: 'TR-76-BX',
    reason: 'Delivery-first · onboard inventory covers route',
    deliveryFirst: true,
    requiredFuelL: 18000,
    stops: [
      { kind: 'delivery', name: 'Frankfurt Retail GmbH', city: 'Frankfurt', fuelType: 'Diesel EN590', quantityL: 6000, window: '07:30' },
      { kind: 'delivery', name: 'Main Fuel Services', city: 'Frankfurt', fuelType: 'Diesel EN590', quantityL: 7000, window: '08:20' },
      { kind: 'delivery', name: 'Airport Logistics', city: 'Frankfurt', fuelType: 'Diesel EN590', quantityL: 5000, window: '09:10' },
    ],
  },
  {
    id: '2912',
    sourceTerminal: '—',
    destination: 'Frankfurt',
    product: 'Diesel EN590',
    volume: '20,000 L',
    pickupWindow: '—',
    deliveryWindow: '08:00 – 10:30',
    recommendedDriver: 'Markus Wagner',
    recommendedTruck: 'TR-76-BX',
    reason: 'Delivery-first · insufficient onboard inventory',
    deliveryFirst: true,
    requiredFuelL: 20000,
    stops: [
      { kind: 'delivery', name: 'Frankfurt West Depot', city: 'Frankfurt', fuelType: 'Diesel EN590', quantityL: 7000, window: '08:00' },
      { kind: 'delivery', name: 'Frankfurt Nord Fuels', city: 'Frankfurt', fuelType: 'Diesel EN590', quantityL: 7000, window: '08:50' },
      { kind: 'delivery', name: 'Frankfurt Ost Fuels', city: 'Frankfurt', fuelType: 'Diesel EN590', quantityL: 6000, window: '09:40' },
    ],
  },
];

export const assignmentOptions: Record<string, AssignmentOption[]> = {
  '2865': [
    {
      driverName: 'Markus Wagner',
      truckPlate: 'TR-76-BX',
      available: '14:15',
      distance: '18 km',
      checks: [
        { label: 'Capacity', ok: true },
        { label: 'Shift', ok: true },
        { label: 'Delivery window', ok: true },
      ],
    },
    {
      driverName: 'Jan Vos',
      truckPlate: 'NL-77-KVX',
      available: '14:40',
      distance: '26 km',
      checks: [
        { label: 'Capacity', ok: true },
        { label: 'Shift', ok: true },
        { label: 'Delivery window', ok: false },
      ],
    },
    {
      driverName: 'Lars Petersen',
      truckPlate: 'DE-12-HH',
      available: '15:05',
      distance: '42 km',
      checks: [
        { label: 'Capacity', ok: true },
        { label: 'Shift', ok: false },
        { label: 'Delivery window', ok: false },
      ],
    },
  ],
  '2864': [
    {
      driverName: 'Pieter Jansen',
      truckPlate: 'NL-34-RT',
      available: '09:30',
      distance: '8 km',
      checks: [
        { label: 'Capacity', ok: true },
        { label: 'Shift', ok: true },
        { label: 'Delivery window', ok: true },
      ],
    },
    {
      driverName: 'Sven de Vries',
      truckPlate: 'NL-45-KL',
      available: '10:00',
      distance: '15 km',
      checks: [
        { label: 'Capacity', ok: true },
        { label: 'Shift', ok: true },
        { label: 'Delivery window', ok: true },
      ],
    },
    {
      driverName: 'Jan Vos',
      truckPlate: 'NL-77-KVX',
      available: '10:25',
      distance: '12 km',
      checks: [
        { label: 'Capacity', ok: true },
        { label: 'Shift', ok: true },
        { label: 'Delivery window', ok: false },
      ],
    },
  ],
};
