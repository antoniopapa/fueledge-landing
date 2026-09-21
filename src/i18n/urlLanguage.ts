import { LANGUAGES } from './languages';

const languageCodes = new Set(LANGUAGES.map((language) => language.code));

export const HOME_MENU_ITEMS = [
  { key: 'navSourcing', href: '#how-it-works' },
  { key: 'navPlatform', href: '#product' },
  { key: 'navSavings', href: '#impact' },
] as const;

export function languageFromPath(pathname: string) {
  const [pathLanguage] = pathname.split('/').filter(Boolean);
  return pathLanguage && languageCodes.has(pathLanguage) ? pathLanguage : undefined;
}

export function pathForLanguage(pathname: string, languageCode: string) {
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length > 0 && languageCodes.has(parts[0])) {
    parts[0] = languageCode;
  } else {
    parts.unshift(languageCode);
  }

  return `/${parts.join('/')}`;
}
