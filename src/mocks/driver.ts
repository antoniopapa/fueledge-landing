export type RunStatus = 'Scheduled' | 'In Progress' | 'Completed';
export type StopStatus = 'Upcoming' | 'Next' | 'En route' | 'Arrived' | 'Completed';
export type StopKind = 'pickup' | 'delivery';

export interface Vehicle {
  /** Stable internal key, matches fleet + onboard-inventory records. */
  id: string;
  /** Internal fleet identifier, e.g. "Truck 24". Secondary for the driver. */
  fleetNumber: string;
  /** License plate — the primary identifier the driver physically checks. */
  registrationNumber: string;
}

export type LoadDeviationReason =
  | 'different_quantity'
  | 'different_compartment'
  | 'product_unavailable'
  | 'skipped'
  | 'other';

export interface LoadDeviation {
  reason: LoadDeviationReason;
  note: string | null;
}

export interface PickupProduct {
  product: string;
  compartmentId: string;
  /** Physical capacity of the compartment (litres). */
  capacityL: number | null;
  /** Quantity already onboard before this load (litres) — compartments are not assumed empty. */
  currentL: number | null;
  /** What dispatch instructs the driver to load (litres). The operational target. */
  plannedQuantity: number | null;
  /** Expected document/accounting quantity (litres), distinct from the operational plan. */
  expectedGrossQuantity: number | null;
  /** What was actually loaded (litres) — captured only when it differs from planned. */
  actualLoadedQuantity: number | null;
  /** Confirmed gross from the BoL (per-line when the document carries compartment lines). */
  grossQuantity: number | null;
  /** Confirmed net from the BoL. */
  netQuantity: number | null;
  retainedQuantity: number | null;
  /** Deviation captured via "Loading differs from plan". Null = loaded as planned. */
  deviation: LoadDeviation | null;
}

export interface DeliveryProduct {
  product: string;
  compartmentId: string;
  /** Physical capacity of the compartment (litres). */
  capacityL: number | null;
  /** Quantity onboard before delivery (litres). */
  currentL: number | null;
  /** What dispatch instructs to deliver (litres). */
  plannedQuantity: number | null;
  /** Expected document/accounting quantity (litres). */
  expectedGrossQuantity: number | null;
  /** What was actually delivered (litres) — captured only on deviation. */
  actualDeliveredQuantity: number | null;
  /** Confirmed gross from the delivery/meter ticket. */
  grossQuantity: number | null;
  /** Confirmed net delivered. */
  netQuantity: number | null;
  /** How much to retain onboard (litres) — an instruction, not an editable field. */
  retainedQuantity: number | null;
  /** Customer tank this compartment delivers into; null = no tank measurement required. */
  tankSerialNumber: string | null;
  initialTankVolume: number | null;
  finalTankVolume: number | null;
  waterInTank: number | null;
  /** Deviation captured via "Delivery differs from plan". Null = delivered as planned. */
  deviation: LoadDeviation | null;
}

export interface Stop {
  id: string;
  kind: StopKind;
  status: StopStatus;
  name: string;
  address: string;
  city: string;
  fuelType: string;
  quantity: string;
  price: string | null;
  bol: string | null;
  actualQuantity: string | null;
  actualPrice: string | null;
  contactName: string | null;
  contactPhone: string | null;
  pod: string | null;
  notes: string | null;
  window: string;
  eta: string | null;
  distanceKm: number | null;
  arrivedAt: number | null;
  loadCompletedAt?: number | null;
  deliveryCompletedAt?: number | null;
  discrepancy?: string | null;
  completedAt: number | null;
  /** Supplier / loading terminal for pickups (e.g. "Oiltanking Frankfurt"). */
  supplier?: string | null;
  /** Loading number (pickup), captured inside the BoL mini-flow — not a permanent field. */
  loadingNumber?: string | null;
  /** Purchase order number (delivery reference). */
  poNumber?: string | null;
  /** Delivery/meter ticket number (delivery), captured in the delivery flow. */
  deliveryTicket?: string | null;
  /** Compartment-level items loaded at a pickup. */
  pickupProducts?: PickupProduct[];
  /** Compartment-level items delivered to a customer. */
  deliveryProducts?: DeliveryProduct[];
}

