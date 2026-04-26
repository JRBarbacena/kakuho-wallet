import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const cid = searchParams.get('cid');

        if (!cid) {
            return NextResponse.json({ success: false, error: "CID required" }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined') {
            return NextResponse.json({ success: false, error: "Database credentials missing" }, { status: 503 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data: registry, error } = await supabase
            .from('pending_registries')
            .select('*')
            .eq('cid', cid)
            .single();

        if (error || !registry) {
            return NextResponse.json({ success: false, error: "Registry not found" }, { status: 404 });
        }

        if (registry.used) {
            return NextResponse.json({ success: false, error: "This Registry CID has already been activated." }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: registry.data });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

