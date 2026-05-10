import { describe, it, expect } from 'vitest';
import {
  UserRole,
  MoneyAmount,
  TripStatus,
  GeoCoordinates,
  BookingRequest,
  TripUpdateRequest,
  canTransition,
  ValidTransitions,
  SubscriptionStatus,
  RouteSchema,
  TripSchema,
  ProfileSchema,
  Translations,
  Languages,
  SubscriptionSchema,
} from '../../packages/core/index';

describe('Core Validation Logic', () => {
  describe('UserRole', () => {
    it('should validate correct user roles', () => {
      expect(UserRole.safeParse('student').success).toBe(true);
      expect(UserRole.safeParse('driver').success).toBe(true);
      expect(UserRole.safeParse('admin').success).toBe(true);
      expect(UserRole.safeParse('hacker').success).toBe(false);
      expect(UserRole.safeParse('').success).toBe(false);
    });
  });

  describe('MoneyAmount', () => {
    it('should validate monetary amounts as integers', () => {
      expect(MoneyAmount.safeParse(5000).success).toBe(true);
      expect(MoneyAmount.safeParse(0).success).toBe(true);
      expect(MoneyAmount.safeParse(50.5).success).toBe(false);
      expect(MoneyAmount.safeParse(-100).success).toBe(false);
    });
  });

  describe('GeoCoordinates', () => {
    it('should validate geo coordinates', () => {
      expect(GeoCoordinates.safeParse({ lat: 33.3, lng: 44.4 }).success).toBe(true);
      expect(GeoCoordinates.safeParse({ lat: 0, lng: 0 }).success).toBe(true);
      expect(GeoCoordinates.safeParse({ lat: 100, lng: 200 }).success).toBe(false);
      expect(GeoCoordinates.safeParse({ lat: -91, lng: 0 }).success).toBe(false);
    });
  });

  describe('TripStatus', () => {
    it('should validate trip status values', () => {
      expect(TripStatus.safeParse('in_transit').success).toBe(true);
      expect(TripStatus.safeParse('scheduled').success).toBe(true);
      expect(TripStatus.safeParse('driver_waiting').success).toBe(true);
      expect(TripStatus.safeParse('completed').success).toBe(true);
      expect(TripStatus.safeParse('absent').success).toBe(true);
      expect(TripStatus.safeParse('cancelled').success).toBe(true);
      expect(TripStatus.safeParse('teleporting').success).toBe(false);
    });
  });

  describe('Trip State Machine', () => {
    it('should allow valid transitions from scheduled', () => {
      expect(canTransition('scheduled', 'driver_waiting')).toBe(true);
      expect(canTransition('scheduled', 'cancelled')).toBe(true);
      expect(canTransition('scheduled', 'in_transit')).toBe(false);
      expect(canTransition('scheduled', 'completed')).toBe(false);
    });

    it('should allow valid transitions from driver_waiting', () => {
      expect(canTransition('driver_waiting', 'in_transit')).toBe(true);
      expect(canTransition('driver_waiting', 'cancelled')).toBe(true);
      expect(canTransition('driver_waiting', 'scheduled')).toBe(false);
    });

    it('should allow valid transitions from in_transit', () => {
      expect(canTransition('in_transit', 'completed')).toBe(true);
      expect(canTransition('in_transit', 'absent')).toBe(true);
      expect(canTransition('in_transit', 'cancelled')).toBe(false);
    });

    it('should not allow transitions from terminal states', () => {
      expect(canTransition('completed', 'scheduled')).toBe(false);
      expect(canTransition('completed', 'in_transit')).toBe(false);
      expect(canTransition('absent', 'scheduled')).toBe(false);
      expect(canTransition('cancelled', 'scheduled')).toBe(false);
    });

    it('should define valid transitions for all statuses', () => {
      const allStatuses: TripStatus[] = ['scheduled', 'driver_waiting', 'in_transit', 'completed', 'absent', 'cancelled'];
      for (const status of allStatuses) {
        expect(ValidTransitions[status]).toBeDefined();
        expect(Array.isArray(ValidTransitions[status])).toBe(true);
      }
    });
  });

  describe('BookingRequest', () => {
    it('should validate booking requests', () => {
      expect(BookingRequest.safeParse({ routeId: '550e8400-e29b-41d4-a716-446655440000', studentId: '550e8400-e29b-41d4-a716-446655440001' }).success).toBe(true);
      expect(BookingRequest.safeParse({ routeId: 'invalid', studentId: '550e8400-e29b-41d4-a716-446655440001' }).success).toBe(false);
      expect(BookingRequest.safeParse({ routeId: '550e8400-e29b-41d4-a716-446655440000' }).success).toBe(false);
    });

    it('should reject empty routeId or studentId', () => {
      expect(BookingRequest.safeParse({ routeId: '', studentId: '550e8400-e29b-41d4-a716-446655440001' }).success).toBe(false);
      expect(BookingRequest.safeParse({ routeId: '550e8400-e29b-41d4-a716-446655440000', studentId: '' }).success).toBe(false);
    });
  });

  describe('TripUpdateRequest', () => {
    it('should validate trip update requests', () => {
      expect(TripUpdateRequest.safeParse({
        tripId: '550e8400-e29b-41d4-a716-446655440000',
        newStatus: 'in_transit',
        lat: 33.3152,
        lng: 44.3661,
      }).success).toBe(true);

      expect(TripUpdateRequest.safeParse({
        tripId: '550e8400-e29b-41d4-a716-446655440000',
        newStatus: 'invalid',
        lat: 33.3152,
        lng: 44.3661,
      }).success).toBe(false);
    });

    it('should reject out-of-range coordinates', () => {
      expect(TripUpdateRequest.safeParse({
        tripId: '550e8400-e29b-41d4-a716-446655440000',
        newStatus: 'in_transit',
        lat: 200,
        lng: 44.3661,
      }).success).toBe(false);
    });
  });

  describe('SubscriptionStatus', () => {
    it('should validate subscription statuses', () => {
      expect(SubscriptionStatus.safeParse('active').success).toBe(true);
      expect(SubscriptionStatus.safeParse('pending').success).toBe(true);
      expect(SubscriptionStatus.safeParse('expired').success).toBe(true);
      expect(SubscriptionStatus.safeParse('cancelled').success).toBe(true);
      expect(SubscriptionStatus.safeParse('unknown').success).toBe(false);
    });
  });

  describe('RouteSchema', () => {
    it('should validate a complete route', () => {
      const validRoute = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        driver_id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Mansour to Uni',
        start_location: 'Mansour',
        end_location: 'University',
        price: 50000,
        capacity: 4,
        available_seats: 2,
        is_active: true,
      };
      expect(RouteSchema.safeParse(validRoute).success).toBe(true);
    });

    it('should reject route with negative price', () => {
      const invalidRoute = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        driver_id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Test',
        start_location: 'A',
        end_location: 'B',
        price: -100,
        capacity: 4,
        available_seats: 2,
        is_active: true,
      };
      expect(RouteSchema.safeParse(invalidRoute).success).toBe(false);
    });
  });

  describe('SubscriptionSchema', () => {
    it('should validate a subscription', () => {
      const validSub = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        student_id: '550e8400-e29b-41d4-a716-446655440001',
        route_id: '550e8400-e29b-41d4-a716-446655440002',
        status: 'active',
        start_date: '2026-01-01',
        end_date: '2026-02-01',
        created_at: '2026-01-01',
      };
      expect(SubscriptionSchema.safeParse(validSub).success).toBe(true);
    });
  });

  describe('ProfileSchema', () => {
    it('should validate a profile', () => {
      const validProfile = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        full_name: 'Ali Hussain',
        phone: '+9647800000000',
        role: 'student',
        institution_id: null,
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      };
      expect(ProfileSchema.safeParse(validProfile).success).toBe(true);
    });
  });

  describe('i18n Translations', () => {
    it('should have Arabic and English translations', () => {
      expect(Translations.ar).toBeDefined();
      expect(Translations.en).toBeDefined();
    });

    it('should have matching keys in both languages', () => {
      const arKeys = Object.keys(Translations.ar);
      const enKeys = Object.keys(Translations.en);
      expect(arKeys.sort()).toEqual(enKeys.sort());
    });

    it('should have all essential translation keys', () => {
      const essentialKeys = [
        'welcome', 'book_now', 'login', 'logout', 'profile', 'no_seats',
        'error_generic', 'no_internet', 'cancel_subscription', 'save', 'phone', 'language',
      ];
      for (const key of essentialKeys) {
        expect(Translations.ar[key]).toBeDefined();
        expect(Translations.en[key]).toBeDefined();
      }
    });

    it('should have non-empty string values for all keys', () => {
      for (const [key, value] of Object.entries(Translations.ar)) {
        expect(value.length).toBeGreaterThan(0);
      }
      for (const [key, value] of Object.entries(Translations.en)) {
        expect(value.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Languages', () => {
    it('should validate language codes', () => {
      expect(Languages.safeParse('ar').success).toBe(true);
      expect(Languages.safeParse('en').success).toBe(true);
      expect(Languages.safeParse('fr').success).toBe(false);
    });
  });
});
