"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { decryptSecret } from "@/utils/crypto";

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

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const stored = localStorage.getItem("citizen_license");
      if (!stored) {
        setError("No wallet found on this device. Please register first.");
        setLoading(false);
        return;
      }

      const record = JSON.parse(stored);

      if (!record.encrypted_secret) {
        setError("Wallet data is missing or corrupted. Please re-register.");
        setLoading(false);
        return;
      }

      const secret = await decryptSecret(record.encrypted_secret, password);
      sessionStorage.setItem("unlocked_secret", secret);
      router.push("/wallet");
    } catch {
      setError("Incorrect password. Try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <div className="grid-bg" />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 28 }} className="anim-fade-up">

        {/* Back */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--text3)", fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: ".04em" }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </Link>

        {/* Header */}
        <div>
          <KakuhoLogo />
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", letterSpacing: "-.025em", marginTop: 20 }}>
            Unlock <span style={{ color: "var(--orange)" }}>Wallet.</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 8, lineHeight: 1.6 }}>
            Enter your password to access your ZK-secured credential.
          </p>
        </div>

        {/* Form card */}
        <div className="kk-card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <label className="kk-label">Wallet Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoFocus
                  className="kk-input"
                  style={{ paddingLeft: 44 }}
                />
                <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: .3 }} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,.07)", border: "1.5px solid rgba(239,68,68,.2)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#f87171", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 13h-2v-2h2v2zm0-4h-2V7h2v4z" /></svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-kk btn-orange" style={{ width: "100%", marginTop: 4 }}>
              {loading ? (
                <>
                  <span className="anim-spin" style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.25)", borderTopColor: "white", borderRadius: "50%", flexShrink: 0 }} />
                  Unlocking…
                </>
              ) : (
                <>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Unlock Wallet
                </>
              )}
            </button>
          </form>

          <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              No wallet?{" "}
              <Link href="/register" style={{ color: "var(--orange)", fontWeight: 700, fontSize: 12 }}>Register →</Link>
            </span>
          </div>
        </div>

        {/* Security note */}
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", background: "rgba(255,255,255,.02)", border: "1.5px solid var(--border)", borderRadius: 12 }}>
          <svg style={{ flexShrink: 0, opacity: .35, marginTop: 1 }} width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.6 }}>
            Password decrypts your local vault. Nothing is sent to any server — exactly like MetaMask.
          </p>
        </div>
      </div>
    </div>
  );
}
