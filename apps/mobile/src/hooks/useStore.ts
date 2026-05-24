import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole, TripStatus, Language } from '@sair/core';
import { OfflineCache } from '../lib/offlineCache';

interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  profile: {
    full_name: string;
    phone: string;
    institution_id?: string | null;
    is_verified?: boolean;
  } | null;
  initialized: boolean;
  hasHydrated: boolean;
  hasSeenOnboarding: boolean;
  setAuth: (user: AuthUser | null, role: UserRole | null) => void;
  setProfile: (profile: {
    full_name: string;
    phone: string;
    institution_id?: string | null;
    is_verified?: boolean;
  }) => void;
  setInitialized: (initialized: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  setHasSeenOnboarding: (val: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      profile: null,
      initialized: false,
      hasHydrated: false,
      hasSeenOnboarding: false,
      setHasSeenOnboarding: (val) => set({ hasSeenOnboarding: val }),
      setAuth: (user, role) => set({ user, role }),
      setProfile: (profile) => set({ profile }),
      setInitialized: (initialized) => set({ initialized }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      logout: () => {
        OfflineCache.clear();
        useTripStore.getState().clearTrip();
        useBookingStore.getState().resetBooking();
        set({ user: null, role: null, profile: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        role: state.role,
        profile: state.profile,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

interface TripState {
  activeTripId: string | null;
  currentStatus: TripStatus | null;
  tripRouteId: string | null;
  hasHydrated: boolean;
  setActiveTrip: (tripId: string, status: TripStatus, routeId: string) => void;
  updateStatus: (status: TripStatus) => void;
  clearTrip: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      activeTripId: null,
      currentStatus: null,
      tripRouteId: null,
      hasHydrated: false,
      setActiveTrip: (tripId, status, routeId) =>
        set({ activeTripId: tripId, currentStatus: status, tripRouteId: routeId }),
      updateStatus: (status) => set({ currentStatus: status }),
      clearTrip: () => set({ activeTripId: null, currentStatus: null, tripRouteId: null }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'trip-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeTripId: state.activeTripId,
        currentStatus: state.currentStatus,
        tripRouteId: state.tripRouteId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

interface BookingState {
  isBooking: boolean;
  lastBookingId: string | null;
  bookingError: string | null;
  idempotencyKey: string | null;
  hasHydrated: boolean;
  setBooking: (isBooking: boolean) => void;
  setBookingResult: (subscriptionId: string | null, error: string | null) => void;
  resetBooking: () => void;
  setIdempotencyKey: (key: string) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      isBooking: false,
      lastBookingId: null,
      bookingError: null,
      idempotencyKey: null,
      hasHydrated: false,
      setBooking: (isBooking) => set({ isBooking }),
      setBookingResult: (subscriptionId, error) =>
        set({ isBooking: false, lastBookingId: subscriptionId, bookingError: error }),
      resetBooking: () =>
        set({ isBooking: false, lastBookingId: null, bookingError: null, idempotencyKey: null }),
      setIdempotencyKey: (key) => set({ idempotencyKey: key }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isBooking: state.isBooking,
        lastBookingId: state.lastBookingId,
        bookingError: state.bookingError,
        idempotencyKey: state.idempotencyKey,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

interface I18nState {
  language: Language;
  hasHydrated: boolean;
  setLanguage: (lang: Language) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: 'ar' as Language,
      hasHydrated: false,
      setLanguage: (language) => set({ language }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: 'i18n-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        language: state.language,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
