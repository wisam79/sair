import { AuthBindings } from '@refinedev/core';
import { supabaseClient } from './supabaseClient';

export const authProvider: AuthBindings = {
  login: async (params) => {
    const { email, password } = (params || {}) as Record<string, unknown>;
    const emailStr = typeof email === 'string' ? email : '';
    const passwordStr = typeof password === 'string' ? password : '';
    
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: emailStr,
      password: passwordStr,
    });

    if (error) {
      return {
        success: false,
        error,
      };
    }

    if (data?.session) {
      // Only allow admins - use app_metadata (not user_metadata which is client-writable)
      const role = data.user?.app_metadata?.role as string | undefined;
      if (role !== 'admin') {
        await supabaseClient.auth.signOut();
        return {
          success: false,
          error: {
            message: 'Unauthorized. Admin access only.',
            name: 'Unauthorized',
          },
        };
      }
      return {
        success: true,
        redirectTo: '/',
      };
    }

    return {
      success: false,
      error: {
        message: 'Login failed',
        name: 'Invalid credentials',
      },
    };
  },
  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      return { success: false, error };
    }
    return { success: true, redirectTo: '/login' };
  },
  check: async () => {
    try {
      const { data, error } = await supabaseClient.auth.getSession();

      if (error) {
        return { authenticated: false, redirectTo: '/login' };
      }

      const { session } = data;

      if (!session) {
        return { authenticated: false, redirectTo: '/login' };
      }

      const role = session.user?.app_metadata?.role as string | undefined;
      if (role !== 'admin') {
        return { authenticated: false, redirectTo: '/login', logout: true };
      }

      return { authenticated: true };
    } catch {
      return { authenticated: false, redirectTo: '/login' };
    }
  },
  getPermissions: async () => {
    const { data } = await supabaseClient.auth.getUser();
    if (data?.user) {
      return (data.user.app_metadata?.role as string | null | undefined) ?? null;
    }
    return null;
  },
  getIdentity: async () => {
    const { data } = await supabaseClient.auth.getUser();
    if (data?.user) {
      return {
        ...data.user,
        name: data.user.email,
      };
    }
    return null;
  },
  onError: (error) => {
    const err = error as { status?: number } | null | undefined;
    if (err?.status === 401) {
      return Promise.resolve({ logout: true });
    }
    return Promise.resolve({
      error: error as unknown,
    });
  },
};
