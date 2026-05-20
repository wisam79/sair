import { describe, it, expect } from 'vitest';
import {
  TripUpdateRequest,
  NotificationRequest,
  BookingRequest,
  CheckoutRequest,
  ZainCashWebhookRequest,
  LicenseSchema,
  retryWithBackoff,
  getErrorMessage,
} from './index';

const uuid = '123e4567-e89b-12d3-a456-426614174000';
const uuid2 = '223e4567-e89b-12d3-a456-426614174001';

describe('TripUpdateRequest (trip-engine RPC input)', () => {
  it('accepts valid trip update', () => {
    const result = TripUpdateRequest.safeParse({
      trip_id: uuid,
      new_status: 'driver_waiting',
      lat: 33.3152,
      lng: 44.3661,
    });
    expect(result.success).toBe(true);
  });

  it('accepts update without coordinates', () => {
    const result = TripUpdateRequest.safeParse({
      trip_id: uuid,
      new_status: 'cancelled',
    });
    expect(result.success).toBe(true);
  });

  it('accepts nullable coordinates', () => {
    const result = TripUpdateRequest.safeParse({
      trip_id: uuid,
      new_status: 'in_transit',
      lat: null,
      lng: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid trip_id', () => {
    const result = TripUpdateRequest.safeParse({
      trip_id: 'not-a-uuid',
      new_status: 'scheduled',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid status', () => {
    const result = TripUpdateRequest.safeParse({
      trip_id: uuid,
      new_status: 'invalid_status',
    });
    expect(result.success).toBe(false);
  });

  it('rejects out-of-range latitude', () => {
    const result = TripUpdateRequest.safeParse({
      trip_id: uuid,
      new_status: 'driver_waiting',
      lat: 91,
      lng: 44,
    });
    expect(result.success).toBe(false);
  });

  it('rejects out-of-range longitude', () => {
    const result = TripUpdateRequest.safeParse({
      trip_id: uuid,
      new_status: 'driver_waiting',
      lat: 33,
      lng: 181,
    });
    expect(result.success).toBe(false);
  });
});

describe('NotificationRequest (send-notification RPC input)', () => {
  it('accepts with target_user_id', () => {
    const result = NotificationRequest.safeParse({
      target_user_id: uuid,
      title: 'Trip Update',
      body: 'Your driver is arriving',
    });
    expect(result.success).toBe(true);
  });

  it('accepts with target_role', () => {
    const result = NotificationRequest.safeParse({
      target_role: 'student',
      title: 'Maintenance scheduled',
      body: 'System maintenance tonight',
    });
    expect(result.success).toBe(true);
  });

  it('accepts with both target_user_id and target_role', () => {
    const result = NotificationRequest.safeParse({
      target_user_id: uuid,
      target_role: 'driver',
      title: 'Trip update',
      body: 'Your trip is starting',
    });
    expect(result.success).toBe(true);
  });

  it('rejects without target_user_id or target_role', () => {
    const result = NotificationRequest.safeParse({
      title: 'Alert',
      body: 'Something happened',
    });
    expect(result.success).toBe(false);
  });
});

describe('BookingRequest (reserve_seat RPC input)', () => {
  it('accepts valid booking', () => {
    const result = BookingRequest.safeParse({
      route_id: uuid,
      student_id: uuid2,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing route_id', () => {
    const result = BookingRequest.safeParse({
      student_id: uuid2,
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing student_id', () => {
    const result = BookingRequest.safeParse({
      route_id: uuid,
    });
    expect(result.success).toBe(false);
  });
});

describe('CheckoutRequest (zaincash-checkout RPC input)', () => {
  it('accepts valid checkout', () => {
    const result = CheckoutRequest.safeParse({ route_id: uuid });
    expect(result.success).toBe(true);
  });

  it('rejects missing route_id', () => {
    const result = CheckoutRequest.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('LicenseSchema (activate_license RPC input)', () => {
  it('accepts 8-char code format', () => {
    const result = LicenseSchema.safeParse({
      id: uuid,
      batch_id: uuid,
      route_id: uuid,
      code: 'ABCD1234',
      status: 'active',
      valid_days: 30,
      created_at: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it('rejects code that is not 8 characters', () => {
    const result = LicenseSchema.safeParse({
      id: uuid,
      batch_id: uuid,
      route_id: uuid,
      code: 'TOOLONGCODE123',
      status: 'active',
      valid_days: 30,
      created_at: new Date().toISOString(),
    });
    expect(result.success).toBe(false);
  });
});

describe('ZainCashWebhookRequest', () => {
  it('accepts valid token', () => {
    const result = ZainCashWebhookRequest.safeParse({ token: 'abc123' });
    expect(result.success).toBe(true);
  });

  it('rejects empty token', () => {
    const result = ZainCashWebhookRequest.safeParse({ token: '' });
    expect(result.success).toBe(false);
  });
});

describe('retryWithBackoff', () => {
  it('retries on failure and succeeds', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      if (attempts < 3) throw new Error('fail');
      return 'success';
    };
    const result = await retryWithBackoff(fn, 3, 10);
    expect(result).toBe('success');
    expect(attempts).toBe(3);
  });

  it('throws after max retries', async () => {
    const fn = async () => {
      throw new Error('always fail');
    };
    await expect(retryWithBackoff(fn, 3, 10)).rejects.toThrow('always fail');
  });
});

describe('getErrorMessage', () => {
  it('returns message from Error instance', () => {
    expect(getErrorMessage(new Error('test error'))).toBe('test error');
  });

  it('returns string as-is', () => {
    expect(getErrorMessage('string error')).toBe('string error');
  });

  it('returns unknown for non-error objects', () => {
    expect(getErrorMessage(null)).toBe('An unknown error occurred');
    expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
  });
});
