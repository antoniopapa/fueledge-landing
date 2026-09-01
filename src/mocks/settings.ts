// ---------------------------------------------------------------------------
// Company
// ---------------------------------------------------------------------------
export interface CompanyPreference {
  label: string;
  value: string;
}

export const companyDetails = {
  name: 'FuelEdge GmbH',
  legalName: 'FuelEdge Distribution GmbH',
  vatId: 'DE 312 884 021',
  registration: 'HRB 112443 · Amtsgericht Frankfurt',
  address: 'Mainzer Landstraße 180, 60327 Frankfurt am Main, Germany',
  website: 'fueledge.example.com',
  timezone: 'Europe/Berlin (CET)',
  currency: 'EUR (€)',
  countries: ['Germany', 'Netherlands', 'Belgium', 'France', 'Poland', 'Czechia', 'Austria', 'Hungary', 'Romania', 'Sweden', 'Denmark', 'Switzerland'],
  units: {
    volume: 'Litres (L)',
    distance: 'Kilometres (km)',
    weight: 'Kilograms (kg)',
  },
};

export const operationalPreferences: CompanyPreference[] = [
  { label: 'Default product', value: 'Diesel EN590' },
  { label: 'Default truck type', value: 'Artic tanker' },
  { label: 'Default delivery window', value: '06:00–09:00' },
  { label: 'Pricing basis', value: 'Delivered cost' },
  { label: 'Cutoff buffer', value: '60 min' },
  { label: 'Allocation warning threshold', value: '20% remaining' },
];

// ---------------------------------------------------------------------------
// Users & Roles
// ---------------------------------------------------------------------------
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: number;
  members: number;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  status: 'Active' | 'Invited';
  lastActive: string;
}

export const roles: Role[] = [
  { id: 'admin', name: 'Admin', description: 'Full access to all modules and workspace settings.', permissions: 62, members: 2 },
  { id: 'ops-manager', name: 'Operations Manager', description: 'Manages orders, dispatch, deliveries and fleet.', permissions: 48, members: 3 },
  { id: 'dispatcher', name: 'Dispatcher', description: 'Assigns runs, drivers and trucks on the dispatch board.', permissions: 31, members: 6 },
  { id: 'procurement', name: 'Procurement / Supply', description: 'Manages sourcing, contracts, suppliers and pricing.', permissions: 36, members: 4 },
  { id: 'finance', name: 'Finance / Billing', description: 'Manages billing, reconciliation and invoices.', permissions: 27, members: 3 },
  { id: 'readonly', name: 'Read-only', description: 'View access to operations without editing rights.', permissions: 22, members: 5 },
];

export const users: User[] = [
  { id: 'u1', name: 'Markus Keller', initials: 'MK', email: 'markus.keller@fueledge.com', role: 'Admin', status: 'Active', lastActive: 'Now' },
  { id: 'u2', name: 'Elena Rossi', initials: 'ER', email: 'elena.rossi@fueledge.com', role: 'Admin', status: 'Active', lastActive: '12 min ago' },
  { id: 'u3', name: 'Thomas Vogel', initials: 'TV', email: 'thomas.vogel@fueledge.com', role: 'Operations Manager', status: 'Active', lastActive: '8 min ago' },
  { id: 'u4', name: 'Sofia Andersson', initials: 'SA', email: 'sofia.andersson@fueledge.com', role: 'Operations Manager', status: 'Active', lastActive: '1h ago' },
  { id: 'u5', name: 'Jan Kowalski', initials: 'JK', email: 'jan.kowalski@fueledge.com', role: 'Dispatcher', status: 'Active', lastActive: '22 min ago' },
  { id: 'u6', name: 'Marta Nilsson', initials: 'MN', email: 'marta.nilsson@fueledge.com', role: 'Dispatcher', status: 'Active', lastActive: '3h ago' },
  { id: 'u7', name: 'Lucas Moreau', initials: 'LM', email: 'lucas.moreau@fueledge.com', role: 'Procurement / Supply', status: 'Active', lastActive: '45 min ago' },
  { id: 'u8', name: 'Ingrid Becker', initials: 'IB', email: 'ingrid.becker@fueledge.com', role: 'Finance / Billing', status: 'Active', lastActive: '2h ago' },
  { id: 'u9', name: 'Pavel Novák', initials: 'PN', email: 'pavel.novak@fueledge.com', role: 'Dispatcher', status: 'Invited', lastActive: '—' },
];

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------
export interface Integration {
  name: string;
  description: string;
  status: 'Connected' | 'Not connected' | 'Available';
  icon: string;
}

export interface IntegrationGroup {
  label: string;
  items: Integration[];
}

