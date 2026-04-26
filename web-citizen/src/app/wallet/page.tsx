"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";
import { Html5Qrcode } from "html5-qrcode";

const ConnectionsView = () => (
  <main className="flex-1 p-6 lg:p-12 overflow-y-auto min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
     <header className="mb-10 pt-8 lg:pt-12 px-6">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 block">System Scope</span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Institutional Partners</h1>
     </header>

     <div className="space-y-4 px-6 max-w-4xl">
        {/* LTO Government Connection - Current Research Scope */}
        <div className="bg-white border border-slate-100 p-8 rounded-[40px] flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm relative overflow-hidden group hover:border-orange-200 transition-all">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="flex items-center gap-6 z-10 w-full">
              <div className="w-16 h-16 bg-slate-900 rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-slate-900/20">
                 <svg className="w-8 h-8 text-orange-primary" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                 </svg>
              </div>
              <div>
                 <p className="text-slate-900 font-black text-lg leading-tight">Republic of the Philippines<br/>Land Transportation Office</p>
                 <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Verified Identity Registry</p>
              </div>
           </div>
        </div>

        <div className="pt-8 pb-4">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-2">Future Research Expansion</p>
        </div>

        {/* Future Scope Placeholders */}
        <div className="bg-slate-50/50 border border-dashed border-slate-200 p-8 rounded-[40px] opacity-40 group hover:opacity-60 transition-all">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white border border-slate-100 rounded-[24px] flex items-center justify-center text-slate-300 shadow-sm">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <div>
                 <p className="text-slate-400 font-black text-xl italic">Financial Institute</p>
                 <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Proposed Banking Verification</p>
              </div>
           </div>
        </div>

        <div className="bg-slate-50/50 border border-dashed border-slate-200 p-8 rounded-[40px] opacity-40 group hover:opacity-60 transition-all">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white border border-slate-100 rounded-[24px] flex items-center justify-center text-slate-300 shadow-sm">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4 2.222" /></svg>
              </div>
              <div>
                 <p className="text-slate-400 font-black text-xl italic">Future University</p>
                 <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Academic Credential Verification</p>
              </div>
           </div>
        </div>
     </div>
  </main>
);

const QRScannerModal = ({ onScan, onError, onClose }: { onScan: (data: string) => void, onError: (msg: string) => void, onClose: () => void }) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
    html5QrCode.start({ facingMode: "environment" }, qrConfig, (decodedText) => {
      onScan(decodedText);
      html5QrCode.stop().then(() => onClose());
    }, () => {}).then(() => setIsReady(true)).catch(error => {
      console.error(error);
      onError("Camera Access Denied or Failed");
      onClose();
    });
    return () => { if (html5QrCode.isScanning) html5QrCode.stop().catch(e => console.error(e)); };
  }, [onScan, onError, onClose]);

  return (
    <div className="fixed inset-0 bg-slate-950/95 z-[250] flex flex-col items-center justify-center p-6 backdrop-blur-2xl animate-in fade-in duration-300">
       <div className="w-full max-sm:w-[90%] max-w-sm aspect-square bg-black rounded-[40px] overflow-hidden relative border-4 border-white/10 shadow-2xl">
          <div id="reader" className="w-full h-full"></div>
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
             <div className="w-64 h-64 border-2 border-orange-primary/30 rounded-3xl relative">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-orange-primary rounded-tl-xl"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-orange-primary rounded-tr-xl"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-orange-primary rounded-bl-xl"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-orange-primary rounded-br-xl"></div>
                {isReady && <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-primary to-transparent shadow-[0_0_15px_rgba(249,115,22,0.8)] animate-scan-line"></div>}
             </div>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 bg-white/10 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border border-white/20 z-20">✕</button>
       </div>
       <div className="mt-10 flex flex-col items-center gap-4"><div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl"><div className="w-2 h-2 bg-orange-primary rounded-full animate-pulse"></div><p className="text-white font-black uppercase tracking-[0.3em] text-[10px]">Scanning Kakuho Secure Hash</p></div></div>
       <style jsx>{` @keyframes scan { 0% { top: 0%; } 50% { top: 100%; } 100% { top: 0%; } } .animate-scan-line { position: absolute; animation: scan 3s linear infinite; } `}</style>
    </div>
  );
};

