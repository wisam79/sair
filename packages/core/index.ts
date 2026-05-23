import { z } from 'zod';
import { createMachine } from '@xstate/fsm';

export const UserRole = z.enum(['admin', 'student', 'driver']);
export type UserRole = z.infer<typeof UserRole>;

export const MoneyAmount = z.number().int().min(0);

export const TripStatus = z.enum([
  'scheduled',
  'driver_waiting',
  'in_transit',
  'completed',
  'absent',
  'cancelled',
]);
export type TripStatus = z.infer<typeof TripStatus>;

export type TripEvent =
  | { type: 'ARRIVE' }
  | { type: 'START' }
  | { type: 'COMPLETE' }
  | { type: 'MARK_ABSENT' }
  | { type: 'CANCEL' };

export const tripStateMachine = createMachine<any, TripEvent>({
  id: 'trip',
  initial: 'scheduled',
  states: {
    scheduled: {
      on: {
        ARRIVE: 'driver_waiting',
        MARK_ABSENT: 'absent',
        CANCEL: 'cancelled',
      },
    },
    driver_waiting: {
      on: {
        START: 'in_transit',
        MARK_ABSENT: 'absent',
        CANCEL: 'cancelled',
      },
    },
    in_transit: {
      on: {
        COMPLETE: 'completed',
        CANCEL: 'cancelled',
      },
    },
    completed: {},
    absent: {
      on: {
        CANCEL: 'cancelled',
      },
    },
    cancelled: {},
  },
});

export const ValidTransitions: Record<TripStatus, TripStatus[]> = {
  scheduled: ['driver_waiting', 'absent', 'cancelled'],
  driver_waiting: ['in_transit', 'absent', 'cancelled'],
  in_transit: ['completed', 'cancelled'],
  completed: [],
  absent: ['cancelled'],
  cancelled: [],
};

export function canTransition(from: TripStatus, to: TripStatus): boolean {
  const stateConfig = tripStateMachine.config.states[from];
  if (!stateConfig || !stateConfig.on) return false;
  return Object.values(stateConfig.on).includes(to);
}

export const GeoCoordinates = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const BookingRequest = z.object({
  route_id: z.string().uuid(),
  student_id: z.string().uuid(),
});
export type BookingRequest = z.infer<typeof BookingRequest>;

export const CheckoutRequest = z.object({
  route_id: z.string().uuid(),
});
export type CheckoutRequest = z.infer<typeof CheckoutRequest>;

export const NotificationRequest = z
  .object({
    target_user_id: z.string().uuid().optional(),
    target_role: z.enum(['all', 'student', 'driver']).optional(),
    title: z.string().min(1),
    body: z.string().min(1),
    data: z.record(z.unknown()).optional(),
  })
  .refine((data) => data.target_user_id || data.target_role, {
    message: 'Must provide either target_user_id or target_role',
  });
export type NotificationRequest = z.infer<typeof NotificationRequest>;

export const ZainCashWebhookRequest = z.object({
  token: z.string().min(1),
});
export type ZainCashWebhookRequest = z.infer<typeof ZainCashWebhookRequest>;

export const TripUpdateRequest = z.object({
  trip_id: z.string().uuid(),
  new_status: TripStatus,
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
});
export type TripUpdateRequest = z.infer<typeof TripUpdateRequest>;

export const SubscriptionStatus = z.enum(['pending', 'active', 'expired', 'cancelled']);
export type SubscriptionStatus = z.infer<typeof SubscriptionStatus>;

export const InstitutionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  city: z.string().nullable().optional(),
  created_at: z.string(),
});
export type Institution = z.infer<typeof InstitutionSchema>;

export const RouteSchema = z.object({
  id: z.string().uuid(),
  driver_id: z.string().uuid(),
  institution_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1),
  start_location: z.string().min(1),
  end_location: z.string().min(1),
  price: z.number().int().min(0),
  capacity: z.number().int().min(1),
  available_seats: z.number().int().min(0),
  is_active: z.boolean(),
  start_lat: z.number().nullable().optional(),
  start_lng: z.number().nullable().optional(),
  end_lat: z.number().nullable().optional(),
  end_lng: z.number().nullable().optional(),
  departure_time: z.string().nullable().optional(),
  return_time: z.string().nullable().optional(),
});
export type Route = z.infer<typeof RouteSchema>;

