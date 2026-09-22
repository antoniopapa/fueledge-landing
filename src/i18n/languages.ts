export type LanguageOption = {
  code: string;
  label: string;
  flag: string;
};

export const DEFAULT_LANGUAGE_CODE = 'en';

export const LANGUAGES: LanguageOption[] = [
  { code: 'bg', label: 'Български', flag: '🇧🇬' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
  { code: 'cz', label: 'Čeština', flag: '🇨🇿' },
];

export const LANGUAGE_STORAGE_KEY = 'fueledge-language';
