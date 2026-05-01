"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { generateIdentityProof } from "@/utils/zk-prove";
import { fetchAllLeaves, fetchRoot } from "@/utils/chain";
import { toFieldHex } from "@/lib/commitment";

const TREE_DEPTH = 20;

async function buildMerklePath(leaves: string[], leafIndex: number): Promise<string[]> {
  const { Barretenberg } = await import("@aztec/bb.js");
  const bb = await Barretenberg.new({ threads: 1 });

  const bigintToBytes = (n: bigint): Uint8Array => {
    const hex = n.toString(16).padStart(64, "0");
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return bytes;
  };

  const hashPair = async (l: bigint, r: bigint): Promise<bigint> => {
    const result = await bb.poseidon2Hash({ inputs: [bigintToBytes(l), bigintToBytes(r)] });
    return BigInt("0x" + Array.from(result.hash).map((b: number) => b.toString(16).padStart(2, "0")).join(""));
  };

  const size = Math.pow(2, TREE_DEPTH);
  const nodes: bigint[] = Array(size).fill(0n);
  for (let i = 0; i < leaves.length; i++) nodes[i] = BigInt(leaves[i]);

  const path: string[] = [];
  let idx = leafIndex;

  for (let level = 0; level < TREE_DEPTH; level++) {
    const siblingIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
    path.push(toFieldHex(nodes[siblingIdx]));

    const nextSize = Math.ceil(nodes.length / 2);
    const nextNodes: bigint[] = Array(nextSize).fill(0n);
    for (let i = 0; i < nextSize; i++) {
      const l = nodes[2 * i] ?? 0n;
      const r = nodes[2 * i + 1] ?? 0n;
      nextNodes[i] = await hashPair(l, r);
    }
    const paddedNext: bigint[] = Array(size).fill(0n);
    for (let i = 0; i < nextNodes.length; i++) paddedNext[i] = nextNodes[i];

    idx = Math.floor(idx / 2);
    nodes.splice(0, nodes.length, ...paddedNext);
  }

  await bb.destroy();
  return path;
}

const STEPS = [
  { label: "Fetching Merkle root from blockchain", sub: "Reading on-chain state…" },
  { label: "Computing Merkle inclusion path", sub: "Building proof witness…" },
  { label: "Generating ZK proof", sub: "Barretenberg WASM ~30s…" },
];

