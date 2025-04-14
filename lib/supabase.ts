import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a single supabase client for interacting with your database on the server
export const createServerSupabaseClient = () => {
  return createClient<Database>(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "", {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// For client-side usage (with anon key)
let clientSupabaseClient: ReturnType<typeof createClient<Database>> | null = null

export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient

  clientSupabaseClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storageKey: "supabase-auth",
      },
    },
  )

  return clientSupabaseClient
}
