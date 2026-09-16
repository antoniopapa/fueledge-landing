import type { ScheduleStatus } from '@/mocks/schedule';

export interface StatusStyle {
  label: string;
  bar: string;
  bg: string;
  text: string;
  dot: string;
  border: string;
}

export const statusMeta: Record<ScheduleStatus, StatusStyle> = {
  Scheduled: { label: 'Планиран', bar: 'bg-primary-400', bg: 'bg-primary-50', text: 'text-primary-700', dot: 'bg-primary-500', border: 'border-primary-200' },
  Dispatched: { label: 'Изпратен', bar: 'bg-indigo-400', bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500', border: 'border-indigo-200' },
  Completed: { label: 'Завършен', bar: 'bg-accent-400', bg: 'bg-accent-50', text: 'text-accent-700', dot: 'bg-accent-500', border: 'border-accent-200' },
  Delayed: { label: 'Закъснява', bar: 'bg-secondary-400', bg: 'bg-secondary-50', text: 'text-secondary-700', dot: 'bg-secondary-500', border: 'border-secondary-200' },
  Conflict: { label: 'Конфликт', bar: 'bg-red-400', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', border: 'border-red-200' },
};
