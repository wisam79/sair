import { useTranslation as useReactI18n } from 'react-i18next';
import { useI18nStore } from './useStore';
import { Language } from '@sair/core';
import { useCallback, useEffect } from 'react';
import i18n from '../lib/i18n';

export function useTranslation() {
  const { t } = useReactI18n();
  const language = useI18nStore((state) => state.language);
  const setLanguageState = useI18nStore((state) => state.setLanguage);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang);
      i18n.changeLanguage(lang);
    },
    [setLanguageState],
  );

  const isRTL = language === 'ar';

  return { t, language, isRTL, setLanguage };
}
