import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env file if running in local/test environment
try {
  const envPath = path.resolve(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    for (const line of envConfig.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value.trim();
        }
      }
    }
  }
} catch (e) {
  console.warn('Failed to load .env file in test-helpers:', e);
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zpcvvyxtmxzplmojobbv.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isDBAvailable(): boolean {
  return !!serviceRoleKey;
}

export function createServiceClient(): SupabaseClient {
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for integration tests');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Keep track of created user IDs to delete them in cleanup
const createdUserIds: string[] = [];

export async function createAuthenticatedClient(role: 'student' | 'driver' | 'admin'): Promise<{
  client: SupabaseClient;
  user: { id: string; email: string };
}> {
  const serviceClient = createServiceClient();
  const randomId = Math.random().toString(36).substring(2, 10);
  const email = `test_user_${role}_${randomId}@sair.test`;
  const password = `Password123!_${randomId}`;

  // 1. Create user using service role admin API
  const {
    data: { user },
    error: createError,
  } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role },
  });

  if (createError || !user) {
    throw new Error(`Failed to create test user for role ${role}: ${createError?.message}`);
  }

  createdUserIds.push(user.id);

  // 2. Ensure profile exists and has the correct role
  const phone = `+96478${Math.floor(10000000 + Math.random() * 90000000)}`;
  const { error: profileError } = await serviceClient.from('profiles').upsert({
    id: user.id,
    full_name: `Test ${role} ${randomId}`,
    phone: role === 'driver' ? phone : null,
    role,
  });

  if (profileError) {
    console.error(`Warning: Profile creation failed for test user: ${profileError.message}`);
  }

  // If driver role, we also need to insert into drivers table
  if (role === 'driver') {
    const randomLicense = `LIC-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomPlate = `PLT-${Math.floor(100000 + Math.random() * 900000)}`;
    const { error: driverError } = await serviceClient.from('drivers').upsert({
      user_id: user.id,
      is_verified: true,
      license_number: randomLicense,
      vehicle_model: 'Toyota Coaster Test',
      vehicle_plate: randomPlate,
      capacity: 10,
    });
    if (driverError) {
      console.error(`Warning: Driver profile creation failed: ${driverError.message}`);
    }
  }

  // 3. Create a client instance and sign in
  const userClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error: signInError } = await userClient.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    throw new Error(`Failed to sign in test user: ${signInError.message}`);
  }

  return { client: userClient, user: { id: user.id, email } };
}

export async function cleanupTestData() {
  if (createdUserIds.length === 0) return;
  const serviceClient = createServiceClient();

  for (const userId of createdUserIds) {
    try {
      await serviceClient.auth.admin.deleteUser(userId);
    } catch (err) {
      console.error(`Failed to delete test user ${userId}:`, err);
    }
  }
  createdUserIds.length = 0;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
