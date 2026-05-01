import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { leafHash } = await req.json();
        if (!leafHash) return NextResponse.json({ success: false, error: 'No hash provided' }, { status: 400 });

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined') {
            return NextResponse.json({ success: false, error: 'Database credentials missing' }, { status: 503 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { error } = await supabase
            .from('identities')
            .update({ status: 'REVOKED' })
            .eq('leaf_hash', leafHash);

        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
