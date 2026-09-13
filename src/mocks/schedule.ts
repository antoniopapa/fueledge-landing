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

export const scheduleResources: ScheduleResource[] = [
  { driverName: 'Thomas Müller', driverInitials: 'TM', truckPlate: 'DE-82-MN', availability: 'On Shift' },
  { driverName: 'Markus Wagner', driverInitials: 'MW', truckPlate: 'TR-76-BX', availability: 'On Shift' },
  { driverName: 'Sven de Vries', driverInitials: 'SV', truckPlate: 'NL-45-KL', availability: 'On Shift' },
  { driverName: 'Pieter Jansen', driverInitials: 'PJ', truckPlate: 'NL-34-RT', availability: 'On Shift' },
  { driverName: 'Jonas Fischer', driverInitials: 'JF', truckPlate: 'DE-55-FR', availability: 'On Shift' },
  { driverName: 'Karel Novák', driverInitials: 'KN', truckPlate: 'CZ-20-PRG', availability: 'On Shift' },
  { driverName: 'Mateusz Kowalski', driverInitials: 'MK', truckPlate: 'PL-88-WAW', availability: 'On Shift' },
  { driverName: 'Erik Johansson', driverInitials: 'EJ', truckPlate: 'SE-23-STO', availability: 'On Shift' },
  { driverName: 'Henrik Larsen', driverInitials: 'HL', truckPlate: 'DK-14-CPH', availability: 'On Shift' },
  { driverName: 'Andrei Popescu', driverInitials: 'AP', truckPlate: 'RO-91-BUC', availability: 'Break' },
  { driverName: 'Jan Vos', driverInitials: 'JV', truckPlate: 'NL-77-KVX', availability: 'On Shift' },
  { driverName: 'Lars Petersen', driverInitials: 'LP', truckPlate: 'DE-12-HH', availability: 'Available' },
  { driverName: 'Olivier Moreau', driverInitials: 'OM', truckPlate: 'FR-30-LYS', availability: 'Unavailable' },
];

