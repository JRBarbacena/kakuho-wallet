use std::hash::poseidon::bn254;

fn main(
    // --- PRIVATE WITNESSES ---
    secret: Field,
    private_license_data: Field,
    merkle_path: [Field; 20],
    leaf_index: u32,
    // --- PUBLIC INPUTS ---
    public_name: pub Field,
    public_merkle_root: pub Field
) {
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
}
