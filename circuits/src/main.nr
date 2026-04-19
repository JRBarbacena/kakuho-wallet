use dep::poseidon::poseidon::bn254;

// THE LTO SEMAPHORE V4 CIRCUIT
// This circuit proves a driver is in the National Chain Merkle Tree
// and derives a Nullifier for the traffic stop, without revealing their identity.

fn main(
    // --- PRIVATE WITNESSES ---
    secret: Field,
    private_license_data: Field,
    merkle_path: [Field; 20],
    leaf_index: u32,
    // --- PUBLIC INPUTS ---
    public_name: pub Field,
    scope: pub Field,
    public_merkle_root: pub Field,
) -> pub Field {
    // CONSTRAINT 1: Leaf Reconstruction
    let computed_leaf = bn254::hash_3([secret, private_license_data, public_name]);

    // CONSTRAINT 2: Merkle Inclusion Proof (Manual Loop)
    let mut computed_root = computed_leaf;
    let mut index = leaf_index;

    for i in 0..20 {
        let sibling = merkle_path[i];

        if index % 2 == 0 {
            computed_root = bn254::hash_2([computed_root, sibling]);
        } else {
            computed_root = bn254::hash_2([sibling, computed_root]);
        }

        index = index / 2;
    }

    // CONSTRAINT 3: State Verification
    assert(computed_root == public_merkle_root);

    // CONSTRAINT 4: Nullifier Derivation
    let nullifier = bn254::hash_2([secret, scope]);

    // Output the Nullifier
    nullifier
}
