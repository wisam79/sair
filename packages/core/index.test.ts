import { describe, it, expect, vi } from 'vitest';
import {
  canTransition,
  TripStatus,
  ValidTransitions,
  RouteSchema,
  RatingSchema,
  TripSchema,
  ProfileSchema,
  LicenseSchema,
  LicenseBatchSchema,
  SubscriptionSchema,
  GeoCoordinates,
  Translations,
  InstitutionSchema,
  DriverPayoutSchema,
  DriverPayoutStatus,
  LoginSchema,
  SignupSchema,
  UserRole,
  SubscriptionStatus,
  LicenseStatus,
  Languages,
  MoneyAmount,
  BookingRequest,
  CheckoutRequest,
  NotificationRequest,
  ZainCashWebhookRequest,
  TripUpdateRequest,
  getErrorMessage,
  retryWithBackoff,
} from './index';

// ─── State Machine ─────────────────────────────────────────────────────────────

describe('canTransition', () => {
  it('allows scheduled → driver_waiting', () => {
    expect(canTransition('scheduled', 'driver_waiting')).toBe(true);
  });

  it('allows scheduled → absent', () => {
    expect(canTransition('scheduled', 'absent')).toBe(true);
  });

  it('allows scheduled → cancelled', () => {
    expect(canTransition('scheduled', 'cancelled')).toBe(true);
  });

  it('allows driver_waiting → in_transit', () => {
    expect(canTransition('driver_waiting', 'in_transit')).toBe(true);
  });

  it('allows driver_waiting → absent', () => {
    expect(canTransition('driver_waiting', 'absent')).toBe(true);
  });

  it('allows driver_waiting → cancelled', () => {
    expect(canTransition('driver_waiting', 'cancelled')).toBe(true);
  });

  it('allows in_transit → completed', () => {
    expect(canTransition('in_transit', 'completed')).toBe(true);
  });

  it('allows in_transit → cancelled', () => {
    expect(canTransition('in_transit', 'cancelled')).toBe(true);
  });

  it('allows in_transit → absent', () => {
    expect(canTransition('in_transit', 'absent')).toBe(false);
  });

  it('rejects scheduled → completed (skip steps)', () => {
    expect(canTransition('scheduled', 'completed')).toBe(false);
  });

  it('rejects scheduled → in_transit (skip steps)', () => {
    expect(canTransition('scheduled', 'in_transit')).toBe(false);
  });

  it('rejects completed → any (terminal state)', () => {
    const statuses: TripStatus[] = [
      'scheduled',
      'driver_waiting',
      'in_transit',
      'absent',
      'cancelled',
    ];
    statuses.forEach((s) => {
      expect(canTransition('completed', s)).toBe(false);
    });
  });

  it('rejects absent → any except cancelled', () => {
    const statuses: TripStatus[] = ['scheduled', 'driver_waiting', 'in_transit', 'completed'];
    statuses.forEach((s) => {
      expect(canTransition('absent', s)).toBe(false);
    });
  });

  it('allows absent → cancelled', () => {
    expect(canTransition('absent', 'cancelled')).toBe(true);
  });

  it('rejects cancelled → any (terminal state)', () => {
    const statuses: TripStatus[] = [
      'scheduled',
      'driver_waiting',
      'in_transit',
      'completed',
      'absent',
    ];
    statuses.forEach((s) => {
      expect(canTransition('cancelled', s)).toBe(false);
    });
  });

  it('rejects unknown status gracefully', () => {
    expect(canTransition('unknown' as TripStatus, 'completed')).toBe(false);
  });
});

describe('ValidTransitions completeness', () => {
  it('covers all TripStatus values as keys', () => {
    const allStatuses: TripStatus[] = [
      'scheduled',
      'driver_waiting',
      'in_transit',
      'completed',
      'absent',
      'cancelled',
    ];
    allStatuses.forEach((s) => {
      expect(ValidTransitions).toHaveProperty(s);
      expect(Array.isArray(ValidTransitions[s])).toBe(true);
    });
  });
});

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const uuid = '123e4567-e89b-12d3-a456-426614174000';
const uuid2 = '223e4567-e89b-12d3-a456-426614174001';
const uuid3 = '323e4567-e89b-12d3-a456-426614174002';
const uuid4 = '423e4567-e89b-12d3-a456-426614174003';
const now = new Date().toISOString();

