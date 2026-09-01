import type { SeriesPoint } from '@/mocks/analytics';

interface ColumnsProps {
  items: SeriesPoint[];
  unit?: string;
}

export default function Columns({ items, unit = '' }: ColumnsProps) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div>
      <div className="flex items-end gap-1.5 h-40">
        {items.map((item) => (
          <div key={item.label} className="flex-1 flex flex-col items-center gap-1.5 group">
            <span className="text-[10px] text-foreground-400 tabular opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.value}
              {unit}
            </span>
            <div
              className="w-full rounded-t-md bg-primary-500/80 group-hover:bg-primary-500 transition-colors"
              style={{ height: `${Math.max((item.value / max) * 100, 3)}%` }}
              title={`${item.value}${unit}`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-2">
        {items.map((item) => (
          <span
            key={item.label}
            className="flex-1 text-center text-[10px] text-foreground-400 whitespace-nowrap overflow-hidden"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}