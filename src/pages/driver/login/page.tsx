import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_LANGUAGE_CODE, LANGUAGES, LANGUAGE_STORAGE_KEY } from '@/i18n/languages';
import { pathForLanguage } from '@/i18n/urlLanguage';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import DriverLogo from '@/pages/driver/components/DriverLogo';

export default function DriverLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { driver } = useDriverApp();
  const [email, setEmail] = useState("ivan@fueledge.eu");
  const [password, setPassword] = useState('fueledge-demo');
  const [showPassword, setShowPassword] = useState(false);
  const currentLanguage =
    LANGUAGES.find((language) => language.code === i18n.language) ??
    LANGUAGES.find((language) => language.code === DEFAULT_LANGUAGE_CODE) ??
    LANGUAGES[0];

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate('/driver/home');
  }

  function selectLanguage(code: string) {
    i18n.changeLanguage(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    navigate(`${pathForLanguage(location.pathname, code)}${location.search}${location.hash}`);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background-100 px-4 py-10">
      <div className="absolute right-4 top-4">
        <label htmlFor="driver-login-language" className="sr-only">
          {t('driver.language')}
        </label>
        <select
          id="driver-login-language"
          value={currentLanguage.code}
          onChange={(event) => selectLanguage(event.target.value)}
          className="rounded-md border border-background-200 bg-background-50 px-2.5 py-1.5 text-[12px] font-medium text-foreground-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-500/15"
        >
          {LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.flag} {language.label}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-background-200 bg-background-50 p-6 md:p-8">
          <DriverLogo sub={t('driver.appName')} />

          <h1 className="mt-6 font-heading text-xl font-bold text-foreground-950">{t('driver.welcomeBack')}</h1>
          <p className="mt-1 text-sm text-foreground-500">{t('driver.loginSubtitle')}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="driver-email" className="block text-[12px] font-medium text-foreground-600 mb-1.5">
                {t('driver.email')}
              </label>
              <div className="flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3 py-2.5 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/15">
                <i className="ri-mail-line text-foreground-400 text-sm leading-none" />
                <input
                  id="driver-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground-900 outline-none"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="driver-password" className="block text-[12px] font-medium text-foreground-600 mb-1.5">
                {t('driver.password')}
              </label>
              <div className="flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3 py-2.5 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/15">
                <i className="ri-lock-line text-foreground-400 text-sm leading-none" />
                <input
                  id="driver-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground-900 outline-none"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-foreground-400 hover:text-foreground-700 cursor-pointer"
                  aria-label={t('driver.togglePassword')}
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm leading-none`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[12px] text-foreground-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-background-300 text-primary-500" />
                {t('driver.rememberMe')}
              </label>
              <button type="button" className="text-[12px] font-medium text-primary-700 hover:text-primary-800 cursor-pointer">
                {t('driver.forgotPassword')}
              </button>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-login-box-line text-sm leading-none" />
              {t('driver.login')}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-foreground-400">
          {t('driver.demoAccount')} · {driver.name} · {driver.truck.registrationNumber}
        </p>
      </div>
    </div>
  );
}
