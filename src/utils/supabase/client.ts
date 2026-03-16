import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Estas variáveis vêm do seu ficheiro .env.local
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}