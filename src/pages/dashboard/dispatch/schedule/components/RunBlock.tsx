import type { ScheduleRun } from '@/mocks/schedule';
import { statusMeta } from './statusMeta';

interface RunBlockProps {
  run: ScheduleRun;
  variant?: 'week' | 'day';
  onClick?: () => void;
}

export default function RunBlock({ run, variant = 'week', onClick }: RunBlockProps) {
  const meta = statusMeta[run.status];
  const title = run.conflict
    ? `Конфликт в графика\nПредишният курс приключва 14:20\nСледващото товарене започва 14:00`
    : `#${run.id} · ${run.route} · ${run.volume} · ${run.product}`;

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', run.id)}
      onClick={onClick}
      title={title}
      className={`relative block w-full overflow-hidden rounded-md border text-left cursor-pointer transition-colors hover:brightness-95 ${
        run.conflict ? 'border-red-300 ring-1 ring-red-300' : 'border-transparent'
      } ${meta.bg}`}
    >
      <span className={`absolute left-0 top-0 bottom-0 w-1 ${meta.bar}`} />
      <div className={variant === 'week' ? 'px-2.5 py-1.5' : 'px-2 py-1'}>
        <p className={`flex items-center gap-1 text-[10px] font-semibold whitespace-nowrap ${meta.text}`}>
          #{run.id} · {run.startTime}
          {run.conflict && (
            <span className="w-3 h-3 flex items-center justify-center">
              <i className="ri-alert-fill text-red-500 text-[10px] leading-none" />
            </span>
          )}
        </p>
        <p className="text-[11px] font-medium text-foreground-800 truncate whitespace-nowrap">{run.route}</p>
        {variant === 'week' && (
          <p className="text-[10px] text-foreground-500 whitespace-nowrap">
            {run.volume} · {run.product}
          </p>
        )}
      </div>
    </button>
  );
}
