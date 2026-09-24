import type { Supplier, Terminal, TerminalStatus } from './sourcing';
import type { Product } from './settings';
import type { AccountStatus, Customer, CustomerContact, CustomerLocation, Tank } from './customers';
import type { Driver, DriverStatus } from './drivers';

export type ScheduleStatus = 'Scheduled' | 'Dispatched' | 'Completed' | 'Delayed' | 'Conflict' | 'Unassigned';

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
  day: number; // 0 = Thu Sep 24 2026 .. 6 = Wed Sep 30 2026 within the visible week
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

export interface ApiTrailer {
  id: string;
  number: string;
  plate: string;
  type: string;
  compartments: number;
  capacityLiters: number;
  status: string;
  active: boolean;
}

export interface ApiTruck {
  id: string;
  serialNumber: string;
  tractor: string;
}

const apiBaseUrl = 'https://fueledge-api.vercel.app/api';
const scheduleLoadsUrl = `${apiBaseUrl}/loads`;
const terminalsUrl = `${apiBaseUrl}/terminals`;
const suppliersUrl = `${apiBaseUrl}/suppliers`;
const productsUrl = `${apiBaseUrl}/products`;
const customersUrl = `${apiBaseUrl}/customers`;
const driversUrl = `${apiBaseUrl}/drivers`;
const trailersUrl = `${apiBaseUrl}/trailers`;
const trucksUrl = `${apiBaseUrl}/trucks`;

function recordsFromPayload(payload: unknown, key: string): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const record = payload as Record<string, unknown>;
  if (Array.isArray(record[key])) return record[key];
  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.records)) return record.records;

  return [];
}

function recordFromPayload(payload: unknown, key: string): unknown {
  if (!payload || typeof payload !== 'object') return payload;

  const record = payload as Record<string, unknown>;
  const singularKey = key.endsWith('s') ? key.slice(0, -1) : key;
  return record[singularKey] ?? record.data ?? record.item ?? record.record ?? payload;
}

interface ApiRequestOptions {
  method: string;
  body?: string;
  headers?: Record<string, string>;
}

async function apiRequest(path: string, init: ApiRequestOptions): Promise<unknown> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function stringValue(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return fallback;
}

function booleanValue(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return ['active', 'true', 'yes', '1'].includes(value.toLowerCase());
  return fallback;
}

function stringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => stringValue(item)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isScheduleStatus(status: string): status is ScheduleStatus {
  return ['Scheduled', 'Dispatched', 'Completed', 'Delayed', 'Conflict', 'Unassigned'].includes(status);
}

function isTerminalStatus(status: string): status is TerminalStatus {
  return ['Operational', 'Busy', 'Limited', 'Issue'].includes(status);
}

function isAccountStatus(status: string): status is AccountStatus {
  return ['Active', 'On Hold', 'Credit Warning', 'Inactive'].includes(status);
}

function isDriverStatus(status: string): status is DriverStatus {
  return ['Available', 'Assigned', 'Loading', 'In Transit', 'Delivering', 'Break', 'Off Duty'].includes(status);
}

function initialsFromName(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function normalizeContact(item: unknown, fallbackRole: string): CustomerContact {
  const contact = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};

  return {
    name: stringValue(contact.name, '—'),
    role: stringValue(contact.role, fallbackRole),
    email: stringValue(contact.email),
    phone: stringValue(contact.phone),
  };
}

function normalizeTank(item: unknown): Tank {
  const tank = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};

  return {
    product: stringValue(tank.product ?? tank.productName, 'Fuel'),
    capacity: stringValue(tank.capacity, '—'),
    level: stringValue(tank.level, '—'),
  };
}

function normalizeCustomerLocation(item: unknown, customerName: string): CustomerLocation | null {
  if (!item || typeof item !== 'object') return null;

  const location = item as Record<string, unknown>;
  const name = stringValue(location.name ?? location.locationName ?? location.siteName);
  const id = stringValue(location.id ?? location._id ?? location.slug, name ? slugify(`${customerName}-${name}`) : '');
  if (!id || !name) return null;

  return {
    id,
    name,
    address: stringValue(location.address),
    city: stringValue(location.city),
    country: stringValue(location.country),
    products: stringArray(location.products ?? location.productNames),
    deliveryWindow: stringValue(location.deliveryWindow, '—'),
    openingHours: stringValue(location.openingHours, '—'),
    accessRestrictions: stringValue(location.accessRestrictions, '—'),
    driverInstructions: stringValue(location.driverInstructions ?? location.instructions, '—'),
    siteContact: stringValue(location.siteContact, '—'),
    tanks: Array.isArray(location.tanks) ? location.tanks.map((tank) => normalizeTank(tank)) : [],
    lastDelivery: stringValue(location.lastDelivery, '—'),
    nextDelivery: stringValue(location.nextDelivery, '—'),
  };
}

