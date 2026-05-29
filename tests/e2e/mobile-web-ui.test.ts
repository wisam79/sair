import { test, expect, request as playwrightRequest, Browser } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/** Zustand persist keys to clear before each test */
const STORE_KEYS = ['auth-storage', 'trip-storage', 'booking-storage', 'i18n-storage'];

/**
 * Finds the Expo Web Dev Server by:
 * 1. Quick HTTP check for Expo HTML markers on ports 8081-8083
 * 2. Actually loading the page in a real browser to verify it renders content
 *
 * Returns the base URL (e.g. "http://localhost:8082") or null if not found.
 */
async function findExpoWebUrl(browser: Browser): Promise<string | null> {
  const ports = [8081, 8082, 8083];
  const diagDir = 'test-results/expo-detection';
  fs.mkdirSync(diagDir, { recursive: true });

  for (const port of ports) {
    const url = `http://localhost:${port}`;
    let page = null;
    try {
      // Step 1: Quick HTTP check
      const ctx = await playwrightRequest.newContext();
      const res = await ctx.get(`${url}/`, { timeout: 3000 });
      const body = await res.text();
      await ctx.dispose();

      const looksLikeExpo =
        res.status() < 500 &&
        (body.includes('expo-') ||
          body.includes('_expo') ||
          body.includes('bundle?platform=web') ||
          body.includes('index.bundle'));

      if (!looksLikeExpo) {
        console.log(`[E2E] Port ${port}: not an Expo server (status=${res.status()})`);
        continue;
      }
      console.log(`[E2E] Port ${port}: Expo HTML markers found — verifying with browser...`);

      // Step 2: Open in a real browser to verify rendering
      page = await browser.newPage();
      page.on('pageerror', (err) => {
        console.log(`[BROWSER ERROR] Port ${port}: ${err.message}`);
        console.log(
          `[BROWSER ERROR DETAILS] Port ${port}: filename=${(err as any).filename}, line=${(err as any).lineno}, col=${(err as any).colno}`,
        );
        if (err.stack) console.log(`[BROWSER ERROR STACK] Port ${port}: ${err.stack}`);
      });
      page.on('console', (msg) =>
        console.log(`[BROWSER CONSOLE] Port ${port}: [${msg.type()}] ${msg.text()}`),
      );
      await page.setViewportSize({ width: 393, height: 852 });

      // Clear Zustand stores so we start fresh
      await page.addInitScript(() => {
        ['auth-storage', 'trip-storage', 'booking-storage', 'i18n-storage'].forEach((k) =>
          localStorage.removeItem(k),
        );
      });

      await page.goto(`${url}/`);
      await page.waitForLoadState('networkidle').catch(() => {});

      // Take diagnostic screenshot to see what the app shows
      const diagScreenshot = path.join(diagDir, `port-${port}.png`);
      await page.screenshot({ path: diagScreenshot, fullPage: true });

      const visibleText = await page.evaluate(() => document.body.innerText.trim());
      const allText = await page.evaluate(() => document.body.textContent?.trim() ?? '');
      console.log(
        `[E2E] Port ${port}: visibleText.length=${visibleText.length}, allText.length=${allText.length}`,
      );
      if (visibleText.length > 0) {
        console.log(`[E2E] Port ${port}: first 120 chars = "${visibleText.slice(0, 120)}"`);
      }
      await page.close();
      page = null;

      if (visibleText.length > 5) {
        console.log(`[E2E] ✅ Using Expo Web server on port ${port}`);
        return url;
      } else {
        console.log(
          `[E2E] Port ${port}: blank page — screenshot at ${diagScreenshot} — trying next port`,
        );
      }
    } catch (err) {
      console.log(`[E2E] Port ${port}: error — ${err}`);
      if (page) await page.close().catch(() => {});
    }
  }
  return null;
}

let EXPO_BASE_URL: string | null = null;

test.describe('Mobile App Web UI E2E Tests', () => {
  test.beforeAll(async ({ browser }) => {
    EXPO_BASE_URL = await findExpoWebUrl(browser);
    if (!EXPO_BASE_URL) {
      console.log(
        '\n[SKIP] No rendering Expo Web server found on ports 8081-8083.\n' +
          '       To run UI tests, start the Expo web server:\n' +
          '         cd apps/mobile && npx expo start --web\n',
      );
    } else {
      console.log(`[E2E] UI tests will run against: ${EXPO_BASE_URL}`);
    }
  });

  test.beforeEach(async ({ page }, testInfo) => {
    if (!EXPO_BASE_URL) {
      testInfo.skip();
      return;
    }

    // Suppress known Expo/Metro bundler import.meta warnings
    page.on('pageerror', (exception) => {
      if (!exception.message.includes('import.meta')) {
        console.error(`[BROWSER ERROR] ${exception.message}`);
      }
    });

    // Mobile viewport (iPhone 14 Pro)
    await page.setViewportSize({ width: 393, height: 852 });

    // Clear Zustand stores BEFORE page loads → hasSeenOnboarding resets to false
    await page.addInitScript(() => {
      ['auth-storage', 'trip-storage', 'booking-storage', 'i18n-storage'].forEach((k) =>
        localStorage.removeItem(k),
      );
    });

    await page.goto(EXPO_BASE_URL!);
    await page.waitForLoadState('networkidle').catch(() => {});
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus && testInfo.status !== 'skipped') {
      const screenshotPath = `test-results/screenshot-${testInfo.title.replace(/\s+/g, '_')}.png`;
      await page.screenshot({ path: screenshotPath });
      console.log(`[TEST DEBUG] Screenshot: ${screenshotPath}`);
    }
  });

  test('should complete the onboarding flow and reach the login screen', async ({ page }) => {
    // Allow extra time for Metro bundler first load
    const skipButton = page.locator('text=Skip').or(page.locator('text=تخطي'));
    await expect(skipButton).toBeVisible({ timeout: 30000 });

    const nextButton = page.locator('text=Next').or(page.locator('text=التالي'));
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    await page.waitForTimeout(500);
    await nextButton.click();

    const getStartedButton = page.locator('text=Get Started').or(page.locator('text=ابدأ الآن'));
    await expect(getStartedButton).toBeVisible({ timeout: 5000 });
    await getStartedButton.click();

    // Verify login screen appears
    const loginHeading = page.locator('text=Login').or(page.locator('text=تسجيل الدخول')).first();
    await expect(loginHeading).toBeVisible({ timeout: 10000 });

    const googleButton = page
      .locator('text=Sign in with Google')
      .or(page.locator('text=Google'))
      .or(page.locator('text=الدخول بواسطة جوجل'))
      .or(page.locator('text=جوجل'))
      .first();
    await expect(googleButton).toBeVisible();
  });

  test('should allow user to skip onboarding directly to login', async ({ page }) => {
    const skipButton = page.locator('text=Skip').or(page.locator('text=تخطي'));
    await expect(skipButton).toBeVisible({ timeout: 30000 });
    await skipButton.click();

    const loginHeading = page.locator('text=Login').or(page.locator('text=تسجيل الدخول')).first();
    await expect(loginHeading).toBeVisible({ timeout: 10000 });
  });
});
