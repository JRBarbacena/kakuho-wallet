// utils/merkleTree.js
import { LeanIMT } from "@zk-kit/lean-imt";
import { poseidon2 } from "poseidon-lite";

export class LTOMerkleTree {
    constructor() {
        this.tree = null;
    }

    async initialize(existingLeaves = []) {
        const hashFunction = (...args) => {
            const nodes = Array.isArray(args[0]) ? args[0] : args;
            const a = BigInt(nodes[0].toString().startsWith("0x") ? nodes[0].toString() : "0x" + nodes[0].toString());
            const b = BigInt(nodes[1].toString().startsWith("0x") ? nodes[1].toString() : "0x" + nodes[1].toString());
            return "0x" + poseidon2([a, b]).toString(16);
        };

        this.tree = new LeanIMT(hashFunction);

        for (let leaf of existingLeaves) {
            this.tree.insert("0x" + BigInt(leaf.toString().startsWith("0x") ? leaf.toString() : "0x" + leaf.toString()).toString(16));
        }
    }

    insert(leaf) {
        this.tree.insert("0x" + BigInt(leaf.toString().startsWith("0x") ? leaf.toString() : "0x" + leaf.toString()).toString(16));
        return this.tree.root.toString();
    }

    getRoot() {
        if (this.tree === null || this.tree.leaves.length === 0) return "0";
        return this.tree.root.toString();
    }
}
