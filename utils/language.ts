export type Language = 'en' | 'ur';

export const translations = {
  en: {
    home: 'Home',
    language: 'Language',
  },

  ur: {
    home: 'ہوم',
    language: 'زبان',
  },
};

export function t(
  key: keyof typeof translations.en,
  language: Language
) {
  return translations[language][key];
}