export interface SubNavItem {
  label: string;
  path: string;
  end?: boolean;
}

export const dispatchNav: SubNavItem[] = [
  { label: 'dashboard.nav.schedule', path: '/dispatch', end: true },
  { label: 'dashboard.nav.unassigned', path: '/dispatch/unassigned' },
  { label: 'dashboard.nav.issues', path: '/dispatch/issues' },
];

export const deliveriesNav: SubNavItem[] = [
  { label: 'dashboard.nav.active', path: '/deliveries', end: true },
  { label: 'dashboard.nav.completed', path: '/deliveries/completed' },
  { label: 'dashboard.nav.exceptions', path: '/deliveries/exceptions' },
];

export const customersNav: SubNavItem[] = [
  { label: 'dashboard.nav.customers', path: '/customers', end: true },
  { label: 'dashboard.nav.locations', path: '/customers/locations' },
];

export const billingNav: SubNavItem[] = [
  { label: 'dashboard.nav.reconciliation', path: '/billing/reconciliation', end: true },
  { label: 'dashboard.nav.readyToInvoice', path: '/billing/ready-to-invoice' },
  { label: 'dashboard.nav.invoices', path: '/billing/invoices' },
];

export const analyticsNav: SubNavItem[] = [
  { label: 'dashboard.nav.overview', path: '/analytics', end: true },
  { label: 'dashboard.nav.sourcing', path: '/analytics/sourcing' },
  { label: 'dashboard.nav.operations', path: '/analytics/operations' },
  { label: 'dashboard.nav.financial', path: '/analytics/financial' },
  { label: 'dashboard.nav.terminals', path: '/analytics/terminals' },
];

export const settingsNav: SubNavItem[] = [
  { label: 'dashboard.nav.company', path: '/settings', end: true },
  { label: 'dashboard.nav.usersAndRoles', path: '/settings/users' },
  { label: 'dashboard.nav.integrations', path: '/settings/integrations' },
  { label: 'dashboard.nav.products', path: '/settings/products' },
  { label: 'dashboard.nav.notifications', path: '/settings/notifications' },
  { label: 'dashboard.nav.dataAndImports', path: '/settings/data' },
];
