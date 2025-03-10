import { supabase } from "./supabase";
import { create } from "zustand";

// 管理者アカウントの認証情報
const ADMIN_CREDENTIALS = {
  email: "admin@batontouch.jp",
  password: "admin123",
};

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,

  initialize: async () => {
    try {
      // Get initial session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Check if user is admin
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        set({
          user: session.user,
          profile,
          isAdmin: !!adminUser,
          loading: false,
        });
      } else {
        set({
          user: null,
          profile: null,
          isAdmin: false,
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ loading: false });
    }
  },

  signIn: async ({ email, password }) => {
    try {
      // Check if admin login
      if (
        email === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
      ) {
        const {
          data: { user, session },
          error,
        } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        set({
          user,
          profile: null,
          isAdmin: true,
        });

        return { user, isAdmin: true };
      }

      const {
        data: { user, session },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      set({ user, profile });
      return { user, profile, isAdmin: false };
    } catch (error) {
      throw error;
    }
  },
  signUp: async ({ email, password, name }) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      console.log(user, "signup");

      // Create profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            name,
          },
        ])
        .select()
        .single();

      if (profileError) throw profileError;
      console.log(profile, "profile");

      set({ user, profile });
      return { user, profile };
    } catch (error) {
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, profile: null, isAdmin: false });
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (updates) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", updates.id)
        .select()
        .single();

      if (error) throw error;
      set({ profile });
      return profile;
    } catch (error) {
      throw error;
    }
  },
}));

// Auth state change listener
supabase.auth.onAuthStateChange(async (event, session) => {
  const authStore = useAuthStore.getState();

  if (event === "SIGNED_IN" && session?.user) {
    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    authStore.setState({
      user: session.user,
      profile,
    });
  } else if (event === "SIGNED_OUT") {
    authStore.setState({
      user: null,
      profile: null,
    });
  }
});