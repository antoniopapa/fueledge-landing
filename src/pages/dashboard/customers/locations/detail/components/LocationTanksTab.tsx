import type { CustomerLocation } from '@/mocks/customers';

function parseLevel(s: string): number {
  return parseInt(s.replace(/[^0-9]/g, ''), 10) || 0;
}

export default function LocationTanksTab({ location }: { location: CustomerLocation }) {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-background-200">
        <h2 className="text-sm font-semibold text-foreground-950">Site Tanks</h2>
        <p className="text-[11px] text-foreground-400">{location.tanks.length} tank{location.tanks.length === 1 ? '' : 's'} installed</p>
      </div>
      <div className="divide-y divide-background-200">
        {location.tanks.map((t, i) => {
          const level = parseLevel(t.level);
          return (
            <div key={i} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-foreground-900">{t.product}</p>
                  <p className="text-[11px] text-foreground-500">Tank {i + 1} · {t.capacity}</p>
                </div>
                <span
                  className={`text-[13px] font-bold tabular ${
                    level < 25 ? 'text-secondary-700' : 'text-foreground-900'
                  }`}
                >
                  {t.level}
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-background-200 overflow-hidden">
                <div
                  className={`h-full rounded-full ${level < 25 ? 'bg-secondary-500' : 'bg-accent-500'}`}
                  style={{ width: `${Math.min(level, 100)}%` }}
                />
              </div>
              {level < 25 && (
                <p className="mt-1.5 text-[11px] font-medium text-secondary-700">Low level — schedule a delivery</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}