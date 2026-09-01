import { useTranslation } from 'react-i18next';
import Reveal from '@/components/base/Reveal';
import Button from '@/components/base/Button';

const BOOK_DEMO_URL = 'https://calendly.com/martocsan/book-call';

export default function FinalCta() {
  const { t, i18n } = useTranslation();
  const compact = ['ro', 'fr', 'pl', 'hu', 'cz', 'bg'].includes(i18n.language);

  return (
    <section id="book-demo" className="py-20 md:py-28 bg-primary-900 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,oklch(var(--primary-500)/0.35),transparent)]"
      />
      <div className="relative mx-auto max-w-3xl px-4 md:px-6 text-center">
        <Reveal>
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-200">
            {t('home.ctaEyebrow')}
          </span>
          <h2 className={`mt-3 font-heading font-extrabold tracking-tight text-background-50 leading-tight ${compact ? 'text-xl md:text-3xl' : 'text-2xl md:text-4xl'}`}>
            {t('home.ctaTitle')}
          </h2>
          <p className="mt-4 text-sm md:text-base text-primary-100 max-w-2xl mx-auto leading-relaxed">
            {t('home.ctaSubtitle')}
          </p>

          <div className="mt-8">
            <Button
              size="lg"
              href={BOOK_DEMO_URL}
              className="!bg-background-50 !text-foreground-950 hover:!bg-background-100"
            >
              {t('home.bookDemo')}
              <i className="ri-arrow-right-line" />
            </Button>
            <p className="mt-4 text-sm text-primary-100">{t('home.ctaNote')}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}