export interface SubNavItem {
  label: string;
  path: string;
  end?: boolean;
}

export const sourcingNav: SubNavItem[] = [
  { label: 'Overview', path: '/sourcing', end: true },
  { label: 'Terminals', path: '/sourcing/terminals' },
  { label: 'Suppliers', path: '/sourcing/suppliers' },
  { label: 'Pricing', path: '/sourcing/pricing' },
  { label: 'Contracts', path: '/sourcing/contracts' },
];

export const dispatchNav: SubNavItem[] = [
  { label: 'Schedule', path: '/dispatch', end: true },
  { label: 'Unassigned', path: '/dispatch/unassigned' },
  { label: 'Issues', path: '/dispatch/issues' },
];

export const deliveriesNav: SubNavItem[] = [
  { label: 'Active', path: '/deliveries', end: true },
  { label: 'Completed', path: '/deliveries/completed' },
  { label: 'Exceptions', path: '/deliveries/exceptions' },
];

export const customersNav: SubNavItem[] = [
  { label: 'Customers', path: '/customers', end: true },
  { label: 'Locations', path: '/customers/locations' },
];

export const billingNav: SubNavItem[] = [
  { label: 'Reconciliation', path: '/billing/reconciliation', end: true },
  { label: 'Ready to Invoice', path: '/billing/ready-to-invoice' },
  { label: 'Invoices', path: '/billing/invoices' },
];

export const analyticsNav: SubNavItem[] = [
  { label: 'Overview', path: '/analytics', end: true },
  { label: 'Sourcing', path: '/analytics/sourcing' },
  { label: 'Operations', path: '/analytics/operations' },
  { label: 'Financial', path: '/analytics/financial' },
  { label: 'Terminals', path: '/analytics/terminals' },
];

export const settingsNav: SubNavItem[] = [
  { label: 'Company', path: '/settings', end: true },
  { label: 'Users & Roles', path: '/settings/users' },
  { label: 'Integrations', path: '/settings/integrations' },
  { label: 'Products', path: '/settings/products' },
  { label: 'Notifications', path: '/settings/notifications' },
  { label: 'Data & Imports', path: '/settings/data' },
];