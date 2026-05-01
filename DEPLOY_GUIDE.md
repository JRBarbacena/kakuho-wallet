# Deployment Guide — Hybrid Transparency

## What's already done (by Claude)
- `LTORegistry.sol` updated: accepts verifier address, has `verifyIdentityProof()`, nullifier tracking
- `hardhat.config.ts` updated: Sepolia network added, reads from `.env`
- `contracts/scripts/deploy_sepolia.js` written: full deploy sequence
- `contracts/.env.example` written: template for secrets

---

## Step 1 — Generate HonkVerifier.sol from your Noir circuit

> Requires: `bb` (Barretenberg CLI) installed. If not installed:
> ```
> curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/master/barretenberg/bbup/install | bash
> bbup -nv 0.82.2
> ```

Run from the `circuits/` folder:

```bash
cd circuits

# Compile circuit (if not already compiled)
nargo compile

# Generate verification key
bb write_vk -b ./target/hybrid_transparency.json -o ./target/vk

# Generate Solidity verifier contract
bb contract -k ./target/vk -o ../contracts/contracts/HonkVerifier.sol
```

This creates `contracts/contracts/HonkVerifier.sol` — the auto-generated on-chain verifier.

---

## Step 2 — Set up Alchemy (Sepolia RPC)

1. Go to https://alchemy.com → create free account
2. Create app → select **Ethereum Sepolia**
3. Copy the HTTPS URL: `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`

---

## Step 3 — Get Sepolia ETH (testnet faucet)

You need ~0.1 ETH on Sepolia to pay gas for deployment.

- https://sepoliafaucet.com (requires Alchemy account)
- https://faucet.quicknode.com/ethereum/sepolia

Use your **deployer wallet** address (the wallet whose private key you'll use).

---

## Step 4 — Create contracts/.env

```bash
cd contracts
cp .env.example .env
```

Edit `.env`:
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
DEPLOYER_PRIVATE_KEY=0xYOUR_WALLET_PRIVATE_KEY
```

> ⚠️ Never commit `.env`. It's already gitignored.

---

## Step 5 — Deploy HonkVerifier first, then LTORegistry

### Option A — HonkVerifier exists (Step 1 done)

Deploy both in one command:

```bash
cd contracts
npx hardhat run scripts/deploy_sepolia.js --network sepolia
```

This deploys with `verifierAddress = address(0)` (no verifier yet). Then deploy HonkVerifier separately and call `setVerifier()`.

### Option B — Deploy HonkVerifier separately via Hardhat console

After running the deploy script, note the LTORegistry address. Then:

```bash
npx hardhat console --network sepolia
```

```js
const HonkVerifier = await ethers.getContractFactory("HonkVerifier");
const verifier = await HonkVerifier.deploy();
await verifier.waitForDeployment();
console.log("HonkVerifier:", verifier.target);

// Wire it to LTORegistry
const registry = await ethers.getContractAt("LTORegistry", "0xYOUR_REGISTRY_ADDRESS");
await registry.setVerifier(verifier.target);
console.log("Verifier set.");
```

---

## Step 6 — Update web-citizen .env.local

```
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_REGISTRY_ADDRESS=0xYOUR_NEW_SEPOLIA_REGISTRY_ADDRESS
NEXT_PUBLIC_ADMIN_URL=https://YOUR_ADMIN_VERCEL_URL/admin
```

---

## Step 7 — Deploy to Vercel

### web-citizen
1. Push branch to GitHub
2. Go to vercel.com → Import project → select `web-citizen` folder as root
3. Add environment variables (from `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_REGISTRY_ADDRESS`
   - `NEXT_PUBLIC_RPC_URL`
   - `NEXT_PUBLIC_ADMIN_URL`
4. Deploy

### web-admin (same process)
Set root directory to `web-admin`, same env vars.

---

## Summary of addresses to track

| Contract | Network | Address |
|----------|---------|---------|
| LTORegistry (old, local) | Hardhat localhost | 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 |
| PoseidonT3 | Sepolia | TBD after deploy |
| LeanIMT | Sepolia | TBD after deploy |
| HonkVerifier | Sepolia | TBD after deploy |
| LTORegistry (new) | Sepolia | TBD after deploy |
