"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";
import { Html5Qrcode } from "html5-qrcode";
import { QRCodeSVG } from "qrcode.react";
import { fetchRoot } from "@/utils/chain";

/* ── Logo ── */
const KakuhoLogo = ({ size = 34 }: { size?: number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * .3),
      background: "rgba(249,115,22,.12)", border: "1.5px solid rgba(249,115,22,.28)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width={size * .55} height={size * .55} viewBox="0 0 24 24" fill="none">
        <path d="M12 4L5 7V11C5 15.42 8 19.54 12 21C16 19.54 19 15.42 19 11V7L12 4Z" fill="#F97316" opacity=".9" />
      </svg>
    </div>
    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".35em", color: "rgba(238,240,248,.35)", textTransform: "uppercase" }}>Kakuho</span>
  </div>
);

/* ── Connections view ── */
const ConnectionsView = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 0 80px" }} className="anim-fade-up">
    <div>
      <span className="kk-label" style={{ display: "block", marginBottom: 4 }}>System Scope</span>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-.015em" }}>Institutional Partners</h2>
    </div>

    {/* Active partner */}
    <div style={{ background: "var(--bg2)", border: "1.5px solid oklch(0.72 0.18 200/.18)", borderRadius: 18, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "var(--orange-lite)", border: "1.5px solid rgba(249,115,22,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="26" height="26" fill="var(--orange)" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 14, lineHeight: 1.4 }}>Republic of the Philippines<br />Land Transportation Office</p>
          <p style={{ fontSize: 10, color: "var(--text3)", marginTop: 4, letterSpacing: ".08em", textTransform: "uppercase" }}>Verified Identity Registry</p>
        </div>
        <span className="badge-kk badge-green">
          <div style={{ width: 7, height: 7, borderRadius: "50%" }} className="dot-green anim-pulse" />
          Live
        </span>
      </div>
    </div>

    <span className="kk-label">Coming Soon</span>
    {[{ l: "Financial Institute", s: "Banking Verification" }, { l: "University System", s: "Academic Credentials" }].map(it => (
      <div key={it.l} style={{ background: "rgba(255,255,255,.02)", border: "1.5px dashed var(--border)", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", gap: 14, opacity: .4 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,.03)", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="22" height="22" fill="none" stroke="var(--text3)" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <div>
          <p style={{ fontWeight: 700, color: "var(--text2)", fontSize: 14, fontStyle: "italic" }}>{it.l}</p>
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2, textTransform: "uppercase", letterSpacing: ".08em" }}>{it.s}</p>
        </div>
      </div>
    ))}
  </div>
);

/* ── QR Scanner modal ── */
const QRScannerModal = ({ onScan, onError, onClose }: { onScan: (d: string) => void; onError: (m: string) => void; onClose: () => void }) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } },
      (decoded) => { onScan(decoded); html5QrCode.stop().then(() => onClose()); },
      () => {}
    ).then(() => setIsReady(true)).catch(err => { console.error(err); onError("Camera Access Denied or Failed"); onClose(); });
    return () => { if (html5QrCode.isScanning) html5QrCode.stop().catch(e => console.error(e)); };
  }, [onScan, onError, onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(13,15,20,.98)", zIndex: 250, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(24px)" }} className="anim-fade-in">
      <div style={{ width: "100%", maxWidth: 360, aspectRatio: "1", background: "black", borderRadius: 32, overflow: "hidden", position: "relative", border: "1.5px solid var(--border)" }}>
        <div id="reader" style={{ width: "100%", height: "100%" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 224, height: 224, border: "1px solid rgba(249,115,22,.3)", borderRadius: 24, position: "relative" }}>
            {(["tl", "tr", "bl", "br"] as const).map(c => (
              <div key={c} style={{
                position: "absolute", width: 24, height: 24,
                ...(c === "tl" ? { top: -1, left: -1, borderTop: "2px solid var(--orange)", borderLeft: "2px solid var(--orange)", borderTopLeftRadius: 12 } : {}),
                ...(c === "tr" ? { top: -1, right: -1, borderTop: "2px solid var(--orange)", borderRight: "2px solid var(--orange)", borderTopRightRadius: 12 } : {}),
                ...(c === "bl" ? { bottom: -1, left: -1, borderBottom: "2px solid var(--orange)", borderLeft: "2px solid var(--orange)", borderBottomLeftRadius: 12 } : {}),
                ...(c === "br" ? { bottom: -1, right: -1, borderBottom: "2px solid var(--orange)", borderRight: "2px solid var(--orange)", borderBottomRightRadius: 12 } : {}),
              }} />
            ))}
            {isReady && <div className="scan-line" style={{ position: "absolute", insetInline: 0, height: 2, background: "linear-gradient(to right,transparent,var(--orange),transparent)", boxShadow: "0 0 12px rgba(249,115,22,.8)" }} />}
          </div>
        </div>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", zIndex: 20 }}>✕</button>
      </div>
      <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.05)", border: "1.5px solid var(--border)", padding: "10px 20px", borderRadius: 99 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--orange)" }} className="anim-pulse" />
        <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text2)", letterSpacing: ".3em", textTransform: "uppercase" }}>Scanning Kakuho Hash</span>
      </div>
    </div>
  );
};

