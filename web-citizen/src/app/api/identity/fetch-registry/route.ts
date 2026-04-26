import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const supabase = getSupabase();
        if (!supabase) {
            return NextResponse.json({ success: false, error: "Database not initialized" }, { status: 503 });
        }

        const { searchParams } = new URL(req.url);
        const cid = searchParams.get('cid');

        if (!cid) {
            return NextResponse.json({ success: false, error: "Missing CID" }, { status: 400 });
        }

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

