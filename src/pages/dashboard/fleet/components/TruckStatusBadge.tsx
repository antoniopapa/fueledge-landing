import type { TruckStatus } from '@/mocks/fleet';

const statusStyle: Record<TruckStatus, string> = {
  Available: 'text-accent-700 bg-accent-100',
  Assigned: 'text-primary-700 bg-primary-100',
  'Heading to Terminal': 'text-primary-700 bg-primary-100',
  Loading: 'text-primary-700 bg-primary-100',
  'In Transit': 'text-primary-700 bg-primary-100',
  'At Customer': 'text-secondary-700 bg-secondary-100',
  Maintenance: 'text-secondary-700 bg-secondary-100',
  'Out of Service': 'text-foreground-500 bg-background-200',
};

const statusDot: Record<TruckStatus, string> = {
  Available: 'bg-accent-500',
  Assigned: 'bg-primary-500',
  'Heading to Terminal': 'bg-primary-400',
  Loading: 'bg-primary-400',
  'In Transit': 'bg-primary-500',
  'At Customer': 'bg-secondary-500',
  Maintenance: 'bg-secondary-500',
  'Out of Service': 'bg-background-400',
};

export default function TruckStatusBadge({ status }: { status: TruckStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
      {status}
    </span>
  );
}