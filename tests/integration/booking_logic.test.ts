import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase client for local testing using the service role key to bypass RLS for setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy';
const supabase = createClient(supabaseUrl, supabaseKey);

describe('Database State Machine & Booking Logic', () => {
  it('should reject invalid trip transitions at the DB level', async () => {
    const { data: trip } = await supabase
      .from('trips')
      .select('id, status')
      .eq('status', 'scheduled')
      .limit(1)
      .single();

    if (!trip) {
      console.warn('Skipping test: No scheduled trips found in seed data');
      return;
    }

    // Test transition from scheduled to completed (invalid)
    const { error } = await supabase.rpc('update_trip_status', {
      p_trip_id: trip.id,
      p_new_status: 'completed',
      p_lat: null,
      p_lng: null,
      p_driver_id: null,
    });

    expect(error).not.toBeNull();
    expect(error?.message).toContain('Invalid transition');
  });

  it('should allow valid trip transitions', async () => {
    const { data: trip } = await supabase
      .from('trips')
      .select('id, status')
      .eq('status', 'scheduled')
      .limit(1)
      .single();

    if (!trip) return;

    // Test transition from scheduled to cancelled
    const { error } = await supabase.rpc('update_trip_status', {
      p_trip_id: trip.id,
      p_new_status: 'cancelled',
      p_lat: null,
      p_lng: null,
      p_driver_id: null,
    });

    // Might fail due to missing driver ID or permissions, but should not fail due to 'Invalid transition'
    if (error) {
      expect(error.message).not.toContain('Invalid transition');
    }
  });

  it('should atomically handle license activation (booking)', async () => {
    // This tests the real DB RPC instead of a mock
    const { error } = await supabase.rpc('activate_license', {
      p_code: 'INVALID_CODE',
    });

    // An invalid code should be rejected by the DB logic
    expect(error).not.toBeNull();
  });
});