describe('RouteSchema', () => {
  const validRoute = {
    id: uuid,
    driver_id: uuid2,
    title: 'Baghdad → University',
    start_location: 'Baghdad',
    end_location: 'University of Baghdad',
    price: 5000,
    capacity: 20,
    available_seats: 15,
    is_active: true,
  };

  it('accepts a valid route', () => {
    expect(() => RouteSchema.parse(validRoute)).not.toThrow();
  });

  it('rejects negative price', () => {
    expect(() => RouteSchema.parse({ ...validRoute, price: -1 })).toThrow();
  });

  it('rejects zero capacity', () => {
    expect(() => RouteSchema.parse({ ...validRoute, capacity: 0 })).toThrow();
  });

  it('rejects empty title', () => {
    expect(() => RouteSchema.parse({ ...validRoute, title: '' })).toThrow();
  });
});

describe('RatingSchema', () => {
  const validRating = {
    id: uuid,
    trip_id: uuid2,
    student_id: uuid3,
    driver_id: uuid4,
    rating: 4,
    created_at: now,
  };

  it('accepts rating 1–5', () => {
    [1, 2, 3, 4, 5].forEach((r) => {
      expect(() => RatingSchema.parse({ ...validRating, rating: r })).not.toThrow();
    });
  });

  it('rejects rating 0', () => {
    expect(() => RatingSchema.parse({ ...validRating, rating: 0 })).toThrow();
  });

  it('rejects rating 6', () => {
    expect(() => RatingSchema.parse({ ...validRating, rating: 6 })).toThrow();
  });

  it('rejects non-integer rating', () => {
    expect(() => RatingSchema.parse({ ...validRating, rating: 3.5 })).toThrow();
  });
});

describe('GeoCoordinates', () => {
  it('accepts valid coordinates', () => {
    expect(() => GeoCoordinates.parse({ lat: 33.3152, lng: 44.3661 })).not.toThrow();
  });

  it('rejects lat > 90', () => {
    expect(() => GeoCoordinates.parse({ lat: 91, lng: 44 })).toThrow();
  });

  it('rejects lat < -90', () => {
    expect(() => GeoCoordinates.parse({ lat: -91, lng: 44 })).toThrow();
  });

  it('rejects lng > 180', () => {
    expect(() => GeoCoordinates.parse({ lat: 33, lng: 181 })).toThrow();
  });

  it('rejects lng < -180', () => {
    expect(() => GeoCoordinates.parse({ lat: 33, lng: -181 })).toThrow();
  });
});

describe('ProfileSchema', () => {
  const validProfile = {
    id: uuid,
    full_name: 'Ahmed Ali',
    phone: '07701234567',
    role: 'student' as const,
    institution_id: null,
    is_verified: false,
    created_at: now,
    updated_at: now,
  };

  it('accepts valid profile', () => {
    expect(() => ProfileSchema.parse(validProfile)).not.toThrow();
  });

  it('rejects invalid role', () => {
    expect(() => ProfileSchema.parse({ ...validProfile, role: 'superuser' })).toThrow();
  });

  it('rejects empty full_name', () => {
    expect(() => ProfileSchema.parse({ ...validProfile, full_name: '' })).toThrow();
  });
});

describe('LicenseSchema', () => {
  const validLicense = {
    id: uuid,
    batch_id: uuid2,
    route_id: uuid3,
    code: 'ABCD1234',
    status: 'available' as const,
    valid_days: 30,
    created_at: now,
  };

  it('accepts valid license', () => {
    expect(() => LicenseSchema.parse(validLicense)).not.toThrow();
  });

  it('rejects code length != 8', () => {
    expect(() => LicenseSchema.parse({ ...validLicense, code: 'ABCD123' })).toThrow();
    expect(() => LicenseSchema.parse({ ...validLicense, code: 'ABCD12345' })).toThrow();
  });

  it('rejects invalid status', () => {
    expect(() => LicenseSchema.parse({ ...validLicense, status: 'pending' })).toThrow();
  });

  it('rejects valid_days < 1', () => {
    expect(() => LicenseSchema.parse({ ...validLicense, valid_days: 0 })).toThrow();
  });
});

