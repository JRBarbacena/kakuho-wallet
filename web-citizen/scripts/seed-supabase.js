import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createIdentityLeafHash } from '../src/lib/commitment.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase keys in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const mockData = [
    {
        public_name: "Jose Carmona",
        is_revoked: false,
        raw_data: { 
            firstName: "Jose", 
            lastName: "Carmona", 
            secretHash: "482901773",
            licenseId: "N01-26-991234", 
            licenseType: "NON-PRO", 
            bloodType: "O+", 
            age: "35", 
            gender: "Male", 
            nationality: "Filipino", 
            contact: "0917-888-0000",
            cid: "CID-11223344"
        }
    },
    {
        public_name: "Gloria Dela Cruz",
        is_revoked: false,
        raw_data: { 
            firstName: "Gloria", 
            lastName: "Dela Cruz", 
            secretHash: "591284660",
            licenseId: "N01-26-882233", 
            licenseType: "STUDENT", 
            bloodType: "A+", 
            age: "19", 
            gender: "Female", 
            nationality: "Filipino", 
            contact: "0918-777-1111",
            cid: "CID-55667788"
        }
    },
    {
        public_name: "Oscar Sosa",
        is_revoked: false,
        raw_data: { 
            firstName: "Oscar", 
            lastName: "Sosa", 
            secretHash: "703115228",
            licenseId: "N01-26-773344", 
            licenseType: "PROFESSIONAL", 
            bloodType: "B+", 
            age: "42", 
            gender: "Male", 
            nationality: "Filipino", 
            contact: "0919-666-2222",
            cid: "CID-99001122"
        }
    }
];

const normalizedMockData = mockData.map((item) => ({
    ...item,
    leaf_hash: createIdentityLeafHash(
        item.raw_data.secretHash,
        item.raw_data.licenseId,
        item.public_name
    )
}));

async function seedSupabase() {
    console.log("🚀 Refreshing Supabase with Premium Identity Data...");
    
    for (const item of normalizedMockData) {
        const { error } = await supabase
            .from('identities')
            .upsert(item, { onConflict: 'leaf_hash' });
        
        if (error) {
            console.error(`❌ Failed to insert ${item.public_name}:`, error.message);
        } else {
            console.log(`✅ Success: ${item.public_name} is now upgraded!`);
        }
    }
    
    console.log("✨ All data refreshed. You can now use these hashes in the app!");
}

seedSupabase();
