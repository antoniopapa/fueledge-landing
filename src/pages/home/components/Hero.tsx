import { useTranslation } from 'react-i18next';
import Button from '@/components/base/Button';

const BOOK_DEMO_URL = 'https://calendly.com/martocsan/book-call';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const compact = ['ro', 'fr', 'pl', 'hu', 'cz', 'bg'].includes(i18n.language);

  return (
    <section id="top" className="relative pt-28 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      {/* subtle backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(var(--primary-100)/0.55),transparent)]"
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_8fr] gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div className="pt-4 lg:pt-0">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary-600 bg-primary-50 border border-primary-200/60 px-2.5 py-1 rounded-full">
              <span className="text-xs leading-none">🇪🇺</span>
              {t('home.heroBadge')}
            </span>

            <h1 className={`mt-6 font-heading font-extrabold tracking-tight text-foreground-950 leading-[1.05] ${compact ? 'text-3xl md:text-4xl xl:text-5xl' : 'text-4xl md:text-5xl xl:text-6xl'}`}>
              {t('home.heroTitle1')}
              <br />
              <span className="text-primary-600">{t('home.heroTitle2')}</span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-foreground-600 leading-relaxed max-w-2xl">
              {t('home.heroSubtitle')}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button size="lg" href={BOOK_DEMO_URL} className="w-full sm:w-auto">
                {t('home.bookDemo')}
                <i className="ri-arrow-right-line" />
              </Button>
              <Button size="lg" variant="secondary" href="#product" className="w-full sm:w-auto">
                {t('home.seePlatform')}
              </Button>
            </div>
          </div>

          {/* Right — image */}
          <div className="relative">
            <img
              src="https://storage.helloreaddy.io/project_files/f0377096-bfe5-4d24-abc9-2da0e560044c/c4213994-286c-476d-bec1-c1dbb245d010_compressed_hero.webp"
              alt="Fuel logistics platform — tanker truck, storage terminals, and digital route management across Europe"
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}