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
    label: 'Операции',
    items: [
      { label: 'Преглед', icon: 'ri-dashboard-line', path: '/overview' },
      { label: 'Диспечиране', icon: 'ri-send-plane-line', path: '/dispatch' },
      { label: 'Поръчки', icon: 'ri-file-list-3-line', path: '/orders' },
      { label: 'Доставки', icon: 'ri-truck-line', path: '/deliveries' },
    ],
  },
  {
    label: 'Ресурси',
    items: [
      { label: 'Терминали', icon: 'ri-building-2-line', path: '/terminals' },
      { label: 'Доставчици', icon: 'ri-store-2-line', path: '/suppliers' },
      { label: 'Продукти', icon: 'ri-drop-line', path: '/products' },
      { label: 'Камиони', icon: 'ri-car-line', path: '/trucks' },
      { label: 'Ремаркета', icon: 'ri-truck-line', path: '/trailers' },
      { label: 'Шофьори', icon: 'ri-user-star-line', path: '/drivers' },
    ],
  },
  {
    label: 'Бизнес',
    items: [
      { label: 'Клиенти', icon: 'ri-team-line', path: '/customers' },
      { label: 'Фактуриране', icon: 'ri-wallet-3-line', path: '/billing' },
    ],
  },
  {
    label: 'Анализи',
    items: [
      { label: 'Отчети', icon: 'ri-bar-chart-line', path: '/analytics' },
    ],
  },
];

export const settingsNav: DashboardNavItem = {
  label: 'Настройки',
  icon: 'ri-settings-3-line',
  path: '/settings',
};