function normalizeCustomer(item: unknown): Customer | null {
  if (!item || typeof item !== 'object') return null;

  const customer = item as Record<string, unknown>;
  const name = stringValue(customer.name ?? customer.customerName);
  const id = stringValue(customer.id ?? customer._id ?? customer.slug, name ? slugify(name) : '');
  if (!id || !name) return null;

  const rawStatus = stringValue(customer.accountStatus ?? customer.status, 'Active');
  const accountStatus = isAccountStatus(rawStatus) ? rawStatus : 'Active';
  const locations = Array.isArray(customer.locations)
    ? customer.locations
        .map((location) => normalizeCustomerLocation(location, name))
        .filter((location): location is CustomerLocation => location !== null)
    : [];
  const rawContacts = customer.mainContacts ?? customer.contacts;
  const contacts = Array.isArray(rawContacts) ? rawContacts : [];

  return {
    id,
    name,
    type: stringValue(customer.type ?? customer.customerType, 'Customer'),
    accountStatus,
    creditLimit: stringValue(customer.creditLimit, '—'),
    creditStatus: stringValue(customer.creditStatus, '—'),
    products: stringArray(customer.products ?? customer.productNames),
    pricingAgreement: stringValue(customer.pricingAgreement, '—'),
    contract: stringValue(customer.contract, '—'),
    openOrders: Number(customer.openOrders ?? 0),
    outstandingBalance: stringValue(customer.outstandingBalance, '—'),
    billingStatus: stringValue(customer.billingStatus, '—'),
    lastDelivery: stringValue(customer.lastDelivery, '—'),
    totalVolume: stringValue(customer.totalVolume, '—'),
    revenue: stringValue(customer.revenue, '—'),
    grossMargin: stringValue(customer.grossMargin, '—'),
    openInvoices: Number(customer.openInvoices ?? 0),
    mainContacts: contacts.map((contact) => normalizeContact(contact, 'Contact')),
    billingContact: normalizeContact(customer.billingContact, 'Billing'),
    locations,
    ...(customer.notes ? { notes: stringValue(customer.notes) } : {}),
  };
}

function normalizeTerminal(item: unknown): Terminal | null {
  if (!item || typeof item !== 'object') return null;

  const terminal = item as Record<string, unknown>;
  const name = stringValue(terminal.name ?? terminal.terminalName);
  const id = stringValue(terminal.id ?? terminal._id ?? terminal.slug, name ? slugify(name) : '');
  if (!id || !name) return null;

  const rawStatus = stringValue(terminal.status, 'Operational');
  const status = isTerminalStatus(rawStatus) ? rawStatus : 'Operational';
  const products = stringArray(terminal.products ?? terminal.productNames);

  return {
    id,
    name,
    city: stringValue(terminal.city),
    country: stringValue(terminal.country),
    status,
    products,
    basePrice: stringValue(terminal.basePrice ?? terminal.price ?? terminal.fuelPrice, '€0.000'),
    waitTime: stringValue(terminal.waitTime ?? terminal.avgWaitTime, '0 min'),
    allocation: stringValue(terminal.allocation ?? terminal.allocationUsed, '0%'),
    cutoff: stringValue(terminal.cutoff ?? terminal.loadingCutoff, '—'),
    otif: stringValue(terminal.otif, '—'),
    avgWait: stringValue(terminal.avgWait ?? terminal.waitTime, '—'),
    dailyThroughput: stringValue(terminal.dailyThroughput ?? terminal.throughput, '—'),
    pickups: Array.isArray(terminal.pickups)
      ? terminal.pickups.map((pickup) => {
          const record = pickup && typeof pickup === 'object' ? (pickup as Record<string, unknown>) : {};
          return {
            time: stringValue(record.time, '—'),
            order: stringValue(record.order ?? record.orderId, '—'),
            volume: stringValue(record.volume, '—'),
          };
        })
      : [],
    pricing: Array.isArray(terminal.pricing)
      ? terminal.pricing.map((price) => {
          const record = price && typeof price === 'object' ? (price as Record<string, unknown>) : {};
          return {
            product: stringValue(record.product ?? record.name, 'Fuel'),
            price: stringValue(record.price, '€0.000'),
            change: stringValue(record.change, 'flat'),
          };
        })
      : products.map((product) => ({
          product,
          price: stringValue(terminal.basePrice ?? terminal.price ?? terminal.fuelPrice, '€0.000'),
          change: 'flat',
        })),
  };
}

