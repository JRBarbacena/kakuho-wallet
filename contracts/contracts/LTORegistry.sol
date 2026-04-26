// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@zk-kit/imt.sol/LeanIMT.sol";

contract LTORegistry {
    using LeanIMT for LeanIMTData; 
    LeanIMTData internal tree;
    address public admin;

    // NEW: The Private Chain Database (Stores every single driver directly on-chain)
    uint256[] public driverLeaves;

    event LicenseIssued(address indexed executor, uint256 indexed leafCommitment, uint256 timestamp);
    event LicenseRevoked(address indexed executor, uint256 indexed index, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only LTO Admin allowed");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function issueLicense(uint256 leafCommitment) public onlyAdmin {
        // 1. Do the secure math
        tree.insert(leafCommitment);
        
        // 2. Save it to our permanent on-chain array
        driverLeaves.push(leafCommitment); 
        
        emit LicenseIssued(msg.sender, leafCommitment, block.timestamp);
    }

    function revokeLicense(uint256 index, uint256[] calldata siblings) public onlyAdmin {
        // 1. Update the math
        tree.update(index, 0, siblings); 
        
        // 2. Update the on-chain array (set the revoked driver to 0)
        driverLeaves[index] = 0; 
        
        emit LicenseRevoked(msg.sender, index, block.timestamp);
    }

    function getRoot() public view returns (uint256) {
        return tree.root();
    }

    // NEW: The function the Frontend will use to generate Merkle Paths!
    function getAllLeaves() public view returns (uint256[] memory) {
        return driverLeaves;
    }
}