import { useTranslation as useReactI18n } from 'react-i18next';
import { useI18nStore } from './useStore';
import { Language } from '@sair/core';
import { useCallback, useEffect } from 'react';
import { I18nManager, DevSettings } from 'react-native';
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
    async (lang: Language) => {
      const isRtl = lang === 'ar';
      const rtlStatusChanged = I18nManager.isRTL !== isRtl;

      setLanguageState(lang);
      await i18n.changeLanguage(lang);

      if (rtlStatusChanged) {
        I18nManager.allowRTL(isRtl);
        I18nManager.forceRTL(isRtl);

        // Wait a tiny bit for Zustand storage to persist before reload
        setTimeout(() => {
          try {
            DevSettings.reload();
          } catch (err) {
            console.error('[I18n] Failed to reload app after RTL change:', err);
          }
        }, 150);
      }
    },
    [setLanguageState],
  );

  const isRTL = language === 'ar';

  return { t, language, isRTL, setLanguage };
}
