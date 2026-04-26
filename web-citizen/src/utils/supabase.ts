import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  // If we're in a build phase, return a mock/null to prevent crashes
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined') {
    console.warn('Supabase credentials missing or invalid. Returning null client.');
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.error("Failed to create Supabase client:", e);
      return null;
    }
  }
  
  return supabaseInstance;
};

// Lazy proxy so existing code can still use `supabase.from(...)` unchanged
export const supabase = {
  from: (table: string) => {
    const client = getSupabase();
    if (!client) return { select: () => ({ order: () => ({ data: [], error: null }), eq: () => ({ single: () => ({ data: null, error: null }) }) }), insert: () => ({ error: null }), update: () => ({ eq: () => ({ error: null }) }), delete: () => ({ eq: () => ({ error: null }) }) } as any;
    return client.from(table);
  },
  auth: () => getSupabase()?.auth,
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
