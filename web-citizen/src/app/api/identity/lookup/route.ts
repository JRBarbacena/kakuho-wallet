import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hash = searchParams.get("hash");

  if (!hash) {
    return NextResponse.json({ success: false, error: "Provide your leaf hash" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Both login and wallet import use leaf_hash — CID is no longer used for login
  const { data, error } = await supabase
    .from("identities")
    .select("*")
    .eq("leaf_hash", hash)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, error: "Hash not in registry" }, { status: 404 });
  }

  if (data.status === "REVOKED") {
    return NextResponse.json({ success: false, error: "This credential has been revoked" }, { status: 403 });
  }

  return NextResponse.json({
    success: true,
    leafHash: data.leaf_hash,
    publicName: data.public_name,
    data,
  });
}