export type IssueSeverity = 'normal' | 'urgent';
export type IssueStatus = 'Reported' | 'Acknowledged' | 'Resolved';
export type IssueKind = 'issue' | 'unable_to_complete';

export interface RunIssue {
  id: string;
  stopId: string;
  stopLabel: string;
  kind: IssueKind;
  category: string;
  note: string;
  severity: IssueSeverity;
  status: IssueStatus;
  time: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  detail: string;
  time: string;
}

export interface DriverRun {
  id: string;
  orderId: string;
  status: RunStatus;
  route: string;
  originCity: string;
  destinationCity: string;
  product: string;
  volume: string;
  window: string;
  /** Dispatcher-defined scheduled start time (e.g. "07:30"). Nullable — a run may have no time assigned. */
  scheduledStartAt?: string | null;
  stops: Stop[];
  issues: RunIssue[];
  history: AuditEvent[];
  startedAt: number | null;
  completedAt: number | null;
  /** Actual on-run elapsed time in minutes (used by Activity History summaries). */
  durationMin?: number;
}

export interface DriverProfile {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  truck: Vehicle;
  trailer: Vehicle;
  base: string;
  email: string;
  phone: string;
}

export const dispatcherName = 'FuelEdge Dispatch';
export const dispatcherPhone = '+49 69 4004 5005';

export const driverProfile: DriverProfile = {
  id: 'markus-wagner',
  name: 'Markus Wagner',
  initials: 'MW',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  truck: { id: 'TR-76-BX', fleetNumber: 'Truck 24', registrationNumber: 'TR-76-BX' },
  trailer: { id: 'TRL-08', fleetNumber: 'Trailer 08', registrationNumber: 'TR-08-XC' },
  base: 'Frankfurt Depot',
  email: 'm.wagner@fueledge.eu',
  phone: '+49 171 402 8817',
};

/**
 * Onboard (on-truck) inventory. A run is an ordered sequence of stops, and a
 * truck may begin a run with compatible product already onboard — so a run
 * does NOT need to start with a terminal pickup.
 *
 * `compartments` is intentionally left optional so a compartment-level model
 * can be added later without changing the top-level shape.
 */
export interface TruckCompartment {
  id: string;
  fuelType: string;
  capacityL: number;
  currentL: number;
}

export interface TruckInventory {
  truckId: string;
  fuelType: string;
  quantityL: number;
  compartments?: TruckCompartment[];
}

export const truckInventory: TruckInventory[] = [
  {
    truckId: 'TR-76-BX',
    fuelType: 'Diesel EN590',
    quantityL: 18000,
    compartments: [
      { id: 'C1', fuelType: 'Diesel EN590', capacityL: 6000, currentL: 3000 },
      { id: 'C2', fuelType: 'Diesel EN590', capacityL: 5000, currentL: 3000 },
      { id: 'C3', fuelType: 'Diesel EN590', capacityL: 5000, currentL: 3000 },
      { id: 'C4', fuelType: 'Diesel EN590', capacityL: 6000, currentL: 3500 },
      { id: 'C5', fuelType: 'Diesel EN590', capacityL: 5000, currentL: 3000 },
      { id: 'C6', fuelType: 'Diesel EN590', capacityL: 5000, currentL: 2500 },
    ],
  },
  { truckId: 'NL-34-RT', fuelType: 'Diesel EN590', quantityL: 4000 },
  { truckId: 'NL-45-KL', fuelType: 'Diesel EN590', quantityL: 0 },
  { truckId: 'DE-82-MN', fuelType: 'Diesel B7', quantityL: 6000 },
  { truckId: 'DE-55-FR', fuelType: 'Heating Oil EL', quantityL: 0 },
];

export interface ShiftRosterDay {
  day: string;
  date: string;
  time: string;
  isToday?: boolean;
}

export interface ShiftRosterWeek {
  id: string;
  label: string;
  range: string;
  days: ShiftRosterDay[];
}

