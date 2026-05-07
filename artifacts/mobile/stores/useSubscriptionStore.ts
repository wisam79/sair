import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistOptions } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';

export interface SubscriptionData {
  id: string;
  student_id: string;
  driver_id: string;
  start_date: string;
  end_date: string;
  monthly_fee: number;
  commission_rate: number;
  commission_amount: number;
  driver_payout: number;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  activation_code: string | null;
  cancelled_at: string | null;
  refund_amount: number | null;
  driver?: {
    id: string;
    user_id: string;
    vehicle_info: string | null;
    capacity: number;
    available_seats: number;
    monthly_fee: number;
  };
}

export interface SubscriptionRequestData {
  id: string;
  student_id: string;
  driver_id: string;
  institution_id: string;
  go_time: string;
  return_time: string;
  pickup_area: string | null;
  dropoff_area: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  responded_at: string | null;
  created_at: string;
}

export type SubscriptionPlan = 'basic' | 'standard' | 'premium';

interface SubscriptionState {
  subscription: SubscriptionData | null;
  pendingRequests: SubscriptionRequestData[];
  setSubscription: (subscription: SubscriptionData | null) => void;
  setPendingRequests: (requests: SubscriptionRequestData[]) => void;
  submitSubscriptionRequest: (request: SubscriptionRequestData) => void;
  respondToRequest: (requestId: string, status: 'accepted' | 'rejected') => void;
}

type SubscriptionPersist = PersistOptions<SubscriptionState>;

const persistConfig: SubscriptionPersist = {
  name: 'subscription-storage',
  storage: mmkvStorage,
};

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      subscription: null,
      pendingRequests: [],

      setSubscription: (subscription) => {
        set({ subscription });
      },

      setPendingRequests: (requests) => {
        set({ pendingRequests: requests });
      },

      submitSubscriptionRequest: (request) => {
        set((state) => ({
          pendingRequests: [...state.pendingRequests, request],
        }));
      },

      respondToRequest: (requestId, status) => {
        set((state) => ({
          pendingRequests: state.pendingRequests.map((r) =>
            r.id === requestId ? { ...r, status } : r
          ),
        }));
      },
    }),
    persistConfig,
  ),
);