export const scheduleRuns: ScheduleRun[] = [
  // ---- Thu (day 0) · today ----
  { id: '2850', driverName: 'Thomas Müller', truckPlate: 'DE-82-MN', route: 'Hamburg → Bremen', product: 'Diesel EN590', volume: '28,000 L', day: 0, startTime: '13:30', endTime: '16:00', status: 'Scheduled', pickup: 'Hamburg Terminal', delivery: 'Bremen' },
  { id: '2841', driverName: 'Markus Wagner', truckPlate: 'TR-76-BX', route: 'Frankfurt → Mannheim', product: 'Diesel EN590', volume: '32,000 L', day: 0, startTime: '11:30', endTime: '16:00', status: 'Dispatched', pickup: 'Frankfurt Terminal', delivery: 'Mannheim' },
  { id: '2844', driverName: 'Sven de Vries', truckPlate: 'NL-45-KL', route: 'Antwerp → Cologne', product: 'Diesel EN590', volume: '24,000 L', day: 0, startTime: '11:30', endTime: '16:05', status: 'Dispatched', pickup: 'Antwerp Terminal', delivery: 'Cologne' },
  { id: '2839', driverName: 'Pieter Jansen', truckPlate: 'NL-34-RT', route: 'Rotterdam → Eindhoven', product: 'Diesel EN590', volume: '26,000 L', day: 0, startTime: '13:50', endTime: '14:20', status: 'Conflict', pickup: 'Rotterdam Terminal', delivery: 'Eindhoven', conflict: true, conflictNote: 'Previous run ends 14:20 · Next pickup begins 14:00' },
  { id: '2859', driverName: 'Pieter Jansen', truckPlate: 'NL-34-RT', route: 'Eindhoven → Rotterdam', product: 'Diesel EN590', volume: '24,000 L', day: 0, startTime: '14:00', endTime: '16:30', status: 'Conflict', pickup: 'Eindhoven', delivery: 'Rotterdam', conflict: true, conflictNote: 'Previous run ends 14:20 · Next pickup begins 14:00' },
  { id: '2852', driverName: 'Jonas Fischer', truckPlate: 'DE-55-FR', route: 'Basel → Strasbourg', product: 'Diesel EN590', volume: '27,000 L', day: 0, startTime: '10:20', endTime: '13:10', status: 'Dispatched', pickup: 'Basel Terminal', delivery: 'Strasbourg' },
  { id: '2854', driverName: 'Karel Novák', truckPlate: 'CZ-20-PRG', route: 'Pardubice → Prague', product: 'Diesel EN590', volume: '25,000 L', day: 0, startTime: '11:30', endTime: '15:20', status: 'Delayed', pickup: 'Pardubice Terminal', delivery: 'Prague' },
  { id: '2855', driverName: 'Mateusz Kowalski', truckPlate: 'PL-88-WAW', route: 'Gdańsk → Warsaw', product: 'Diesel EN590', volume: '29,000 L', day: 0, startTime: '11:00', endTime: '15:00', status: 'Dispatched', pickup: 'Gdańsk Terminal', delivery: 'Warsaw' },
  { id: '2856', driverName: 'Erik Johansson', truckPlate: 'SE-23-STO', route: 'Stockholm → Uppsala', product: 'Diesel EN590', volume: '21,000 L', day: 0, startTime: '10:50', endTime: '14:00', status: 'Dispatched', pickup: 'Stockholm Terminal', delivery: 'Uppsala' },
  { id: '2858', driverName: 'Henrik Larsen', truckPlate: 'DK-14-CPH', route: 'Aalborg → Aarhus', product: 'Diesel EN590', volume: '23,000 L', day: 0, startTime: '13:00', endTime: '15:00', status: 'Scheduled', pickup: 'Aalborg Terminal', delivery: 'Aarhus' },
  { id: '2848', driverName: 'Andrei Popescu', truckPlate: 'RO-91-BUC', route: 'Arad → Budapest', product: 'Diesel EN590', volume: '30,000 L', day: 0, startTime: '13:20', endTime: '15:00', status: 'Scheduled', pickup: 'Arad Terminal', delivery: 'Budapest' },
  { id: '2843', driverName: 'Jan Vos', truckPlate: 'NL-77-KVX', route: 'Rotterdam → Mannheim', product: 'Diesel EN590', volume: '30,000 L', day: 0, startTime: '10:40', endTime: '15:40', status: 'Dispatched', pickup: 'Rotterdam Terminal', delivery: 'Mannheim' },
  { id: '2820', driverName: 'Lars Petersen', truckPlate: 'DE-12-HH', route: 'Hamburg → Kiel', product: 'Diesel EN590', volume: '20,000 L', day: 0, startTime: '06:00', endTime: '08:52', status: 'Completed', pickup: 'Hamburg Terminal', delivery: 'Kiel' },

  // ---- Fri (day 1) ----
  { id: '2857', driverName: 'Markus Wagner', truckPlate: 'TR-76-BX', route: 'Frankfurt → Mannheim', product: 'Diesel EN590', volume: '30,000 L', day: 1, startTime: '09:00', endTime: '12:00', status: 'Scheduled', pickup: 'Frankfurt', delivery: 'Mannheim' },
  { id: '2860', driverName: 'Sven de Vries', truckPlate: 'NL-45-KL', route: 'Cologne → Düsseldorf', product: 'Diesel EN590', volume: '24,000 L', day: 1, startTime: '08:30', endTime: '11:30', status: 'Scheduled', pickup: 'Cologne', delivery: 'Düsseldorf' },
  { id: '2861', driverName: 'Jonas Fischer', truckPlate: 'DE-55-FR', route: 'Strasbourg → Stuttgart', product: 'Diesel EN590', volume: '25,000 L', day: 1, startTime: '10:00', endTime: '13:00', status: 'Scheduled', pickup: 'Strasbourg', delivery: 'Stuttgart' },
  { id: '2874', driverName: 'Jan Vos', truckPlate: 'NL-77-KVX', route: 'Mannheim → Karlsruhe', product: 'Diesel EN590', volume: '28,000 L', day: 1, startTime: '14:00', endTime: '16:30', status: 'Scheduled', pickup: 'Mannheim', delivery: 'Karlsruhe' },

  // ---- Sat (day 2) ----
  { id: '2862', driverName: 'Karel Novák', truckPlate: 'CZ-20-PRG', route: 'Prague → Brno', product: 'Diesel EN590', volume: '25,000 L', day: 2, startTime: '09:00', endTime: '12:00', status: 'Scheduled', pickup: 'Prague', delivery: 'Brno' },
  { id: '2863', driverName: 'Mateusz Kowalski', truckPlate: 'PL-88-WAW', route: 'Warsaw → Łódź', product: 'Diesel EN590', volume: '22,000 L', day: 2, startTime: '08:00', endTime: '11:00', status: 'Scheduled', pickup: 'Warsaw', delivery: 'Łódź' },

  // ---- Sun (day 3) ----
  { id: '2866', driverName: 'Erik Johansson', truckPlate: 'SE-23-STO', route: 'Uppsala → Västerås', product: 'Diesel EN590', volume: '21,000 L', day: 3, startTime: '14:00', endTime: '16:30', status: 'Scheduled', pickup: 'Uppsala', delivery: 'Västerås' },

  // ---- Mon (day 4) ----
  { id: '2853', driverName: 'Thomas Müller', truckPlate: 'DE-82-MN', route: 'Bremen → Hamburg', product: 'Diesel EN590', volume: '28,000 L', day: 4, startTime: '08:00', endTime: '11:00', status: 'Scheduled', pickup: 'Bremen', delivery: 'Hamburg' },
  { id: '2867', driverName: 'Henrik Larsen', truckPlate: 'DK-14-CPH', route: 'Aarhus → Randers', product: 'Diesel EN590', volume: '23,000 L', day: 4, startTime: '09:00', endTime: '11:30', status: 'Scheduled', pickup: 'Aarhus', delivery: 'Randers' },
  { id: '2849', driverName: 'Andrei Popescu', truckPlate: 'RO-91-BUC', route: 'Budapest → Győr', product: 'Diesel EN590', volume: '26,000 L', day: 4, startTime: '10:00', endTime: '13:00', status: 'Scheduled', pickup: 'Budapest', delivery: 'Győr' },

  // ---- Tue (day 5) ----
  { id: '2840', driverName: 'Pieter Jansen', truckPlate: 'NL-34-RT', route: 'Rotterdam → Breda', product: 'Diesel EN590', volume: '24,000 L', day: 5, startTime: '08:30', endTime: '11:00', status: 'Scheduled', pickup: 'Rotterdam', delivery: 'Breda' },
  { id: '2868', driverName: 'Mateusz Kowalski', truckPlate: 'PL-88-WAW', route: 'Warsaw → Radom', product: 'Diesel EN590', volume: '19,000 L', day: 5, startTime: '09:30', endTime: '12:00', status: 'Scheduled', pickup: 'Warsaw', delivery: 'Radom' },
  { id: '2870', driverName: 'Sven de Vries', truckPlate: 'NL-45-KL', route: 'Düsseldorf → Cologne', product: 'Diesel EN590', volume: '20,000 L', day: 5, startTime: '13:00', endTime: '15:30', status: 'Scheduled', pickup: 'Düsseldorf', delivery: 'Cologne' },

  // ---- Wed (day 6) ----
  { id: '2869', driverName: 'Karel Novák', truckPlate: 'CZ-20-PRG', route: 'Brno → Prague', product: 'Diesel EN590', volume: '25,000 L', day: 6, startTime: '08:00', endTime: '11:00', status: 'Scheduled', pickup: 'Brno', delivery: 'Prague' },
  { id: '2871', driverName: 'Markus Wagner', truckPlate: 'TR-76-BX', route: 'Frankfurt → Cologne', product: 'Diesel EN590', volume: '30,000 L', day: 6, startTime: '10:00', endTime: '13:00', status: 'Scheduled', pickup: 'Frankfurt', delivery: 'Cologne' },
];

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
