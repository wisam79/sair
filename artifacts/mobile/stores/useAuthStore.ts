import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistOptions } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useAppSettings } from '@/hooks/useAppSettings';
import { mmkvStorage } from '@/lib/storage';

export type UserRole = 'student' | 'driver' | 'admin' | 'unassigned';

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  gender: 'male' | 'female' | null;
  role: UserRole;
  institution_id: string | null;
  is_activated: boolean;
  parent_name: string | null;
  parent_phone: string | null;
}

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  registerProfile: (data: {
    fullName: string;
    role: UserRole;
    institutionId?: string;
    parentName?: string;
    parentPhone?: string;
    vehicleInfo?: string;
    capacity?: number;
    monthlyFee?: number;
  }) => Promise<void>;
  loadUserProfile: (userId: string) => Promise<void>;
}

type AuthPersist = PersistOptions<AuthState>;

const persistConfig: AuthPersist = {
  name: 'auth-storage',
  storage: mmkvStorage,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      loadUserProfile: async (userId: string) => {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (profileError) throw profileError;

          if (profile) {
            set({ user: profile as Profile, isAuthenticated: true });
          } else {
            set({
              user: {
                id: userId,
                full_name: '',
                phone: null,
                gender: null,
                role: 'unassigned',
                institution_id: null,
                is_activated: false,
                parent_name: null,
                parent_phone: null,
              } as Profile,
              isAuthenticated: true,
            });
          }
        } catch (err: any) {
          set({ error: err?.message || 'فشل تحميل الملف الشخصي' });
        }
      },

      signIn: async (email, password) => {
        set({ error: null });
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          const message = signInError.message === 'Invalid login credentials'
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            : signInError.message;
          set({ error: message });
          throw signInError;
        }
      },

      signUp: async (email, password) => {
        set({ error: null });
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
          set({ error: signUpError.message });
          throw signUpError;
        }
      },

      signOut: async () => {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          set({ error: signOutError.message });
          throw signOutError;
        }
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) return;
        set({ error: null });
        const forbiddenKeys = ['role', 'is_admin', 'user_id'];
        for (const key of forbiddenKeys) {
          if (key in updates) {
            throw new Error(`لا يمكنك تحديث ${key}`);
          }
        }
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
        if (updateError) {
          set({ error: updateError.message });
          throw updateError;
        }
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      registerProfile: async (data) => {
        set({ error: null });
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id ?? get().user?.id;
        if (!userId) {
          set({ error: 'لم يتم العثور على جلسة المستخدم' });
          return;
        }

        const { data: settingsData } = await supabase
          .from('app_settings')
          .select('monthly_fee')
          .single();
        const monthly_fee = settingsData?.monthly_fee ?? 90000;

        try {
          const { error: rpcError } = await supabase.rpc('register_user_profile', {
            p_user_id: userId,
            p_full_name: data.fullName,
            p_role: data.role,
            p_institution_id: data.institutionId || null,
            p_parent_name: data.parentName || null,
            p_parent_phone: data.parentPhone || null,
            p_vehicle_info: data.vehicleInfo || null,
            p_capacity: data.capacity ?? 4,
            p_monthly_fee: data.monthlyFee ?? monthly_fee,
          });

          if (rpcError) throw rpcError;
        } catch {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              full_name: data.fullName,
              role: data.role,
              institution_id: data.institutionId || null,
              parent_name: data.parentName || null,
              parent_phone: data.parentPhone || null,
            })
            .eq('id', userId);
          if (profileError) {
            set({ error: profileError.message });
            throw profileError;
          }

          if (data.role === 'driver') {
            const { error: driverError } = await supabase.from('drivers').insert({
              user_id: userId,
              vehicle_info: data.vehicleInfo || 'غير محدد',
              capacity: data.capacity ?? 4,
              available_seats: data.capacity ?? 4,
              monthly_fee: data.monthlyFee,
              institution_id: data.institutionId || null,
            });
            if (driverError) {
              await supabase
                .from('profiles')
                .update({ role: 'unassigned', full_name: null, institution_id: null })
                .eq('id', userId);
              set({ error: driverError.message });
              throw driverError;
            }
          }
        }

        await get().loadUserProfile(userId);
      },
    }),
    persistConfig,
  ),
);
