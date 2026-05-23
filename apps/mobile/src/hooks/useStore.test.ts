import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(null),
    removeItem: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock('expo-secure-store', () => ({
  getItemAsync: vi.fn(),
  setItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
  WHEN_UNLOCKED: 'WHEN_UNLOCKED',
}));

vi.mock('../lib/offlineCache', () => ({
  OfflineCache: {
    clear: vi.fn(),
  },
}));

import { useAuthStore, useTripStore, useBookingStore, useI18nStore } from './useStore';
import { OfflineCache } from '../lib/offlineCache';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    useAuthStore.getState().setInitialized(false);
    useAuthStore.getState().setHasSeenOnboarding(false);
    useAuthStore.getState().setHasHydrated(false);
    vi.clearAllMocks();
  });

  it('has initial null state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.role).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.initialized).toBe(false);
    expect(state.hasSeenOnboarding).toBe(false);
    expect(state.hasHydrated).toBe(false);
  });

  it('sets auth user and role', () => {
    const user = { id: 'u1', email: 'test@test.com' };
    useAuthStore.getState().setAuth(user, 'admin');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.role).toBe('admin');
  });

  it('sets profile', () => {
    const profile = { full_name: 'Ahmed', phone: '07701234567', institution_id: 'inst1' };
    useAuthStore.getState().setProfile(profile);

    expect(useAuthStore.getState().profile).toEqual(profile);
  });

  it('sets initialized flag', () => {
    useAuthStore.getState().setInitialized(true);
    expect(useAuthStore.getState().initialized).toBe(true);
  });

  it('logout clears user, role, profile, trip, booking, and offline cache', () => {
    useAuthStore.getState().setAuth({ id: 'u1' }, 'student');
    useAuthStore.getState().setProfile({ full_name: 'Ahmed', phone: '0770' });

    // Set some state in other stores
    useTripStore.getState().setActiveTrip('t1', 'in_transit', 'r1');
    useBookingStore.getState().setBooking(true);
    useBookingStore.getState().setIdempotencyKey('key1');

    useAuthStore.getState().logout();

    // Verify auth store is cleared
    const authState = useAuthStore.getState();
    expect(authState.user).toBeNull();
    expect(authState.role).toBeNull();
    expect(authState.profile).toBeNull();

    // Verify trip store is cleared
    const tripState = useTripStore.getState();
    expect(tripState.activeTripId).toBeNull();
    expect(tripState.currentStatus).toBeNull();
    expect(tripState.tripRouteId).toBeNull();

    // Verify booking store is reset
    const bookingState = useBookingStore.getState();
    expect(bookingState.isBooking).toBe(false);
    expect(bookingState.idempotencyKey).toBeNull();

    // Verify OfflineCache is cleared
    expect(OfflineCache.clear).toHaveBeenCalled();
  });

  it('manages hasSeenOnboarding and hasHydrated state', () => {
    const authStore = useAuthStore.getState();
    expect(authStore.hasSeenOnboarding).toBe(false);
    expect(authStore.hasHydrated).toBe(false);

    authStore.setHasSeenOnboarding(true);
    authStore.setHasHydrated(true);

    expect(useAuthStore.getState().hasSeenOnboarding).toBe(true);
    expect(useAuthStore.getState().hasHydrated).toBe(true);
  });
});

