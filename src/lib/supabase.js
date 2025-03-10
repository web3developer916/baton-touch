import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase環境変数が設定されていません");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing Supabase environment variables");
// }

// // Retry configuration
// const retryConfig = {
//   maxRetries: 3,
//   retryDelay: 1000,
//   retryCondition: (error) => {
//     return (
//       error.message === "Failed to fetch" ||
//       error.code === "ECONNABORTED" ||
//       error.code === "ETIMEDOUT"
//     );
//   },
// };

// // Custom fetch with retry logic
// const customFetch = async (url, options) => {
//   let lastError;
//   for (let i = 0; i < retryConfig.maxRetries; i++) {
//     try {
//       const response = await fetch(url, {
//         ...options,
//         headers: {
//           ...options?.headers,
//           "Cache-Control": "no-cache",
//           Pragma: "no-cache",
//         },
//         keepalive: true,
//         signal: options?.signal,
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.message || "Network response was not ok");
//       }

//       return response;
//     } catch (error) {
//       lastError = error;
//       if (i < retryConfig.maxRetries - 1 && retryConfig.retryCondition(error)) {
//         await new Promise((resolve) =>
//           setTimeout(resolve, retryConfig.retryDelay * (i + 1))
//         );
//         continue;
//       }
//       break;
//     }
//   }
//   throw lastError;
// };

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: true,
//     storage: typeof window !== "undefined" ? window.localStorage : undefined,
//   },
//   global: {
//     headers: {
//       "X-Client-Info": "@supabase/supabase-js",
//     },
//   },
//   db: {
//     schema: "public",
//   },
//   realtime: {
//     params: {
//       eventsPerSecond: 10,
//     },
//   },
//   fetch: customFetch,
// });

// // Helper function to check database connection
// export async function checkDatabaseConnection() {
//   try {
//     // First, try to get existing record
//     const { data: existingData, error: selectError } = await supabase
//       .from("health_check")
//       .select()
//       .eq("status", "ok")
//       .limit(1);

//     // If no record exists or there's an error, try to create one
//     if (!existingData?.length || selectError) {
//       const { error: insertError } = await supabase
//         .from("health_check")
//         .insert([{ status: "ok" }]);

//       if (insertError) {
//         console.error("Failed to create health check record:", insertError);
//         return false;
//       }
//     }

//     // Update the last_check timestamp
//     const { error: updateError } = await supabase
//       .from("health_check")
//       .update({ last_check: new Date().toISOString() })
//       .eq("status", "ok");

//     if (updateError) {
//       console.error("Failed to update health check:", updateError);
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error("Database connection error:", error);
//     return false;
//   }
// }

// // Helper function for error handling
// export function handleSupabaseError(error) {
//   console.error("Supabase error:", error);

//   if (error.message === "Failed to fetch") {
//     return new Error(
//       "データベース接続エラー: インターネット接続を確認してください"
//     );
//   }

//   if (error.code === "PGRST301") {
//     return new Error("認証エラー: 再度ログインしてください");
//   }

//   if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
//     return new Error("タイムアウトエラー: 再度お試しください");
//   }

//   return new Error(error.message || "データベースエラーが発生しました");
// }

// // Add connection status monitoring
// let isConnected = true;
// let reconnectAttempts = 0;
// const maxReconnectAttempts = 5;

// export function getConnectionStatus() {
//   return isConnected;
// }

// async function monitorConnection() {
//   while (true) {
//     try {
//       const connected = await checkDatabaseConnection();
//       if (!connected && isConnected) {
//         isConnected = false;
//         reconnectAttempts = 0;
//         console.warn("Database connection lost");
//       } else if (connected && !isConnected) {
//         isConnected = true;
//         console.log("Database connection restored");
//       }

//       if (!isConnected && reconnectAttempts < maxReconnectAttempts) {
//         reconnectAttempts++;
//         await new Promise((resolve) =>
//           setTimeout(resolve, 5000 * reconnectAttempts)
//         );
//       }
//     } catch (error) {
//       console.error("Connection monitoring error:", error);
//     }
//     await new Promise((resolve) => setTimeout(resolve, 30000));
//   }
// }

// if (typeof window !== "undefined") {
//   monitorConnection();
// }
