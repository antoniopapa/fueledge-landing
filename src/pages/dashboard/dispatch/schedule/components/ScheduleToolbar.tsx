import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ToolbarProps {
  dateLabel: string;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
  driverFilter: string;
  truckFilter: string;
  statusFilter: string;
  searchQuery: string;
  onDriverFilter: (v: string) => void;
  onTruckFilter: (v: string) => void;
  onStatusFilter: (v: string) => void;
  onSearchQuery: (v: string) => void;
  drivers: string[];
  trucks: string[];
  statuses: string[];
}

const filterLabelKeys: Record<string, string> = {
  'All Drivers': 'driver.scheduleToolbar.allDrivers',
  'All Trucks': 'driver.scheduleToolbar.allTrucks',
  'All Statuses': 'driver.scheduleToolbar.allStatuses',
  Scheduled: 'driver.scheduleToolbar.statuses.scheduled',
  Dispatched: 'driver.scheduleToolbar.statuses.dispatched',
  Delayed: 'driver.scheduleToolbar.statuses.delayed',
  Conflict: 'driver.scheduleToolbar.statuses.conflict',
  Completed: 'driver.scheduleToolbar.statuses.completed',
};

function FilterMenu({
  label,
  options,
  onChange,
}: {
  label: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  function getLabel(value: string) {
    const key = filterLabelKeys[value];
    return key ? t(key) : value;
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1 rounded-md border border-background-200 bg-background-50 px-2.5 py-1.5 text-[12px] font-medium whitespace-nowrap cursor-pointer transition-colors ${
          open ? 'text-foreground-900' : 'text-foreground-600 hover:text-foreground-900'
        }`}
      >
        {getLabel(label)}
        <span className="w-3 h-3 flex items-center justify-center">
          {open ? (
            <i className="ri-arrow-up-s-line text-[12px] leading-none" />
          ) : (
            <i className="ri-arrow-down-s-line text-[12px] leading-none" />
          )}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-48 max-h-64 overflow-y-auto rounded-md border border-background-200 bg-background-50 py-1">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={`flex w-full items-center px-3 py-1.5 text-left text-[12px] whitespace-nowrap cursor-pointer transition-colors ${
                o === label
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-foreground-700 hover:bg-background-100'
              }`}
            >
              {getLabel(o)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ScheduleToolbar({
  dateLabel,
  onToday,
  onPrev,
  onNext,
  driverFilter,
  truckFilter,
  statusFilter,
  searchQuery,
  onDriverFilter,
  onTruckFilter,
  onStatusFilter,
  onSearchQuery,
  drivers,
  trucks,
  statuses,
}: ToolbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex items-center gap-3 flex-wrap">
      {/* left: today / prev-next / date */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToday}
          className="rounded-md border border-background-200 bg-background-50 px-3 py-1.5 text-[12px] font-semibold text-foreground-700 hover:bg-background-100 whitespace-nowrap cursor-pointer transition-colors"
        >
          {t('driver.scheduleToolbar.today')}
        </button>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onPrev}
            aria-label={t('driver.scheduleToolbar.previous')}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-background-200 bg-background-50 text-foreground-600 hover:bg-background-100 cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-s-line text-base leading-none" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label={t('driver.scheduleToolbar.next')}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-background-200 bg-background-50 text-foreground-600 hover:bg-background-100 cursor-pointer transition-colors"
          >
            <i className="ri-arrow-right-s-line text-base leading-none" />
          </button>
        </div>
        <span className="text-[13px] font-semibold text-foreground-900 tabular whitespace-nowrap">{dateLabel}</span>
      </div>

      {/* right: search + filters */}
      <div className="flex items-center gap-2 ml-auto">
        {searchOpen && (
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQuery(e.target.value)}
            placeholder={t('driver.scheduleToolbar.searchPlaceholder')}
            className="w-52 rounded-md border border-background-200 bg-background-50 px-2.5 py-1.5 text-[12px] text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        )}
        <button
          type="button"
          onClick={() => setSearchOpen((o) => !o)}
          aria-label={t('driver.scheduleToolbar.searchFilter')}
          className={`w-7 h-7 flex items-center justify-center rounded-md border border-background-200 bg-background-50 cursor-pointer transition-colors ${
            searchOpen ? 'text-primary-600' : 'text-foreground-600 hover:bg-background-100'
          }`}
        >
          <i className="ri-search-line text-sm leading-none" />
        </button>
        <FilterMenu label={driverFilter} options={['All Drivers', ...drivers]} onChange={onDriverFilter} />
        <FilterMenu label={truckFilter} options={['All Trucks', ...trucks]} onChange={onTruckFilter} />
        <FilterMenu label={statusFilter} options={['All Statuses', ...statuses]} onChange={onStatusFilter} />
      </div>
    </div>
  );
}
