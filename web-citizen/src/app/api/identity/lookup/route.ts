import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const hash = searchParams.get('hash');

        if (!hash) {
            return NextResponse.json({ success: false, error: "Missing Merkle Leaf Hash" }, { status: 400 });
        }

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
            status: identity.status
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
