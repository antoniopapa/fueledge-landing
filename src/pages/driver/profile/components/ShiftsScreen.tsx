import { useState } from 'react';
import { shiftRoster } from '@/mocks/driver';

function shiftHours(time: string): number {
  if (time === 'Off') return 0;
  const [start, end] = time.split('–');
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let hours = eh - sh + (em - sm) / 60;
  if (hours < 0) hours += 24;
  return hours;
}

export default function ShiftsScreen() {
  const [weekIndex, setWeekIndex] = useState(0);
  const week = shiftRoster[weekIndex];

  const shiftCount = week.days.filter((day) => day.time !== 'Off').length;
  const totalHours = week.days.reduce((sum, day) => sum + shiftHours(day.time), 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-background-200 bg-background-50 p-2">
        <button
          type="button"
          aria-label="Previous week"
          onClick={() => setWeekIndex((i) => Math.max(0, i - 1))}
          disabled={weekIndex === 0}
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-600 cursor-pointer transition-colors hover:bg-background-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="ri-arrow-left-s-line text-xl leading-none" />
        </button>

        <span className="text-sm font-semibold text-foreground-900 whitespace-nowrap">{week.range}</span>

        <button
          type="button"
          aria-label="Next week"
          onClick={() => setWeekIndex((i) => Math.min(shiftRoster.length - 1, i + 1))}
          disabled={weekIndex === shiftRoster.length - 1}
          className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-600 cursor-pointer transition-colors hover:bg-background-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="ri-arrow-right-s-line text-xl leading-none" />
        </button>
      </div>

      <p className="px-1 text-sm text-foreground-500">
        {shiftCount} shifts · {totalHours}h scheduled
      </p>

      <div className="divide-y divide-background-100 rounded-lg border border-background-200 bg-background-50">
        {week.days.map((day) => {
          const off = day.time === 'Off';
          return (
            <div
              key={day.day}
              className={`flex items-center justify-between px-4 py-3 ${day.isToday ? 'bg-primary-50/60' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-10 text-[13px] font-semibold ${off ? 'text-foreground-400' : 'text-foreground-800'}`}>
                  {day.day}
                </span>
                <span className="text-[12px] text-foreground-400">{day.date}</span>
                {day.isToday && (
                  <span className="inline-flex items-center rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-semibold text-background-50 whitespace-nowrap">
                    Today
                  </span>
                )}
              </div>
              {off ? (
                <span className="text-[13px] text-foreground-400">Off</span>
              ) : (
                <span className="text-[13px] font-medium text-foreground-900 tabular">{day.time}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}