describe('useTripStore', () => {
  beforeEach(() => {
    useTripStore.getState().clearTrip();
    useTripStore.getState().setHasHydrated(false);
  });

  it('has initial null state', () => {
    const state = useTripStore.getState();
    expect(state.activeTripId).toBeNull();
    expect(state.currentStatus).toBeNull();
    expect(state.tripRouteId).toBeNull();
    expect(state.hasHydrated).toBe(false);
  });

  it('sets active trip', () => {
    useTripStore.getState().setActiveTrip('trip1', 'scheduled', 'route1');

    const state = useTripStore.getState();
    expect(state.activeTripId).toBe('trip1');
    expect(state.currentStatus).toBe('scheduled');
    expect(state.tripRouteId).toBe('route1');
  });

  it('updates status', () => {
    useTripStore.getState().setActiveTrip('trip1', 'scheduled', 'route1');
    useTripStore.getState().updateStatus('driver_waiting');

    expect(useTripStore.getState().currentStatus).toBe('driver_waiting');
    expect(useTripStore.getState().activeTripId).toBe('trip1');
  });

  it('clears trip', () => {
    useTripStore.getState().setActiveTrip('trip1', 'in_transit', 'route1');
    useTripStore.getState().clearTrip();

    const state = useTripStore.getState();
    expect(state.activeTripId).toBeNull();
    expect(state.currentStatus).toBeNull();
    expect(state.tripRouteId).toBeNull();
  });

  it('manages hasHydrated state', () => {
    expect(useTripStore.getState().hasHydrated).toBe(false);
    useTripStore.getState().setHasHydrated(true);
    expect(useTripStore.getState().hasHydrated).toBe(true);
  });
});

describe('useBookingStore', () => {
  beforeEach(() => {
    useBookingStore.getState().resetBooking();
    useBookingStore.getState().setHasHydrated(false);
  });

  it('has initial null state', () => {
    const state = useBookingStore.getState();
    expect(state.isBooking).toBe(false);
    expect(state.lastBookingId).toBeNull();
    expect(state.bookingError).toBeNull();
    expect(state.idempotencyKey).toBeNull();
    expect(state.hasHydrated).toBe(false);
  });

  it('sets booking state', () => {
    useBookingStore.getState().setBooking(true);
    expect(useBookingStore.getState().isBooking).toBe(true);
  });

  it('sets booking result with success', () => {
    useBookingStore.getState().setBookingResult('sub1', null);

    const state = useBookingStore.getState();
    expect(state.isBooking).toBe(false);
    expect(state.lastBookingId).toBe('sub1');
    expect(state.bookingError).toBeNull();
  });

  it('sets booking result with error', () => {
    useBookingStore.getState().setBookingResult(null, 'No seats available');

    const state = useBookingStore.getState();
    expect(state.isBooking).toBe(false);
    expect(state.lastBookingId).toBeNull();
    expect(state.bookingError).toBe('No seats available');
  });

  it('resets booking state', () => {
    useBookingStore.getState().setBooking(true);
    useBookingStore.getState().setIdempotencyKey('key1');
    useBookingStore.getState().setBookingResult('sub1', null);
    useBookingStore.getState().resetBooking();

    const state = useBookingStore.getState();
    expect(state.isBooking).toBe(false);
    expect(state.lastBookingId).toBeNull();
    expect(state.bookingError).toBeNull();
    expect(state.idempotencyKey).toBeNull();
  });

  it('sets idempotency key', () => {
    useBookingStore.getState().setIdempotencyKey('unique-key-123');
    expect(useBookingStore.getState().idempotencyKey).toBe('unique-key-123');
  });

  it('manages hasHydrated state', () => {
    expect(useBookingStore.getState().hasHydrated).toBe(false);
    useBookingStore.getState().setHasHydrated(true);
    expect(useBookingStore.getState().hasHydrated).toBe(true);
  });
});

describe('useI18nStore', () => {
  beforeEach(() => {
    useI18nStore.getState().setHasHydrated(false);
  });

  it('defaults to Arabic', () => {
    expect(useI18nStore.getState().language).toBe('ar');
  });

  it('sets language', () => {
    useI18nStore.getState().setLanguage('en');
    expect(useI18nStore.getState().language).toBe('en');
  });

  it('switches back to Arabic', () => {
    useI18nStore.getState().setLanguage('en');
    useI18nStore.getState().setLanguage('ar');
    expect(useI18nStore.getState().language).toBe('ar');
  });

  it('manages hasHydrated state', () => {
    expect(useI18nStore.getState().hasHydrated).toBe(false);
    useI18nStore.getState().setHasHydrated(true);
    expect(useI18nStore.getState().hasHydrated).toBe(true);
  });
});
