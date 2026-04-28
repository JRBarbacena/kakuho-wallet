import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hash = searchParams.get('hash');

        if (!hash) {
            return NextResponse.json({ success: false, error: "Hash required" }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined') {
            return NextResponse.json({ success: false, error: "Database credentials missing" }, { status: 503 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data: identity, error } = await supabase
            .from('identities')
            .select('*')
            .eq('leaf_hash', hash)
            .single();

        if (error || !identity) {
            return NextResponse.json({ success: false, error: "Identity not found in Database" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: identity.raw_data,
            registryCID: identity.registry_cid,
            publicName: identity.public_name,
            status: identity.is_revoked ? 'REVOKED' : 'ACTIVE'
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}