function normalizeSupplier(item: unknown): Supplier | null {
  if (!item || typeof item !== 'object') return null;

  const supplier = item as Record<string, unknown>;
  const name = stringValue(supplier.name ?? supplier.supplierName);
  const id = stringValue(supplier.id ?? supplier._id ?? supplier.slug, name ? slugify(name) : '');
  if (!id || !name) return null;

  return {
    id,
    name,
    country: stringValue(supplier.country),
    activeTerminals: stringArray(supplier.activeTerminals ?? supplier.terminals ?? supplier.terminalNames),
    products: stringArray(supplier.products ?? supplier.productNames),
    contractStatus: stringValue(supplier.contractStatus ?? supplier.status, 'Active'),
    spend: stringValue(supplier.spend ?? supplier.totalSpend, '—'),
    volume: stringValue(supplier.volume ?? supplier.totalVolume, '—'),
    allocation: stringValue(supplier.allocation, '0%'),
    pricingStatus: stringValue(supplier.pricingStatus, '—'),
  };
}

function normalizeProduct(item: unknown): Product | null {
  if (!item || typeof item !== 'object') return null;

  const product = item as Record<string, unknown>;
  const name = stringValue(product.name ?? product.productName);
  const id = stringValue(product.id ?? product._id ?? product.slug, name ? slugify(name) : '');
  if (!id || !name) return null;

  return {
    id,
    name,
    category: stringValue(product.category, 'Fuel'),
    description: stringValue(product.description),
    defaultMargin: stringValue(product.defaultMargin ?? product.margin, '0%'),
    active: booleanValue(product.active ?? product.status, true),
  };
}

function normalizeDriver(item: unknown): Driver | null {
  if (!item || typeof item !== 'object') return null;

  const driver = item as Record<string, unknown>;
  const firstName = stringValue(driver.firstName);
  const lastName = stringValue(driver.lastName);
  const name = stringValue(driver.name ?? driver.driverName ?? driver.fullName, `${firstName} ${lastName}`.trim());
  const id = stringValue(driver.id ?? driver._id ?? driver.slug, name ? slugify(name) : '');
  if (!id || !name) return null;

  const isActive = booleanValue(driver.active, true);
  const rawStatus = stringValue(driver.status, isActive ? 'Available' : 'Off Duty');
  const status = isDriverStatus(rawStatus) ? rawStatus : 'Available';
  const truck = stringValue(driver.truck ?? driver.truckPlate ?? driver.truckId);
  const exceptions = Array.isArray(driver.exceptions) ? driver.exceptions : [];
  const schedule = Array.isArray(driver.schedule) ? driver.schedule : [];
  const history = Array.isArray(driver.history) ? driver.history : [];

  return {
    id,
    name,
    initials: stringValue(driver.initials, initialsFromName(name)),
    status,
    exceptions: exceptions
      .map((exception) => {
        const record = exception && typeof exception === 'object' ? (exception as Record<string, unknown>) : {};
        const kind = stringValue(record.kind);
        if (!['Delayed', 'Driver Issue', 'Truck Issue', 'Terminal Delay'].includes(kind)) return null;
        return { kind: kind as Driver['exceptions'][number]['kind'], detail: stringValue(record.detail, 'Needs attention') };
      })
      .filter((exception): exception is Driver['exceptions'][number] => exception !== null),
    truck: truck || null,
    currentAssignment: stringValue(driver.currentAssignment ?? driver.email) || null,
    product: stringValue(driver.product, 'Diesel EN590'),
    volume: stringValue(driver.volume, '—'),
    route: stringValue(driver.route, '—'),
    location: stringValue(driver.location ?? driver.email, '—'),
    shift: stringValue(driver.shift, '—'),
    todayRuns: stringValue(driver.todayRuns, '0/0'),
    nextAssignment: stringValue(driver.nextAssignment, '—'),
    eta: stringValue(driver.eta) || null,
    phone: stringValue(driver.phone, '—'),
    schedule: schedule
      .map((event) => {
        const record = event && typeof event === 'object' ? (event as Record<string, unknown>) : {};
        const state = stringValue(record.state, 'upcoming');
        if (!['completed', 'current', 'upcoming', 'delayed'].includes(state)) return null;
        return {
          time: stringValue(record.time, '—'),
          label: stringValue(record.label, 'Driver event'),
          state: state as Driver['schedule'][number]['state'],
        };
      })
      .filter((event): event is Driver['schedule'][number] => event !== null),
    history: history
      .map((record) => {
        const delivery = record && typeof record === 'object' ? (record as Record<string, unknown>) : {};
        const statusValue = stringValue(delivery.status, 'Completed');
        const pod = stringValue(delivery.pod, 'Pending');
        if (!['Completed', 'Delayed'].includes(statusValue) || !['Signed', 'Pending', 'Exception'].includes(pod)) return null;
        return {
          date: stringValue(delivery.date, '—'),
          order: stringValue(delivery.order, '—'),
          route: stringValue(delivery.route, '—'),
          truck: stringValue(delivery.truck, '—'),
          product: stringValue(delivery.product, '—'),
          volume: stringValue(delivery.volume, '—'),
          deliveryTime: stringValue(delivery.deliveryTime, '—'),
          status: statusValue as Driver['history'][number]['status'],
          ...(delivery.statusDetail ? { statusDetail: stringValue(delivery.statusDetail) } : {}),
          bol: stringValue(delivery.bol, '—'),
          pod: pod as Driver['history'][number]['pod'],
          signature: stringValue(delivery.signature, '—'),
          deliveredQty: stringValue(delivery.deliveredQty, '—'),
          notes: stringValue(delivery.notes),
          ...(delivery.exception ? { exception: stringValue(delivery.exception) } : {}),
        };
      })
      .filter((record): record is Driver['history'][number] => record !== null),
  };
}

