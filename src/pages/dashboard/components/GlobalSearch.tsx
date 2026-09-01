import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { drivers } from '@/mocks/drivers';
import { orders } from '@/mocks/orders';
import { trucks } from '@/mocks/fleet';
import { terminals } from '@/mocks/sourcing';

interface SearchResult {
  key: string;
  type: string;
  title: string;
  subtitle: string;
  href: string;
  icon: string;
}

const typeIcon: Record<string, string> = {
  Driver: 'ri-user-line',
  Order: 'ri-file-list-3-line',
  Truck: 'ri-truck-line',
  Terminal: 'ri-building-4-line',
};

export default function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
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

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: SearchResult[] = [];

    drivers.forEach((d) => {
      const hay = `${d.name} ${d.location} ${d.truck ?? ''} ${d.currentAssignment ?? ''} ${d.nextAssignment}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          key: `driver-${d.id}`,
          type: 'Driver',
          title: d.name,
          subtitle: d.location,
          href: `/drivers/${d.id}`,
          icon: typeIcon.Driver,
        });
      }
    });

    orders.forEach((o) => {
      const hay = `#${o.id} ${o.customer} ${o.route} ${o.driver} ${o.destination}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          key: `order-${o.id}`,
          type: 'Order',
          title: `#${o.id} · ${o.route}`,
          subtitle: `${o.customer} · ${o.driver}`,
          href: `/orders/${o.id}`,
          icon: typeIcon.Order,
        });
      }
    });

    trucks.forEach((t) => {
      const hay = `${t.plate} ${t.make} ${t.model} ${t.location} ${t.currentAssignment ?? ''}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          key: `truck-${t.id}`,
          type: 'Truck',
          title: t.plate,
          subtitle: `${t.make} ${t.model} · ${t.location}`,
          href: `/trucks/${t.id}`,
          icon: typeIcon.Truck,
        });
      }
    });

    terminals.forEach((t) => {
      const hay = `${t.name} ${t.city} ${t.country}`.toLowerCase();
      if (hay.includes(q)) {
        out.push({
          key: `terminal-${t.id}`,
          type: 'Terminal',
          title: t.name,
          subtitle: `${t.city}, ${t.country}`,
          href: `/sourcing/terminals/${t.id}`,
          icon: typeIcon.Terminal,
        });
      }
    });

    return out.slice(0, 10);
  }, [query]);

  function go(href: string) {
    navigate(href);
    setOpen(false);
    setQuery('');
  }

  return (
    <div ref={ref} className="relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
        <i className="ri-search-line text-foreground-400 text-sm leading-none" />
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search orders, terminals, drivers…"
        className="w-full rounded-md border border-background-200 bg-background-100 pl-9 pr-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
      />

      {open && query.trim() !== '' && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 rounded-md border border-background-200 bg-background-50 shadow-lg overflow-hidden">
          {results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => go(r.href)}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-background-100 cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-lg bg-background-100 flex items-center justify-center shrink-0">
                    <i className={`${r.icon} text-foreground-600 text-[15px] leading-none`} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[12px] font-semibold text-foreground-900 truncate">{r.title}</span>
                    <span className="block text-[11px] text-foreground-400 truncate">{r.subtitle}</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground-400 whitespace-nowrap">
                    {r.type}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-[12px] text-foreground-500">No results for “{query}”</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}