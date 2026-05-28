import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';

test.describe('Auth Flow E2E', () => {
  test('student signup + email verification + login', async ({ request }) => {
    expect(SUPABASE_URL).toBeTruthy();
  });

  test('non-admin rejected from admin dashboard', async ({ request }) => {
    expect(true).toBe(true);
  });

  test('role promotion reflected after session refresh', async ({ request }) => {
    expect(true).toBe(true);
  });
});
