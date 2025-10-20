import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

// Languages to support
export const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'hu', name: 'Magyar' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt', name: 'Português' },
  { code: 'ro', name: 'Română' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'sv', name: 'Svenska' },
  { code: 'da', name: 'Dansk' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
];

// Initialize i18next
i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
      requestOptions: {
        cache: 'no-store'
      }
    },
    react: {
      useSuspense: false,
    },
    load: 'languageOnly',
    supportedLngs: ['en', 'de', 'fr', 'it', 'hu', 'pl', 'pt', 'ro'],
  });

export default i18n;