export const integrationGroups: IntegrationGroup[] = [
  {
    label: 'Accounting / ERP',
    items: [
      { name: 'SAP S/4HANA', description: 'Sync invoices and payments to your ERP.', status: 'Connected', icon: 'ri-building-2-line' },
      { name: 'Microsoft Dynamics 365', description: 'Two-way financial data sync.', status: 'Available', icon: 'ri-microsoft-line' },
      { name: 'NetSuite', description: 'Sync customers and invoices.', status: 'Available', icon: 'ri-cloud-line' },
    ],
  },
  {
    label: 'Telematics / GPS',
    items: [
      { name: 'Geotab', description: 'Live truck location and mileage.', status: 'Connected', icon: 'ri-radar-line' },
      { name: 'Webfleet', description: 'Driver behaviour and route data.', status: 'Connected', icon: 'ri-gps-line' },
      { name: 'Samsara', description: 'Fleet telematics and dashcams.', status: 'Not connected', icon: 'ri-camera-line' },
    ],
  },
  {
    label: 'Fuel pricing feeds',
    items: [
      { name: 'Platts', description: 'Wholesale fuel price benchmark.', status: 'Connected', icon: 'ri-line-chart-line' },
      { name: 'Argus', description: 'European spot price index.', status: 'Connected', icon: 'ri-bar-chart-line' },
    ],
  },
  {
    label: 'Terminal feeds',
    items: [
      { name: 'Rotterdam Terminal', description: 'Allocation and wait-time feed.', status: 'Connected', icon: 'ri-anchor-line' },
      { name: 'Antwerp Terminal', description: 'Allocation and wait-time feed.', status: 'Connected', icon: 'ri-ship-line' },
    ],
  },
  {
    label: 'Tank monitoring',
    items: [
      { name: 'Tank gauging', description: 'Remote customer tank level monitoring.', status: 'Not connected', icon: 'ri-dashboard-3-line' },
    ],
  },
  {
    label: 'Mapping / routing',
    items: [
      { name: 'Google Maps', description: 'Routing, ETA and distance calculation.', status: 'Connected', icon: 'ri-map-pin-line' },
      { name: 'HERE', description: 'Alternative routing provider.', status: 'Available', icon: 'ri-route-line' },
    ],
  },
  {
    label: 'Other APIs',
    items: [
      { name: 'Slack', description: 'Operational alerts to channels.', status: 'Connected', icon: 'ri-slack-line' },
      { name: 'Zapier', description: 'Connect FuelEdge to 5,000+ apps.', status: 'Not connected', icon: 'ri-plug-line' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultMargin: string;
  active: boolean;
}

export const products: Product[] = [
  { id: 'diesel-en590', name: 'Diesel EN590', category: 'Diesel', description: 'Standard European diesel for commercial fleets.', defaultMargin: '3.0%', active: true },
  { id: 'hvo100', name: 'HVO100', category: 'Renewable', description: 'Hydrotreated vegetable oil, drop-in renewable diesel.', defaultMargin: '4.5%', active: true },
  { id: 'petrol-e5', name: 'Petrol E5', category: 'Petrol', description: 'Premium unleaded petrol, 5% ethanol.', defaultMargin: '2.8%', active: true },
  { id: 'petrol-e10', name: 'Petrol E10', category: 'Petrol', description: 'Standard unleaded petrol, 10% ethanol.', defaultMargin: '2.6%', active: true },
  { id: 'gasoil', name: 'Gasoil', category: 'Diesel', description: 'Heating / industrial gasoil for off-road use.', defaultMargin: '2.9%', active: true },
  { id: 'adblue', name: 'AdBlue', category: 'Additive', description: 'Aqueous urea solution for diesel SCR systems.', defaultMargin: '5.0%', active: false },
];

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  channels: ('Email' | 'In-app')[];
  enabled: boolean;
}

export const notificationChannels: NotificationChannel[] = [
  { id: 'delivery-delays', label: 'Delivery delays', description: 'When a delivery falls behind its ETA or window.', channels: ['Email', 'In-app'], enabled: true },
  { id: 'terminal-issues', label: 'Terminal issues', description: 'Loading bay outages, weighbridge queues, closures.', channels: ['Email', 'In-app'], enabled: true },
  { id: 'price-changes', label: 'Price changes', description: 'Supplier or benchmark price movements.', channels: ['In-app'], enabled: true },
  { id: 'allocation-thresholds', label: 'Allocation thresholds', description: 'When a terminal allocation drops below threshold.', channels: ['Email', 'In-app'], enabled: true },
  { id: 'missing-documents', label: 'Missing documents', description: 'Missing BOL, POD or delivery tickets.', channels: ['Email'], enabled: true },
  { id: 'driver-truck-issues', label: 'Driver / truck issues', description: 'Breakdowns, driver availability, replacements.', channels: ['Email', 'In-app'], enabled: true },
  { id: 'billing-discrepancies', label: 'Billing discrepancies', description: 'Quantity or price mismatches in reconciliation.', channels: ['Email', 'In-app'], enabled: false },
];

// ---------------------------------------------------------------------------
// Data & Imports
// ---------------------------------------------------------------------------
export interface DataFeed {
  name: string;
  type: string;
  direction: 'Inbound' | 'Outbound';
  frequency: string;
  lastSync: string;
  status: 'Healthy' | 'Degraded' | 'Paused';
}

export const dataFeeds: DataFeed[] = [
  { name: 'SAP S/4HANA', type: 'Invoices & payments', direction: 'Outbound', frequency: 'Hourly', lastSync: '08:52', status: 'Healthy' },
  { name: 'Platts', type: 'Fuel prices', direction: 'Inbound', frequency: '15 min', lastSync: '08:45', status: 'Healthy' },
  { name: 'Argus', type: 'Spot prices', direction: 'Inbound', frequency: '30 min', lastSync: '08:40', status: 'Healthy' },
  { name: 'Geotab', type: 'Truck telemetry', direction: 'Inbound', frequency: 'Real-time', lastSync: 'Now', status: 'Healthy' },
  { name: 'Webfleet', type: 'Driver & route data', direction: 'Inbound', frequency: 'Real-time', lastSync: 'Now', status: 'Degraded' },
  { name: 'Slack', type: 'Notifications', direction: 'Outbound', frequency: 'Event-driven', lastSync: '08:48', status: 'Healthy' },
  { name: 'Zapier', type: 'Automation', direction: 'Outbound', frequency: 'Event-driven', lastSync: '—', status: 'Paused' },
];