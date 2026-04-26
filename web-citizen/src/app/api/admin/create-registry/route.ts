import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined') {
            return NextResponse.json({ success: false, error: "Database credentials missing" }, { status: 503 });
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const payload = await req.json();
        
        // Generate a random CID-like string
        const registryCID = "CID-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        // Auto-generate LTMS Portal ID (License ID)
        const licenseID = "N01-26-" + Math.floor(100000 + Math.random() * 900000);
        
        const newEntry = {
            registryCID,
            licenseID,
            ...payload
        };

        const { error } = await supabase
            .from('pending_registries')
            .insert({
                cid: registryCID,
                data: newEntry,
                used: false
            });

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ success: false, error: "Database error: " + error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, registryCID });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

