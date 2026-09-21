import { useTranslation } from 'react-i18next';
import type { NamedAmount } from '@/mocks/analytics';

type BarTone = 'primary' | 'accent' | 'secondary';

const barTone: Record<BarTone, string> = {
  primary: 'bg-primary-500',
  accent: 'bg-accent-500',
  secondary: 'bg-secondary-500',
};

interface BarsProps {
  items: NamedAmount[];
  tone?: BarTone;
}

export default function Bars({ items, tone = 'primary' }: BarsProps) {
  const { t } = useTranslation();
  const max = Math.max(...items.map((i) => i.amount), 1);

  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-[12px] text-foreground-700 whitespace-nowrap">
            {t(item.label)}
          </span>
          <div className="flex-1 h-3 rounded-full bg-background-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${barTone[tone]} transition-[width] duration-500`}
              style={{ width: `${Math.max((item.amount / max) * 100, 3)}%` }}
            />
          </div>
          <span className="w-16 shrink-0 text-right text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
