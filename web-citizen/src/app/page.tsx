"use client";

import Link from "next/link";

const KakuhoLogo = ({ size = 38 }: { size?: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: size, height: size,
      borderRadius: Math.round(size * .3),
      background: "rgba(249,115,22,.12)",
      border: "1.5px solid rgba(249,115,22,.28)",
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

const HeroVisual = () => (
  <div style={{ position: "relative", width: 300, height: 300, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle,oklch(0.72 0.18 200/.12) 0%,rgba(249,115,22,.06) 50%,transparent 75%)", borderRadius: "50%" }} />

    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: "spin 22s linear infinite" }} viewBox="0 0 300 300">
      <circle cx="150" cy="150" r="130" fill="none" stroke="oklch(0.72 0.18 200)" strokeWidth="1" strokeOpacity=".18" strokeDasharray="8 14" />
    </svg>
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: "spin 14s linear infinite reverse" }} viewBox="0 0 300 300">
      <circle cx="150" cy="150" r="100" fill="none" stroke="rgba(249,115,22,.22)" strokeWidth="1" strokeDasharray="4 10" />
    </svg>
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: "spin 30s linear infinite" }} viewBox="0 0 300 300">
      <circle cx="150" cy="150" r="68" fill="none" stroke="oklch(0.72 0.18 200)" strokeWidth="1" strokeOpacity=".12" strokeDasharray="3 8" />
    </svg>

    {/* Center shield */}
    <div style={{
      width: 88, height: 88, borderRadius: 24,
      background: "rgba(249,115,22,.12)",
      border: "1.5px solid rgba(249,115,22,.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 0 40px rgba(249,115,22,.2),0 0 80px oklch(0.72 0.18 200/.1)",
      position: "relative", zIndex: 2,
      backdropFilter: "blur(8px)",
    }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path d="M12 4L5 7V11C5 15.42 8 19.54 12 21C16 19.54 19 15.42 19 11V7L12 4Z" fill="#F97316" opacity=".9" />
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>

    {/* Floating labels */}
    {(["0x3a7f…", "ZK–", "SHA256", "Merkle"] as const).map((t, i) => {
      const positions = [
        { top: "8%", left: "62%" }, { top: "72%", left: "62%" },
        { top: "78%", left: "10%" }, { top: "12%", left: "8%" },
      ];
      return (
        <div key={t} style={{
          position: "absolute", ...positions[i],
          fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700,
          color: i % 2 === 0 ? "oklch(0.72 0.18 200)" : "rgba(249,115,22,.7)",
          opacity: .55, letterSpacing: ".04em",
          animation: `pulse ${2 + i * .5}s ease-in-out infinite`,
          animationDelay: `${i * .4}s`,
        }}>{t}</div>
      );
    })}
  </div>
);

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      <div className="grid-bg" />

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Nav */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px" }}>
          <KakuhoLogo />
        </nav>

        {/* Hero — stable two-column via CSS class */}
        <div className="hero-layout anim-fade-up">

          {/* Left: text + CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 540 }}>
            <div>
              <h1 style={{
                fontSize: "clamp(2.8rem,9vw,5rem)", fontWeight: 700,
                lineHeight: .93, letterSpacing: "-.035em", color: "var(--text)",
              }}>
                Your Identity.<br />
                <span style={{ color: "var(--orange)" }}>Your Proof.</span>
              </h1>
              <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, marginTop: 16, maxWidth: 400 }}>
                ZK-SNARK digital credential anchored to the blockchain. Your secret never leaves your device.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/login" className="btn-kk btn-orange" style={{ flex: "1 1 160px" }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Unlock Wallet
              </Link>
              <Link href="/register" className="btn-kk btn-ghost" style={{ flex: "1 1 160px" }}>
                Register Identity
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: ZK visual — hidden on mobile, shown on desktop via CSS */}
          <div className="hero-visual">
            <HeroVisual />
          </div>
        </div>
      </div>
    </div>
  );
}
