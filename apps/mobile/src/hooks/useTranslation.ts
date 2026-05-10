import { Translations, Language } from '@uniride/core';
import { useI18nStore } from './useStore';

export function useTranslation() {
  const { language } = useI18nStore();

  const t = (key: string): string => {
    return Translations[language]?.[key] ?? Translations['en']?.[key] ?? key;
  };

  const isRTL = language === 'ar';

  return { t, language, isRTL, setLanguage: useI18nStore.getState().setLanguage };
}
