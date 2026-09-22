import { useTranslation } from 'react-i18next';

const legendItems = [
  { labelKey: 'dashboard.dispatch.schedule.statuses.scheduled', swatch: 'bg-primary-500' },
  { labelKey: 'dashboard.dispatch.schedule.legend.dispatchedInProgress', swatch: 'bg-indigo-500' },
  { labelKey: 'dashboard.dispatch.schedule.legend.delayAttention', swatch: 'bg-secondary-500' },
  { labelKey: 'dashboard.dispatch.schedule.statuses.conflict', swatch: 'bg-red-500' },
  { labelKey: 'dashboard.dispatch.schedule.statuses.completed', swatch: 'bg-accent-500' },
];

export default function Legend() {
  const { t } = useTranslation();

  return (
    <div className="mb-3 flex items-center gap-4 flex-wrap">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground-400">
        {t('dashboard.dispatch.schedule.status')}
      </span>
      {legendItems.map((item) => (
        <span key={item.labelKey} className="flex items-center gap-1.5 text-[11px] text-foreground-600 whitespace-nowrap">
          <span className={`w-2.5 h-2.5 rounded-full ${item.swatch}`} />
          {t(item.labelKey)}
        </span>
      ))}
    </div>
  );
}
