import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import {
  mapDeliveries,
  type MapDelivery,
  type MapLocation,
  type RouteHealth,
} from '@/pages/dashboard/overview/overviewData';

type Filter = 'all' | 'ontime' | 'warning' | 'risk';

const HEALTH_META: Record<RouteHealth, { stroke: string; fill: string; label: string }> = {
  ontime: { stroke: 'stroke-green-500', fill: 'bg-green-500', label: 'Навреме' },
  warning: { stroke: 'stroke-amber-500', fill: 'bg-amber-500', label: 'Предупреждение' },
  risk: { stroke: 'stroke-red-500', fill: 'bg-red-500', label: 'В риск' },
  scheduled: { stroke: 'stroke-gray-400', fill: 'bg-gray-400', label: 'Планиран' },
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Всички активни' },
  { key: 'ontime', label: 'Навреме' },
  { key: 'warning', label: 'Предупреждения' },
  { key: 'risk', label: 'В риск' },
];

// --- mock GPS tick -------------------------------------------------------
const TICK_MS = 80;
const SPEED = 0.002; // progress gained per tick (~40s to traverse a route)

// --- route geometry helpers ---------------------------------------------
function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

// Smooth + densify a coarse waypoint list into a road-hugging curve.
function densify(points: MapLocation[], perSegment = 8): MapLocation[] {
  if (points.length < 3) return points;
  const out: MapLocation[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    for (let j = 0; j < perSegment; j++) {
      const t = j / perSegment;
      out.push({
        city: '',
        lat: 0,
        lng: 0,
        x: catmullRom(p0.x, p1.x, p2.x, p3.x, t),
        y: catmullRom(p0.y, p1.y, p2.y, p3.y, t),
      });
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

function pointAt(points: MapLocation[], t: number): MapLocation {
  const c = Math.max(0, Math.min(1, t));
  const seg = c * (points.length - 1);
  const i = Math.floor(seg);
  const f = seg - i;
  const a = points[i];
  const b = points[Math.min(i + 1, points.length - 1)];
  return { city: '', lat: 0, lng: 0, x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
}

function splitPath(points: MapLocation[], t: number): { traveled: MapLocation[]; remaining: MapLocation[] } {
  const c = Math.max(0, Math.min(1, t));
  const seg = c * (points.length - 1);
  const i = Math.floor(seg);
  const f = seg - i;
  const a = points[i];
  const b = points[Math.min(i + 1, points.length - 1)];
  const mid: MapLocation = { city: '', lat: 0, lng: 0, x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  return { traveled: [...points.slice(0, i + 1), mid], remaining: [mid, ...points.slice(i + 1)] };
}

function toPointsString(points: MapLocation[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

function RunDetails({ d }: { d: MapDelivery }) {
  const meta = HEALTH_META[d.health];
  return (
    <div className="min-w-0">
      <div className="text-[11px] font-semibold text-foreground-900">Курс {d.order}</div>
      <div className="mt-0.5 text-[10px] text-foreground-600">
        {d.origin.city} → {d.destination.city}
      </div>
      <div className="mt-1.5 flex flex-col gap-1 text-[10px] text-foreground-600">
        <span className="flex items-center gap-1.5">
          <i className="ri-user-line text-foreground-400" /> Шофьор: {d.driver}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="ri-truck-line text-foreground-400" /> Камион: {d.truck}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="ri-drop-line text-foreground-400" /> {d.volume} {d.product}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="ri-time-line text-foreground-400" /> Очаквано: {d.eta}
        </span>
        <span className="flex items-center gap-1.5">
          <i className="ri-flag-line text-foreground-400" /> Статус: {d.status}
        </span>
      </div>
      <span
        className={`mt-1.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-semibold text-background-50 ${meta.fill}`}
      >
        {meta.label}
      </span>
    </div>
  );
}

export default function OperationsMap() {
  const [filter, setFilter] = useState<Filter>('all');
  const [showScheduled, setShowScheduled] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Dense, smoothed path + a staggered start offset per delivery (computed once).
  const animated = useMemo(() => {
    const m = new Map<string, { path: MapLocation[]; offset: number }>();
    mapDeliveries.forEach((d, i) => {
      m.set(d.id, { path: densify(d.path), offset: (i * 0.14) % 1 });
    });
    return m;
  }, []);

  const visible = useMemo(
    () =>
      mapDeliveries.filter((d) => {
        if (d.health === 'scheduled') return showScheduled && filter === 'all';
        if (filter === 'all') return true;
        return d.health === filter;
      }),
    [filter, showScheduled],
  );

  const terminals = useMemo(() => {
    const seen = new Map<string, { city: string; x: number; y: number }>();
    mapDeliveries.forEach((d) => {
      if (!seen.has(d.origin.city)) {
        seen.set(d.origin.city, { city: d.origin.city, x: d.origin.x, y: d.origin.y });
      }
    });
    return Array.from(seen.values());
  }, []);

  const selected = selectedId ? mapDeliveries.find((d) => d.id === selectedId) ?? null : null;
  const hovered = hoverId && !selected ? mapDeliveries.find((d) => d.id === hoverId) ?? null : null;
  const activeFilterLabel = FILTERS.find((f) => f.key === filter)?.label ?? 'Всички активни';
  const flipY = mouse.y < 160;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="rounded-lg border border-background-200 overflow-hidden relative bg-background-100 h-full">
      <div className="relative h-[440px] md:h-[520px]" onMouseMove={handleMouseMove}>
        <iframe
          title="Карта на европейските операции на FuelEdge"
          src="https://maps.google.com/maps?q=Europe&z=5&output=embed"
          className="absolute inset-0 w-full h-full border-0 [filter:grayscale(1)_brightness(1.12)_contrast(0.82)]"
          loading="lazy"
          aria-label="Карта на европейските горивни операции с терминали, цистерни и маршрути за доставка"
        />
        <div className="absolute inset-0 bg-background-50/25 pointer-events-none" />

        {/* Routes: traveled (solid) + remaining (dashed) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          {visible.map((d) => {
            const meta = HEALTH_META[d.health];
            const anim = animated.get(d.id);
            if (!anim) return null;
            const progress = (anim.offset + tick * SPEED) % 1;
            const { traveled, remaining } = splitPath(anim.path, progress);
            const isSelected = d.id === selectedId;
            const dimmed = !!selected && !isSelected;
            const width = isSelected ? 4 : dimmed ? 1 : 2;
            const traveledOpacity = isSelected ? 1 : dimmed ? 0.2 : 0.95;
            const remainingOpacity = isSelected ? 0.45 : dimmed ? 0.12 : 0.4;
            return (
              <g key={d.id}>
                {/* remaining (faint dashed) */}
                <polyline
                  points={toPointsString(remaining)}
                  fill="none"
                  strokeWidth={width}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className={meta.stroke}
                  style={{ opacity: remainingOpacity, strokeDasharray: '3 5', pointerEvents: 'none' }}
                />
                {/* traveled (solid, slight halo) */}
                <polyline
                  points={toPointsString(traveled)}
                  fill="none"
                  strokeWidth={width + 3}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className={meta.stroke}
                  style={{ opacity: traveledOpacity * 0.15, pointerEvents: 'none' }}
                />
                <polyline
                  points={toPointsString(traveled)}
                  fill="none"
                  strokeWidth={width}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className={meta.stroke}
                  style={{ opacity: traveledOpacity, pointerEvents: 'none' }}
                />
                {/* invisible wide hit area */}
                <polyline
                  points={toPointsString(anim.path)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={12}
                  style={{ pointerEvents: 'visibleStroke', cursor: 'pointer' }}
                  onClick={() => setSelectedId((id) => (id === d.id ? null : d.id))}
                  onMouseEnter={() => setHoverId(d.id)}
                  onMouseLeave={() => setHoverId((id) => (id === d.id ? null : id))}
                />
              </g>
            );
          })}
        </svg>

        {/* Terminals */}
        {terminals.map((t) => (
          <div
            key={t.city}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center"
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
            title={`${t.city} Terminal`}
          >
            <span className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center ring-2 ring-background-50">
              <i className="ri-building-4-line text-background-50 text-[8px] leading-none" />
            </span>
          </div>
        ))}

        {/* Destinations */}
        {visible.map((d) => {
          const dimmed = !!selected && d.id !== selectedId;
          return (
            <div
              key={`${d.id}-dest`}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 flex items-center justify-center"
              style={{ left: `${d.destination.x}%`, top: `${d.destination.y}%`, opacity: dimmed ? 0.2 : 1 }}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-accent-500 flex items-center justify-center ring-2 ring-background-50">
                <i className="ri-map-pin-2-line text-background-50 text-[8px] leading-none" />
              </span>
            </div>
          );
        })}

        {/* Trucks (animated along route) */}
        {visible.map((d) => {
          const meta = HEALTH_META[d.health];
          const anim = animated.get(d.id);
          if (!anim) return null;
          const progress = (anim.offset + tick * SPEED) % 1;
          const pos = pointAt(anim.path, progress);
          const dimmed = !!selected && d.id !== selectedId;
          return (
            <button
              key={d.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center cursor-pointer transition-opacity duration-200"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, opacity: dimmed ? 0.2 : 1 }}
              onClick={() => setSelectedId((id) => (id === d.id ? null : d.id))}
              onMouseEnter={() => setHoverId(d.id)}
              onMouseLeave={() => setHoverId((id) => (id === d.id ? null : id))}
              title={`${d.order} · ${d.route}`}
              aria-label={`Select delivery ${d.order}`}
            >
              {d.health === 'risk' && (
                <span className="absolute -inset-1 rounded-full bg-red-500/40 animate-ping" />
              )}
              <span
                className={`relative w-5 h-5 rounded-full ${meta.fill} flex items-center justify-center ring-2 ring-background-50`}
              >
                <i className="ri-truck-line text-background-50 text-[11px] leading-none" />
              </span>
            </button>
          );
        })}

        {/* Filter + scheduled toggle */}
        <div className="absolute top-3 left-3 z-10">
          <div className="relative">
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className="flex items-center gap-1.5 bg-background-50/95 border border-background-200 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-foreground-700 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-filter-3-line text-xs" />
              {activeFilterLabel}
              <i className={`ri-arrow-down-s-line text-xs transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 bg-background-50 border border-background-200 rounded-md py-1 z-20">
                {FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => {
                      setFilter(f.key);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[11px] cursor-pointer whitespace-nowrap ${
                      filter === f.key
                        ? 'text-primary-600 font-semibold bg-background-100'
                        : 'text-foreground-600 hover:bg-background-100'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowScheduled((s) => !s)}
            className="mt-1.5 flex items-center gap-1.5 cursor-pointer"
          >
            <span
              className={`w-7 h-4 rounded-full relative transition-colors ${
                showScheduled ? 'bg-secondary-500' : 'bg-background-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-3 h-3 rounded-full bg-background-50 transition-all ${
                  showScheduled ? 'left-3.5' : 'left-0.5'
                }`}
              />
            </span>
            <span className="text-[10px] text-foreground-600 whitespace-nowrap">Планирани</span>
          </button>
        </div>

        {/* Selected info card */}
        {selected && (
          <div className="absolute top-3 right-3 z-20 w-64 bg-background-50/95 border border-background-200 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <RunDetails d={selected} />
              <button
                onClick={() => setSelectedId(null)}
                className="cursor-pointer text-foreground-500 hover:text-foreground-700 ml-2 shrink-0"
                aria-label="Покажи всички"
              >
                <i className="ri-close-line text-sm leading-none" />
              </button>
            </div>
            {selected.exception && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-red-600">
                <i className="ri-alarm-warning-line" /> {selected.exception}
              </div>
            )}
            <button
              onClick={() => setSelectedId(null)}
              className="mt-2 w-full flex items-center justify-center gap-1 text-[10px] font-medium text-primary-600 hover:text-primary-700 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-arrow-go-back-line text-xs" /> Покажи всички
            </button>
          </div>
        )}

        {/* Hover tooltip */}
        {hovered && (
          <div
            className="absolute z-30 pointer-events-none w-52 bg-background-50/95 border border-background-200 rounded-md p-2.5"
            style={{
              left: mouse.x,
              top: mouse.y,
              transform: flipY ? 'translate(-50%, 12px)' : 'translate(-50%, calc(-100% - 8px))',
            }}
          >
            <RunDetails d={hovered} />
          </div>
        )}

        {/* Legend */}
        <div className="absolute left-3 bottom-3 bg-background-50/95 rounded-md px-2.5 py-2 flex flex-col gap-1.5 border border-background-200">
          <span className="flex items-center gap-1.5 text-[9px] text-foreground-600">
            <i className="ri-building-4-line text-primary-500 text-[10px] leading-none" /> Терминал
          </span>
          <span className="flex items-center gap-1.5 text-[9px] text-foreground-600">
            <i className="ri-truck-line text-foreground-500 text-[10px] leading-none" /> Камион
          </span>
          <span className="flex items-center gap-1.5 text-[9px] text-foreground-600">
            <i className="ri-map-pin-2-line text-accent-500 text-[10px] leading-none" /> Дестинация
          </span>
          <span className="h-px bg-background-200 my-0.5" />
          <span className="flex items-center gap-1.5 text-[9px] text-foreground-600">
            <span className="w-2 h-0.5 bg-green-500 rounded" /> Навреме
          </span>
          <span className="flex items-center gap-1.5 text-[9px] text-foreground-600">
            <span className="w-2 h-0.5 bg-amber-500 rounded" /> Предупреждение
          </span>
          <span className="flex items-center gap-1.5 text-[9px] text-foreground-600">
            <span className="w-2 h-0.5 bg-red-500 rounded" /> В риск
          </span>
          <span className="flex items-center gap-1.5 text-[9px] text-foreground-600">
            <span className="w-2 h-0.5 bg-gray-400 rounded" /> Планиран
          </span>
          <span className="h-px bg-background-200 my-0.5" />
          <span className="flex items-center gap-1.5 text-[9px] text-foreground-500">
            <span className="w-3 h-0.5 bg-foreground-400 rounded" /> Изминато
          </span>
          <span className="flex items-center gap-1.5 text-[9px] text-foreground-500">
            <span className="w-3 border-t border-dashed border-foreground-400" /> Оставащо
          </span>
        </div>

        {/* Live badge */}
        <div className="absolute right-3 bottom-3 bg-background-50/95 rounded-md px-2.5 py-1.5 border border-background-200">
          <span className="text-[9px] font-medium text-foreground-500">
            Live · {visible.length} active
          </span>
        </div>
      </div>
    </div>
  );
}
