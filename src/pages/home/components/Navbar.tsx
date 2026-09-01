import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/base/Button';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';

const BOOK_DEMO_URL = 'https://calendly.com/bastion-infra/30min';

const linkKeys = [
  { key: 'navSourcing', href: '#how-it-works' },
  { key: 'navPlatform', href: '#product' },
  { key: 'navSavings', href: '#impact' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-background-50/90 backdrop-blur border-b border-background-200' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 md:px-6 h-16 flex items-center justify-between">
        <Logo />

        <div className="hidden md:flex items-center gap-1">
          {linkKeys.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-sm font-medium text-foreground-700 hover:text-foreground-950 rounded-md hover:bg-background-100 transition-colors whitespace-nowrap"
            >
              {t(`home.${l.key}`)}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <Button href={BOOK_DEMO_URL}>{t('home.bookDemo')}</Button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-md text-foreground-900 hover:bg-background-100"
          >
            <i className={`${open ? 'ri-close-line' : 'ri-menu-line'} text-xl`} />
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-background-50 border-b border-background-200 px-4 py-3 flex flex-col">
          {linkKeys.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm font-medium text-foreground-800 hover:text-foreground-950 border-b border-background-100 last:border-0"
            >
              {t(`home.${l.key}`)}
            </a>
          ))}
          <Button href={BOOK_DEMO_URL} className="mt-3 w-full">
            {t('home.bookDemo')}
          </Button>
        </div>
      )}
    </header>
  );
}