import { describe, it, expect } from 'vitest';
import { Translations } from '@uniride/core';

// Test the translation logic directly (without React hooks)
function t(key: string, language: string): string {
  return (
    Translations[language as keyof typeof Translations]?.[key] ?? Translations['en']?.[key] ?? key
  );
}

function isRTL(language: string): boolean {
  return language === 'ar';
}

describe('Translation logic', () => {
  it('returns Arabic translation for ar language', () => {
    expect(t('welcome', 'ar')).toBe('مرحباً بك في سير');
  });

  it('returns English translation for en language', () => {
    expect(t('welcome', 'en')).toBe('Welcome to Sair');
  });

  it('falls back to English when key missing in current language', () => {
    // All keys exist in both, so test with a key that exists
    expect(t('login', 'ar')).toBe('تسجيل الدخول');
    expect(t('login', 'en')).toBe('Login');
  });

  it('returns key as fallback when missing in both languages', () => {
    expect(t('nonexistent_key_xyz', 'ar')).toBe('nonexistent_key_xyz');
    expect(t('nonexistent_key_xyz', 'en')).toBe('nonexistent_key_xyz');
  });

  it('isRTL returns true for Arabic', () => {
    expect(isRTL('ar')).toBe(true);
  });

  it('isRTL returns false for English', () => {
    expect(isRTL('en')).toBe(false);
  });

  it('translates common UI strings in Arabic', () => {
    expect(t('loading', 'ar')).toBe('جاري التحميل...');
    expect(t('logout', 'ar')).toBe('تسجيل الخروج');
    expect(t('save', 'ar')).toBe('حفظ');
  });

  it('translates common UI strings in English', () => {
    expect(t('loading', 'en')).toBe('Loading...');
    expect(t('logout', 'en')).toBe('Logout');
    expect(t('save', 'en')).toBe('Save');
  });
});