describe('SubscriptionSchema', () => {
  const validSub = {
    id: uuid,
    student_id: uuid2,
    route_id: uuid3,
    status: 'active' as const,
    start_date: now,
    end_date: now,
    created_at: now,
  };

  it('accepts valid subscription', () => {
    expect(() => SubscriptionSchema.parse(validSub)).not.toThrow();
  });

  it('rejects invalid status', () => {
    expect(() => SubscriptionSchema.parse({ ...validSub, status: 'unknown' })).toThrow();
  });
});

// ─── i18n ──────────────────────────────────────────────────────────────────────

describe('Translations', () => {
  it('has both ar and en', () => {
    expect(Translations).toHaveProperty('ar');
    expect(Translations).toHaveProperty('en');
  });

  it('ar and en have the same keys', () => {
    const arKeys = Object.keys(Translations.ar).sort();
    const enKeys = Object.keys(Translations.en).sort();
    expect(arKeys).toEqual(enKeys);
  });

  it('no empty translation values', () => {
    Object.entries(Translations.ar).forEach(([key, value]) => {
      expect(value, `ar.${key} is empty`).toBeTruthy();
    });
    Object.entries(Translations.en).forEach(([key, value]) => {
      expect(value, `en.${key} is empty`).toBeTruthy();
    });
  });
});

// ─── InstitutionSchema ─────────────────────────────────────────────────────────

describe('InstitutionSchema', () => {
  const validInstitution = {
    id: uuid,
    name: 'University of Baghdad',
    city: 'Baghdad',
    created_at: now,
  };

  it('accepts valid institution', () => {
    expect(() => InstitutionSchema.parse(validInstitution)).not.toThrow();
  });

  it('accepts institution with null city', () => {
    expect(() => InstitutionSchema.parse({ ...validInstitution, city: null })).not.toThrow();
  });

  it('accepts institution without city', () => {
    const { city, ...rest } = validInstitution;
    expect(() => InstitutionSchema.parse(rest)).not.toThrow();
  });

  it('rejects empty name', () => {
    expect(() => InstitutionSchema.parse({ ...validInstitution, name: '' })).toThrow();
  });

  it('rejects invalid uuid', () => {
    expect(() => InstitutionSchema.parse({ ...validInstitution, id: 'not-a-uuid' })).toThrow();
  });

  it('rejects missing created_at', () => {
    const { created_at, ...rest } = validInstitution;
    expect(() => InstitutionSchema.parse(rest)).toThrow();
  });
});

// ─── LicenseBatchSchema ────────────────────────────────────────────────────────

describe('LicenseBatchSchema', () => {
  const validBatch = {
    id: uuid,
    created_by: uuid2,
    route_id: uuid3,
    batch_name: 'May 2026 Batch',
    quantity: 50,
    price: 25000,
    valid_days: 30,
    created_at: now,
  };

  it('accepts valid batch', () => {
    expect(() => LicenseBatchSchema.parse(validBatch)).not.toThrow();
  });

  it('rejects quantity < 1', () => {
    expect(() => LicenseBatchSchema.parse({ ...validBatch, quantity: 0 })).toThrow();
  });

  it('rejects negative price', () => {
    expect(() => LicenseBatchSchema.parse({ ...validBatch, price: -100 })).toThrow();
  });

  it('accepts zero price (free batch)', () => {
    expect(() => LicenseBatchSchema.parse({ ...validBatch, price: 0 })).not.toThrow();
  });

  it('rejects valid_days < 1', () => {
    expect(() => LicenseBatchSchema.parse({ ...validBatch, valid_days: 0 })).toThrow();
  });

  it('rejects non-integer quantity', () => {
    expect(() => LicenseBatchSchema.parse({ ...validBatch, quantity: 1.5 })).toThrow();
  });

  it('rejects non-integer valid_days', () => {
    expect(() => LicenseBatchSchema.parse({ ...validBatch, valid_days: 30.5 })).toThrow();
  });
});

