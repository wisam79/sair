import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://zpcvvyxtmxzplmojobbv.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

test.describe('Admin Dashboard Diagnostics & UX Review', () => {
  test.use({ extraHTTPHeaders: {} });
  let adminUserId: string | null = null;
  const adminEmail = `temp_admin_diag_${Math.random().toString(36).substring(7)}@sair.test`;
  const adminPassword = `AdminPass123!_${Math.random().toString(36).substring(7)}`;

  test.beforeAll(async () => {
    if (!serviceRoleKey) {
      console.warn('[DIAG] SUPABASE_SERVICE_ROLE_KEY not set. Using manual login check.');
      return;
    }

    console.log(`[DIAG] Creating temporary admin user: ${adminEmail}`);
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Create auth user with admin role
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      app_metadata: { role: 'admin' },
    });

    if (createError || !user) {
      throw new Error(`Failed to create temp admin user: ${createError?.message}`);
    }
    adminUserId = user.id;

    // 2. Insert into profiles table
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: 'System Diagnostic Admin',
      role: 'admin',
    });

    if (profileError) {
      console.error(`[DIAG] Warning: Profile creation failed: ${profileError.message}`);
    }
  });

  test.afterAll(async () => {
    if (!serviceRoleKey) return;
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    try {
      // Clean up any leftover System Diagnostic Admin profiles (by name pattern)
      const { data: diagProfiles } = await supabase
        .from('profiles')
        .select('id')
        .ilike('full_name', 'System Diagnostic Admin%');

      if (diagProfiles && diagProfiles.length > 0) {
        const diagIds = diagProfiles.map((p: { id: string }) => p.id);
        await supabase.from('profiles').delete().in('id', diagIds);
        for (const id of diagIds) {
          await supabase.auth.admin.deleteUser(id, true);
        }
      }

      // Also delete by tracked ID
      if (adminUserId) {
        console.log(`[DIAG] Cleaning up temporary admin user: ${adminEmail}`);
        await supabase.from('profiles').delete().eq('id', adminUserId);
        await supabase.auth.admin.deleteUser(adminUserId, true);
      }
    } catch (e: unknown) {
      console.warn('[DIAG] Cleanup error (non-fatal):', e instanceof Error ? e.message : String(e));
    }
  });


  test('Navigate consolidated pages, check load times, check console logs, and take screenshots', async ({ page }) => {
    test.setTimeout(240000); // 4 minutes to allow slow dev compilations in CI
    const reportDir = path.resolve(__dirname, '../../test-results/admin-diagnostic');
    fs.mkdirSync(reportDir, { recursive: true });

    const errors: string[] = [];
    const consoleWarnings: string[] = [];
    const loadTimes: Record<string, number> = {};

    // Catch page exceptions
    page.on('pageerror', (err) => {
      errors.push(`[BROWSER ERROR] ${err.message}`);
      console.error(`[BROWSER ERROR] ${err.message}`);
    });

    // Catch console messages
    page.on('console', (msg) => {
      const txt = msg.text();
      if (msg.type() === 'error') {
        errors.push(`[CONSOLE ERROR] ${txt}`);
        console.error(`[CONSOLE ERROR] ${txt}`);
      } else if (msg.type() === 'warning' && !txt.includes('import.meta')) {
        consoleWarnings.push(`[CONSOLE WARNING] ${txt}`);
      }
    });

    // 1. Visit Login
    console.log('[DIAG] Navigating to login...');
    const startTime = Date.now();
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    loadTimes['/login'] = Date.now() - startTime;
    await page.screenshot({ path: path.join(reportDir, '01_login.png') });

    // 2. Perform Login
    console.log('[DIAG] Typing credentials...');
    await page.fill('input[name="email"]', adminEmail);
    await page.fill('input[name="password"]', adminPassword);
    
    console.log('[DIAG] Clicking sign in...');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('http://localhost:3000/', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    console.log('[DIAG] Logged in successfully!');

    // 3. Visit Consolidated Pages
    const pagesToVisit = [
      { name: 'Dashboard', path: '/' },
      { name: 'Trips Hub', path: '/trips' },
      { name: 'Trips Archive Tab', path: '/trips?tab=archive' },
      { name: 'Users List', path: '/profiles' },
      { name: 'Drivers List', path: '/drivers' },
      { name: 'Institutions', path: '/institutions' },
      { name: 'Routes', path: '/routes' },
      { name: 'Subscriptions', path: '/subscriptions' },
      { name: 'Licenses Hub', path: '/licenses' },
      { name: 'License Batches Tab', path: '/licenses?tab=batches' },
      { name: 'Finance Hub', path: '/finance' },
      { name: 'Payouts Tab', path: '/finance?tab=payouts' },
      { name: 'Ratings Tab', path: '/finance?tab=ratings' },
      { name: 'System Diagnostics', path: '/system' },
      { name: 'Activity Log Tab', path: '/system?tab=logs' },
      { name: 'Settings Hub', path: '/settings' },
      { name: 'Feature Flags Tab', path: '/settings?tab=flags' },
      { name: 'Notifications Broadcast', path: '/notifications' },
    ];

    for (let i = 0; i < pagesToVisit.length; i++) {
      const p = pagesToVisit[i];
      const pageIndex = (i + 2).toString().padStart(2, '0');
      const filename = `${pageIndex}_${p.name.replace(/\s+/g, '_').toLowerCase()}.png`;

      console.log(`[DIAG] Visiting ${p.name} (${p.path})...`);
      const navStart = Date.now();
      await page.goto(`http://localhost:3000${p.path}`);
      await page.waitForLoadState('load');
      await page.waitForTimeout(1000); // Wait for animations
      loadTimes[p.path] = Date.now() - navStart - 1000; // subtract artificial delay

      await page.screenshot({ path: path.join(reportDir, filename), fullPage: true });
      console.log(`[DIAG] Successfully loaded ${p.name} in ${loadTimes[p.path]}ms`);
    }

    // Save diagnostic results to file
    const resultsPath = path.join(reportDir, 'diagnostics-summary.json');
    const results = {
      loadTimes,
      consoleErrors: errors,
      consoleWarnings,
      screenshotDirectory: reportDir,
    };
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`[DIAG] Diagnostics report saved to: ${resultsPath}`);

    // Expect no critical browser errors
    const criticalErrors = errors.filter(e => !e.includes('favicon.ico'));
    expect(criticalErrors.length).toBe(0);
  });
});
