"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateSecret, createFinalMerkleLeaf, stringToFieldHex } from "@/lib/commitment";
import { encryptSecret } from "@/utils/crypto";
import mockCitizens, { type CitizenSubject } from "@/lib/mockData";

type Step = "select" | "password" | "committing" | "done";

const KakuhoLogo = ({ size = 38 }: { size?: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * .3),
      background: "rgba(249,115,22,.12)", border: "1.5px solid rgba(249,115,22,.28)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 0 18px rgba(249,115,22,.12)",
    }}>
      <svg width={size * .55} height={size * .55} viewBox="0 0 24 24" fill="none">
        <path d="M12 4L5 7V11C5 15.42 8 19.54 12 21C16 19.54 19 15.42 19 11V7L12 4Z" fill="#F97316" opacity=".9" />
      </svg>
    </div>
    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".35em", color: "rgba(238,240,248,.35)", textTransform: "uppercase" }}>Kakuho</span>
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select");
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ leafHash: string; subject: CitizenSubject } | null>(null);

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : password.length < 14 ? 3 : 4;
  const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setError(null);
    setStep("committing");
    setProgress(0);

    try {
      const { subject } = mockCitizens[selectedIndex!];
      const fullName = `${subject.firstName} ${subject.lastName}`;
      const secret = generateSecret();
      const privateLicenseData = stringToFieldHex(subject.licenseID);
      const publicName = stringToFieldHex(fullName);
      const leafHash = await createFinalMerkleLeaf(secret, privateLicenseData, publicName);

      // Animate progress while awaiting
      const tick = setInterval(() => setProgress(p => Math.min(p + 4, 95)), 40);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leafHash, publicName: fullName, subject }),
      });
      const data = await res.json();
      clearInterval(tick);
      if (!data.success) throw new Error(data.error || "Registration failed");

      setProgress(100);
      const encryptedSecret = await encryptSecret(secret, password);

      localStorage.setItem("citizen_license", JSON.stringify({
        encrypted_secret: encryptedSecret,
        leafHash, publicName: fullName, public_name: publicName,
        private_license_data: privateLicenseData,
        subject, merkle_path: null, leaf_index: null, public_merkle_root: null,
      }));

      setResult({ leafHash, subject });
      setTimeout(() => setStep("done"), 300);
    } catch (err: unknown) {
      setError((err as Error).message || "Something went wrong.");
      setStep("password");
    }
  };

  /* ── Committing screen ── */
  if (step === "committing") {
    const pct = progress;
    const circumference = 2 * Math.PI * 40;
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", gap: 28, padding: 24, position: "relative" }}>
        <div className="grid-bg" />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }} className="anim-fade-up">
          <div style={{ position: "relative", width: 88, height: 88 }}>
            <svg style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }} viewBox="0 0 88 88" fill="none">
              <circle cx="44" cy="44" r="40" stroke="rgba(255,255,255,.06)" strokeWidth="4" />
              <circle cx="44" cy="44" r="40" stroke="var(--orange)" strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${pct * circumference / 100} ${circumference}`}
                style={{ transition: "stroke-dasharray .1s" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{pct}%</div>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, color: "var(--text)", letterSpacing: ".04em", textTransform: "uppercase" }}>Creating your wallet…</p>
            <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 6, lineHeight: 1.6 }}>Encrypting secret with your password.<br />Never leaves this device.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280 }}>
            {["Generating private secret", "Creating Merkle leaf hash", "Encrypting & storing vault"].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, opacity: pct > i * 33 ? 1 : .3, transition: "opacity .4s" }}>
                <div className={`step-dot ${pct > i * 33 + 30 ? "step-done" : pct > i * 33 ? "step-active" : "step-idle"}`}>
                  {pct > i * 33 + 30
                    ? <svg width="12" height="12" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    : <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--orange)" }} className="anim-pulse" />
                  }
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Done screen ── */
  if (step === "done" && result) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
        <div className="grid-bg" />
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 20 }} className="anim-pop">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(34,197,94,.1)", border: "1.5px solid rgba(34,197,94,.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="24" height="24" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-.02em" }}>Wallet Created!</h1>
              <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>
                Submitted as <strong style={{ color: "var(--text)" }}>{result.subject.firstName} {result.subject.lastName}</strong>. Wait for LTO admin to anchor to blockchain.
              </p>
            </div>
          </div>

          <div style={{ background: "rgba(249,115,22,.06)", border: "1.5px solid rgba(249,115,22,.2)", borderRadius: 16, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <svg width="13" height="13" fill="var(--orange)" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
              <span className="kk-label" style={{ color: "var(--orange)" }}>Public Leaf Hash</span>
            </div>
            <code style={{ display: "block", fontSize: 11, fontFamily: "var(--font-mono)", color: "rgba(249,115,22,.75)", wordBreak: "break-all", lineHeight: 1.8, background: "rgba(0,0,0,.2)", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(249,115,22,.1)" }}>
              {result.leafHash}
            </code>
            <p style={{ fontSize: 10, color: "rgba(249,115,22,.5)", marginTop: 8, fontWeight: 600 }}>Safe to share — this is your public identity anchor on-chain.</p>
          </div>

          <div style={{ background: "rgba(34,197,94,.04)", border: "1.5px solid rgba(34,197,94,.15)", borderRadius: 14, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <svg style={{ flexShrink: 0, marginTop: 2 }} width="15" height="15" fill="none" stroke="#4ade80" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>Your private secret is encrypted locally with your password — just like MetaMask. Use your password to log in.</p>
          </div>

          <button className="btn-kk btn-orange" style={{ width: "100%" }} onClick={() => router.push("/login")}>
            Go to Login
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </div>
      </div>
    );
  }

  /* ── Password step ── */
  if (step === "password") {
    const subject = mockCitizens[selectedIndex!].subject;
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
        <div className="grid-bg" />
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 24 }} className="anim-fade-up">
          <button onClick={() => { setStep("select"); setError(null); setPassword(""); setConfirmPassword(""); }}
            style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 12, fontWeight: 600, padding: 0, letterSpacing: ".04em" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
            Back
          </button>

          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", letterSpacing: "-.02em" }}>Create Password</h1>
            <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 6, lineHeight: 1.6 }}>This encrypts your vault locally. Required every login.</p>
          </div>

          {/* Identity chip */}
          <div className="kk-card-sm" style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--orange-lite)", border: "1.5px solid rgba(249,115,22,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "var(--orange)", flexShrink: 0 }}>
              {subject.firstName[0]}{subject.lastName[0]}
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 14 }}>{subject.firstName} {subject.lastName}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)", marginTop: 1 }}>{subject.licenseID}</p>
            </div>
          </div>

          <div className="kk-card" style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
            <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {error && <div style={{ background: "rgba(239,68,68,.07)", border: "1.5px solid rgba(239,68,68,.2)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#f87171", fontWeight: 600 }}>{error}</div>}

              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label className="kk-label">New Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters" required minLength={8} className="kk-input" />
                {password.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", gap: 3 }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: pwStrength >= i ? strengthColors[pwStrength] : "rgba(255,255,255,.08)", transition: "background .3s" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: strengthColors[pwStrength] || "var(--text3)" }}>{strengthLabels[pwStrength]}</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label className="kk-label">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password" required className="kk-input" />
              </div>

              <button type="submit" className="btn-kk btn-orange" style={{ width: "100%", marginTop: 4 }}>Create Wallet</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ── Select step (default) ── */
  const selected = selectedIndex !== null ? mockCitizens[selectedIndex].subject : null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      <div className="grid-bg" />
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", padding: "20px 20px 32px", maxWidth: 520, margin: "0 auto", width: "100%", gap: 0 }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 28 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--text3)", fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: ".04em" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
            Back
          </Link>
          <KakuhoLogo size={32} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }} className="anim-fade-up">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", letterSpacing: "-.025em", lineHeight: 1.15 }}>Register Identity</h1>
            <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 8, lineHeight: 1.6 }}>Select your pre-approved identity from the LTO registry to create your ZK wallet.</p>
          </div>

          {/* Citizen dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative" }}>
            <label className="kk-label">Select Citizen</label>

            {/* Trigger — shows selected or placeholder */}
            <div onClick={() => setDropdownOpen(o => !o)} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
              background: selectedIndex !== null ? "rgba(249,115,22,.07)" : "var(--bg2)",
              border: `1.5px solid ${dropdownOpen ? "rgba(249,115,22,.45)" : selectedIndex !== null ? "rgba(249,115,22,.3)" : "var(--border)"}`,
              borderRadius: 14, cursor: "pointer", transition: "all .18s",
              boxShadow: selectedIndex !== null ? "0 0 20px rgba(249,115,22,.08)" : "none",
            }}>
              {selectedIndex !== null ? (
                <>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "var(--orange-lite)", border: "1.5px solid rgba(249,115,22,.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: "var(--orange)", flexShrink: 0,
                  }}>
                    {mockCitizens[selectedIndex].subject.firstName[0]}{mockCitizens[selectedIndex].subject.lastName[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 14 }}>
                      {mockCitizens[selectedIndex].subject.firstName} {mockCitizens[selectedIndex].subject.lastName}
                    </p>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)", marginTop: 1 }}>
                      {mockCitizens[selectedIndex].subject.licenseID}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "rgba(255,255,255,.04)", border: "1.5px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="16" height="16" fill="none" stroke="var(--text3)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <p style={{ flex: 1, fontSize: 14, color: "var(--text3)" }}>Choose your identity…</p>
                </>
              )}
              {/* Chevron */}
              <svg style={{ flexShrink: 0, transition: "transform .2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)", color: "var(--text3)" }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>

            {/* Dropdown list */}
            {dropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                background: "var(--bg2)", border: "1.5px solid var(--border2)",
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,.45)",
              }} className="anim-fade-up">
                {mockCitizens.map((c, i) => (
                  <div key={i} onClick={() => { setSelectedIndex(i); setDropdownOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "13px 16px",
                    background: selectedIndex === i ? "rgba(249,115,22,.07)" : "transparent",
                    borderBottom: i < mockCitizens.length - 1 ? "1px solid var(--border)" : "none",
                    cursor: "pointer", transition: "background .15s",
                  }}
                  onMouseEnter={e => { if (selectedIndex !== i) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,.03)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = selectedIndex === i ? "rgba(249,115,22,.07)" : "transparent"; }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: selectedIndex === i ? "var(--orange-lite)" : "rgba(255,255,255,.06)",
                      border: `1.5px solid ${selectedIndex === i ? "rgba(249,115,22,.3)" : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800,
                      color: selectedIndex === i ? "var(--orange)" : "var(--text3)",
                      flexShrink: 0,
                    }}>
                      {c.subject.firstName[0]}{c.subject.lastName[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 14 }}>{c.subject.firstName} {c.subject.lastName}</p>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)", marginTop: 1 }}>{c.subject.licenseID}</p>
                    </div>
                    {selectedIndex === i && (
                      <svg width="14" height="14" fill="none" stroke="var(--orange)" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          {selected && (
            <div className="kk-card" style={{ padding: 18, borderColor: "rgba(249,115,22,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="kk-label">Credential Preview</span>
                <span className="badge-kk badge-orange">LTO Registry</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px" }}>
                {([["License ID", selected.licenseID], ["Blood Type", selected.bloodType], ["Date of Birth", selected.dateOfBirth], ["City", selected.addressCity], ["License Type", selected.licenseType], ["Expires", selected.expirationDate]] as [string, string][]).map(([l, v]) => (
                  <div key={l}>
                    <span className="kk-label" style={{ fontSize: 9, display: "block", marginBottom: 3 }}>{l}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text2)", fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="btn-kk btn-orange" style={{ width: "100%" }} disabled={selectedIndex === null} onClick={() => selectedIndex !== null && setStep("password")}>
            Continue
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>

          <p style={{ textAlign: "center", fontSize: 12, color: "var(--text3)" }}>
            Already registered?{" "}
            <Link href="/login" style={{ color: "var(--orange)", fontWeight: 700, fontSize: 12 }}>Log in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
