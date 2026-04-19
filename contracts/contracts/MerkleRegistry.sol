pragma solidity ^0.8.20;

// 1. Import the LeanIMT library from ZK-Kit
import "@zk-kit/imt.sol/LeanIMT.sol";

contract MerkleRegistry {
    // 2. THE FIX: Apply the LeanIMT library math to the LeanIMTData struct
    using LeanIMT for LeanIMTData; 
    
    // 3. Declare the tree using the proper struct name
    LeanIMTData internal tree;
    
    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only LTO Admin allowed");
        _;
    }

    constructor() {
        admin = msg.sender;
    }
    // 2. ADMIN ADDS A DRIVER (Issuance)
    function issueLicense(uint256 leafCommitment) public onlyAdmin {
        tree.insert(leafCommitment); // The ZK-Kit library handles all the math instantly
    }

    // 3. ADMIN REVOKES A DRIVER 
    function revokeLicense(uint256 index) public onlyAdmin {
        // To revoke, the Admin just updates the driver's specific index to a 0 hash
        tree.update(index, 0); 
    }

    // 4. GET THE ROOT (For the public to verify against)
    function getRoot() public view returns (uint256) {
        return tree.root();
    }
}