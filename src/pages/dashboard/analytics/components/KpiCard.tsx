import { useTranslation } from 'react-i18next';
import type { MetricTone } from '@/mocks/analytics';

const toneClass: Record<MetricTone, string> = {
  neutral: 'border-background-200 bg-background-50',
  primary: 'border-primary-200 bg-primary-50',
  accent: 'border-accent-200 bg-accent-50',
  secondary: 'border-secondary-200 bg-secondary-50',
  danger: 'border-red-200 bg-red-50',
};

const toneValue: Record<MetricTone, string> = {
  neutral: 'text-foreground-950',
  primary: 'text-primary-700',
  accent: 'text-accent-700',
  secondary: 'text-secondary-700',
  danger: 'text-red-600',
};

const toneIcon: Record<MetricTone, string> = {
  neutral: 'bg-background-200 text-foreground-600',
  primary: 'bg-primary-100 text-primary-700',
  accent: 'bg-accent-100 text-accent-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  danger: 'bg-red-100 text-red-600',
};

const toneBar: Record<MetricTone, string> = {
  neutral: 'bg-foreground-300',
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  secondary: 'bg-secondary-500',
  danger: 'bg-red-500',
};

interface KpiCardProps {
  label: string;
  value: string;
  delta: string;
  icon: string;
  tone: MetricTone;
  emphasized?: boolean;
}

export default function KpiCard({ label, value, delta, icon, tone, emphasized = false }: KpiCardProps) {
  const { t } = useTranslation();

  if (emphasized) {
    return (
      <div className={`relative overflow-hidden rounded-lg border px-4 py-3.5 ${toneClass[tone]}`}>
        <span className={`absolute inset-x-0 top-0 h-0.5 ${toneBar[tone]}`} />
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-foreground-500 font-medium whitespace-nowrap">
            {t(label)}
          </span>
          <span className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${toneIcon[tone]}`}>
            <i className={`${icon} text-sm leading-none`} />
          </span>
        </div>
        <p className={`mt-2 text-[28px] font-bold tabular leading-none ${toneValue[tone]}`}>{value}</p>
        <p className="mt-2 text-[11px] text-foreground-500 whitespace-nowrap">{delta}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border px-3.5 py-3 ${toneClass[tone]}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">
          {t(label)}
        </span>
        <span className="w-5 h-5 flex items-center justify-center shrink-0">
          <i className={`${icon} text-foreground-400 text-sm leading-none`} />
        </span>
      </div>
      <p className={`mt-1.5 text-2xl font-bold tabular leading-none ${toneValue[tone]}`}>{value}</p>
      <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">{delta}</p>
    </div>
  );
}
