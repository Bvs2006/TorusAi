import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const createClient = (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request })
  const configuredSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const configuredSupabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const hasSupabaseConfig = Boolean(configuredSupabaseUrl && configuredSupabaseKey)
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build"
  const supabaseUrl = configuredSupabaseUrl || "http://missing-supabase-url.invalid"
  const supabaseKey = configuredSupabaseKey || "missing-supabase-key"

  if (!hasSupabaseConfig && !isBuildPhase) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY before handling requests."
    )
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: This refreshes the user's session.
  // Do not remove — required for auth to work correctly.
  supabase.auth.getUser()

  return supabaseResponse
}
