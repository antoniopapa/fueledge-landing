export interface DayInfo {
  weekday: string;
  date: number;
  month: string;
  year: number;
  isToday: boolean;
}

const WEEK_START = new Date(2026, 7, 20); // Thursday 20 August 2026

export function buildDays(weekOffset: number): DayInfo[] {
  const start = new Date(WEEK_START);
  start.setDate(WEEK_START.getDate() + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      year: d.getFullYear(),
      isToday: weekOffset === 0 && i === 0,
    };
  });
}

export function weekRangeLabel(days: DayInfo[]): string {
  const first = days[0];
  const last = days[6];
  if (first.month === last.month && first.year === last.year) {
    return `${first.date}–${last.date} ${first.month} ${first.year}`;
  }
  return `${first.date} ${first.month} – ${last.date} ${last.month} ${last.year}`;
}

export function singleDayLabel(day: DayInfo): string {
  return `${day.weekday} ${day.date} ${day.month} ${day.year}`;
}