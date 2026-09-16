import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES, LANGUAGE_STORAGE_KEY } from '@/i18n/languages';

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function select(code: string) {
    i18n.changeLanguage(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-background-100 transition-colors"
      >
        <span className="flex items-center gap-3 text-sm font-medium text-foreground-800">
          <i className="ri-global-line text-foreground-500 text-base leading-none" />
          {t('driver.language')}
        </span>
        <span className="flex items-center gap-1.5 text-[13px] text-foreground-600">
          <span className="text-base leading-none">{current.flag}</span>
          <span>{current.label}</span>
          <i className="ri-arrow-right-s-line text-foreground-400 text-base leading-none" />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-1 w-52 rounded-md border border-background-200 bg-background-50 shadow-lg py-1 overflow-hidden">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => select(l.code)}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-[13px] cursor-pointer whitespace-nowrap ${
                current.code === l.code ? 'bg-primary-50 text-primary-700' : 'text-foreground-700 hover:bg-background-100'
              }`}
            >
              <span className="text-base leading-none">{l.flag}</span>
              <span className="flex-1 text-left">{l.label}</span>
              {current.code === l.code && <i className="ri-check-line text-primary-600 text-[13px]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
