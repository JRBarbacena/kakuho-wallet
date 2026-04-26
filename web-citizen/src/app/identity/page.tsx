"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function IdentityPage() {
  const [showSecret, setShowSecret] = useState(false);
  const commitment = "0x2b9c7f8e...a1d4";
  const trapdoor = "77265c83d...f92a";
  const nullifier = "192c3d4e5...b712";

  return (
    <div className="wallet-container pb-24">
      <header className="flex items-center gap-4">
        <Link href="/wallet" className="glass p-2 rounded-xl text-zinc-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Identity Vault</h1>
          <p className="text-zinc-500 text-sm">Semaphore v4 Identity</p>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {/* Status Section */}
        <div className="glass rounded-2xl p-6 flex flex-col gap-4 border-primary/20">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Vault Status</span>
            <span className="flex items-center gap-2 text-primary text-xs font-bold">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              ENCRYPTED & SYNCED
            </span>
          </div>
          <p className="text-sm text-zinc-300">Your identity secrets are stored locally and encrypted using your device&apos;s secure enclave.</p>
        </div>

        {/* Commitment Section */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">Public Identity Commitment</label>
          <div className="glass rounded-2xl p-5 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <code className="text-xs text-primary font-mono bg-primary/10 px-2 py-1 rounded-md">{commitment}</code>
              <button className="text-zinc-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-zinc-500">This hash is what exists in the government Merkle Tree. It does not reveal your PII.</p>
          </div>
        </div>

        {/* Private Secrets Section */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Private Witnesses</label>
            <button 
              onClick={() => setShowSecret(!showSecret)}
              className="text-[10px] font-bold text-accent hover:underline uppercase tracking-tighter"
            >
              {showSecret ? "Hide Secrets" : "Reveal Secrets"}
            </button>
          </div>
          <div className="glass rounded-2xl p-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Trapdoor</span>
              <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                <code className="text-xs font-mono">
                  {showSecret ? trapdoor : "••••••••••••••••••••••••••••"}
                </code>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Nullifier</span>
              <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5">
                <code className="text-xs font-mono">
                  {showSecret ? nullifier : "••••••••••••••••••••••••••••"}
                </code>
              </div>
            </div>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex gap-3 items-start">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent shrink-0">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
            <p className="text-[10px] text-accent/80 leading-relaxed font-medium">
              NEVER share your Trapdoor or Nullifier with anyone. These are the mathematical witnesses required to generate your proofs.
            </p>
          </div>
        </div>

        <button className="mt-4 w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold py-4 rounded-2xl border border-white/5 transition-all">
          Backup Identity
        </button>
      </div>

      {/* Bottom Nav (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border px-8 py-4 flex justify-between items-center sm:hidden">
        <Link href="/wallet" className="flex flex-col items-center gap-1 text-zinc-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
          </svg>
          <span className="text-[10px] font-medium uppercase">Wallet</span>
        </Link>
        <div className="flex flex-col items-center gap-1 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
          </svg>
          <span className="text-[10px] font-medium uppercase">Identity</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-zinc-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.007.51.011.769.011h3c.259 0 .516-.004.769-.011m-5.338-9.18c.253-.007.51-.011.769-.011h3c.259 0 .516.004.769.011m0 0c.688.06 1.386.09 2.09.09h.75a4.5 4.5 0 1 1 0 9h-.75c-.704 0-1.402.03-2.09.09M9 18c3.666 0 6.667-3 6.667-6.667H9V18Z" />
          </svg>
          <span className="text-[10px] font-medium uppercase">History</span>
        </div>
      </nav>
    </div>
  );
}
