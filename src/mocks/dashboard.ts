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
    label: 'Operations',
    items: [
      { label: 'Overview', icon: 'ri-dashboard-line', path: '/overview' },
      { label: 'Dispatch', icon: 'ri-send-plane-line', path: '/dispatch' },
      { label: 'Orders', icon: 'ri-file-list-3-line', path: '/orders' },
      { label: 'Deliveries', icon: 'ri-truck-line', path: '/deliveries' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Terminals', icon: 'ri-building-2-line', path: '/terminals' },
      { label: 'Suppliers', icon: 'ri-store-2-line', path: '/suppliers' },
      { label: 'Products', icon: 'ri-drop-line', path: '/products' },
      { label: 'Trucks', icon: 'ri-car-line', path: '/trucks' },
      { label: 'Drivers', icon: 'ri-user-star-line', path: '/drivers' },
    ],
  },
  {
    label: 'Business',
    items: [
      { label: 'Customers', icon: 'ri-team-line', path: '/customers' },
      { label: 'Billing', icon: 'ri-wallet-3-line', path: '/billing' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Analytics', icon: 'ri-bar-chart-line', path: '/analytics' },
    ],
  },
];

export const settingsNav: DashboardNavItem = {
  label: 'Settings',
  icon: 'ri-settings-3-line',
  path: '/settings',
};
