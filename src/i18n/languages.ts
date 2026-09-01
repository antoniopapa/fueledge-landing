export type LanguageOption = {
  code: string;
  label: string;
  flag: string;
};

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
  { code: 'cz', label: 'Čeština', flag: '🇨🇿' },
  { code: 'bg', label: 'Български', flag: '🇧🇬' },
];

export const LANGUAGE_STORAGE_KEY = 'fueledge-language';