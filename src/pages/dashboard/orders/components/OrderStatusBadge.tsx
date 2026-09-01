import type { OrderStatus } from '@/mocks/orders';

const statusStyle: Record<OrderStatus, string> = {
  New: 'text-foreground-600 bg-background-200',
  'Ready to Source': 'text-secondary-700 bg-secondary-100',
  Sourced: 'text-accent-700 bg-accent-100',
  Scheduled: 'text-primary-700 bg-primary-100',
  'In Progress': 'text-primary-700 bg-primary-100',
  Completed: 'text-accent-700 bg-accent-100',
  Cancelled: 'text-foreground-400 bg-background-100',
};

const statusDot: Record<OrderStatus, string> = {
  New: 'bg-background-400',
  'Ready to Source': 'bg-secondary-500',
  Sourced: 'bg-accent-500',
  Scheduled: 'bg-primary-500',
  'In Progress': 'bg-primary-400',
  Completed: 'bg-accent-500',
  Cancelled: 'bg-background-300',
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
      {status}
    </span>
  );
}