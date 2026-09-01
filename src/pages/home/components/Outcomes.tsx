import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal from '@/components/base/Reveal';
import SectionHeading from './SectionHeading';

const IMPROVEMENT_PER_LITRE = 0.005; // €0.005/L — fixed assumption
const OPERATING_DAYS = 22; // days/month — fixed assumption

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const fmtInt = (n: number) => Math.round(n).toLocaleString('en-IE');

const fmtEuro = (n: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

type SliderControlProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
};

function SliderControl({ id, label, value, min, max, step, format, onChange }: SliderControlProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-foreground-800">
          {label}
        </label>
        <span className="text-sm font-semibold text-foreground-900 tabular">{format(value)}</span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(clamp(parseFloat(e.target.value), min, max))}
        className="fuel-range mt-4"
        style={{
          background: `linear-gradient(to right, oklch(var(--primary-500)) ${pct}%, oklch(var(--background-200)) ${pct}%)`,
        }}
        aria-label={label}
      />
    </div>
  );
}

export default function Outcomes() {
  const { t } = useTranslation();
  const [loadsPerDay, setLoadsPerDay] = useState(10);
  const [litresPerLoad, setLitresPerLoad] = useState(30000);

  const perLoad = useMemo(() => litresPerLoad * IMPROVEMENT_PER_LITRE, [litresPerLoad]);
  const monthly = useMemo(() => perLoad * loadsPerDay * OPERATING_DAYS, [perLoad, loadsPerDay]);

  return (
    <section id="impact" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={t('home.outcomesEyebrow')}
            title={t('home.outcomesTitle')}
            subtitle={t('home.outcomesSubtitle')}
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-center rounded-xl bg-foreground-950 p-6 md:p-8 text-background-50">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground-300">
                {t('home.monthlyImpact')}
              </span>
              <div className="mt-3 font-heading font-extrabold text-5xl md:text-6xl tracking-tight tabular">
                {fmtEuro(monthly)}
              </div>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-foreground-800 pt-6">
                <span className="text-sm text-foreground-300">{t('home.perLoadImpact')}</span>
                <span className="font-heading font-bold text-2xl text-accent-300 tabular">{fmtEuro(perLoad)}</span>
              </div>
            </div>

            <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col rounded-xl border border-foreground-200/70 bg-background-50 p-6 md:p-8">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-700">
                {t('home.yourOperation')}
              </span>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <SliderControl
                  id="loads-per-day"
                  label={t('home.loadsPerDay')}
                  value={loadsPerDay}
                  min={1}
                  max={100}
                  step={1}
                  format={fmtInt}
                  onChange={setLoadsPerDay}
                />
                <SliderControl
                  id="litres-per-load"
                  label={t('home.litresPerLoad')}
                  value={litresPerLoad}
                  min={1000}
                  max={60000}
                  step={500}
                  format={(v) => `${fmtInt(v)} L`}
                  onChange={setLitresPerLoad}
                />
              </div>

              <div className="mt-8 space-y-1 border-t border-foreground-200/70 pt-5 text-xs leading-relaxed text-foreground-500">
                <p>{t('home.estimate1')}</p>
                <p>{t('home.estimate2')}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}