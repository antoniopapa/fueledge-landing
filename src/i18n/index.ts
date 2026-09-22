import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import messages from './local/index';
import { DEFAULT_LANGUAGE_CODE, LANGUAGES } from './languages';

const pathLanguage = window.location.pathname.split('/').filter(Boolean)[0];
const hasPathLanguage = LANGUAGES.some((language) => language.code === pathLanguage);
const initialLanguage = hasPathLanguage ? pathLanguage : DEFAULT_LANGUAGE_CODE;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE_CODE,
    debug: false,
    resources: messages,
    interpolation: {
      escapeValue: false,
    },
  });

document.documentElement.lang = i18n.language;

export default i18n;
