import { createBrowserClient } from "@supabase/ssr";

const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const configuredSupabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const hasSupabaseConfig = Boolean(configuredSupabaseUrl && configuredSupabaseKey);
const supabaseUrl = configuredSupabaseUrl || "http://missing-supabase-url.invalid";
const supabaseKey = configuredSupabaseKey || "missing-supabase-key";

export const createClient = () => {
  if (!hasSupabaseConfig && typeof window !== "undefined") {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY before running the app."
    );
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
};
