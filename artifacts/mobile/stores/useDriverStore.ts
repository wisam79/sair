import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistOptions } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';

export interface DriverProfile {
  id: string;
  user_id: string;
  vehicle_info: string | null;
  capacity: number;
  available_seats: number;
  monthly_fee: number;
  commission_rate: number;
  is_available: boolean;
  is_online: boolean;
  institution_id: string | null;
  profile?: {
    id: string;
    full_name: string;
    phone: string | null;
  };
}

interface DriverState {
  driver: DriverProfile | null;
  availableDrivers: DriverProfile[];
  setDriver: (driver: DriverProfile | null) => void;
  setAvailableDrivers: (drivers: DriverProfile[]) => void;
}

type DriverPersist = PersistOptions<DriverState>;

const persistConfig: DriverPersist = {
  name: 'driver-storage',
  storage: mmkvStorage,
};

export const useDriverStore = create<DriverState>()(
  persist(
    (set) => ({
      driver: null,
      availableDrivers: [],

      setDriver: (driver) => {
        set({ driver });
      },

      setAvailableDrivers: (drivers) => {
        set({ availableDrivers: drivers });
      },
    }),
    persistConfig,
  ),
);
