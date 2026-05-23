import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Translations } from '@sair/core';
import adminAr from './locales/ar/admin.json';
import adminEn from './locales/en/admin.json';

const resources = {
  ar: {
    translation: {
      ...Translations.ar,
      ...adminAr,
    },
  },
  en: {
    translation: {
      ...Translations.en,
      ...adminEn,
    },
  },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: 'ar', // Default to Arabic
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