function normalizeTrailer(item: unknown): ApiTrailer | null {
  if (!item || typeof item !== 'object') return null;

  const trailer = item as Record<string, unknown>;
  const id = stringValue(trailer.id ?? trailer._id ?? trailer.slug);
  const number = stringValue(trailer.number ?? trailer.trailerNumber ?? trailer.id);
  const plate = stringValue(trailer.plate ?? trailer.registrationNumber);
  if (!id || !number || !plate) return null;

  return {
    id,
    number,
    plate,
    type: stringValue(trailer.type, 'Fuel Tanker'),
    compartments: Number(trailer.compartments ?? 0),
    capacityLiters: Number(trailer.capacityLiters ?? trailer.capacity ?? 0),
    status: stringValue(trailer.status, 'Available'),
    active: booleanValue(trailer.active, true),
  };
}

function normalizeTruck(item: unknown): ApiTruck | null {
  if (!item || typeof item !== 'object') return null;

  const truck = item as Record<string, unknown>;
  const id = stringValue(truck.id ?? truck._id ?? truck.slug);
  const serialNumber = stringValue(truck.serialNumber ?? truck.vin);
  const tractor = stringValue(truck.tractor ?? truck.plate ?? truck.registrationNumber);
  if (!id || !serialNumber || !tractor) return null;

  return {
    id,
    serialNumber,
    tractor,
  };
}

function dayIndexFromApiValue(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return null;

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const weekStart = new Date(2026, 8, 24); // Thursday 24 September 2026
  const diffMs = date.getTime() - weekStart.getTime();
  return Math.round(diffMs / 86400000);
}

function normalizeScheduleRun(item: unknown): ScheduleRun | null {
  if (!item || typeof item !== 'object') return null;

  const run = item as Record<string, unknown>;
  const id = stringValue(run.id);
  const volume = stringValue(run.volume);
  const startTime = stringValue(run.startTime);
  const endTime = stringValue(run.endTime);
  const pickup = stringValue(run.pickup);
  const delivery = stringValue(run.delivery);
  const status = stringValue(run.status);
  const day = dayIndexFromApiValue(run.day);
  const driverName = stringValue(run.driverName, run.driverId ? `Driver ${stringValue(run.driverId)}` : 'Unassigned driver');
  const truckPlate = stringValue(run.truckPlate, run.truckId ? `Truck ${stringValue(run.truckId)}` : 'Unassigned truck');
  const productName = stringValue(run.product, run.productId ? `Product ${stringValue(run.productId)}` : 'Fuel');
  const route = stringValue(run.route, pickup && delivery ? `${pickup} -> ${delivery}` : '');

  if (
    !id ||
    !driverName ||
    !truckPlate ||
    !route ||
    !productName ||
    !volume ||
    day === null ||
    !startTime ||
    !endTime ||
    !status ||
    !isScheduleStatus(status) ||
    !pickup ||
    !delivery
  ) {
    return null;
  }

  return {
    id,
    driverName,
    truckPlate,
    route,
    product: productName,
    volume,
    day,
    startTime,
    endTime,
    status,
    pickup,
    delivery,
    ...(run.conflict !== undefined ? { conflict: booleanValue(run.conflict) } : {}),
    ...(run.conflictNote ? { conflictNote: stringValue(run.conflictNote) } : {}),
  };
}

