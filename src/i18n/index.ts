import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import messages from './local/index';
import { DEFAULT_LANGUAGE_CODE, LANGUAGES, LANGUAGE_STORAGE_KEY } from './languages';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LANGUAGE_CODE,
    fallbackLng: DEFAULT_LANGUAGE_CODE,
    debug: false,
    resources: messages,
    interpolation: {
      escapeValue: false,
    },
  });

// Restore a previously selected language so switching persists across visits.
const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
if (stored && LANGUAGES.some((l) => l.code === stored)) {
  i18n.changeLanguage(stored);
}

export default i18n;
