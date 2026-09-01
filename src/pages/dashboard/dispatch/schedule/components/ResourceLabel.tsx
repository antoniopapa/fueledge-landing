import type { ScheduleResource } from '@/mocks/schedule';

const availabilityMeta: Record<ScheduleResource['availability'], { dot: string; pill: string }> = {
  Available: { dot: 'bg-accent-500', pill: 'text-accent-700 bg-accent-100' },
  'On Shift': { dot: 'bg-primary-500', pill: '' },
  Break: { dot: 'bg-secondary-500', pill: 'text-secondary-700 bg-secondary-100' },
  Unavailable: { dot: 'bg-red-500', pill: 'text-red-700 bg-red-100' },
};

export default function ResourceLabel({ resource }: { resource: ScheduleResource }) {
  const a = availabilityMeta[resource.availability];
  return (
    <div className="flex items-center gap-2.5 min-w-0" title={`${resource.driverName} · ${resource.truckPlate}`}>
      <span className="relative w-8 h-8 shrink-0">
        <span className="w-8 h-8 rounded-full bg-background-200 flex items-center justify-center text-[11px] font-bold text-foreground-600">
          {resource.driverInitials}
        </span>
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-background-50 ${a.dot}`} />
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[12px] font-semibold text-foreground-900 truncate">{resource.driverName}</p>
          {resource.availability !== 'On Shift' && (
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap ${a.pill}`}>
              {resource.availability}
            </span>
          )}
        </div>
        <p className="text-[11px] text-foreground-400 tabular">{resource.truckPlate}</p>
      </div>
    </div>
  );
}