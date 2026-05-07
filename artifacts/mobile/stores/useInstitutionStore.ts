import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistOptions } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';

export interface Institution {
  id: string;
  name: string;
  location: string | null;
}

interface InstitutionState {
  institutions: Institution[];
  setInstitutions: (institutions: Institution[]) => void;
}

type InstitutionPersist = PersistOptions<InstitutionState>;

const persistConfig: InstitutionPersist = {
  name: 'institution-storage',
  storage: mmkvStorage,
};

export const useInstitutionStore = create<InstitutionState>()(
  persist(
    (set) => ({
      institutions: [],

      setInstitutions: (institutions) => {
        set({ institutions });
      },
    }),
    persistConfig,
  ),
);
