import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const adminPrivateKey = process.env.ADMIN_PRIVATE_KEY;

        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined') {
            return NextResponse.json({ success: false, error: "Database credentials missing" }, { status: 503 });
        }
        if (!adminPrivateKey) {
            return NextResponse.json({ success: false, error: "Admin private key missing" }, { status: 503 });
        }

        const payload = await req.json();

        // Two entry paths:
        // A) Citizen-initiated: citizen sends leafHash computed on their device (secret stays with them)
        // B) Admin-initiated: admin form sends { publicName, subject } — we generate secret + leafHash here
        let { leafHash, publicName, subject, licenseID: incomingLicenseID } = payload;

        if (!leafHash) {
            // Admin-initiated registration — compute leaf hash server-side
            const { computeLeafHash, stringToFieldHex } = await import('@/lib/commitment');
            const randomBytes = crypto.getRandomValues(new Uint8Array(32));
            const secret = "0x" + Array.from(randomBytes).map((b: number) => b.toString(16).padStart(2, "0")).join("");
            const privateLicenseData = stringToFieldHex(subject?.licenseID || "");
            const publicNameField = stringToFieldHex(publicName || subject?.name || "");
            leafHash = await computeLeafHash(secret, privateLicenseData, publicNameField);
        }

        // Step 3 finalisation: anchor leaf hash to the blockchain
        const { ethers } = await import('ethers');
        const REGISTRY_ABI = [
            "function issueLicense(uint256 leafCommitment) public",
            "function getAllLeaves() public view returns (uint256[] memory)",
            "function getRoot() public view returns (uint256)",
            "function revokeLicense(uint256 index, uint256[] calldata siblings) public",
            "function admin() public view returns (address)"
        ];
        const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS!;
        const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;

        const provider = new ethers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(adminPrivateKey, provider);
        const contract = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, wallet);

        // Get leaf index BEFORE inserting (it will be leaves.length after insert)
        const currentLeaves = await contract.getAllLeaves();
        const leafIndex = currentLeaves.length;

        const tx = await contract.issueLicense(BigInt(leafHash));
        const receipt = await tx.wait();

        // Fetch the new Merkle root after insertion
        const newRoot = await contract.getRoot();
        const merkleRoot = "0x" + BigInt(newRoot).toString(16).padStart(64, "0");

        // Write the final record to Supabase identities table
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const licenseID = incomingLicenseID || subject?.licenseID || ("N01-26-" + Math.floor(100000 + Math.random() * 900000));

        const { error: dbError } = await supabase.from('identities').upsert({
            license_id: licenseID,
            leaf_hash: leafHash,
            public_name: publicName || subject?.name || "Unknown",
            subject,
            leaf_index: leafIndex,
            merkle_root: merkleRoot,
            tx_hash: receipt.hash,
            status: "ACTIVE",
            created_at: new Date().toISOString(),
        }, { onConflict: 'leaf_hash' });

        if (dbError) {
            console.error('Supabase Error:', dbError);
            return NextResponse.json({ success: false, error: "Database error: " + dbError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            licenseID,
            leafIndex,
            merkleRoot,
            txHash: receipt.hash,
        });
    } catch (error: any) {
        console.error("create-registry error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
