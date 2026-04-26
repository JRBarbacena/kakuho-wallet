import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials missing. Please check your Environment Variables.');
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

// Lazy proxy so existing code can still use `supabase.from(...)` unchanged
export const supabase = {
  from: (table: string) => getSupabase().from(table),
  auth: getSupabase,
};

export type CitizenData = {
  license_id: string
  first_name: string
  last_name: string
  dob: string
  license_type: 'STUDENT' | 'NON_PRO'
  expiration_date: string
  blood_type: string
  address_city: string
  admin_hash: string
}
