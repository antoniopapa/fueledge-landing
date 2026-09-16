export interface SubNavItem {
  label: string;
  path: string;
  end?: boolean;
}

export const dispatchNav: SubNavItem[] = [
  { label: 'График', path: '/dispatch', end: true },
  { label: 'Неназначени', path: '/dispatch/unassigned' },
  { label: 'Проблеми', path: '/dispatch/issues' },
];

export const deliveriesNav: SubNavItem[] = [
  { label: 'Активни', path: '/deliveries', end: true },
  { label: 'Завършени', path: '/deliveries/completed' },
  { label: 'Изключения', path: '/deliveries/exceptions' },
];

export const customersNav: SubNavItem[] = [
  { label: 'Клиенти', path: '/customers', end: true },
  { label: 'Локации', path: '/customers/locations' },
];

export const billingNav: SubNavItem[] = [
  { label: 'Съгласуване', path: '/billing/reconciliation', end: true },
  { label: 'Готови за фактура', path: '/billing/ready-to-invoice' },
  { label: 'Фактури', path: '/billing/invoices' },
];

export const analyticsNav: SubNavItem[] = [
  { label: 'Преглед', path: '/analytics', end: true },
  { label: 'Снабдяване', path: '/analytics/sourcing' },
  { label: 'Операции', path: '/analytics/operations' },
  { label: 'Финанси', path: '/analytics/financial' },
  { label: 'Терминали', path: '/analytics/terminals' },
];

export const settingsNav: SubNavItem[] = [
  { label: 'Компания', path: '/settings', end: true },
  { label: 'Потребители и роли', path: '/settings/users' },
  { label: 'Интеграции', path: '/settings/integrations' },
  { label: 'Продукти', path: '/settings/products' },
  { label: 'Известия', path: '/settings/notifications' },
  { label: 'Данни и импорти', path: '/settings/data' },
];