/* ── Desktop sidebar ── */
const DesktopSidebar = ({ active, setActive, citizen, onLogout, hasUnread, onNotif, notifOpen, notifications, onCloseNotif }: any) => (
  <aside className="kk-sidebar" style={{ display: "none", position: "relative" }} id="kk-sidebar">
    <div style={{ padding: "20px 18px", borderBottom: "1.5px solid var(--border)" }}>
      <KakuhoLogo />
    </div>

    {citizen && (
      <div style={{ padding: "16px 16px", borderBottom: "1.5px solid var(--border)" }}>
        <div style={{ background: "rgba(249,115,22,.05)", border: "1.5px solid rgba(249,115,22,.12)", borderRadius: 14, padding: "12px 13px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: "0 0 14px rgba(249,115,22,.25)" }}>
              {(citizen.firstName?.[0] || "U")}{(citizen.lastName?.[0] || "N")}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{citizen.firstName} {citizen.lastName}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{citizen.licenseId || citizen.licenseID}</p>
            </div>
          </div>
        </div>
      </div>
    )}

    <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
      {[
        { id: "home", label: "Home", icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg> },
        { id: "assets", label: "Credentials", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg> },
        { id: "connections", label: "Connections", icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg> },
        { id: "prove", label: "ZK Prover", icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
      ].map(n => (
        <button key={n.id} onClick={() => setActive(n.id)} className={`sidebar-item${active === n.id ? " active" : ""}`}>
          {n.icon}{n.label}
        </button>
      ))}
    </nav>

    <div style={{ padding: "10px 10px", borderTop: "1.5px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Activity / notifications button */}
      <button onClick={onNotif} style={{
        width: "100%", padding: "9px 12px", borderRadius: 12,
        background: notifOpen ? "var(--orange-lite)" : "rgba(255,255,255,.03)",
        border: `1.5px solid ${notifOpen ? "rgba(249,115,22,.25)" : "var(--border)"}`,
        display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
        color: notifOpen ? "var(--orange)" : "var(--text3)", transition: "all .18s", position: "relative",
        fontFamily: "var(--font-sans)",
      }}>
        <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
        <span style={{ fontSize: 12, fontWeight: 600 }}>Activity</span>
        {hasUnread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--red)", marginLeft: "auto", boxShadow: "0 0 6px var(--red)" }} />}
      </button>

      {/* Notif panel — floats above, anchored to sidebar bottom section */}
      {notifOpen && (
        <div style={{
          position: "absolute", bottom: 112, left: 12, right: 12,
          background: "rgba(19,22,30,.95)", backdropFilter: "blur(24px)",
          border: "1.5px solid var(--border2)", borderRadius: 14, padding: 14,
          zIndex: 100, boxShadow: "0 -8px 32px rgba(0,0,0,.4)",
        }} className="anim-fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span className="kk-label">Activity Log</span>
            <button onClick={onCloseNotif} style={{ background: "none", border: "none", color: "var(--orange)", fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: ".04em" }}>Close</button>
          </div>
          {notifications.map((n: any, i: number) => (
            <div key={n.id} style={{ borderBottom: i < notifications.length - 1 ? "1px solid var(--border)" : "none", paddingBottom: i < notifications.length - 1 ? 8 : 0, marginBottom: i < notifications.length - 1 ? 8 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{n.title}</span>
                <span style={{ fontSize: 10, color: "var(--text3)" }}>{n.time}</span>
              </div>
              <p style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>{n.desc}</p>
            </div>
          ))}
        </div>
      )}

      <button onClick={onLogout} className="btn-kk btn-red" style={{ width: "100%", fontSize: 11, padding: 10, letterSpacing: ".06em" }}>
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        Logout Session
      </button>
    </div>
  </aside>
);

/* ── Credential card ── */
const CredentialCard = ({ data, onAlert }: { data: any; onAlert?: (type: "success" | "error", msg: string) => void }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState("");
  const registryHash = data.leafHash || data.leaf_hash || "—";
  const isNonPro = data.licenseType === "NON-PROFESSIONAL";
  const cardGradient = isNonPro
    ? "linear-gradient(135deg,#1a237e 0%,#283593 45%,#1565c0 100%)"
    : "linear-gradient(135deg,#fb923c 0%,#f97316 50%,#c2410c 100%)";

  const handleCopy = async (e: React.MouseEvent, text: string, label: string) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.left = "-9999px";
        document.body.appendChild(ta); ta.focus(); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta);
      }
      setCopied(label);
      onAlert?.("success", `${label} copied!`);
      setTimeout(() => setCopied(""), 2500);
    } catch {
      onAlert?.("error", "Copy Failed!");
    }
  };

  return (
    <div className="cred-perspective" style={{ width: "100%", maxWidth: "min(400px,100%)", height: 190, position: "relative", cursor: "pointer" }} onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`cred-inner${isFlipped ? " flipped" : ""}`}>

        {/* Front */}
        <div className="cred-face" style={{ background: cardGradient, boxShadow: "0 16px 48px rgba(0,0,0,.5),0 0 32px rgba(21,101,192,.2)", border: "1px solid rgba(255,255,255,.14)" }}>
          <div className="holo" />
          <div style={{ position: "absolute", right: -24, top: -24, width: 130, height: 130, borderRadius: "50%", border: "1px solid rgba(255,255,255,.06)" }} />
          <div style={{ position: "absolute", right: 20, bottom: -10, width: 80, height: 80, borderRadius: "50%", border: "1px solid rgba(255,255,255,.04)" }} />
          <div style={{ padding: "14px 16px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 7, fontWeight: 800, color: "rgba(255,255,255,.4)", letterSpacing: ".15em", textTransform: "uppercase", lineHeight: 1.3 }}>Republic of the Philippines</p>
                <p style={{ fontSize: 9.5, fontWeight: 800, color: "white", letterSpacing: ".04em", textTransform: "uppercase", marginTop: 3, lineHeight: 1.2 }}>Land Transportation Office</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, marginLeft: 8 }}>
                <span className="badge-kk badge-green" style={{ fontSize: 7, padding: "3px 7px", whiteSpace: "nowrap" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%" }} className="dot-green anim-pulse" />
                  Verified
                </span>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="13" height="13" fill="white" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" opacity=".9" /></svg>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 8, fontWeight: 800, color: "rgba(255,255,255,.5)", letterSpacing: ".2em", textTransform: "uppercase", lineHeight: 1 }}>{data.licenseType || "NON-PROFESSIONAL"}</span>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", letterSpacing: "-.01em", lineHeight: 1.1 }}>
                {data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : (data.publicName || "Verified Citizen")}
              </h3>
              <div style={{ display: "flex", gap: 16, marginTop: 2 }}>
                <div><p style={{ fontSize: 6, fontWeight: 800, color: "rgba(255,255,255,.35)", letterSpacing: ".12em", textTransform: "uppercase" }}>Control ID</p><p style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,.85)", fontWeight: 500 }}>{data.licenseId}</p></div>
                <div><p style={{ fontSize: 6, fontWeight: 800, color: "rgba(255,255,255,.35)", letterSpacing: ".12em", textTransform: "uppercase" }}>Valid Through</p><p style={{ fontSize: 9, color: "rgba(255,255,255,.85)", fontWeight: 500 }}>{data.expirationDate}</p></div>
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 7, left: 14, opacity: .18, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "white" }} />
            <span style={{ fontSize: 6, fontWeight: 800, color: "white", letterSpacing: ".15em", textTransform: "uppercase" }}>Tap to view full credential</span>
          </div>
        </div>

        {/* Back */}
        <div className="cred-face cred-back" style={{ background: "#08091a", border: "1px solid rgba(255,255,255,.08)", boxShadow: "0 16px 48px rgba(0,0,0,.6)" }}>
          <div style={{ padding: "12px 14px", height: "100%", display: "flex", flexDirection: "column", gap: 7, position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,.05)", paddingBottom: 6 }}>
              <span className="kk-label" style={{ fontSize: 8 }}>Credential Data</span>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px 10px", flex: 1 }}>
              {([["Date of Birth", data.dateOfBirth], ["Blood Type", data.bloodType], ["Address", data.addressCity], ["Restrictions", data.restrictions], ["Conditions", data.conditions]] as [string, string][]).map(([l, v]) => (
                <div key={l} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 7, fontWeight: 800, color: "var(--text3)", letterSpacing: ".1em", textTransform: "uppercase" }}>{l}</span>
                  <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text2)", fontWeight: 500 }}>{v || "—"}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <button onClick={e => handleCopy(e, registryHash, "Hash")} style={{ width: "100%", background: "rgba(249,115,22,.06)", border: "1.5px solid rgba(249,115,22,.15)", borderRadius: 8, padding: "5px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: 7, fontWeight: 700, color: "rgba(249,115,22,.6)", letterSpacing: ".08em", textTransform: "uppercase" }}>Leaf Hash</span>
                <code style={{ fontSize: 8, fontFamily: "var(--font-mono)", color: "rgba(249,115,22,.65)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{registryHash.slice(0, 18)}…</code>
                <svg width="10" height="10" fill="none" stroke={copied === "Hash" ? "#4ade80" : "rgba(255,255,255,.3)"} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </button>
              <button onClick={e => handleCopy(e, data.secret || "", "Secret")} style={{ width: "100%", background: "rgba(239,68,68,.05)", border: "1.5px solid rgba(239,68,68,.15)", borderRadius: 8, padding: "5px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontSize: 7, fontWeight: 700, color: "rgba(239,68,68,.6)", letterSpacing: ".08em", textTransform: "uppercase" }}>Private Secret</span>
                <code style={{ fontSize: 8, fontFamily: "var(--font-mono)", color: "rgba(239,68,68,.55)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {data.secret ? "•••••••••••••••••••" : "Not unlocked"}
                </code>
                <svg width="10" height="10" fill="none" stroke={copied === "Secret" ? "#4ade80" : "rgba(239,68,68,.3)"} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main wallet page ── */
export default function WalletPage() {
  const [citizen, setCitizen] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [tab, setTab] = useState("home");
  const [search, setSearch] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Identity Anchored", desc: "Your credential is now secured on-chain.", time: "2m ago" },
    { id: 2, title: "Vault Activated", desc: "Digital wallet initialized successfully.", time: "1h ago" },
  ]);
  const [alert, setAlert] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showQRShare, setShowQRShare] = useState(false);
  const [chainRoot, setChainRoot] = useState<string | null>(null);
  const [rootSyncing, setRootSyncing] = useState(false);
  const [proofHistory, setProofHistory] = useState<{ nullifier: string; ts: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("citizen_license");
    if (!data) { router.push("/login"); return; }
    const unlockedSecret = sessionStorage.getItem("unlocked_secret");
    if (!unlockedSecret) { router.push("/login"); return; }

    const user = JSON.parse(data);
    const smartUser = {
      firstName: user.subject?.firstName || user.firstName || (user.publicName?.split(" ")[0] || "Verified"),
      lastName: user.subject?.lastName || user.lastName || (user.publicName?.split(" ")[1] || "Citizen"),
      licenseId: user.subject?.licenseID || user.licenseId || `N01-26-${Math.floor(100000 + Math.random() * 900000)}`,
      dateOfBirth: user.subject?.dateOfBirth || user.dateOfBirth || "N/A",
      bloodType: user.subject?.bloodType || user.bloodType || "O+",
      addressCity: user.subject?.addressCity || user.addressCity || "N/A",
      restrictions: user.subject?.restrictions || user.restrictions || "None",
      conditions: user.subject?.conditions || user.conditions || "None",
      licenseType: user.subject?.licenseType || user.licenseType || "Non-Professional",
      expirationDate: user.subject?.expirationDate || user.expirationDate || "2036-04-21",
      ...user,
      secret: unlockedSecret,
    };
    setCitizen(smartUser);
    setWallets([smartUser]);

    // Load proof history from localStorage
    const history = JSON.parse(localStorage.getItem("proof_history") || "[]");
    setProofHistory(history);

    // Sync Merkle root from chain
    setRootSyncing(true);
    fetchRoot().then(root => {
      setChainRoot(root || null);
    }).catch(() => {}).finally(() => setRootSyncing(false));
  }, [router]);

  const showAlert = (type: "success" | "error", msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleNav = (id: string) => {
    if (id === "prove") { router.push("/prove"); return; }
    setTab(id);
  };

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) setHasUnread(false);
  };

  const handleImportAttempt = async (hash: string) => {
    if (!hash) return;
    setIsImporting(true);
    try {
      const res = await fetch(`/api/identity/lookup?hash=${hash.trim()}`);
      const result = await res.json();
      if (result.success) {
        const newUser = {
          firstName: result.data?.subject?.firstName || (result.publicName?.split(" ")[0] || "New"),
          lastName: result.data?.subject?.lastName || (result.publicName?.split(" ")[1] || "User"),
          licenseId: result.data?.subject?.licenseID || result.data?.licenseId || `N01-26-${Math.floor(100000 + Math.random() * 900000)}`,
          ...result.data, leafHash: result.leafHash, publicName: result.publicName,
        };
        setWallets(prev => [...prev, newUser]);
        showAlert("success", "Identity Verified & Imported!");
        setNotifications(prev => [{ id: Date.now(), title: "Credential Imported", desc: "Security hash validated against registry.", time: "Just now" }, ...prev]);
        setHasUnread(true);
      } else {
        showAlert("error", "Unauthorized: Hash not in Registry!");
      }
    } catch {
      showAlert("error", "Connection to Registry Failed");
    }
    setIsImporting(false);
  };

  const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d"); if (!ctx) { setIsImporting(false); return; }
        canvas.width = img.width; canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) { handleImportAttempt(code.data); }
        else { showAlert("error", "Import Failed: No QR Code found!"); setIsImporting(false); }
      };
      img.onerror = () => { showAlert("error", "Invalid Image File!"); setIsImporting(false); };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => { sessionStorage.removeItem("unlocked_secret"); window.location.href = "/login"; };

  if (!citizen) return null;

  const initials = `${citizen.firstName?.[0] || "U"}${citizen.lastName?.[0] || "N"}`;
  const displayWallets = wallets.filter(w =>
    (w.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (w.licenseId?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const MobileNotifPanel = () => (
    <div style={{
      position: "fixed", top: 64, right: 12, width: 280,
      background: "rgba(19,22,30,.95)", backdropFilter: "blur(24px)", border: "1.5px solid var(--border2)",
      borderRadius: 16, padding: 16, zIndex: 200, boxShadow: "0 16px 48px rgba(0,0,0,.5)",
    }} className="anim-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span className="kk-label">Activity Log</span>
        <button onClick={() => setShowNotifications(false)} style={{ background: "none", border: "none", color: "var(--orange)", fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: ".04em" }}>Close</button>
      </div>
      {notifications.map((n, i) => (
        <div key={n.id} style={{ borderBottom: i < notifications.length - 1 ? "1px solid var(--border)" : "none", paddingBottom: i < notifications.length - 1 ? 10 : 0, marginBottom: i < notifications.length - 1 ? 10 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{n.title}</span>
            <span style={{ fontSize: 10, color: "var(--text3)" }}>{n.time}</span>
          </div>
          <p style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>{n.desc}</p>
        </div>
      ))}
    </div>
  );

  /* ── QR Share Modal ── */
  const QRShareModal = () => {
    const leafHash = citizen?.leafHash || citizen?.leaf_hash || "";
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(13,15,20,.96)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(24px)" }} className="anim-fade-in">
        <div style={{ background: "var(--bg2)", border: "1.5px solid var(--border2)", borderRadius: 24, padding: 28, maxWidth: 360, width: "100%", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }} className="anim-pop">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", letterSpacing: "-.01em" }}>Share Identity</h3>
              <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Scan to verify your leaf hash</p>
            </div>
            <button onClick={() => setShowQRShare(false)} style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,.05)", border: "1.5px solid var(--border)", color: "var(--text3)", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>✕</button>
          </div>
          <div style={{ background: "white", padding: 16, borderRadius: 16 }}>
            <QRCodeSVG value={leafHash || "no-hash"} size={200} bgColor="#ffffff" fgColor="#0d0f14" level="M" />
          </div>
          <div style={{ width: "100%", background: "rgba(249,115,22,.05)", border: "1.5px solid rgba(249,115,22,.15)", borderRadius: 12, padding: "10px 14px" }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(249,115,22,.5)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Leaf Hash</p>
            <code style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "rgba(249,115,22,.7)", wordBreak: "break-all", lineHeight: 1.7 }}>{leafHash}</code>
          </div>
          <p style={{ fontSize: 10, color: "var(--text3)", textAlign: "center", lineHeight: 1.6 }}>This QR contains only your public leaf hash — no private data is exposed.</p>
        </div>
      </div>
    );
  };

  /* ── Settings Panel ── */
  const SettingsPanel = () => {
    const leafHash = citizen?.leafHash || citizen?.leaf_hash || "—";
    const [copied, setCopied] = useState(false);
    const handleCopyHash = async () => {
      try {
        await navigator.clipboard.writeText(leafHash);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* fallback not needed in settings */ }
    };
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "0 0 80px" }} className="anim-fade-up">
        <div>
          <span className="kk-label" style={{ display: "block", marginBottom: 4 }}>Account</span>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-.015em" }}>Settings</h2>
        </div>

        {/* Identity info */}
        <div className="kk-card" style={{ padding: 18 }}>
          <span className="kk-label" style={{ display: "block", marginBottom: 12 }}>Identity</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>Name</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{citizen?.firstName} {citizen?.lastName}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>License ID</span>
              <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--text2)" }}>{citizen?.licenseId}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>Chain Root</span>
              {rootSyncing
                ? <span style={{ fontSize: 10, color: "var(--text3)" }} className="anim-pulse">Syncing…</span>
                : <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--cyan)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chainRoot || "—"}</span>
              }
            </div>
          </div>
        </div>

        {/* Leaf hash */}
        <div className="kk-card" style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span className="kk-label">Public Leaf Hash</span>
            <button onClick={handleCopyHash} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "var(--green)" : "var(--orange)", fontSize: 11, fontWeight: 700 }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <code style={{ display: "block", fontSize: 10, fontFamily: "var(--font-mono)", color: "rgba(249,115,22,.7)", wordBreak: "break-all", lineHeight: 1.8, background: "rgba(249,115,22,.04)", border: "1.5px solid rgba(249,115,22,.12)", borderRadius: 10, padding: "10px 12px" }}>{leafHash}</code>
        </div>

        {/* Proof history */}
        {proofHistory.length > 0 && (
          <div className="kk-card" style={{ padding: 18 }}>
            <span className="kk-label" style={{ display: "block", marginBottom: 12 }}>Proof History</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {proofHistory.slice(0, 5).map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < Math.min(proofHistory.length, 5) - 1 ? "1px solid var(--border)" : "none" }}>
                  <code style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--cyan)", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nullifier.slice(0, 20)}…</code>
                  <span style={{ fontSize: 10, color: "var(--text3)" }}>{new Date(p.ts).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danger zone */}
        <div className="kk-card" style={{ padding: 18, borderColor: "rgba(239,68,68,.15)" }}>
          <span className="kk-label" style={{ display: "block", marginBottom: 12, color: "rgba(239,68,68,.5)" }}>Session</span>
          <button onClick={handleLogout} className="btn-kk btn-red" style={{ width: "100%" }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout Session
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: "100vh", display: "flex", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <div className="grid-bg" />
      <DesktopSidebar active={tab} setActive={handleNav} citizen={citizen} onLogout={handleLogout} hasUnread={hasUnread} onNotif={handleOpenNotifications} notifOpen={showNotifications} notifications={notifications} onCloseNotif={() => setShowNotifications(false)} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 1, minWidth: 0, height: "100vh", overflow: "hidden" }}>

        {/* Top bar — mobile only */}
        <header id="wallet-header" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 18px", background: "rgba(13,15,20,.9)", backdropFilter: "blur(20px)",
          borderBottom: "1.5px solid var(--border)", position: "sticky", top: 0, zIndex: 40,
        }}>
          {/* Mobile: avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }} id="mobile-header-user">
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", boxShadow: "0 0 12px rgba(249,115,22,.2)" }}>
              {initials}
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 14, lineHeight: 1 }}>{citizen.firstName} {citizen.lastName}</p>
            </div>
          </div>
          {/* Notification bell */}
          <div style={{ position: "relative" }}>
            <button onClick={handleOpenNotifications} style={{
              width: 36, height: 36, borderRadius: 11,
              background: showNotifications ? "var(--orange-lite)" : "rgba(255,255,255,.04)",
              border: `1.5px solid ${showNotifications ? "rgba(249,115,22,.25)" : "var(--border)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: showNotifications ? "var(--orange)" : "var(--text3)", transition: "all .18s", position: "relative",
            }}>
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
              {hasUnread && <div style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", background: "var(--red)", border: "1.5px solid var(--bg)" }} />}
            </button>
            {showNotifications && <MobileNotifPanel />}
          </div>
        </header>

        {/* Toast */}
        {alert && (
          <div className="kk-toast">
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "11px 18px", borderRadius: 14,
              background: alert.type === "success" ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)",
              border: `1px solid ${alert.type === "success" ? "rgba(34,197,94,.3)" : "rgba(239,68,68,.3)"}`,
              backdropFilter: "blur(24px)", color: alert.type === "success" ? "#4ade80" : "#f87171",
              fontSize: 12, fontWeight: 700, letterSpacing: ".05em", whiteSpace: "nowrap",
              boxShadow: "0 8px 32px rgba(0,0,0,.4)",
            }}>
              {alert.type === "success"
                ? <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                : <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              }
              {alert.msg}
            </div>
          </div>
        )}

        {showScanner && <QRScannerModal onScan={handleImportAttempt} onError={msg => showAlert("error", msg)} onClose={() => setShowScanner(false)} />}
        {showQRShare && <QRShareModal />}

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" as any }}>
        <div style={{ padding: "16px 16px 100px", display: "flex", flexDirection: "column", gap: 16 }} id="wallet-body">

          {/* HOME TAB */}
          {tab === "home" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="anim-fade-up">

              {/* Action row */}
              <div style={{ display: "flex", justifyContent: "space-around", padding: 16, background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 18 }}>
                {[
                  { label: "Verify", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, action: () => router.push("/prove") },
                  { label: "Share", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>, action: () => setShowQRShare(true) },
                  { label: "Scan", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h5v5H3zM3 16h5v5H3zM16 3h5v5h-5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 16h2v2h-2zm0 3h2v2h-2zm3-3h2v2h-2zm0 3h2v2h-2z" /></svg>, action: () => setShowScanner(true) },
                  { label: "History", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, action: () => setTab("settings") },
                ].map(a => (
                  <button key={a.label} onClick={a.action} className="action-btn">
                    <div className="action-btn-icon">{a.icon}</div>
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>

              {/* My Credentials header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>My Credentials</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {rootSyncing && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.03)", border: "1px solid var(--border)", borderRadius: 99, padding: "3px 8px" }}>
                      <div className="anim-spin" style={{ width: 8, height: 8, border: "1.5px solid rgba(249,115,22,.2)", borderTopColor: "var(--orange)", borderRadius: "50%", flexShrink: 0 }} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text3)", letterSpacing: ".08em", textTransform: "uppercase" }}>Syncing</span>
                    </div>
                  )}
                  <button onClick={() => setTab("assets")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--orange)", fontSize: 12, fontWeight: 700 }}>View all →</button>
                </div>
              </div>

              <CredentialCard data={citizen} onAlert={showAlert} />
            </div>
          )}

          {/* ASSETS TAB */}
          {tab === "assets" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="anim-fade-up">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-.015em" }}>My Credentials</h2>
                  <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{wallets.length} credential{wallets.length !== 1 ? "s" : ""} stored</p>
                </div>
              </div>

              {/* Search */}
              <div style={{ position: "relative" }}>
                <input type="text" placeholder="Search wallet…" value={search} onChange={e => setSearch(e.target.value)}
                  className="kk-input" style={{ paddingLeft: 40 }} />
                <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", opacity: .3 }} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>

              {/* Credential list entry */}
              <div style={{ background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 18, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid var(--border)", cursor: "pointer" }} onClick={() => setTab("home")}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#1a237e,#1565c0)", border: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" opacity=".9" /></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: "var(--text)", fontSize: 14 }}>Driver&apos;s License</p>
                    <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>Land Transportation Office · PH</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span className="badge-kk badge-green">Verified</span>
                    <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text3)" }}>Exp. 2036</span>
                  </div>
                </div>
                {/* Import slot */}
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, opacity: isImporting ? 1 : .5, cursor: "pointer" }} onClick={() => !isImporting && fileInputRef.current?.click()}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--bg3)", border: "1.5px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {isImporting
                      ? <div className="anim-spin" style={{ width: 18, height: 18, border: "2px solid rgba(249,115,22,.2)", borderTopColor: "var(--orange)", borderRadius: "50%" }} />
                      : <svg width="20" height="20" fill="none" stroke="var(--text3)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    }
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text2)", fontSize: 13, fontStyle: "italic" }}>{isImporting ? "Verifying…" : "Add Credential"}</p>
                    <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>Import via QR or hash</p>
                  </div>
                  <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileScan} />
                </div>
              </div>

              {/* Paste hash input */}
              <div style={{ position: "relative" }}>
                <input type="text" placeholder="Paste leaf hash to import…"
                  className="kk-input" style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}
                  onKeyDown={e => e.key === "Enter" && handleImportAttempt(e.currentTarget.value)} />
              </div>

              {displayWallets.map((w, idx) => (
                <CredentialCard key={idx} data={w} onAlert={showAlert} />
              ))}
            </div>
          )}

          {/* CONNECTIONS TAB */}
          {tab === "connections" && <ConnectionsView />}

          {/* SETTINGS TAB */}
          {tab === "settings" && <SettingsPanel />}
        </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav" id="mobile-bottom-nav">
        {[
          { id: "home", label: "Home", icon: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg> },
          { id: "assets", label: "Assets", icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg> },
          { id: "prove", label: "Prove", fab: true, icon: <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
          { id: "connections", label: "Partners", icon: <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg> },
          { id: "settings", label: "Settings", icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg> },
        ].map(n => (n as any).fab ? (
          <button key={n.id} onClick={() => router.push("/prove")} style={{ width: 56, height: 56, borderRadius: 18, background: "var(--orange)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 20px rgba(249,115,22,.35)", transform: "translateY(-10px)", flexShrink: 0 }}>
            {n.icon}
          </button>
        ) : (
          <button key={n.id} onClick={() => setTab(n.id)} className={`nav-item${tab === n.id ? " active" : ""}`}>
            {n.icon}
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

      <style>{`
        @media(min-width:768px){
          #kk-sidebar { display:flex !important; }
          #mobile-bottom-nav { display:none !important; }
          #wallet-header { display:none !important; }
          #wallet-body { padding:24px 28px 32px !important; }
        }
      `}</style>
    </div>
  );
}