export async function fetchScheduleRuns(): Promise<ScheduleRun[]> {
  const response = await fetch(scheduleLoadsUrl);
  if (!response.ok) {
    if (response.status === 404) return [];
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

export async function fetchTerminals(): Promise<Terminal[]> {
  const response = await fetch(terminalsUrl);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Unable to retrieve terminals: ${response.status}`);
  }

  const payload = await response.json();
  return recordsFromPayload(payload, 'terminals')
    .map((terminal) => normalizeTerminal(terminal))
    .filter((terminal): terminal is Terminal => terminal !== null);
}

export async function fetchSuppliers(): Promise<Supplier[]> {
  const response = await fetch(suppliersUrl);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Unable to retrieve suppliers: ${response.status}`);
  }

  const payload = await response.json();
  return recordsFromPayload(payload, 'suppliers')
    .map((supplier) => normalizeSupplier(supplier))
    .filter((supplier): supplier is Supplier => supplier !== null);
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(productsUrl);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Unable to retrieve products: ${response.status}`);
  }

  const payload = await response.json();
  return recordsFromPayload(payload, 'products')
    .map((product) => normalizeProduct(product))
    .filter((product): product is Product => product !== null);
}

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch(customersUrl);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Unable to retrieve customers: ${response.status}`);
  }

  const payload = await response.json();
  return recordsFromPayload(payload, 'customers')
    .map((customer) => normalizeCustomer(customer))
    .filter((customer): customer is Customer => customer !== null);
}

export async function fetchDrivers(): Promise<Driver[]> {
  const response = await fetch(driversUrl);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Unable to retrieve drivers: ${response.status}`);
  }

  const payload = await response.json();
  return recordsFromPayload(payload, 'drivers')
    .map((driver) => normalizeDriver(driver))
    .filter((driver): driver is Driver => driver !== null);
}

export async function fetchTrailers(): Promise<ApiTrailer[]> {
  const response = await fetch(trailersUrl);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Unable to retrieve trailers: ${response.status}`);
  }

  const payload = await response.json();
  return recordsFromPayload(payload, 'trailers')
    .map((trailer) => normalizeTrailer(trailer))
    .filter((trailer): trailer is ApiTrailer => trailer !== null);
}

export async function fetchTrucks(): Promise<ApiTruck[]> {
  const response = await fetch(trucksUrl);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Unable to retrieve trucks: ${response.status}`);
  }

  const payload = await response.json();
  return recordsFromPayload(payload, 'trucks')
    .map((truck) => normalizeTruck(truck))
    .filter((truck): truck is ApiTruck => truck !== null);
}

export async function createTerminal(payload: Partial<Terminal>): Promise<Terminal> {
  const response = await apiRequest('/terminals', { method: 'POST', body: JSON.stringify(payload) });
  const terminal = normalizeTerminal(recordFromPayload(response, 'terminals') ?? payload);
  if (!terminal) throw new Error('Created terminal response was invalid');
  return terminal;
}

export async function updateTerminal(id: string, payload: Partial<Terminal>): Promise<Terminal> {
  const response = await apiRequest(`/terminals/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  const terminal = normalizeTerminal(recordFromPayload(response, 'terminals') ?? { ...payload, id });
  if (!terminal) throw new Error('Updated terminal response was invalid');
  return terminal;
}

export async function deleteTerminal(id: string): Promise<void> {
  await apiRequest(`/terminals/${id}`, { method: 'DELETE' });
}

export async function createSupplier(payload: Partial<Supplier>): Promise<Supplier> {
  const response = await apiRequest('/suppliers', { method: 'POST', body: JSON.stringify(payload) });
  const supplier = normalizeSupplier(recordFromPayload(response, 'suppliers') ?? payload);
  if (!supplier) throw new Error('Created supplier response was invalid');
  return supplier;
}

