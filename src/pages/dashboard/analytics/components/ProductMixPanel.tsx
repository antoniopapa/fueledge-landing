import Panel from './Panel';
import type { ProductMixRow } from '@/mocks/analytics';

const toneColor: Record<ProductMixRow['tone'], string> = {
  primary: 'oklch(var(--primary-500))',
  accent: 'oklch(var(--accent-500))',
  secondary: 'oklch(var(--secondary-500))',
  primarySoft: 'oklch(var(--primary-200))',
  accentSoft: 'oklch(var(--accent-200))',
  secondarySoft: 'oklch(var(--secondary-200))',
  foreground: 'oklch(var(--foreground-300))',
};

interface ProductMixPanelProps {
  items: ProductMixRow[];
}

export default function ProductMixPanel({ items }: ProductMixPanelProps) {
  const total = items.reduce((sum, i) => sum + i.value, 0) || 1;
  let acc = 0;
  const stops = items
    .map((i) => {
      const start = (acc / total) * 360;
      acc += i.value;
      const end = (acc / total) * 360;
      return `${toneColor[i.tone]} ${start.toFixed(1)}deg ${end.toFixed(1)}deg`;
    })
    .join(', ');

  return (
    <Panel title="Product Mix" subtitle="Volume & profitability by product">
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 shrink-0 rounded-full" style={{ background: `conic-gradient(${stops})` }}>
          <div className="absolute inset-[20%] rounded-full bg-background-50 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-foreground-950 tabular leading-none">1.84M</span>
            <span className="text-[9px] text-foreground-400 mt-0.5">litres</span>
          </div>
        </div>
        <div className="flex-1 space-y-1.5 min-w-0">
          <div>
            <div className="text-[10px] text-foreground-400">Total volume</div>
            <div className="text-lg font-bold text-foreground-950 tabular leading-tight">1.84M L</div>
          </div>
          <div>
            <div className="text-[10px] text-foreground-400">Gross margin</div>
            <div className="text-sm font-semibold text-primary-700 tabular leading-tight">€186k</div>
          </div>
        </div>
      </div>

      <table className="w-full mt-4 text-[12px]">
        <thead>
          <tr className="text-foreground-400 text-[10px] uppercase tracking-wide">
            <th className="text-left font-medium pb-2">Product</th>
            <th className="text-right font-medium pb-2">Share</th>
            <th className="text-right font-medium pb-2">Margin/L</th>
            <th className="text-right font-medium pb-2">Margin</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.label} className="border-t border-background-100">
              <td className="py-1.5 pr-2">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: toneColor[i.tone] }} />
                  <span className="text-foreground-700 whitespace-nowrap">{i.label}</span>
                </span>
              </td>
              <td className="py-1.5 text-right tabular text-foreground-700 whitespace-nowrap">{i.value}%</td>
              <td className="py-1.5 text-right tabular text-foreground-700 whitespace-nowrap">{i.marginPerL}</td>
              <td className="py-1.5 text-right tabular font-semibold text-foreground-900 whitespace-nowrap">{i.grossMargin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}