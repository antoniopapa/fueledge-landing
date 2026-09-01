import type { RunStatus, StopStatus } from '@/mocks/driver';

type StatusKind = RunStatus | StopStatus;

const meta: Record<StatusKind, { label: string; cls: string; icon: string }> = {
  Scheduled: {
    label: 'Scheduled',
    cls: 'bg-secondary-100 text-secondary-800',
    icon: 'ri-time-line',
  },
  'In Progress': {
    label: 'In Progress',
    cls: 'bg-primary-100 text-primary-700',
    icon: 'ri-loader-4-line',
  },
  Completed: {
    label: 'Completed',
    cls: 'bg-accent-100 text-accent-800',
    icon: 'ri-checkbox-circle-line',
  },
  Upcoming: {
    label: 'Upcoming',
    cls: 'bg-background-200 text-foreground-600',
    icon: 'ri-hourglass-line',
  },
  Next: {
    label: 'Next',
    cls: 'bg-primary-500 text-background-50',
    icon: 'ri-arrow-right-circle-line',
  },
  'En route': {
    label: 'En route',
    cls: 'bg-primary-100 text-primary-700',
    icon: 'ri-navigation-line',
  },
  Arrived: {
    label: 'Arrived',
    cls: 'bg-secondary-100 text-secondary-800',
    icon: 'ri-map-pin-2-line',
  },
};

export default function StatusPill({ status }: { status: StatusKind }) {
  const m = meta[status] ?? meta.Upcoming;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${m.cls}`}
    >
      <i className={`${m.icon} text-[12px] leading-none`} />
      {m.label}
    </span>
  );
}