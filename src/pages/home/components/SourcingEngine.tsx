import { useTranslation } from 'react-i18next';
import Reveal from '@/components/base/Reveal';

const factorKeys = [
  { icon: 'ri-oil-line', key: 'factorFuelPrice' },
  { icon: 'ri-truck-line', key: 'factorTransportCost' },
  { icon: 'ri-road-map-line', key: 'factorDistance' },
  { icon: 'ri-time-line', key: 'factorAvailability' },
];

export default function SourcingEngine() {
  const { t, i18n } = useTranslation();
  const compact = ['ro', 'fr', 'pl', 'hu', 'cz', 'bg'].includes(i18n.language);

  return (
    <section id="how-it-works" className="relative border-y border-foreground-100/70 bg-background-100/70 py-14 md:py-20">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-700">
              {t('home.sourcingEyebrow')}
            </span>
            <h2 className={`mt-2 font-heading font-bold tracking-tight text-foreground-950 leading-tight ${compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
              {t('home.sourcingTitle')}
            </h2>
            <p className="mt-3 text-sm text-foreground-600 leading-relaxed">
              {t('home.sourcingSubtitle')}
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-2">
            {factorKeys.map((f) => (
              <div
                key={f.key}
                className="inline-flex items-center gap-1.5 rounded-full bg-white border border-foreground-100/70 px-3 py-1.5"
              >
                <i className={`${f.icon} text-sm text-primary-600`} />
                <span className="text-[11px] font-medium text-foreground-700 whitespace-nowrap">
                  {t(`home.${f.key}`)}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}