// ─── DriverPayoutSchema ────────────────────────────────────────────────────────

describe('DriverPayoutSchema', () => {
  const validPayout = {
    id: uuid,
    driver_id: uuid2,
    amount: 150000,
    status: 'pending' as const,
    reference_note: 'Monthly payout',
    created_at: now,
    updated_at: now,
  };

  it('accepts valid payout', () => {
    expect(() => DriverPayoutSchema.parse(validPayout)).not.toThrow();
  });

  it('accepts payout without reference_note', () => {
    const { reference_note, ...rest } = validPayout;
    expect(() => DriverPayoutSchema.parse(rest)).not.toThrow();
  });

  it('accepts payout with null reference_note', () => {
    expect(() => DriverPayoutSchema.parse({ ...validPayout, reference_note: null })).not.toThrow();
  });

  it('rejects amount < 0.01', () => {
    expect(() => DriverPayoutSchema.parse({ ...validPayout, amount: 0 })).toThrow();
  });

  it('rejects invalid status', () => {
    expect(() => DriverPayoutSchema.parse({ ...validPayout, status: 'unknown' })).toThrow();
  });

  it('accepts all valid statuses', () => {
    const statuses: DriverPayoutStatus[] = ['pending', 'completed', 'rejected'];
    statuses.forEach((s) => {
      expect(() => DriverPayoutSchema.parse({ ...validPayout, status: s })).not.toThrow();
    });
  });
});

// ─── LoginSchema ───────────────────────────────────────────────────────────────

describe('LoginSchema', () => {
  it('accepts valid login', () => {
    expect(() =>
      LoginSchema.parse({ email: 'user@test.com', password: 'password123' }),
    ).not.toThrow();
  });

  it('rejects invalid email', () => {
    expect(() => LoginSchema.parse({ email: 'not-an-email', password: 'password123' })).toThrow();
  });

  it('rejects password < 6 chars', () => {
    expect(() => LoginSchema.parse({ email: 'user@test.com', password: 'short' })).toThrow();
  });

  it('rejects empty email', () => {
    expect(() => LoginSchema.parse({ email: '', password: 'password123' })).toThrow();
  });

  it('rejects empty password', () => {
    expect(() => LoginSchema.parse({ email: 'user@test.com', password: '' })).toThrow();
  });

  it('accepts minimum length password (6 chars)', () => {
    expect(() => LoginSchema.parse({ email: 'user@test.com', password: '123456' })).not.toThrow();
  });
});

// ─── SignupSchema ──────────────────────────────────────────────────────────────

describe('SignupSchema', () => {
  const validSignup = {
    email: 'user@test.com',
    password: 'password123',
    full_name: 'Ahmed Ali',
  };

  it('accepts valid signup', () => {
    expect(() => SignupSchema.parse(validSignup)).not.toThrow();
  });

  it('rejects full_name < 3 chars', () => {
    expect(() => SignupSchema.parse({ ...validSignup, full_name: 'Al' })).toThrow();
  });

  it('inherits email validation from LoginSchema', () => {
    expect(() => SignupSchema.parse({ ...validSignup, email: 'bad' })).toThrow();
  });

  it('inherits password validation from LoginSchema', () => {
    expect(() => SignupSchema.parse({ ...validSignup, password: 'short' })).toThrow();
  });
});

// ─── Enum Schemas ──────────────────────────────────────────────────────────────

describe('UserRole', () => {
  it('accepts admin', () => {
    expect(UserRole.parse('admin')).toBe('admin');
  });

  it('accepts student', () => {
    expect(UserRole.parse('student')).toBe('student');
  });

  it('accepts driver', () => {
    expect(UserRole.parse('driver')).toBe('driver');
  });

  it('rejects unknown role', () => {
    expect(() => UserRole.parse('superuser')).toThrow();
  });
});