export const RatingSchema = z.object({
  id: z.string().uuid(),
  trip_id: z.string().uuid(),
  student_id: z.string().uuid(),
  driver_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable().optional(),
  created_at: z.string(),
});
export type Rating = z.infer<typeof RatingSchema>;

export const TripSchema = z.object({
  id: z.string().uuid(),
  route_id: z.string().uuid(),
  driver_id: z.string().uuid(),
  status: TripStatus,
  scheduled_at: z.string(),
  started_at: z.string().nullable(),
  ended_at: z.string().nullable(),
  last_lat: z.number().nullable(),
  last_lng: z.number().nullable(),
});
export type Trip = z.infer<typeof TripSchema>;

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  student_id: z.string().uuid(),
  route_id: z.string().uuid(),
  status: SubscriptionStatus,
  start_date: z.string(),
  end_date: z.string(),
  created_at: z.string(),
});
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const LicenseStatus = z.enum(['active', 'used', 'revoked']);
export type LicenseStatus = z.infer<typeof LicenseStatus>;

export const LicenseSchema = z.object({
  id: z.string().uuid(),
  batch_id: z.string().uuid(),
  route_id: z.string().uuid(),
  code: z.string().length(8),
  status: LicenseStatus,
  used_by: z.string().uuid().nullable().optional(),
  used_at: z.string().nullable().optional(),
  valid_days: z.number().int().min(1),
  created_at: z.string(),
});
export type License = z.infer<typeof LicenseSchema>;

export const LicenseBatchSchema = z.object({
  id: z.string().uuid(),
  created_by: z.string().uuid(),
  route_id: z.string().uuid(),
  batch_name: z.string(),
  quantity: z.number().int().min(1),
  price: z.number().int().min(0),
  valid_days: z.number().int().min(1),
  created_at: z.string(),
});
export type LicenseBatch = z.infer<typeof LicenseBatchSchema>;

export const DriverPayoutStatus = z.enum(['pending', 'completed', 'rejected']);
export type DriverPayoutStatus = z.infer<typeof DriverPayoutStatus>;

export const DriverPayoutSchema = z.object({
  id: z.string().uuid(),
  driver_id: z.string().uuid(),
  amount: z.number().int().min(1),
  status: DriverPayoutStatus,
  reference_note: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type DriverPayout = z.infer<typeof DriverPayoutSchema>;

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1),
  phone: z.string().min(1).nullable().optional(),
  role: UserRole,
  institution_id: z.string().uuid().nullable(),
  is_verified: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const LoginSchema = z.object({
  email: z.string().email('invalid_email'),
  password: z.string().min(6, 'password_min_length'),
});
export type LoginRequest = z.infer<typeof LoginSchema>;

export const SignupSchema = LoginSchema.extend({
  full_name: z.string().min(3, 'full_name_min_length'),
});
export type SignupRequest = z.infer<typeof SignupSchema>;

export const Languages = z.enum(['ar', 'en']);
export type Language = z.infer<typeof Languages>;

import arTranslations from './locales/ar.ts';
import enTranslations from './locales/en.ts';

export const Translations: Record<Language, Record<string, string>> = {
  ar: arTranslations,
  en: enTranslations,
};

export type TranslationKey = keyof typeof enTranslations;

// NOTE: Theme tokens are defined in apps/mobile/src/theme/ — do not add here.

// ─── Exponential Backoff with Jitter ──────────────────────────────────────────

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unknown error occurred';
}

export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Base delay in milliseconds (default: 500) */
  baseDelayMs?: number;
  /** Maximum delay cap in milliseconds (default: 30000) */
  maxDelayMs?: number;
  /** Predicate to decide whether to retry on a given error (default: always retry) */
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Retries an async function with exponential backoff and random jitter.
 * Safe to use in Deno, Node, and React Native — no platform-specific imports.
 *
 * delay = min(baseDelayMs * 2^attempt + jitter, maxDelayMs)
 * where jitter is a random integer in [0, baseDelayMs)
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options?: RetryOptions,
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 500,
    maxDelayMs = 30000,
    shouldRetry = () => true,
  } = options ?? {};

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (!shouldRetry(err)) throw err;
      if (attempt === maxRetries) break;

      const jitter = Math.floor(Math.random() * baseDelayMs);
      const delay = Math.min(baseDelayMs * Math.pow(2, attempt) + jitter, maxDelayMs);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
