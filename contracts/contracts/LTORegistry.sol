// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@zk-kit/imt.sol/LeanIMT.sol";

// Interface matching the auto-generated HonkVerifier.sol from `bb contract`
interface IHonkVerifier {
    function verify(bytes calldata proof, bytes32[] calldata publicInputs) external view returns (bool);
}

contract LTORegistry {
    using LeanIMT for LeanIMTData;
    LeanIMTData internal tree;
    address public admin;
    IHonkVerifier public verifier;

    uint256[] public driverLeaves;

    // Nullifier set — prevents double-proving
    mapping(bytes32 => bool) public usedNullifiers;

    event LicenseIssued(address indexed executor, uint256 indexed leafCommitment, uint256 timestamp);
    event LicenseRevoked(address indexed executor, uint256 indexed index, uint256 timestamp);
    event ProofVerified(address indexed prover, bytes32 nullifier, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only LTO Admin allowed");
        _;
    }

    // verifierAddress can be address(0) initially; set later via setVerifier()
    constructor(address verifierAddress) {
        admin = msg.sender;
        if (verifierAddress != address(0)) {
            verifier = IHonkVerifier(verifierAddress);
        }
    }

    function setVerifier(address verifierAddress) external onlyAdmin {
        verifier = IHonkVerifier(verifierAddress);
    }

    function issueLicense(uint256 leafCommitment) public onlyAdmin {
        tree.insert(leafCommitment);
        driverLeaves.push(leafCommitment);
        emit LicenseIssued(msg.sender, leafCommitment, block.timestamp);
    }

    function revokeLicense(uint256 index, uint256[] calldata siblings) public onlyAdmin {
        tree.update(index, 0, siblings);
        driverLeaves[index] = 0;
        emit LicenseRevoked(msg.sender, index, block.timestamp);
    }

    // On-chain ZK proof verification
    // publicInputs[0] = public_name (Field as bytes32)
    // publicInputs[1] = public_merkle_root (Field as bytes32)
    function verifyIdentityProof(
        bytes calldata proof,
        bytes32 nullifier,
        bytes32[] calldata publicInputs
    ) external returns (bool) {
        require(address(verifier) != address(0), "Verifier not set");
        require(!usedNullifiers[nullifier], "Proof already used");

        // Enforce that the public Merkle root in the proof matches on-chain state
        bytes32 onChainRoot = bytes32(tree.root());
        require(publicInputs.length >= 2, "Missing public inputs");
        require(publicInputs[1] == onChainRoot, "Merkle root mismatch");

        bool valid = verifier.verify(proof, publicInputs);
        require(valid, "Invalid ZK proof");

        usedNullifiers[nullifier] = true;
        emit ProofVerified(msg.sender, nullifier, block.timestamp);
        return true;
    }

    function getRoot() public view returns (uint256) {
        return tree.root();
    }

    function getAllLeaves() public view returns (uint256[] memory) {
        return driverLeaves;
    }

    function isNullifierUsed(bytes32 nullifier) external view returns (bool) {
        return usedNullifiers[nullifier];
    }
}
