import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getContractWithSigner } from '@/utils/chain';

export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const { registryCID, leafHash, publicName, rawData } = payload;

        if (!registryCID || !leafHash || !publicName || !rawData) {
            return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 });
        }

        const { error } = await supabase
            .from('identities')
            .insert({
                registry_cid: registryCID,
                leaf_hash: leafHash,
                public_name: publicName,
                raw_data: rawData,
                status: 'ACTIVE'
            });

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        // 2. ANCHOR ON-CHAIN (BLOCKCHAIN)
        try {
            const privateKey = process.env.ADMIN_PRIVATE_KEY || "";
            if (privateKey) {
                const contract = await getContractWithSigner(privateKey);
                // Convert leafHash to BigInt if it's hex, or use as is if numeric
                const leafBigInt = BigInt(leafHash);
                const tx = await contract.issueLicense(leafBigInt);
                await tx.wait();
                console.log('Successfully anchored on-chain:', tx.hash);
            } else {
                console.warn('Skipping on-chain anchoring: No ADMIN_PRIVATE_KEY found in environment.');
            }
        } catch (chainError: any) {
            console.error('Blockchain Anchoring Failed:', chainError.message);
            // We continue anyway since it's saved in DB
        }

        // Mark CID as used in pending_registries table
        if (registryCID) {
            const { error: updateError } = await supabase
                .from('pending_registries')
                .update({ used: true })
                .eq('cid', registryCID);
                
            if (updateError) {
                console.error("Failed to update pending_registries used status:", updateError);
            }
        }

        return NextResponse.json({ success: true, registryCID });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('Register Error:', message);
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
