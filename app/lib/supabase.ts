import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import { create } from "zustand";

// Initialize Supabase client
let supabaseClient: SupabaseClient | null = null;
let supabaseConfigError: string | null = null;

const getSupabase = (): SupabaseClient | null => {
  if (typeof window === "undefined") return null;

  if (!supabaseClient) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
      const missingVars = [
        !url ? "VITE_SUPABASE_URL" : null,
        !key ? "VITE_SUPABASE_ANON_KEY" : null,
      ].filter(Boolean);

      supabaseConfigError = `Missing Supabase environment variable(s): ${missingVars.join(
        ", ",
      )}`;
      console.warn(supabaseConfigError);
      return null;
    }

    supabaseConfigError = null;
    supabaseClient = createClient(url, key);
  }

  return supabaseClient;
};

interface SupabaseAuthStore {
  isLoading: boolean;
  error: string | null;
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;
    getUser: () => User | null;
  };
  init: () => void;
  clearError: () => void;
}

export const useSupabaseAuthStore = create<SupabaseAuthStore>((set, get) => {
  const setError = (msg: string) => {
    set({
      error: msg,
      isLoading: false,
      auth: {
        user: null,
        isAuthenticated: false,
        signIn: get().auth.signIn,
        signUp: get().auth.signUp,
        signOut: get().auth.signOut,
        resetPassword: get().auth.resetPassword,
        checkAuthStatus: get().auth.checkAuthStatus,
        getUser: get().auth.getUser,
      },
    });
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    const supabase = getSupabase();
    if (!supabase) {
      setError(supabaseConfigError || "Supabase client not initialized");
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        set({
          auth: {
            user: null,
            isAuthenticated: false,
            signIn: get().auth.signIn,
            signUp: get().auth.signUp,
            signOut: get().auth.signOut,
            resetPassword: get().auth.resetPassword,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => null,
          },
          isLoading: false,
        });
        return false;
      }

      set({
        auth: {
          user,
          isAuthenticated: true,
          signIn: get().auth.signIn,
          signUp: get().auth.signUp,
          signOut: get().auth.signOut,
          resetPassword: get().auth.resetPassword,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => user,
        },
        isLoading: false,
      });
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to check auth status";
      setError(msg);
      return false;
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    const supabase = getSupabase();
    if (!supabase) {
      setError(supabaseConfigError || "Supabase client not initialized");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      await checkAuthStatus();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setError(msg);
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    const supabase = getSupabase();
    if (!supabase) {
      setError(supabaseConfigError || "Supabase client not initialized");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // After signup, try to sign in
      await signIn(email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      setError(msg);
    }
  };

  const signOut = async (): Promise<void> => {
    const supabase = getSupabase();
    if (!supabase) {
      setError(supabaseConfigError || "Supabase client not initialized");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setError(error.message);
        return;
      }

      set({
        auth: {
          user: null,
          isAuthenticated: false,
          signIn: get().auth.signIn,
          signUp: get().auth.signUp,
          signOut: get().auth.signOut,
          resetPassword: get().auth.resetPassword,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => null,
        },
        isLoading: false,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign out failed";
      setError(msg);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    const supabase = getSupabase();
    if (!supabase) {
      setError(supabaseConfigError || "Supabase client not initialized");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message);
        return;
      }

      set({ isLoading: false, error: null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Password reset failed";
      setError(msg);
    }
  };

  const init = (): void | (() => void) => {
    const supabase = getSupabase();
    if (supabase) {
      checkAuthStatus();

      // Set up auth state listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          set({
            auth: {
              user: session.user,
              isAuthenticated: true,
              signIn: get().auth.signIn,
              signUp: get().auth.signUp,
              signOut: get().auth.signOut,
              resetPassword: get().auth.resetPassword,
              checkAuthStatus: get().auth.checkAuthStatus,
              getUser: () => session.user,
            },
          });
        } else {
          set({
            auth: {
              user: null,
              isAuthenticated: false,
              signIn: get().auth.signIn,
              signUp: get().auth.signUp,
              signOut: get().auth.signOut,
              resetPassword: get().auth.resetPassword,
              checkAuthStatus: get().auth.checkAuthStatus,
              getUser: () => null,
            },
          });
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    } else {
      setError(supabaseConfigError || "Supabase not available");
    }
  };

  return {
    isLoading: false,
    error: null,
    auth: {
      user: null,
      isAuthenticated: false,
      signIn,
      signUp,
      signOut,
      resetPassword,
      checkAuthStatus,
      getUser: () => null,
    },
    init,
    clearError: () => set({ error: null }),
  };
});
