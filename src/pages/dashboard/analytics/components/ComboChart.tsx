import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ComboPoint } from '@/mocks/analytics';

const W = 720;
const H = 280;
const PAD_L = 34;
const PAD_R = 44;
const PAD_T = 16;
const PAD_B = 26;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

const VOL_MAX = 80;
const MPL_MIN = 0.08;
const MPL_MAX = 0.12;

const VOL_TICKS = [0, 20, 40, 60, 80];
const MPL_TICKS = [0.08, 0.09, 0.1, 0.11, 0.12];

interface ComboChartProps {
  items: ComboPoint[];
}

export default function ComboChart({ items }: ComboChartProps) {
  const { t } = useTranslation();
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const n = items.length;
  const slot = PLOT_W / n;
  const barW = slot * 0.44;

  const volY = (v: number) => PAD_T + PLOT_H - (v / VOL_MAX) * PLOT_H;
  const mplY = (m: number) => PAD_T + PLOT_H - ((m - MPL_MIN) / (MPL_MAX - MPL_MIN)) * PLOT_H;
  const xOf = (i: number) => PAD_L + slot * i + slot / 2;

  const linePoints = items.map((d, i) => `${xOf(i)},${mplY(d.marginPerL)}`).join(' ');

  const active = hover ?? selected;
  const tooltipPoint = hover != null ? items[hover] : null;
  const rawTipLeft = hover != null ? (xOf(hover) / W) * 100 : 50;
  const tipLeft = Math.min(Math.max(rawTipLeft, 12), 88);
  const selectedPoint = selected != null ? items[selected] : null;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-3 text-[11px] text-foreground-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary-500" />
          Delivered volume (kL)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-primary-200" />
          Prior period
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-500" />
          Gross margin (€/L)
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block"
          role="img"
          aria-label="Delivered volume and gross margin per litre trend"
        >
          {VOL_TICKS.map((t) => (
            <line
              key={t}
              x1={PAD_L}
              x2={PAD_L + PLOT_W}
              y1={volY(t)}
              y2={volY(t)}
              stroke="oklch(var(--background-200))"
              strokeWidth="1"
            />
          ))}
          {VOL_TICKS.map((t) => (
            <text key={t} x={PAD_L - 6} y={volY(t) + 3} textAnchor="end" fontSize="10" fill="oklch(var(--foreground-400))">
              {t}
            </text>
          ))}
          {MPL_TICKS.map((t) => (
            <text
              key={t}
              x={PAD_L + PLOT_W + 6}
              y={mplY(t) + 3}
              textAnchor="start"
              fontSize="10"
              fill="oklch(var(--foreground-400))"
            >
              €{t.toFixed(2)}
            </text>
          ))}

          {items.map((d, i) => {
            const x = xOf(i) - barW / 2;
            const vy = volY(d.volume);
            const py = volY(d.prevVolume);
            const isSel = i === selected;
            const isHov = i === hover;
            return (
              <g key={d.label}>
                <rect x={x} y={py} width={barW} height={PAD_T + PLOT_H - py} rx="2" fill="oklch(var(--primary-200))" />
                <rect
                  x={x}
                  y={vy}
                  width={barW}
                  height={PAD_T + PLOT_H - vy}
                  rx="2"
                  fill={isSel ? 'oklch(var(--primary-600))' : isHov ? 'oklch(var(--primary-500))' : 'oklch(var(--primary-500) / 0.85)'}
                />
              </g>
            );
          })}

          <polyline
            points={linePoints}
            fill="none"
            stroke="oklch(var(--accent-500))"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {items.map((d, i) => (
            <circle
              key={d.label}
              cx={xOf(i)}
              cy={mplY(d.marginPerL)}
              r={i === active ? 3.5 : 2.5}
              fill="oklch(var(--background-50))"
              stroke="oklch(var(--accent-500))"
              strokeWidth="2"
            />
          ))}

          {items.map((d, i) => (
            <text
              key={d.label}
              x={xOf(i)}
              y={H - 8}
              textAnchor="middle"
              fontSize="9"
              fontWeight={i === active ? 600 : 400}
              fill={i === active ? 'oklch(var(--foreground-700))' : 'oklch(var(--foreground-400))'}
            >
              {t(d.label)}
            </text>
          ))}

          {items.map((d, i) => (
            <rect
              key={`hit-${d.label}`}
              x={PAD_L + slot * i}
              y={PAD_T}
              width={slot}
              height={PLOT_H}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setSelected((s) => (s === i ? null : i))}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </svg>

        {tooltipPoint && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg border border-background-200 bg-background-50 px-3 py-2.5 min-w-[168px]"
            style={{ left: `${tipLeft}%`, top: 4 }}
          >
            <div className="text-[11px] font-semibold text-foreground-900">{t(tooltipPoint.label)}</div>
            <div className="mt-1.5 space-y-1 text-[11px]">
              <TooltipRow label="Volume" value={`${tooltipPoint.volume} kL`} />
              <TooltipRow label="Revenue" value={`€${tooltipPoint.revenue}k`} />
              <TooltipRow label="Gross margin" value={`€${tooltipPoint.grossMargin}k`} />
              <TooltipRow label="Margin / L" value={`€${tooltipPoint.marginPerL.toFixed(3)}`} />
              <TooltipRow label="Runs" value={`${tooltipPoint.runs}`} />
            </div>
          </div>
        )}
      </div>

      {selectedPoint && (
        <div className="mt-3 rounded-lg border border-background-200 bg-background-100/70 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-foreground-700">{t(selectedPoint.label)} · day detail</span>
            <button
              onClick={() => setSelected(null)}
              className="text-[11px] font-medium text-foreground-400 hover:text-foreground-700 whitespace-nowrap cursor-pointer"
            >
              Clear selection
            </button>
          </div>
          <div className="mt-2 grid grid-cols-5 gap-2">
            <DayStat label="Volume" value={`${selectedPoint.volume} kL`} />
            <DayStat label="Revenue" value={`€${selectedPoint.revenue}k`} />
            <DayStat label="Gross margin" value={`€${selectedPoint.grossMargin}k`} />
            <DayStat label="Margin / L" value={`€${selectedPoint.marginPerL.toFixed(3)}`} />
            <DayStat label="Runs" value={`${selectedPoint.runs}`} />
          </div>
        </div>
      )}
    </div>
  );
}

function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-foreground-500">{label}</span>
      <span className="font-semibold text-foreground-900 tabular whitespace-nowrap">{value}</span>
    </div>
  );
}

function DayStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-foreground-400">{label}</div>
      <div className="text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">{value}</div>
    </div>
  );
}
