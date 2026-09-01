import type { DriverStatus, ExceptionKind } from '@/mocks/drivers';

const statusStyle: Record<DriverStatus, string> = {
  Available: 'text-accent-700 bg-accent-100',
  Assigned: 'text-primary-700 bg-primary-100',
  Loading: 'text-primary-700 bg-primary-100',
  'In Transit': 'text-primary-700 bg-primary-100',
  Delivering: 'text-accent-700 bg-accent-100',
  Break: 'text-secondary-700 bg-secondary-100',
  'Off Duty': 'text-foreground-500 bg-background-200',
};

const statusDot: Record<DriverStatus, string> = {
  Available: 'bg-accent-500',
  Assigned: 'bg-primary-500',
  Loading: 'bg-primary-400',
  'In Transit': 'bg-primary-500',
  Delivering: 'bg-accent-500',
  Break: 'bg-secondary-500',
  'Off Duty': 'bg-background-400',
};

const exceptionStyle: Record<ExceptionKind, string> = {
  Delayed: 'text-secondary-700 bg-secondary-100',
  'Terminal Delay': 'text-secondary-700 bg-secondary-100',
  'Driver Issue': 'text-red-600 bg-red-100',
  'Truck Issue': 'text-red-600 bg-red-100',
};

type StatusBadgeProps = {
  status: DriverStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
      {status}
    </span>
  );
}

export function ExceptionBadge({ kind, detail }: { kind: ExceptionKind; detail: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${exceptionStyle[kind]}`}
    >
      <i className="ri-alert-line text-[10px] leading-none" />
      {kind}
      {detail ? ` · ${detail}` : ''}
    </span>
  );
}