// Re-export types from stores for backward compatibility
export type { Profile, UserRole } from '@/stores/useAuthStore';
export type { DriverProfile } from '@/stores/useDriverStore';
export type {
  SubscriptionData,
  SubscriptionRequestData,
  SubscriptionPlan,
} from '@/stores/useSubscriptionStore';
export type { TripData, TripLocation } from '@/stores/useTripStore';
export type { NotificationData, AppNotification } from '@/stores/useNotificationStore';
export type { Institution } from '@/stores/useInstitutionStore';

// Import stores for legacy hook wrappers
import { useAuthStore } from '@/stores/useAuthStore';
import { useDriverStore } from '@/stores/useDriverStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { useTripStore } from '@/stores/useTripStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { useInstitutionStore } from '@/stores/useInstitutionStore';

// Re-export stores for direct import
export {
  useAuthStore,
  useDriverStore,
  useSubscriptionStore,
  useTripStore,
  useNotificationStore,
  useInstitutionStore,
};

// Legacy hook exports (can be removed once all screens are updated)
export const useAuth = () => useAuthStore();
export const useDriver = () => useDriverStore();
export const useSubscription = () => useSubscriptionStore();
export const useTrip = () => useTripStore();
export const useNotification = () => useNotificationStore();
export const useInstitution = () => useInstitutionStore();
