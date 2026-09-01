import { useTranslation } from 'react-i18next';
import Reveal from '@/components/base/Reveal';
import SectionHeading from './SectionHeading';
import ImagePlaceholder from './ImagePlaceholder';

const primaryKeys = [
  {
    labelKey: 'cap1Label',
    icon: 'ri-line-chart-line',
    titleKey: 'cap1Title',
    descKey: 'cap1Desc',
    screenshot: 'Sourcing comparison screenshot',
  },
  {
    labelKey: 'cap2Label',
    icon: 'ri-route-line',
    titleKey: 'cap2Title',
    descKey: 'cap2Desc',
    screenshot: 'Dispatch board / fleet map screenshot',
  },
  {
    labelKey: 'cap3Label',
    icon: 'ri-map-pin-2-line',
    titleKey: 'cap3Title',
    descKey: 'cap3Desc',
    screenshot: 'Active deliveries screenshot',
  },
];

const supportingKeys = [
  { icon: 'ri-team-line', titleKey: 'sup1Title', descKey: 'sup1Desc' },
  { icon: 'ri-truck-line', titleKey: 'sup2Title', descKey: 'sup2Desc' },
  { icon: 'ri-receipt-line', titleKey: 'sup3Title', descKey: 'sup3Desc' },
  { icon: 'ri-bar-chart-line', titleKey: 'sup4Title', descKey: 'sup4Desc' },
];

export default function Platform() {
  const { t, i18n } = useTranslation();
  const compact = ['ro', 'fr', 'pl', 'hu', 'cz', 'bg'].includes(i18n.language);

  return (
    <section id="product" className="py-16 md:py-20 bg-background-50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <Reveal>
          <SectionHeading
            eyebrow={t('home.platformEyebrow')}
            title={t('home.platformTitle')}
            subtitle={t('home.platformSubtitle')}
          />
        </Reveal>

        {/* Primary capabilities — dominant, alternating rows */}
        <div className="mt-10 md:mt-12 space-y-10 md:space-y-12">
          {primaryKeys.map((cap, i) => (
            <div key={cap.titleKey} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <Reveal className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <div>
                  <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-700">
                    <i className={`${cap.icon} text-sm`} />
                    {t(`home.${cap.labelKey}`)}
                  </span>
                  <h3 className={`mt-2.5 font-heading font-bold tracking-tight text-foreground-950 leading-tight ${compact ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
                    {t(`home.${cap.titleKey}`)}
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-foreground-600 leading-relaxed max-w-lg">
                    {t(`home.${cap.descKey}`)}
                  </p>
                </div>
              </Reveal>
              <Reveal delay={100} className={i % 2 === 1 ? 'lg:order-1' : ''}>
                {i === 0 ? (
                  <img
                    src="https://storage.helloreaddy.io/project_files/f0377096-bfe5-4d24-abc9-2da0e560044c/bab82caf-c5f4-468f-8066-4af4f1d30954_compressed_sourcing-pricing.webp"
                    alt="Fuel sourcing engine — comparing terminals, prices, and delivery routes"
                    className="w-full h-auto"
                    loading="eager"
                  />
                ) : i === 1 ? (
                  <img
                    src="https://storage.helloreaddy.io/project_files/f0377096-bfe5-4d24-abc9-2da0e560044c/319f77f1-d8b6-4424-a530-1848de592d8f_compressed_orders-dispatch.webp"
                    alt="Dispatch board and fleet map — live orders, routes, and driver assignments"
                    className="w-full h-auto"
                    loading="eager"
                  />
                ) : i === 2 ? (
                  <img
                    src="https://storage.helloreaddy.io/project_files/f0377096-bfe5-4d24-abc9-2da0e560044c/ff79730f-7812-4cd5-b813-fd6f9838235f_compressed_delivery.webp"
                    alt="Active deliveries — live map tracking trucks, fuel levels, and route exceptions"
                    className="w-full h-auto"
                    loading="eager"
                  />
                ) : (
                  <ImagePlaceholder label={cap.screenshot} aspect="aspect-[16/10]" />
                )}
              </Reveal>
            </div>
          ))}
        </div>

        {/* Supporting capabilities — quieter, smaller */}
        <Reveal delay={60}>
          <div className="mt-14 md:mt-16 border-t border-foreground-100 pt-10 md:pt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
              {supportingKeys.map((s) => (
                <div key={s.titleKey} className="flex items-start gap-3.5">
                  <span className="w-9 h-9 rounded-lg bg-background-100 text-foreground-500 flex items-center justify-center shrink-0">
                    <i className={`${s.icon} text-lg`} />
                  </span>
                  <div>
                    <h4 className="font-heading font-semibold text-base text-foreground-900">
                      {t(`home.${s.titleKey}`)}
                    </h4>
                    <p className="mt-1.5 text-sm text-foreground-500 leading-relaxed">{t(`home.${s.descKey}`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}