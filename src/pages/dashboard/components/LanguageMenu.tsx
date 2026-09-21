import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEFAULT_LANGUAGE_CODE, LANGUAGES, LANGUAGE_STORAGE_KEY } from '@/i18n/languages';
import { pathForLanguage } from '@/i18n/urlLanguage';

export default function LanguageMenu() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current =
    LANGUAGES.find((l) => l.code === i18n.language) ??
    LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE_CODE) ??
    LANGUAGES[0];

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
    navigate(`${pathForLanguage(location.pathname, code)}${location.search}${location.hash}`);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-md border border-background-200 px-2.5 py-1.5 text-[12px] font-medium text-foreground-700 hover:bg-background-100 transition-colors cursor-pointer whitespace-nowrap"
        aria-label="Език"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <i className="ri-arrow-down-s-line text-[12px] leading-none" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-1 w-40 rounded-md border border-background-200 bg-background-50 shadow-lg py-1 overflow-hidden">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => select(l.code)}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-[12px] cursor-pointer whitespace-nowrap ${
                current.code === l.code ? 'bg-primary-50 text-primary-700' : 'text-foreground-700 hover:bg-background-100'
              }`}
            >
              <span className="text-sm leading-none">{l.flag}</span>
              <span className="flex-1 text-left">{l.label}</span>
              {current.code === l.code && <i className="ri-check-line text-primary-600 text-[13px]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
