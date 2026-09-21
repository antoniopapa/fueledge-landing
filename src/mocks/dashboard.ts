export interface DashboardNavItem {
  label: string;
  icon: string;
  path: string;
}

export interface DashboardNavGroup {
  label: string;
  items: DashboardNavItem[];
}

export const dashboardNavGroups: DashboardNavGroup[] = [
  {
    label: 'dashboard.sidebar.groups.operations',
    items: [
      { label: 'dashboard.sidebar.items.overview', icon: 'ri-dashboard-line', path: '/overview' },
      { label: 'dashboard.sidebar.items.dispatch', icon: 'ri-send-plane-line', path: '/dispatch' },
      { label: 'dashboard.sidebar.items.orders', icon: 'ri-file-list-3-line', path: '/orders' },
      { label: 'dashboard.sidebar.items.deliveries', icon: 'ri-truck-line', path: '/deliveries' },
    ],
  },
  {
    label: 'dashboard.sidebar.groups.resources',
    items: [
      { label: 'dashboard.sidebar.items.terminals', icon: 'ri-building-2-line', path: '/terminals' },
      { label: 'dashboard.sidebar.items.suppliers', icon: 'ri-store-2-line', path: '/suppliers' },
      { label: 'dashboard.sidebar.items.products', icon: 'ri-drop-line', path: '/products' },
      { label: 'dashboard.sidebar.items.trucks', icon: 'ri-car-line', path: '/trucks' },
      { label: 'dashboard.sidebar.items.trailers', icon: 'ri-truck-line', path: '/trailers' },
      { label: 'dashboard.sidebar.items.drivers', icon: 'ri-user-star-line', path: '/drivers' },
    ],
  },
  {
    label: 'dashboard.sidebar.groups.business',
    items: [
      { label: 'dashboard.sidebar.items.customers', icon: 'ri-team-line', path: '/customers' },
      { label: 'dashboard.sidebar.items.billing', icon: 'ri-wallet-3-line', path: '/billing' },
    ],
  },
  {
    label: 'dashboard.sidebar.groups.analytics',
    items: [
      { label: 'dashboard.sidebar.items.reports', icon: 'ri-bar-chart-line', path: '/analytics' },
    ],
  },
];

export const settingsNav: DashboardNavItem = {
  label: 'dashboard.sidebar.items.settings',
  icon: 'ri-settings-3-line',
  path: '/settings',
};
