import { poseidon2 } from 'poseidon-lite';

/**
 * A simple Poseidon-based Merkle Tree implementation compatible with LeanIMT.
 */
export class MerkleTree {
  leaves: bigint[];
  depth: number;

  constructor(leaves: string[], depth: number = 20) {
    this.leaves = leaves.map(l => BigInt(l));
    this.depth = depth;
  }

  getRoot(): bigint {
    return this.calculateRoot(this.leaves, this.depth);
  }

  private calculateRoot(nodes: bigint[], depth: number): bigint {
    if (depth === 0) return nodes[0] || 0n;
    
    const nextNodes: bigint[] = [];
    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i];
      const right = nodes[i + 1] || 0n;
      nextNodes.push(poseidon2([left, right]));
    }
    
    // Fill with zero hashes if empty
    if (nextNodes.length === 0) {
      return this.calculateRoot([0n], depth - 1);
    }

    return this.calculateRoot(nextNodes, depth - 1);
  }

  getProof(index: number): string[] {
    const proof: string[] = [];
    let currentNodes = [...this.leaves];
    let currentIndex = index;

    for (let i = 0; i < this.depth; i++) {
      const isRight = currentIndex % 2 === 1;
      const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1;
      const sibling = currentNodes[siblingIndex] || 0n;
      
      proof.push("0x" + sibling.toString(16).padStart(64, '0'));

      // Calculate next level
      const nextNodes: bigint[] = [];
      for (let j = 0; j < currentNodes.length; j += 2) {
        nextNodes.push(poseidon2([currentNodes[j], currentNodes[j + 1] || 0n]));
      }
      currentNodes = nextNodes;
      currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
  }
}
