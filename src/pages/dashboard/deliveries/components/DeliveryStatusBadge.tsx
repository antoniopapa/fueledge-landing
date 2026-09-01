import type { DeliveryStatus } from '@/mocks/deliveries';

const statusStyle: Record<DeliveryStatus, string> = {
  'Heading to Terminal': 'text-foreground-600 bg-background-200',
  Waiting: 'text-secondary-700 bg-secondary-100',
  Loading: 'text-primary-700 bg-primary-100',
  'In Transit': 'text-primary-700 bg-primary-100',
  'At Customer': 'text-accent-700 bg-accent-100',
  Delivering: 'text-accent-700 bg-accent-100',
  Completed: 'text-accent-700 bg-accent-100',
};

const statusDot: Record<DeliveryStatus, string> = {
  'Heading to Terminal': 'bg-background-400',
  Waiting: 'bg-secondary-500',
  Loading: 'bg-primary-400',
  'In Transit': 'bg-primary-500',
  'At Customer': 'bg-accent-500',
  Delivering: 'bg-accent-500',
  Completed: 'bg-accent-500',
};

export default function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
      {status}
    </span>
  );
}