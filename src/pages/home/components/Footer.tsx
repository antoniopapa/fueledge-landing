import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { DEFAULT_LANGUAGE_CODE } from '@/i18n/languages';
import { HOME_MENU_ITEMS, languageFromPath } from '@/i18n/urlLanguage';
import Logo from './Logo';

const BOOK_DEMO_URL = 'https://calendly.com/bastion-infra/30min';
const CONTACT_EMAIL = 'mailto:hello@fueledge.eu';

export default function Footer() {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const pageLanguage = languageFromPath(location.pathname) ?? i18n.language ?? DEFAULT_LANGUAGE_CODE;

  return (
    <footer className="bg-background-100/60 border-t border-background-200">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-10">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-foreground-600 leading-relaxed">
              {t('home.footerDesc')} {t('home.footerTagline')}
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://www.linkedin.com/company/fueledge"
                rel="nofollow"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-md border border-background-200 text-foreground-600 hover:text-foreground-950 hover:bg-background-100 flex items-center justify-center transition-colors"
              >
                <i className="ri-linkedin-fill text-base" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-400">
              {t('home.footerProduct')}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {HOME_MENU_ITEMS.map((l) => (
                <li key={l.key}>
                  <a href={l.href} className="text-sm text-foreground-700 hover:text-foreground-950 transition-colors">
                    {t(`home.${l.key}`, { lng: pageLanguage })}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-400">
              {t('home.footerContact')}
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={BOOK_DEMO_URL}
                  rel="nofollow"
                  className="text-sm text-foreground-700 hover:text-foreground-950 transition-colors"
                >
                  {t('home.bookDemo')}
                </a>
              </li>
              <li>
                <a href={CONTACT_EMAIL} className="text-sm text-foreground-700 hover:text-foreground-950 transition-colors">
                  {t('home.contactUs')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-background-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-foreground-500">{t('home.copyright')}</p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-xs text-foreground-500 hover:text-foreground-800 transition-colors">
              {t('home.privacy')}
            </a>
            <a href="#" className="text-xs text-foreground-500 hover:text-foreground-800 transition-colors">
              {t('home.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
