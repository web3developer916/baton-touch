import { supabase } from "./supabase";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// 管理者アカウントの認証情報
// const ADMIN_CREDENTIALS = {
//   email: "admin@batontouch.jp",
//   password: "admin123",
// };

const RESEND_API_KEY = import.meta.env.NEXT_PUBLIC_RESEND_API_KEY;
const FROM_EMAIL = "no-reply@batontouch-iv.com"; // Resendで認証したドメインのメール

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: true,

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
              .eq("state", "active")
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
          set({ loading: true });

          // Check if admin login
          // if (
          //   email === ADMIN_CREDENTIALS.email &&
          //   password === ADMIN_CREDENTIALS.password
          // ) {
          //   const {
          //     data: { user, session },
          //     error,
          //   } = await supabase.auth.signInWithPassword({
          //     email,
          //     password,
          //   });

          //   if (error) throw error;

          //   set({
          //     user,
          //     profile: null,
          //     isAdmin: true,
          //   });

          //   return { user, isAdmin: true };
          // }

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
            .eq("state", "active")
            .single();

          set({ user, profile, loading: false });
          return profile;
        } catch (error) {
          throw error;
        }
      },
      signUp: async ({ email, password, name }) => {
        try {
          set({ loading: true });
          const {
            data: { user },
            error,
          } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          // await axios.post(
          //   "https://api.resend.com/emails",
          //   {
          //     from: FROM_EMAIL,
          //     to: email,
          //     subject: "アカウント確認メール",
          //     html: `
          //       <p>以下のリンクをクリックして、アカウントを確認してください。</p>
          //       <a href="https://yourapp.com/verify?email=${email}">確認する</a>
          //     `,
          //   },
          //   {
          //     headers: {
          //       Authorization: `Bearer ${RESEND_API_KEY}`,
          //       "Content-Type": "application/json",
          //     },
          //   }
          // );
          console.log(user, "signup");

          // Create profile
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: user.id,
                email,
                name,
              },
            ])
            .select()
            .single();

          if (profileError) throw profileError;
          console.log(profile, "profile");

          set({ user, profile, loading: false });
          return profile;
        } catch (error) {
          throw error;
        }
      },

      // verifyEmail: async (email) => {
      //   try {
      //     set({ loading: true });
      //     const { data, error } = await supabase
      //       .from("auth.users")
      //       .update({ email_confirmed_at: new Date() })
      //       .match({ email });
      //     if (error) throw error;
      //     set({ loading: false });
      //   } catch (error) {
      //     throw error;
      //   }
      // },

      signOut: async () => {
        try {
          set({ loading: true });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, profile: null, loading: false });
        } catch (error) {
          throw error;
        }
      },
      sendEmailChangeConfirmation: async (userId, newEmail) => {
        try {
          const { data, error } = await supabase.auth.admin.generateLink({
            type: "email_change",
            email: newEmail,
            options: {
              expires_in: 3600, // 1時間（秒）
              redirectTo: "https://your-app.com/confirm-email-change",
            },
          });

          if (error) {
            console.error("Error generating email change link:", error);
            return;
          }

          // Resend APIで確認メール送信
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "no-reply@yourdomain.com",
              to: newEmail,
              subject: "メールアドレス変更確認",
              html: `<p>以下のリンクをクリックしてメールアドレスを変更してください。（有効期限1時間）</p>
                         <a href="${data.action_link}">メールアドレス変更を確認</a>`,
            }),
          });
        } catch (error) {}
      },
      sendPasswordReset: async (email) => {
        try {
          const { data, error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
              redirectTo: "https://your-app.com/reset-password",
            }
          );

          if (error) {
            console.error("Error generating reset password link:", error);
            return;
          }

          // Resend APIでパスワードリセットメール送信
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "no-reply@yourdomain.com",
              to: email,
              subject: "パスワードリセット確認",
              html: `<p>以下のリンクをクリックしてパスワードをリセットしてください。（有効期限1時間）</p>
                         <a href="${data.action_link}">パスワードリセット</a>`,
            }),
          });
        } catch (error) {}
      },

      updateProfile: async (updates) => {
        try {
          set({ loading: true });
          const { data: profile, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", updates.id)
            .select()
            .single();

          if (error) throw error;
          set({ profile, loading: false });
          return profile;
        } catch (error) {
          throw error;
        }
      },
      resetPassword: async (newPassword, accessToken) => {
        const { error } = await supabase.auth.updateUser(
          {
            password: newPassword,
          },
          {
            access_token: accessToken,
          }
        );

        if (error) {
          console.error("Error resetting password:", error);
        } else {
          console.log("Password successfully reset!");
        }
      },
      deleteProfile: async (accountId, updates) => {
        try {
          set({ loading: true });
          console.log(accountId, "sdfsdf");
          const { data: profile, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", accountId)
            .select()
            .single();
          if (error) throw error;
          set({ profile: null, user: null, loading: false });
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: "auth-store",
    }
  )
);

// Auth state change listener
// supabase.auth.onAuthStateChange(async (event, session) => {
//   const authStore = useAuthStore.getState();

//   if (event === "SIGNED_IN" && session?.user) {
//     // Get user profile
//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("id", session.user.id)
//       .single();

//     authStore.setState({
//       user: session.user,
//       profile,
//     });
//   } else if (event === "SIGNED_OUT") {
//     authStore.setState({
//       user: null,
//       profile: null,
//     });
//   }
// });
