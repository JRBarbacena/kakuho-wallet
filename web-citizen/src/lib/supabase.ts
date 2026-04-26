import { createClient } from '@supabase/supabase-js';

let supabaseInstance: any = null;

export const getSupabase = () => {
    // If we're in a build environment without env vars, return null instead of crashing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase credentials missing. Returning null client for build compatibility.");
        return null;
    }

    if (!supabaseInstance) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
    
    return supabaseInstance;
};

// For backward compatibility
export const supabase = {
    from: (table: string) => {
        const client = getSupabase();
        if (!client) return { select: () => ({ order: () => ({ data: [], error: null }), eq: () => ({ single: () => ({ data: null, error: null }) }) }), insert: () => ({ error: null }), update: () => ({ eq: () => ({ error: null }) }), delete: () => ({ eq: () => ({ error: null }) }) } as any;
        return client.from(table);
    },
    auth: () => getSupabase()?.auth
};
