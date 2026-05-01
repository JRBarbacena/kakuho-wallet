import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const { leafHash, publicName, subject } = await req.json();

    if (!leafHash || !publicName) {
      return NextResponse.json({ success: false, error: "leafHash and publicName are required" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { error } = await supabase.from("identities").insert({
      leaf_hash: leafHash,
      public_name: publicName,
      subject,
      license_id: subject?.licenseID || null,
      status: "PENDING",
      leaf_index: null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
