import { fleetAvailability, driverAvailability } from '@/pages/dashboard/overview/overviewData';

type ChipTone = 'accent' | 'secondary' | 'neutral';

const chipTone: Record<ChipTone, string> = {
  accent: 'bg-accent-100 text-accent-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  neutral: 'bg-background-100 text-foreground-600',
};

const segments: { label: string; value: string; icon: string; tone: ChipTone }[] = [
  {
    label: 'Налични камиони',
    value: `${fleetAvailability.available}/${fleetAvailability.total}`,
    icon: 'ri-truck-line',
    tone: 'accent',
  },
  {
    label: 'Налични шофьори',
    value: `${driverAvailability.available}/${driverAvailability.total}`,
    icon: 'ri-user-line',
    tone: 'accent',
  },
  {
    label: 'В движение',
    value: String(fleetAvailability.inTransit),
    icon: 'ri-roadster-line',
    tone: 'neutral',
  },
  {
    label: 'Товарене',
    value: String(fleetAvailability.loading),
    icon: 'ri-loader-4-line',
    tone: 'neutral',
  },
  {
    label: 'При клиент',
    value: String(fleetAvailability.atCustomer),
    icon: 'ri-home-4-line',
    tone: 'neutral',
  },
  {
    label: 'Поддръжка',
    value: String(fleetAvailability.maintenance),
    icon: 'ri-tools-line',
    tone: 'secondary',
  },
  {
    label: 'Шофьори на смяна',
    value: `${driverAvailability.onShift}/${driverAvailability.total}`,
    icon: 'ri-team-line',
    tone: 'neutral',
  },
];

export default function AvailabilityStrip() {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 px-4 py-3">
      <div className="flex items-center gap-x-6 gap-y-3 flex-wrap">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400 whitespace-nowrap">
          Флот и шофьори
        </span>
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${chipTone[s.tone]}`}>
              <i className={`${s.icon} text-[13px] leading-none`} />
            </span>
            <div className="leading-tight">
              <div className="text-[13px] font-bold text-foreground-950 tabular whitespace-nowrap">{s.value}</div>
              <div className="text-[10px] text-foreground-400 whitespace-nowrap">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