export default function ProvePage() {
  const [citizen, setCitizen] = useState<any>(null);
  const [isProving, setIsProving] = useState(false);
  const [proofData, setProofData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    const raw = localStorage.getItem("citizen_license");
    if (raw) setCitizen(JSON.parse(raw));
  }, []);

  const handleProve = async () => {
    if (!citizen) return;
    setIsProving(true);
    setError(null);
    setProofData(null);
    setCurrentStep(0);

    try {
      const [leaves, root] = await Promise.all([fetchAllLeaves(), fetchRoot()]);
      if (!leaves.length) throw new Error("No leaves found on chain. Wait for admin to anchor your identity.");

      const leafHash = citizen.leafHash || citizen.leaf_hash;
      if (!leafHash) throw new Error("No leaf hash stored. Complete registration first.");

      const leafIndex = leaves.findIndex((l: string) => l.toLowerCase() === leafHash.toLowerCase());
      if (leafIndex === -1) throw new Error("Your identity is not yet anchored to the blockchain. Contact your LTO officer.");

      setCurrentStep(1);
      const merklePath = await buildMerklePath(leaves, leafIndex);

      setCurrentStep(2);
      const result = await generateIdentityProof(
        citizen.secret,
        citizen.private_license_data,
        merklePath,
        leafIndex,
        citizen.public_name,
        toFieldHex(root)
      );

      const updated = { ...citizen, merkle_path: merklePath, leaf_index: leafIndex, public_merkle_root: root };
      localStorage.setItem("citizen_license", JSON.stringify(updated));

      const history = JSON.parse(localStorage.getItem("proof_history") || "[]");
      history.unshift({ nullifier: result.nullifier, ts: Date.now() });
      localStorage.setItem("proof_history", JSON.stringify(history.slice(0, 20)));

      setProofData(result);
    } catch (err: unknown) {
      setError((err as Error).message || "Proof generation failed.");
    } finally {
      setIsProving(false);
      setCurrentStep(-1);
    }
  };

  if (!citizen) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
        <div className="grid-bg" />
        <div style={{ position: "relative", zIndex: 1, background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 24, padding: 32, maxWidth: 360, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ width: 48, height: 48, background: "rgba(255,255,255,.05)", border: "1.5px solid var(--border)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
            <svg width="24" height="24" fill="none" stroke="var(--text3)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: "-.02em" }}>No Active Identity</h2>
            <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 6, lineHeight: 1.6 }}>You need to log in first to generate a proof.</p>
          </div>
          <Link href="/wallet" className="btn-kk btn-orange" style={{ width: "100%" }}>Go to Wallet</Link>
        </div>
      </div>
    );
  }

  const leafHash = citizen.leafHash || citizen.leaf_hash;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <div className="grid-bg" />
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", maxWidth: 860, margin: "0 auto", width: "100%", padding: "0 20px", overflow: "hidden" }}>

        {/* Header */}
        <header style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 0", borderBottom: "1.5px solid var(--border)" }}>
          <Link href="/wallet" style={{
            width: 36, height: 36, borderRadius: 11,
            background: "var(--bg2)", border: "1.5px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--text2)", flexShrink: 0, textDecoration: "none",
          }}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-.02em" }}>Identity Prover</h1>
          </div>
        </header>

        {/* Two-col on desktop */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "20px 0 32px", flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" as any }} id="prove-cols">

          {/* Identity card */}
          <div className="kk-card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span className="kk-label">Active Identity</span>
              <span className="badge-kk badge-green">
                <div style={{ width: 5, height: 5, borderRadius: "50%" }} className="dot-green anim-pulse" />
                Loaded
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <span className="kk-label" style={{ fontSize: 9, display: "block", marginBottom: 4 }}>Public Name</span>
                <code style={{ display: "block", background: "rgba(255,255,255,.03)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {citizen.firstName && citizen.lastName
                    ? `${citizen.firstName} ${citizen.lastName}`
                    : citizen.publicName || citizen.public_name || "—"}
                </code>
              </div>
              <div>
                <span className="kk-label" style={{ fontSize: 9, display: "block", marginBottom: 4 }}>Leaf Hash (Public Commitment)</span>
                <code style={{ display: "block", background: "rgba(249,115,22,.04)", border: "1.5px solid rgba(249,115,22,.12)", borderRadius: 10, padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)", color: "rgba(249,115,22,.7)", wordBreak: "break-all", lineHeight: 1.7 }}>
                  {leafHash || "Not found"}
                </code>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }} id="prove-right">

            {/* Pipeline */}
            <div className="kk-card" style={{ padding: 20 }}>
              <span className="kk-label" style={{ display: "block", marginBottom: 14 }}>Proof Pipeline</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {STEPS.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className={`step-dot ${currentStep > i ? "step-done" : currentStep === i ? "step-active" : "step-idle"}`}>
                      {currentStep > i
                        ? <svg width="13" height="13" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        : currentStep === i
                        ? <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--orange)" }} className="anim-pulse" />
                        : <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)" }}>{i + 1}</span>
                      }
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: 13, fontWeight: currentStep === i ? 700 : 500,
                        color: currentStep === i ? "var(--text)" : currentStep > i ? "var(--text3)" : "rgba(238,240,248,.22)",
                        transition: "all .3s",
                        textDecoration: currentStep > i ? "line-through" : "none",
                      }}>{s.label}</p>
                      {currentStep === i && <p style={{ fontSize: 11, color: "var(--orange)", marginTop: 2 }}>{s.sub}</p>}
                    </div>
                    {currentStep === i && (
                      <div className="anim-spin" style={{ width: 16, height: 16, border: "2px solid rgba(249,115,22,.2)", borderTopColor: "var(--orange)", borderRadius: "50%", flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Info note */}
            <div style={{ display: "flex", gap: 10, padding: "12px 14px", background: "rgba(255,255,255,.02)", border: "1.5px solid var(--border)", borderRadius: 12 }}>
              <svg style={{ flexShrink: 0, marginTop: 1, opacity: .3 }} width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
              <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.65 }}>Proof runs entirely in-browser — no private data leaves your device.</p>
            </div>

            {/* Prove button */}
            <button onClick={handleProve} disabled={isProving}
              className={`btn-kk ${isProving ? "btn-ghost" : "btn-cyan"}`}
              style={{ width: "100%", fontSize: 14, padding: 16 }}>
              {isProving ? (
                <>
                  <div className="anim-spin" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.2)", borderTopColor: "rgba(255,255,255,.6)", borderRadius: "50%", flexShrink: 0 }} />
                  {currentStep >= 0 ? STEPS[currentStep].label.split(" ").slice(0, 3).join(" ") + "…" : "Working…"}
                </>
              ) : (
                <>
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Generate ZK Proof
                </>
              )}
            </button>

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(239,68,68,.06)", border: "1.5px solid rgba(239,68,68,.2)", borderRadius: 14, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <svg style={{ flexShrink: 0 }} width="15" height="15" fill="#f87171" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 13h-2v-2h2v2zm0-4h-2V7h2v4z" /></svg>
                <p style={{ fontSize: 12, color: "#f87171", lineHeight: 1.6 }}>{error}</p>
              </div>
            )}

            {/* Proof result */}
            {proofData && (
              <div style={{ background: "rgba(34,197,94,.04)", border: "1.5px solid rgba(34,197,94,.2)", borderRadius: 18, padding: 20, display: "flex", flexDirection: "column", gap: 14 }} className="anim-pop">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(34,197,94,.12)", border: "1.5px solid rgba(34,197,94,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="13" height="13" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#4ade80", letterSpacing: ".07em", textTransform: "uppercase" }}>Proof Generated Successfully</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <span className="kk-label" style={{ fontSize: 9, display: "block", marginBottom: 5 }}>Nullifier Hash</span>
                    <code style={{ display: "block", background: "rgba(0,0,0,.25)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)", color: "oklch(0.72 0.18 200)", wordBreak: "break-all", lineHeight: 1.7 }}>{proofData.nullifier}</code>
                  </div>
                  <div>
                    <span className="kk-label" style={{ fontSize: 9, display: "block", marginBottom: 5 }}>Proof Bytes (truncated)</span>
                    <code style={{ display: "block", background: "rgba(0,0,0,.25)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text3)", wordBreak: "break-all", lineHeight: 1.7 }}>{proofData.proof.substring(0, 120)}…</code>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: .28 }}>
                  <svg width="11" height="11" fill="white" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "white", letterSpacing: ".25em", textTransform: "uppercase" }}>Verified by ZK Circuit · Kakuho</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media(min-width:768px){
          #prove-cols { flex-direction:row !important; gap:24px !important; align-items:flex-start !important; }
          #prove-cols > *:first-child { flex:1.3; }
          #prove-right { flex:1; }
        }
      `}</style>
    </div>
  );
}
