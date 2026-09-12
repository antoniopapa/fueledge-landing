export type NotificationTone = 'info' | 'warning' | 'danger' | 'success';

export interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  detail: string;
  time: string;
  tone: NotificationTone;
  link?: string;
  read: boolean;
}

export const notifications: NotificationItem[] = [
  {
    id: 'n1',
    icon: 'ri-alarm-warning-line',
    title: 'Delivery delayed',
    detail: '#2841 Antwerp → Frankfurt is running 35 min late (traffic on A3).',
    time: '2 min ago',
    tone: 'danger',
    link: '/deliveries/2841',
    read: false,
  },
  {
    id: 'n2',
    icon: 'ri-building-4-line',
    title: 'Terminal issue',
    detail: 'Lyon Terminal — loading bay 3 out of service.',
    time: '8 min ago',
    tone: 'danger',
    link: '/terminals/lyon',
    read: false,
  },
  {
    id: 'n3',
    icon: 'ri-user-heart-line',
    title: 'Driver issue',
    detail: 'Erik Johansson reported unwell — replacement requested for #2856.',
    time: '18 min ago',
    tone: 'warning',
    link: '/deliveries/2856',
    read: false,
  },
  {
    id: 'n4',
    icon: 'ri-funds-line',
    title: 'Sourcing opportunity',
    detail: 'Order #2869 can save €268 by sourcing at Arad terminal.',
    time: '31 min ago',
    tone: 'info',
    link: '/terminals',
    read: false,
  },
  {
    id: 'n5',
    icon: 'ri-tools-line',
    title: 'Truck fault',
    detail: 'FR-30-LYS engine fault (P0217) — replacement unit dispatched.',
    time: '44 min ago',
    tone: 'danger',
    link: '/trucks/FR-30-LYS',
    read: false,
  },
  {
    id: 'n6',
    icon: 'ri-file-warning-line',
    title: 'Contract expiring',
    detail: 'OMV contract expires in 30 days — 0.6M L allocation remaining.',
    time: '1 hr ago',
    tone: 'warning',
    link: '/suppliers',
    read: true,
  },
  {
    id: 'n7',
    icon: 'ri-check-double-line',
    title: 'POD signed',
    detail: 'Order #2819 delivered & POD signed by M. Bauer.',
    time: '2 hrs ago',
    tone: 'success',
    link: '/orders/2819',
    read: true,
  },
  {
    id: 'n8',
    icon: 'ri-file-list-3-line',
    title: 'Missing BOL',
    detail: 'Reconciliation flag — BOL missing on run #2841.',
    time: '3 hrs ago',
    tone: 'warning',
    link: '/billing/reconciliation',
    read: true,
  },
];
