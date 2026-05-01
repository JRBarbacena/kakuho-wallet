import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hash = searchParams.get('hash');
        if (!hash) return NextResponse.json({ found: false, error: 'No hash provided' }, { status: 400 });

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined') {
            return NextResponse.json({ found: false, error: 'Database credentials missing' }, { status: 503 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await supabase
            .from('identities')
            .select('*')
            .eq('leaf_hash', hash)
            .single();

        if (error || !data) return NextResponse.json({ found: false });
        return NextResponse.json({ found: true, name: data.public_name, is_revoked: data.is_revoked });
    } catch (err: any) {
        return NextResponse.json({ found: false, error: err.message }, { status: 500 });
    }
}
