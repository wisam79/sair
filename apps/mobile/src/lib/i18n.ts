import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Translations } from '@sair/core';

i18n.use(initReactI18next).init({
  resources: {
    ar: {
      translation: Translations.ar,
    },
    en: {
      translation: Translations.en,
    },
  },
  lng: 'ar', // Default language, will be synced with store on startup
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React Native handles escaping automatically
  },
});

export default i18n;
