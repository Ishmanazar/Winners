import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  username: string;
  avatar: string;
  best_score: number;
  total_games: number;
}

interface AuthStore {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, username: string, avatar: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (username: string, avatar: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({ user: session.user, isAuthenticated: true });
        await get().fetchProfile(session.user.id);
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          set({ user: session.user, isAuthenticated: true });
          await get().fetchProfile(session.user.id);
        } else {
          set({ user: null, profile: null, isAuthenticated: false });
        }
      });
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, username, avatar) => {
    try {
      set({ isLoading: true, error: null });

      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', username.trim())
        .single();

      if (existingUser) {
        set({ isLoading: false });
        return { success: false, error: 'Username is already taken. Choose a different name.' };
      }

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username.trim(),
            avatar,
          });

        if (profileError) {
          set({ isLoading: false });
          return { success: false, error: profileError.message };
        }

        set({
          user: data.user,
          isAuthenticated: true,
          profile: {
            id: data.user.id,
            username: username.trim(),
            avatar,
            best_score: 0,
            total_games: 0,
          },
        });
      }

      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: 'An unexpected error occurred.' };
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }

      if (data.user) {
        set({ user: data.user, isAuthenticated: true });
        await get().fetchProfile(data.user.id);
      }

      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: 'An unexpected error occurred.' };
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, profile: null, isAuthenticated: false });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  },

  fetchProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        set({
          profile: {
            id: data.id,
            username: data.username,
            avatar: data.avatar || '🏃',
            best_score: data.best_score || 0,
            total_games: data.total_games || 0,
          },
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  },

  updateProfile: async (username, avatar) => {
    const { user } = get();
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim(), avatar, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      set((state) => ({
        profile: state.profile ? { ...state.profile, username: username.trim(), avatar } : null,
      }));

      return { success: true };
    } catch (err) {
      return { success: false, error: 'An unexpected error occurred.' };
    }
  },

  clearError: () => set({ error: null }),
}));

