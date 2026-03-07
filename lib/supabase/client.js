import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// TEMPORARY DEV FALLBACK - Replace with real credentials from your team
let supabase

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase environment variables - using temporary fallback')
  console.warn('⚠️ Database features will not work. Get credentials from your team!')
  
  // Create a mock client that won't crash the app
  const mockUrl = 'https://placeholder.supabase.co'
  const mockKey = 'placeholder-key-replace-with-real-credentials'
  
  supabase = createClient(mockUrl, mockKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
} else {
  // Client-side Supabase client (safe for browser)
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export { supabase }