export async function updateSupplier(id: string, payload: Partial<Supplier>): Promise<Supplier> {
  const response = await apiRequest(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  const supplier = normalizeSupplier(recordFromPayload(response, 'suppliers') ?? { ...payload, id });
  if (!supplier) throw new Error('Updated supplier response was invalid');
  return supplier;
}

export async function deleteSupplier(id: string): Promise<void> {
  await apiRequest(`/suppliers/${id}`, { method: 'DELETE' });
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const response = await apiRequest('/products', { method: 'POST', body: JSON.stringify(payload) });
  const product = normalizeProduct(recordFromPayload(response, 'products') ?? payload);
  if (!product) throw new Error('Created product response was invalid');
  return product;
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const response = await apiRequest(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  const product = normalizeProduct(recordFromPayload(response, 'products') ?? { ...payload, id });
  if (!product) throw new Error('Updated product response was invalid');
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiRequest(`/products/${id}`, { method: 'DELETE' });
}

export async function createCustomer(payload: Partial<Customer>): Promise<Customer> {
  const response = await apiRequest('/customers', { method: 'POST', body: JSON.stringify(payload) });
  const customer = normalizeCustomer(recordFromPayload(response, 'customers') ?? payload);
  if (!customer) throw new Error('Created customer response was invalid');
  return customer;
}

export async function updateCustomer(id: string, payload: Partial<Customer>): Promise<Customer> {
  const response = await apiRequest(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  const customer = normalizeCustomer(recordFromPayload(response, 'customers') ?? { ...payload, id });
  if (!customer) throw new Error('Updated customer response was invalid');
  return customer;
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiRequest(`/customers/${id}`, { method: 'DELETE' });
}

export async function createDriver(payload: Partial<Driver>): Promise<Driver> {
  const response = await apiRequest('/drivers', { method: 'POST', body: JSON.stringify(payload) });
  const driver = normalizeDriver(recordFromPayload(response, 'drivers') ?? payload);
  if (!driver) throw new Error('Created driver response was invalid');
  return driver;
}

export async function updateDriver(id: string, payload: Partial<Driver>): Promise<Driver> {
  const response = await apiRequest(`/drivers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  const driver = normalizeDriver(recordFromPayload(response, 'drivers') ?? { ...payload, id });
  if (!driver) throw new Error('Updated driver response was invalid');
  return driver;
}

export async function deleteDriver(id: string): Promise<void> {
  await apiRequest(`/drivers/${id}`, { method: 'DELETE' });
}

export async function createTrailer(payload: Partial<ApiTrailer>): Promise<ApiTrailer> {
  const response = await apiRequest('/trailers', { method: 'POST', body: JSON.stringify(payload) });
  const trailer = normalizeTrailer(recordFromPayload(response, 'trailers') ?? payload);
  if (!trailer) throw new Error('Created trailer response was invalid');
  return trailer;
}

export async function updateTrailer(id: string, payload: Partial<ApiTrailer>): Promise<ApiTrailer> {
  const response = await apiRequest(`/trailers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  const trailer = normalizeTrailer(recordFromPayload(response, 'trailers') ?? { ...payload, id });
  if (!trailer) throw new Error('Updated trailer response was invalid');
  return trailer;
}

export async function deleteTrailer(id: string): Promise<void> {
  await apiRequest(`/trailers/${id}`, { method: 'DELETE' });
}

export async function createTruck(payload: Partial<ApiTruck>): Promise<ApiTruck> {
  const response = await apiRequest('/trucks', { method: 'POST', body: JSON.stringify(payload) });
  const truck = normalizeTruck(recordFromPayload(response, 'trucks') ?? payload);
  if (!truck) throw new Error('Created truck response was invalid');
  return truck;
}

export async function updateTruck(id: string, payload: Partial<ApiTruck>): Promise<ApiTruck> {
  const response = await apiRequest(`/trucks/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
  const truck = normalizeTruck(recordFromPayload(response, 'trucks') ?? { ...payload, id });
  if (!truck) throw new Error('Updated truck response was invalid');
  return truck;
}

export async function deleteTruck(id: string): Promise<void> {
  await apiRequest(`/trucks/${id}`, { method: 'DELETE' });
}

export const unassignedRuns: UnscheduledRun[] = [];

export const assignmentOptions: Record<string, AssignmentOption[]> = {};

