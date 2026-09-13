import type { ScheduleResource } from '@/mocks/schedule';

export default function ResourceLabel({ resource }: { resource: ScheduleResource }) {
  return (
    <p className="min-w-0 truncate text-[12px] font-semibold text-foreground-900" title={resource.driverName}>
      {resource.driverName}
    </p>
  );
}