const DesktopSidebar = ({ active, setActive }: any) => (
  <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0">
    <div className="p-8 mb-4 flex items-center gap-3">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border border-slate-100">
        <svg className="w-7 h-7 text-slate-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 16C4 16 5 19 8 20C11 21 14 20 16 19M16 19C18 18 20 16 20 13M16 19C15 19.5 13 20 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 4L5 7V11C5 15.42 8 19.54 12 21C16 19.54 19 15.42 19 11V7L12 4Z" fill="#F97316"/>
        </svg>
      </div>
      <h1 className="text-base font-black text-slate-900 tracking-tighter uppercase">Kakuho Vault</h1>
    </div>
    <nav className="flex-1 px-4 space-y-1"><SidebarItem label="Wallet" active={active === "wallet"} onClick={() => setActive("wallet")} /><SidebarItem label="Connections" active={active === "connections"} onClick={() => setActive("connections")} /></nav>
    <div className="p-6 m-4 bg-slate-50 rounded-[24px]"><button onClick={() => { localStorage.clear(); window.location.href = "/"; }} className="w-full py-2.5 bg-white border border-slate-200 text-slate-900 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">Logout Session</button></div>
  </aside>
);

const SidebarItem = ({ label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl font-bold transition-all ${active ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"}`}><span className="text-xs tracking-tight">{label}</span></button>
);

const MobileBottomNav = ({ active, setActive, onQRClick }: any) => (
  <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/90 backdrop-blur-2xl border border-slate-200 px-8 py-4 rounded-[32px] flex justify-between items-center z-50 shadow-2xl">
    <button onClick={() => setActive("wallet")} className={`${active === "wallet" ? "text-orange-primary" : "text-slate-300"}`}><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.89 10 8V16C10 17.11 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" /></svg></button>
    <div onClick={onQRClick} className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-slate-900 text-white active:scale-95 transition-all cursor-pointer`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg></div>
    <button onClick={() => setActive("connections")} className={`${active === "connections" ? "text-orange-primary" : "text-slate-300"}`}><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg></button>
  </nav>
);

export default function WalletPage() {
  const [citizen, setCitizen] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("wallet");
  const [search, setSearch] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Identity Anchored", desc: "Your Student Permit is now secured on-chain.", time: "2m ago" },
    { id: 2, title: "Vault Activated", desc: "Digital wallet initialized successfully.", time: "1h ago" }
  ]);
  const [alert, setAlert] = useState<{type: 'success' | 'error', msg: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("citizen_license");
    if (!data) { router.push("/claim"); return; }
    const user = JSON.parse(data);
    const smartUser = {
      firstName: user.subject?.firstName || user.firstName || (user.publicName?.split(' ')[0] || "Verified"),
      lastName: user.subject?.lastName || user.lastName || (user.publicName?.split(' ')[1] || "Citizen"),
      licenseId: user.subject?.licenseID || user.licenseId || `N01-26-${Math.floor(100000 + Math.random() * 900000)}`,
      age: user.subject?.age || user.age || "28",
      gender: user.subject?.gender || user.gender || "Male",
      nationality: user.subject?.nationality || user.nationality || "Filipino",
      bloodType: user.subject?.bloodType || user.bloodType || "O+",
      contact: user.subject?.contact || user.contact || "0917-000-0000",
      cid: user.registryMetadata?.treeIndex || user.cid || `CID-${Math.floor(10000000 + Math.random() * 90000000)}`,
      licenseType: user.subject?.licenseType || user.licenseType || "NON-PRO",
      ...user
    };

    setCitizen(smartUser);
    setWallets([smartUser]);
  }, [router]);

  const handleOpenNotifications = () => { setShowNotifications(!showNotifications); if (!showNotifications) setHasUnread(false); };

  const handleImportAttempt = async (hash: string) => {
    if (!hash) return;
    setIsImporting(true);
    
    try {
      const res = await fetch(`/api/identity/lookup?hash=${hash.trim()}`);
      const result = await res.json();

      if (result.success) {
        const newUser = {
          firstName: result.data?.subject?.firstName || (result.publicName?.split(' ')[0] || "New"),
          lastName: result.data?.subject?.lastName || (result.publicName?.split(' ')[1] || "User"),
          licenseId: result.data?.subject?.licenseID || result.data?.licenseId || `N01-26-${Math.floor(100000 + Math.random() * 900000)}`,
          ...result.data,
          leafHash: result.leafHash,
          publicName: result.publicName
        };

        setWallets(prev => [...prev, newUser]);
        setAlert({ type: 'success', msg: "Identity Verified & Imported!" });
        setNotifications(prev => [{ id: Date.now(), title: "Credential Imported", desc: `Security hash validated against registry.`, time: "Just now" }, ...prev]);
        setHasUnread(true);
      } else {
        setAlert({ type: 'error', msg: "Unauthorized: Hash not in Registry!" });
      }
    } catch (e) {
      setAlert({ type: 'error', msg: "Connection to Registry Failed" });
    }
    setIsImporting(false);
    setTimeout(() => setAlert(null), 5000);
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
        
        if (code) { 
           handleImportAttempt(code.data); 
        } else { 
           setAlert({ type: 'error', msg: "Import Failed: No QR Code found!" }); 
           setIsImporting(false); 
           setTimeout(() => setAlert(null), 5000); 
        }
      };
      img.onerror = () => {
         setAlert({ type: 'error', msg: "Invalid Image File!" });
         setIsImporting(false);
         setTimeout(() => setAlert(null), 5000);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (!citizen) return null;
  const displayWallets = wallets.filter(w => 
    (w.firstName?.toLowerCase() || "").includes(search.toLowerCase()) || 
    (w.licenseId?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-x-hidden">
      <DesktopSidebar active={activeTab} setActive={setActiveTab} />
      <main className="flex-1 flex flex-col relative pb-32">
        {activeTab === "wallet" && (
          <header className="flex justify-between items-center px-6 lg:px-12 py-6 mt-4 lg:hidden">
             <div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm shadow-inner">{(citizen.firstName?.[0] || 'U')}{(citizen.lastName?.[0] || 'N')}</div><h2 className="text-lg font-black text-slate-900 tracking-tight">{citizen.firstName || 'Unknown'} {citizen.lastName || 'User'}</h2></div>
             <div className="relative"><button onClick={handleOpenNotifications} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${showNotifications ? 'bg-orange-100 text-orange-primary' : 'bg-slate-50 text-slate-400'}`}><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>{hasUnread && <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>}</button></div>
          </header>
        )}

        {alert && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-10 duration-500">
             <div className={`${alert.type === 'success' ? 'bg-[#5B5FC7]' : 'bg-red-600'} text-white px-8 py-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex items-center gap-4 font-bold border-2 border-white/20 backdrop-blur-xl ring-4 ring-black/5`}>
                {alert.type === 'success' ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}<span className="tracking-tight uppercase text-xs">{alert.msg}</span>
             </div>
          </div>
        )}

        {showScanner && <QRScannerModal onScan={handleImportAttempt} onError={(msg) => setAlert({type:'error', msg})} onClose={() => setShowScanner(false)} />}

        {activeTab === "wallet" ? (
          <div className="flex flex-col pt-8 lg:pt-12 px-6 lg:px-12 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full max-w-6xl mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">My Wallet</h2>
              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-80"><input type="text" placeholder="Search wallet..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 px-10 py-3 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-orange-primary transition-all shadow-sm" /><svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
                <div className="hidden lg:block relative">
                   <button onClick={handleOpenNotifications} className={`p-3 rounded-xl shadow-sm transition-all border border-slate-200 ${showNotifications ? 'bg-orange-primary text-white shadow-orange-200' : 'bg-white text-slate-400 hover:text-slate-900'}`}><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>{hasUnread && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white translate-x-1 -translate-y-1"></div>}</button>
                   {showNotifications && (
                     <div className="absolute top-full right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] p-5 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logs</p><button onClick={() => setNotifications([])} className="text-[10px] font-black text-orange-primary uppercase">Clear</button></div>
                        <div className="flex flex-col gap-4">
                          {notifications.map(n => (
                            <div key={n.id} className="flex flex-col gap-1 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                               <div className="flex justify-between items-center"><span className="text-xs font-black text-slate-900">{n.title}</span><span className="text-[10px] font-bold text-slate-300">{n.time}</span></div>
                               <p className="text-[11px] text-slate-500 leading-tight font-medium truncate">{n.desc}</p>
                            </div>
                          ))}
                        </div>
                     </div>
                   )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 w-full max-w-6xl pb-12">
               <div onClick={() => fileInputRef.current?.click()} className="hidden lg:flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-[32px] bg-white hover:bg-slate-50 transition-all group cursor-pointer h-[360px] text-center gap-4 relative overflow-hidden shadow-sm">
                  {isImporting && <div className="absolute inset-0 bg-white/90 z-[400] flex flex-col items-center justify-center"><div className="w-10 h-10 border-4 border-orange-primary border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-xs font-black text-slate-900 uppercase tracking-widest">Analyzing Hash...</p></div>}
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 group-hover:scale-110 transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg></div>
                  <button className="bg-[#5B5FC7] text-white px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg mb-1">Import QR Image</button>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">or Drag files</p>
                  <div className="w-full mt-2" onClick={(e) => e.stopPropagation()}><input type="text" placeholder="Manually enter hash..." className="w-full bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg text-[10px] font-mono outline-none focus:border-orange-primary" onKeyDown={(e) => e.key === 'Enter' && handleImportAttempt(e.currentTarget.value)} /></div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileScan} />
               </div>
               {displayWallets.map((w, idx) => <ThesisPremiumCard key={idx} data={w} onAlert={(type, msg) => setAlert({type, msg})} />)}
            </div>
          </div>
        ) : (
          <ConnectionsView />
        )}
      </main>
      <MobileBottomNav active={activeTab} setActive={setActiveTab} onQRClick={() => setShowScanner(true)} />
      <style jsx global>{`.perspective-1000 { perspective: 1000px; } .preserve-3d { transform-style: preserve-3d; } .backface-hidden { backface-visibility: hidden; } .rotate-y-180 { transform: rotateY(180deg); }`}</style>
    </div>
  );
}

