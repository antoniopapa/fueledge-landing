import type { Supplier, Terminal, TerminalStatus } from './sourcing';
import type { Product } from './settings';
import type { AccountStatus, Customer, CustomerContact, CustomerLocation, Tank } from './customers';

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

const apiBaseUrl = 'https://fueledge-api.vercel.app/api';
const scheduleLoadsUrl = `${apiBaseUrl}/loads`;
const terminalsUrl = `${apiBaseUrl}/terminals`;
const suppliersUrl = `${apiBaseUrl}/suppliers`;
const productsUrl = `${apiBaseUrl}/products`;
const customersUrl = `${apiBaseUrl}/customers`;

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
  return ['Scheduled', 'Dispatched', 'Completed', 'Delayed', 'Conflict'].includes(status);
}

function isTerminalStatus(status: string): status is TerminalStatus {
  return ['Operational', 'Busy', 'Limited', 'Issue'].includes(status);
}

function isAccountStatus(status: string): status is AccountStatus {
  return ['Active', 'On Hold', 'Credit Warning', 'Inactive'].includes(status);
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

export async function fetchTerminals(): Promise<Terminal[]> {
  const response = await fetch(terminalsUrl);
  if (!response.ok) {
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
    throw new Error(`Unable to retrieve customers: ${response.status}`);
  }

  const payload = await response.json();
  return recordsFromPayload(payload, 'customers')
    .map((customer) => normalizeCustomer(customer))
    .filter((customer): customer is Customer => customer !== null);
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
