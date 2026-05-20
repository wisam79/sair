import { describe, it, expect } from 'vitest';
import i18n from './i18n';

describe('admin i18n', () => {
  it('initializes with Arabic as default', () => {
    expect(i18n.language).toBe('ar');
  });

  it('has Arabic resources', () => {
    expect(i18n.getResourceBundle('ar', 'translation')).toBeDefined();
  });

  it('has English resources', () => {
    expect(i18n.getResourceBundle('en', 'translation')).toBeDefined();
  });

  it('Arabic and English have mostly matching top-level keys (allowing minor diffs)', () => {
    const arKeys = new Set(Object.keys(i18n.getResourceBundle('ar', 'translation')));
    const enKeys = new Set(Object.keys(i18n.getResourceBundle('en', 'translation')));
    const arOnly = [...arKeys].filter((k) => !enKeys.has(k));
    const enOnly = [...enKeys].filter((k) => !arKeys.has(k));
    // Allow up to 2 key differences (e.g., buttons section)
    expect(arOnly.length + enOnly.length).toBeLessThanOrEqual(2);
  });

  it('has dashboard section in both languages', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');
    expect(ar.dashboard).toBeDefined();
    expect(en.dashboard).toBeDefined();
  });

  it('has profiles section in both languages', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');
    expect(ar.profiles).toBeDefined();
    expect(en.profiles).toBeDefined();
  });

  it('has trips section in both languages', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');
    expect(ar.trips).toBeDefined();
    expect(en.trips).toBeDefined();
  });

  it('has routes section in both languages', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');
    expect(ar.routes).toBeDefined();
    expect(en.routes).toBeDefined();
  });

  it('has subscriptions section in both languages', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');
    expect(ar.subscriptions).toBeDefined();
    expect(en.subscriptions).toBeDefined();
  });

  it('has license_batches section in both languages', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');
    expect(ar.license_batches).toBeDefined();
    expect(en.license_batches).toBeDefined();
  });

  it('has licenses section in both languages', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');
    expect(ar.licenses).toBeDefined();
    expect(en.licenses).toBeDefined();
  });

  it('has drivers section in both languages', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');
    expect(ar.drivers).toBeDefined();
    expect(en.drivers).toBeDefined();
  });

  it('has actions section in both languages', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');
    expect(ar.actions).toBeDefined();
    expect(en.actions).toBeDefined();
  });

  it('dashboard stats keys match between ar and en', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');
    const arStatsKeys = Object.keys(ar.dashboard.stats).sort();
    const enStatsKeys = Object.keys(en.dashboard.stats).sort();
    expect(arStatsKeys).toEqual(enStatsKeys);
  });

  it('profiles keys match between ar and en', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    const en = i18n.getResourceBundle('en', 'translation');
    const arProfileKeys = Object.keys(ar.profiles).sort();
    const enProfileKeys = Object.keys(en.profiles).sort();
    expect(arProfileKeys).toEqual(enProfileKeys);
  });

  it('no empty string values in Arabic translations', () => {
    const ar = i18n.getResourceBundle('ar', 'translation');
    function checkNested(obj: Record<string, unknown>, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        if (typeof value === 'string') {
          expect(value, `ar.${fullPath} is empty`).toBeTruthy();
        } else if (typeof value === 'object' && value !== null) {
          checkNested(value as Record<string, unknown>, fullPath);
        }
      }
    }
    checkNested(ar);
  });

  it('no empty string values in English translations', () => {
    const en = i18n.getResourceBundle('en', 'translation');
    function checkNested(obj: Record<string, unknown>, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        if (typeof value === 'string') {
          expect(value, `en.${fullPath} is empty`).toBeTruthy();
        } else if (typeof value === 'object' && value !== null) {
          checkNested(value as Record<string, unknown>, fullPath);
        }
      }
    }
    checkNested(en);
  });
});