const ThesisPremiumCard = ({ data, onAlert }: { data: any, onAlert?: (type: 'success' | 'error', msg: string) => void }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const registryHash = data.leafHash || data.leaf_hash || "0x7a2f...91d2";
  const isNonPro = data.licenseType === "NON-PRO";
  const cardGradient = isNonPro ? "bg-gradient-to-br from-[#3b41c5] via-[#2E3192] to-[#1e2163]" : "bg-gradient-to-br from-[#fb923c] via-[#f97316] to-[#c2410c]";

  const handleCopy = async (e: React.MouseEvent, textToCopy: string) => {
    e.stopPropagation(); e.preventDefault();
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(textToCopy); } 
      else {
        const textArea = document.createElement("textarea"); textArea.value = textToCopy; textArea.style.position = "fixed"; textArea.style.left = "-9999px"; textArea.style.top = "0"; document.body.appendChild(textArea); textArea.focus(); textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea);
      }
      setCopied(true); if (onAlert) onAlert('success', "Security Hash Copied!"); setTimeout(() => setCopied(false), 3000);
    } catch (err) { if (onAlert) onAlert('error', "Copy Failed!"); }
  };

  return (
    <div className="relative w-full h-[360px] perspective-1000 group cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[32px] overflow-hidden" onClick={() => setIsFlipped(!isFlipped)}>
       <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}>
          <div className={`absolute inset-0 backface-hidden ${cardGradient} p-9 flex flex-col justify-between overflow-hidden border border-white/20 rounded-[32px]`}>
             <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none"></div>
             <div className="flex justify-between items-start z-10">
                <div className="flex flex-col">
                   <p className="text-[7px] font-black text-white/50 uppercase tracking-[0.2em] leading-tight mb-1">Republic of the Philippines</p>
                   <h4 className="text-[12px] font-black text-white tracking-tighter uppercase opacity-95 leading-none">Land Transportation Office</h4>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 8.75-7 9.81-3.87-1.06-7-5.14-7-9.81v-4.7l7-3.12z"/>
                    </svg>
                </div>
             </div>
             <div className="flex flex-col gap-0.5 z-10 mt-auto">
                <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.3em]">{data.licenseType}</span>
                <h3 className="text-2xl font-black text-white tracking-tighter leading-none uppercase drop-shadow-md">
                   {data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : (data.publicName || "Verified Citizen")}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                   <div className="flex flex-col"><span className="text-[6px] font-black text-white/40 uppercase tracking-[0.2em]">CONTROL ID</span><span className="text-[11px] font-mono font-bold text-white/90">{data.licenseId}</span></div>
                   <div className="flex flex-col"><span className="text-[6px] font-black text-white/40 uppercase tracking-[0.2em]">VAL THROUGH</span><span className="text-[11px] font-bold text-white/90">12 / 2029</span></div>
                </div>
             </div>
          </div>

          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#0a0c14] border-4 border-white/5 flex flex-col shadow-2xl rounded-[32px] p-8 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
             <div className="z-10 flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em]">Extended Data</span>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
             </div>
             <div className="z-10 grid grid-cols-2 gap-y-6 px-1">
                <BackDetail label="Age" value={data.age} />
                <BackDetail label="Gender" value={data.gender} />
                <BackDetail label="Nationality" value={data.nationality} />
                <BackDetail label="Blood Type" value={data.bloodType || "A-"} />
                <BackDetail label="Contact" value={data.contact} />
                <BackDetail label="Registry CID" value={data.cid} />
             </div>
             <div className="mt-auto z-10 flex flex-col items-center gap-0.5 pb-2">
                <div className="flex justify-center items-center h-4"><span className={`text-[8px] font-black uppercase tracking-[0.3em] ${copied ? 'text-green-400' : (isNonPro ? 'text-blue-400' : 'text-orange-400')} transition-colors`}>{copied ? "Copy Successful!" : "Merkle Leaf (Login Hash)"}</span></div>
                <button type="button" onClick={(e) => handleCopy(e, registryHash)} className="bg-white/[0.04] border border-white/10 rounded-2xl p-2.5 shadow-inner backdrop-blur-md group/hash hover:bg-white/[0.08] transition-all relative overflow-hidden flex items-center justify-between w-full max-w-[95%] px-4 active:scale-95 outline-none focus:ring-2 focus:ring-white/20">
                   <code className="text-[12px] font-mono text-white/90 whitespace-nowrap overflow-hidden text-ellipsis flex-1 font-black tracking-tighter leading-none py-1.5 pointer-events-none">{registryHash}</code>
                   <div className="flex items-center gap-2 ml-2 flex-shrink-0"><span className="text-[7px] font-black text-white/20 uppercase tracking-widest group-hover/hash:text-white/60 transition-colors">COPY</span><svg className={`w-3.5 h-3.5 ${copied ? 'text-green-400' : 'text-white/40'} transition-colors pointer-events-none`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg></div>
                </button>

                <div className="flex justify-center items-center h-4 mt-2"><span className="text-[8px] font-black uppercase tracking-[0.3em] text-red-400 transition-colors">Private Secret (Do Not Share)</span></div>
                <button type="button" onClick={(e) => handleCopy(e, data.secret || "No Secret Found")} className="bg-red-500/[0.04] border border-red-500/10 rounded-2xl p-2.5 shadow-inner backdrop-blur-md group/secret hover:bg-red-500/[0.08] transition-all relative overflow-hidden flex items-center justify-between w-full max-w-[95%] px-4 active:scale-95 outline-none focus:ring-2 focus:ring-red-500/20">
                   <code className="text-[12px] font-mono text-white/90 whitespace-nowrap overflow-hidden text-ellipsis flex-1 font-black tracking-tighter leading-none py-1.5 pointer-events-none">{data.secret ? "••••••••••••••••••••••••" : "Not Found"}</code>
                   <div className="flex items-center gap-2 ml-2 flex-shrink-0"><span className="text-[7px] font-black text-white/20 uppercase tracking-widest group-hover/secret:text-white/60 transition-colors">COPY</span><svg className="w-3.5 h-3.5 text-white/40 transition-colors pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg></div>
                </button>

                <div className="flex justify-center items-center gap-1.5 opacity-20 mt-2"><svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg><span className="text-[5px] font-black text-white uppercase tracking-[0.5em]">Verified by ZK Circuit</span></div>
             </div>
          </div>
       </div>
    </div>
  );
};

const BackDetail = ({ label, value }: any) => (
  <div className="flex flex-col items-start">
    <span className="text-[6px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 leading-none">{label}</span>
    <span className="text-[10px] font-bold text-white/80 uppercase tracking-tight leading-none">{value}</span>
  </div>
);
