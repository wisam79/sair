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

import { useAuthStore, useTripStore, useBookingStore, useI18nStore } from './useStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    useAuthStore.getState().setInitialized(false);
  });

  it('has initial null state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.role).toBeNull();
    expect(state.profile).toBeNull();
    expect(state.initialized).toBe(false);
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

  it('logout clears user, role, and profile', () => {
    useAuthStore.getState().setAuth({ id: 'u1' }, 'admin');
    useAuthStore.getState().setProfile({ full_name: 'Ahmed', phone: '0770' });
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.role).toBeNull();
    expect(state.profile).toBeNull();
  });
});

describe('useTripStore', () => {
  beforeEach(() => {
    useTripStore.getState().clearTrip();
  });

  it('has initial null state', () => {
    const state = useTripStore.getState();
    expect(state.activeTripId).toBeNull();
    expect(state.currentStatus).toBeNull();
    expect(state.tripRouteId).toBeNull();
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
});

describe('useBookingStore', () => {
  beforeEach(() => {
    useBookingStore.getState().resetBooking();
  });

  it('has initial null state', () => {
    const state = useBookingStore.getState();
    expect(state.isBooking).toBe(false);
    expect(state.lastBookingId).toBeNull();
    expect(state.bookingError).toBeNull();
    expect(state.idempotencyKey).toBeNull();
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
});

describe('useI18nStore', () => {
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
});