describe('SubscriptionStatus', () => {
  it('accepts all valid statuses', () => {
    const statuses: Array<'pending' | 'active' | 'expired' | 'cancelled'> = [
      'pending',
      'active',
      'expired',
      'cancelled',
    ];
    statuses.forEach((s) => {
      expect(SubscriptionStatus.parse(s)).toBe(s);
    });
  });

  it('rejects unknown status', () => {
    expect(() => SubscriptionStatus.parse('unknown')).toThrow();
  });
});

describe('LicenseStatus', () => {
  it('accepts all valid statuses', () => {
    const statuses: Array<
      'available' | 'reserved' | 'payment_hold' | 'used' | 'expired' | 'revoked'
    > = ['available', 'reserved', 'payment_hold', 'used', 'expired', 'revoked'];
    statuses.forEach((s) => {
      expect(LicenseStatus.parse(s)).toBe(s);
    });
  });

  it('rejects unknown status', () => {
    expect(() => LicenseStatus.parse('pending')).toThrow();
  });
});

describe('Languages', () => {
  it('accepts ar', () => {
    expect(Languages.parse('ar')).toBe('ar');
  });

  it('accepts en', () => {
    expect(Languages.parse('en')).toBe('en');
  });

  it('rejects unknown language', () => {
    expect(() => Languages.parse('fr')).toThrow();
  });
});

// ─── MoneyAmount ───────────────────────────────────────────────────────────────

describe('MoneyAmount', () => {
  it('accepts zero', () => {
    expect(MoneyAmount.parse(0)).toBe(0);
  });

  it('accepts positive integer', () => {
    expect(MoneyAmount.parse(5000)).toBe(5000);
  });

  it('rejects negative', () => {
    expect(() => MoneyAmount.parse(-1)).toThrow();
  });

  it('rejects float', () => {
    expect(() => MoneyAmount.parse(10.5)).toThrow();
  });
});

// ─── Additional Request Schemas ────────────────────────────────────────────────

describe('BookingRequest', () => {
  it('accepts valid booking', () => {
    expect(() => BookingRequest.parse({ route_id: uuid, student_id: uuid2 })).not.toThrow();
  });

  it('rejects invalid route_id', () => {
    expect(() => BookingRequest.parse({ route_id: 'bad', student_id: uuid2 })).toThrow();
  });

  it('rejects missing student_id', () => {
    expect(() => BookingRequest.parse({ route_id: uuid })).toThrow();
  });
});

describe('CheckoutRequest', () => {
  it('accepts valid checkout', () => {
    expect(() => CheckoutRequest.parse({ route_id: uuid })).not.toThrow();
  });

  it('rejects invalid route_id', () => {
    expect(() => CheckoutRequest.parse({ route_id: 'bad' })).toThrow();
  });
});

describe('NotificationRequest', () => {
  it('accepts with target_user_id', () => {
    expect(() =>
      NotificationRequest.parse({ target_user_id: uuid, title: 'Hello', body: 'World' }),
    ).not.toThrow();
  });

  it('accepts with target_role', () => {
    expect(() =>
      NotificationRequest.parse({ target_role: 'student', title: 'Hello', body: 'World' }),
    ).not.toThrow();
  });

  it('accepts with both target_user_id and target_role', () => {
    expect(() =>
      NotificationRequest.parse({
        target_user_id: uuid,
        target_role: 'driver',
        title: 'Hello',
        body: 'World',
      }),
    ).not.toThrow();
  });

  it('rejects without target_user_id or target_role', () => {
    expect(() => NotificationRequest.parse({ title: 'Hello', body: 'World' })).toThrow();
  });

  it('rejects empty title', () => {
    expect(() =>
      NotificationRequest.parse({ target_user_id: uuid, title: '', body: 'World' }),
    ).toThrow();
  });

  it('rejects empty body', () => {
    expect(() =>
      NotificationRequest.parse({ target_user_id: uuid, title: 'Hello', body: '' }),
    ).toThrow();
  });

  it('accepts optional data field', () => {
    expect(() =>
      NotificationRequest.parse({
        target_user_id: uuid,
        title: 'Hello',
        body: 'World',
        data: { tripId: '123' },
      }),
    ).not.toThrow();
  });
});

