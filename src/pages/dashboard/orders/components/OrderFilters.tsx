import { useEffect, useRef, useState } from 'react';
import type { OrderStatus } from '@/mocks/orders';

const statuses: OrderStatus[] = [
  'New',
  'Ready to Source',
  'Sourced',
  'Scheduled',
  'In Progress',
  'Completed',
  'Cancelled',
];

type FilterSelectProps = {
  label: string;
  icon: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
};

function FilterSelect({ label, icon, options, value, onChange }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
          value
            ? 'border-primary-300 bg-primary-50 text-primary-700'
            : 'border-background-200 bg-background-50 text-foreground-600 hover:bg-background-100'
        }`}
      >
        <span className="w-4 h-4 flex items-center justify-center">
          <i className={`${icon} text-[13px] leading-none`} />
        </span>
        {value || label}
        <i className="ri-arrow-down-s-line text-[12px] leading-none" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 w-52 rounded-md border border-background-200 bg-background-50 shadow-lg py-1">
          <button
            type="button"
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            className="flex w-full items-center justify-between px-3 py-2 text-[12px] text-foreground-600 hover:bg-background-100 cursor-pointer whitespace-nowrap"
          >
            All
            {!value && <i className="ri-check-line text-primary-600 text-[13px]" />}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-[12px] text-foreground-700 hover:bg-background-100 cursor-pointer whitespace-nowrap"
            >
              {opt}
              {value === opt && <i className="ri-check-line text-primary-600 text-[13px]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type OrderFiltersProps = {
  status: OrderStatus | null;
  onStatus: (s: OrderStatus | null) => void;
  search: string;
  onSearch: (s: string) => void;
  product: string;
  onProduct: (p: string) => void;
  source: string;
  onSource: (s: string) => void;
  productOptions: string[];
  sourceOptions: string[];
  resultCount: number;
};

export default function OrderFilters({
  status,
  onStatus,
  search,
  onSearch,
  product,
  onProduct,
  source,
  onSource,
  productOptions,
  sourceOptions,
  resultCount,
}: OrderFiltersProps) {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-3">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => onStatus(null)}
          className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
            status === null
              ? 'bg-primary-500 text-background-50'
              : 'bg-background-100 text-foreground-600 hover:bg-background-200'
          }`}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onStatus(s)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              status === s
                ? 'bg-primary-500 text-background-50'
                : 'bg-background-100 text-foreground-600 hover:bg-background-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-2 pt-2 border-t border-background-200">
        <div className="relative flex-1 min-w-0 lg:max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
            <i className="ri-search-line text-foreground-400 text-sm leading-none" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search order, route, driver…"
            className="w-full rounded-md border border-background-200 bg-background-50 pl-9 pr-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <FilterSelect label="Product" icon="ri-flask-line" options={productOptions} value={product} onChange={onProduct} />
          <FilterSelect label="Source" icon="ri-building-4-line" options={sourceOptions} value={source} onChange={onSource} />
        </div>

        <span className="ml-auto text-[11px] text-foreground-400 whitespace-nowrap">
          {resultCount} order{resultCount === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  );
}