import { useEffect, useState } from 'react';
import { shiftRoster } from '@/mocks/driver';

function parseMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function findShiftWindow(): { start: number; end: number } | null {
  const today = shiftRoster
    .flatMap((week) => week.days)
    .find((day) => day.isToday) ?? shiftRoster[0]?.days[0];
  if (!today) return null;
  const match = today.time.match(/(\d{2}:\d{2})–(\d{2}:\d{2})/);
  if (!match) return null;
  return { start: parseMinutes(match[1]), end: parseMinutes(match[2]) };
}

export default function ShiftBar() {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const shift = findShiftWindow();
  if (!shift) return null;

  const nowDate = new Date(now);
  const nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();
  const remainingMinutes = shift.end - nowMinutes;
  const elapsedMinutes = nowMinutes - shift.start;
  const pct = Math.max(0, Math.min(100, Math.round((elapsedMinutes / (shift.end - shift.start)) * 100)));

  let remainingLabel = 'Shift complete';
  if (nowMinutes < shift.start) {
    remainingLabel = 'Starts 06:00';
  } else if (remainingMinutes > 0) {
    const h = Math.floor(remainingMinutes / 60);
    const m = remainingMinutes % 60;
    remainingLabel = `${h}h ${m}m left`;
  }

  return (
    <div className="flex items-center gap-3 text-[13px] text-foreground-500">
      <span className="flex items-center gap-1.5 whitespace-nowrap">
        <i className="ri-time-line text-foreground-400 text-sm leading-none" />
        <span className="font-semibold text-foreground-700">Shift</span>
      </span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-background-200">
        <div
          className="h-full rounded-full bg-secondary-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-[12px] font-medium text-foreground-600 tabular">
        {remainingLabel}
      </span>
    </div>
  );
}