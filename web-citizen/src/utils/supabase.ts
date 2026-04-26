import { SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = async (): Promise<SupabaseClient | null> => {
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
      const { createClient } = await import('@supabase/supabase-js');
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
  from: (table: string) => ({
    select: (...args: any[]) => ({
      order: (...args: any[]) => ({
        eq: (...args: any[]) => ({
          single: async () => {
            const client = await getSupabase();
            if (!client) return { data: null, error: { message: "Build mode" } };
            return client.from(table).select(...args).order(...args).eq(...args).single();
          }
        }),
        async then(resolve: any) {
          const client = await getSupabase();
          if (!client) return resolve({ data: [], error: { message: "Build mode" } });
          const res = await client.from(table).select(...args).order(...args);
          resolve(res);
        }
      }),
      async then(resolve: any) {
        const client = await getSupabase();
        if (!client) return resolve({ data: [], error: { message: "Build mode" } });
        const res = await client.from(table).select(...args);
        resolve(res);
      }
    }),
    insert: async (...args: any[]) => {
      const client = await getSupabase();
      if (!client) return { error: { message: "Build mode" } };
      return client.from(table).insert(...args);
    },
    update: (...args: any[]) => ({
      eq: async (...args2: any[]) => {
        const client = await getSupabase();
        if (!client) return { error: { message: "Build mode" } };
        return client.from(table).update(...args).eq(...args2);
      }
    })
  }) as any,
  auth: async () => {
    const client = await getSupabase();
    return client?.auth;
  },
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