describe('ZainCashWebhookRequest', () => {
  it('accepts valid token', () => {
    expect(() => ZainCashWebhookRequest.parse({ token: 'abc123' })).not.toThrow();
  });

  it('rejects empty token', () => {
    expect(() => ZainCashWebhookRequest.parse({ token: '' })).toThrow();
  });
});

describe('TripUpdateRequest', () => {
  it('accepts valid update without coordinates', () => {
    expect(() =>
      TripUpdateRequest.parse({ trip_id: uuid, new_status: 'driver_waiting' }),
    ).not.toThrow();
  });

  it('accepts valid update with nullable coordinates', () => {
    expect(() =>
      TripUpdateRequest.parse({ trip_id: uuid, new_status: 'in_transit', lat: 33.3, lng: 44.4 }),
    ).not.toThrow();
  });

  it('accepts null coordinates', () => {
    expect(() =>
      TripUpdateRequest.parse({ trip_id: uuid, new_status: 'completed', lat: null, lng: null }),
    ).not.toThrow();
  });

  it('rejects invalid trip_id', () => {
    expect(() => TripUpdateRequest.parse({ trip_id: 'bad', new_status: 'scheduled' })).toThrow();
  });

  it('rejects invalid status', () => {
    expect(() => TripUpdateRequest.parse({ trip_id: uuid, new_status: 'unknown' })).toThrow();
  });

  it('rejects out-of-range lat', () => {
    expect(() =>
      TripUpdateRequest.parse({ trip_id: uuid, new_status: 'scheduled', lat: 91 }),
    ).toThrow();
  });

  it('rejects out-of-range lng', () => {
    expect(() =>
      TripUpdateRequest.parse({ trip_id: uuid, new_status: 'scheduled', lng: 181 }),
    ).toThrow();
  });
});

// ─── getErrorMessage ───────────────────────────────────────────────────────────

describe('getErrorMessage', () => {
  it('returns message from Error instance', () => {
    expect(getErrorMessage(new Error('test error'))).toBe('test error');
  });

  it('returns string as-is', () => {
    expect(getErrorMessage('string error')).toBe('string error');
  });

  it('returns default for null', () => {
    expect(getErrorMessage(null)).toBe('An unknown error occurred');
  });

  it('returns default for undefined', () => {
    expect(getErrorMessage(undefined)).toBe('An unknown error occurred');
  });

  it('returns default for number', () => {
    expect(getErrorMessage(42)).toBe('An unknown error occurred');
  });

  it('returns default for object', () => {
    expect(getErrorMessage({ code: 500 })).toBe('An unknown error occurred');
  });
});

// ─── retryWithBackoff ──────────────────────────────────────────────────────────

describe('retryWithBackoff', () => {
  it('succeeds on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await retryWithBackoff(fn);
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries then succeeds', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue('success');
    const result = await retryWithBackoff(fn, { baseDelayMs: 10, maxDelayMs: 50 });
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'));
    await expect(
      retryWithBackoff(fn, { maxRetries: 2, baseDelayMs: 10, maxDelayMs: 50 }),
    ).rejects.toThrow('fail');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('respects shouldRetry predicate', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('no-retry'));
    await expect(
      retryWithBackoff(fn, {
        maxRetries: 3,
        baseDelayMs: 10,
        shouldRetry: (err) => (err as Error).message !== 'no-retry',
      }),
    ).rejects.toThrow('no-retry');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('caps delay at maxDelayMs', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new Error('fail')).mockResolvedValue('ok');
    const start = Date.now();
    await retryWithBackoff(fn, { baseDelayMs: 100, maxDelayMs: 10 });
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
  });
});
