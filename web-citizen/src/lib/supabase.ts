import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

let supabaseInstance: any = null;

export const getSupabase = () => {
    if (supabaseInstance) return supabaseInstance;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase credentials missing. Please check your Environment Variables.");
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
};

// For backward compatibility with existing imports
export const supabase = {
    from: (table: string) => getSupabase().from(table),
    auth: () => getSupabase().auth
};
