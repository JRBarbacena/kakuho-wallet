"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import jsQR from "jsqr";
import { createIdentityLeafHash } from "@/lib/commitment";

export default function LogInPage() {
  const [merkleLeaf, setMerkleLeaf] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Robust QR Scanner Setup
  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (showScanner) {
      const startScanner = async () => {
        try {
          html5QrCode = new Html5Qrcode("reader");
          const config = { fps: 10, qrbox: { width: 250, height: 250 } };
          
          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (decodedText: string) => {
              setMerkleLeaf(decodedText);
              setShowScanner(false);
              void html5QrCode?.stop().catch((error: unknown) => console.error("Failed to stop", error));
            },
            () => {}
          );
        } catch (err) {
          console.error("Scanner failed to start", err);
          setError("Could not access camera. Ensure permissions are granted or use Image Upload.");
        }
      };

      startScanner();

      return () => {
        if (html5QrCode && html5QrCode.isScanning) {
          void html5QrCode.stop().catch((error: unknown) => console.error("Cleanup stop failed", error));
        }
      };
    }
  }, [showScanner]);

  const handleFileScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setIsImporting(true);
    setError("");
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
           setMerkleLeaf(code.data);
           setShowScanner(false);
        } else { 
           setError("No QR Code found in the image.");
        }
        setIsImporting(false);
      };
      img.onerror = () => {
         setError("Invalid Image File!");
         setIsImporting(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Check LocalStorage first (for performance/offline)
      const localData = localStorage.getItem("citizen_license");
      if (localData) {
         const storedUser = JSON.parse(localData);
         if (storedUser.leafHash?.toLowerCase() === merkleLeaf.trim().toLowerCase()) {
            router.push("/wallet");
            return;
         }
      }
      
      // 2. Not found locally or mismatch, check the Global Registry (Supabase)
      const res = await fetch(`/api/identity/lookup?hash=${merkleLeaf.trim()}`);
      const result = await res.json();

      if (result.success) {
         if (result.data.status === 'REVOKED') {
            throw new Error("ACCESS DENIED: Your identity hash has been REVOKED by the LTO Authority.");
         }

         // Success! Reconstruct the session and save locally for the wallet
         const citizenData = {
            ...result.data,
            leafHash: merkleLeaf.trim(),
            publicName: result.publicName
         };
         localStorage.setItem("citizen_license", JSON.stringify(citizenData));
         router.push("/wallet");
      } else {
         throw new Error("No identity found in Registry. Please Register your Registry CID first.");
      }
      
    } catch (error: any) {
      setError(error.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <section className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-20 relative z-10">
        <header className="mb-12">
          <Link href="/" className="inline-flex items-center gap-3 text-slate-400 hover:text-orange-primary font-black transition-all group">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em]">Return to Kakuho</span>
          </Link>
        </header>

        <div className="max-w-md w-full">
           <h1 className="text-4xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
             Log <span className="text-orange-primary">In.</span>
           </h1>
           <p className="text-slate-400 font-medium mb-12 text-lg">Enter your unique Merkle Leaf to access your digital wallet locally.</p>

           {showScanner ? (
             <div className="flex flex-col gap-8 animate-in zoom-in duration-500">
               <div id="reader" className="w-full bg-slate-900 rounded-[40px] border-[12px] border-slate-50 overflow-hidden shadow-2xl relative">
                  {isImporting && <div className="absolute inset-0 bg-white/90 z-[400] flex flex-col items-center justify-center"><div className="w-10 h-10 border-4 border-orange-primary border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-xs font-black text-slate-900 uppercase tracking-widest">Analyzing Image...</p></div>}
               </div>
               <div className="flex flex-col gap-3">
                 <button onClick={() => fileInputRef.current?.click()} className="px-8 py-4 bg-orange-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all">Upload QR Image</button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileScan} />
                 <button onClick={() => setShowScanner(false)} className="px-8 py-4 bg-slate-100 rounded-2xl text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel Scanner</button>
               </div>
             </div>
           ) : (
             <form onSubmit={handleLogin} className="flex flex-col gap-6">
               <div className="flex flex-col gap-3">
                 <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1">Merkle Leaf (Login Hash)</label>
                 <div className="relative">
                   <input 
                     type="text" 
                     value={merkleLeaf}
                     onChange={(e) => setMerkleLeaf(e.target.value)}
                     placeholder="0x..."
                     className="w-full bg-slate-50 px-8 py-6 rounded-[32px] border border-slate-100 focus:bg-white focus:border-orange-primary focus:ring-[12px] focus:ring-orange-500/5 outline-none transition-all text-sm font-mono font-bold uppercase shadow-sm pr-16"
                     required
                   />
                   <button type="button" onClick={() => setShowScanner(true)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 text-orange-primary hover:bg-slate-50 transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   </button>
                 </div>
                 <p className="text-[10px] text-slate-400 ml-1 font-bold">This is verified locally. The Merkle Leaf is not stored in the database.</p>
               </div>

               {error && <p className="text-red-500 text-[10px] font-bold ml-1">{error}</p>}

               <button type="submit" disabled={isLoading} className="mt-4 flex-1 bg-slate-900 text-white font-black py-6 rounded-[32px] shadow-2xl shadow-slate-900/20 hover:bg-orange-primary transition-all text-lg">
                   {isLoading ? "Authenticating..." : "Access Identity"}
               </button>
             </form>
           )}
        </div>
      </section>

      {/* Right Section: Visual */}
      <section className="hidden lg:flex flex-1 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-primary/10 rounded-full blur-[160px]"></div>
      </section>
    </div>
  );
}