export const shiftRoster: ShiftRosterWeek[] = [
  {
    id: 'this-week',
    label: 'This week',
    range: '25–31 August',
    days: [
      { day: 'Mon', date: '25', time: '06:00–16:00', isToday: true },
      { day: 'Tue', date: '26', time: '06:00–16:00' },
      { day: 'Wed', date: '27', time: 'Off' },
      { day: 'Thu', date: '28', time: '14:00–22:00' },
      { day: 'Fri', date: '29', time: '06:00–16:00' },
      { day: 'Sat', date: '30', time: 'Off' },
      { day: 'Sun', date: '31', time: 'Off' },
    ],
  },
  {
    id: 'next-week',
    label: 'Next week',
    range: '1–7 September',
    days: [
      { day: 'Mon', date: '1', time: '06:00–16:00' },
      { day: 'Tue', date: '2', time: '06:00–16:00' },
      { day: 'Wed', date: '3', time: 'Off' },
      { day: 'Thu', date: '4', time: '14:00–22:00' },
      { day: 'Fri', date: '5', time: '06:00–16:00' },
      { day: 'Sat', date: '6', time: 'Off' },
      { day: 'Sun', date: '7', time: 'Off' },
    ],
  },
  {
    id: 'week-8-sep',
    label: 'Week of 8 Sep',
    range: '8–14 September',
    days: [
      { day: 'Mon', date: '8', time: '14:00–22:00' },
      { day: 'Tue', date: '9', time: '14:00–22:00' },
      { day: 'Wed', date: '10', time: 'Off' },
      { day: 'Thu', date: '11', time: '06:00–16:00' },
      { day: 'Fri', date: '12', time: '06:00–16:00' },
      { day: 'Sat', date: '13', time: 'Off' },
      { day: 'Sun', date: '14', time: 'Off' },
    ],
  },
];

export interface DriverNotification {
  id: string;
  kind: 'assignment' | 'update' | 'cancelled' | 'pickup_changed' | 'delivery_changed' | 'quantity_changed' | 'sequence_changed' | 'dispatcher' | 'acknowledged' | 'resolved';
  title: string;
  detail: string;
  time: string;
  runId?: string;
  read: boolean;
}

export const driverNotifications: DriverNotification[] = [
  {
    id: 'dn-1',
    kind: 'assignment',
    title: 'New run assigned',
    detail: 'RN-2865 has been assigned to you.',
    time: '2 min ago',
    runId: 'RN-2865',
    read: false,
  },
  {
    id: 'dn-2',
    kind: 'quantity_changed',
    title: 'Quantity updated',
    detail: 'Delivery quantity changed from 12,000 L to 10,000 L.',
    time: '18 min ago',
    runId: 'RN-2857',
    read: false,
  },
  {
    id: 'dn-3',
    kind: 'dispatcher',
    title: 'Message from dispatch',
    detail: 'Call dispatch before continuing to the next stop.',
    time: '26 min ago',
    runId: 'RN-2841',
    read: false,
  },
  {
    id: 'dn-4',
    kind: 'pickup_changed',
    title: 'Pickup changed',
    detail: 'Pickup moved to Raunheim Terminal.',
    time: '41 min ago',
    runId: 'RN-2857',
    read: false,
  },
  {
    id: 'dn-5',
    kind: 'cancelled',
    title: 'Run cancelled',
    detail: 'RN-2861 has been cancelled by dispatch.',
    time: '1 hr ago',
    runId: 'RN-2861',
    read: false,
  },
  {
    id: 'dn-6',
    kind: 'delivery_changed',
    title: 'Delivery changed',
    detail: 'Delivery address for Rhein-Main Logistics was updated.',
    time: '2 hrs ago',
    runId: 'RN-2857',
    read: true,
  },
  {
    id: 'dn-7',
    kind: 'sequence_changed',
    title: 'Stop sequence changed',
    detail: 'Dispatch changed the order of your stops.',
    time: '3 hrs ago',
    runId: 'RN-2865',
    read: true,
  },
  {
    id: 'dn-8',
    kind: 'acknowledged',
    title: 'Issue acknowledged',
    detail: 'Your reported terminal delay has been acknowledged.',
    time: '5 hrs ago',
    runId: 'RN-2841',
    read: true,
  },
  {
    id: 'dn-9',
    kind: 'resolved',
    title: 'Issue resolved',
    detail: 'Your reported terminal delay has been resolved.',
    time: 'Yesterday',
    runId: 'RN-2841',
    read: true,
  },
  {
    id: 'dn-10',
    kind: 'update',
    title: 'Run updated',
    detail: 'RN-2857 has been updated. Review the latest details.',
    time: 'Yesterday',
    runId: 'RN-2857',
    read: true,
  },
];