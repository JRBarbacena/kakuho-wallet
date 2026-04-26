"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Decorative Gradient Background for Mobile */}
      <div className="lg:hidden absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-orange-50 to-transparent -z-10"></div>
      
      {/* Left Section: Content */}
      <section className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-20 relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-xl shadow-black/5 border border-slate-100">
            <svg className="w-7 h-7 text-slate-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Hand cradling */}
                <path d="M4 16C4 16 5 19 8 20C11 21 14 20 16 19M16 19C18 18 20 16 20 13M16 19C15 19.5 13 20 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                {/* Shield */}
                <path d="M12 4L5 7V11C5 15.42 8 19.54 12 21C16 19.54 19 15.42 19 11V7L12 4Z" fill="#F97316"/>
            </svg>
          </div>
          <h2 className="text-sm font-black text-slate-900 tracking-[0.4em] uppercase">Kakuho</h2>
        </div>
        
        <div className="flex flex-col gap-6 max-w-xl">
          <h1 className="text-5xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
            Digital<br/>
            <span className="text-orange-primary">Credential.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 font-medium leading-relaxed max-w-md">
            The next generation of verifiable identity. Secured by Kakuho ZK-Proofs and anchored to the blockchain.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 mt-16">
          <Link 
            href="/login"
            className="px-10 py-6 bg-slate-900 text-white font-black rounded-3xl text-center hover:bg-orange-primary transition-all shadow-2xl shadow-slate-900/20 text-lg"
          >
            Log In
          </Link>
          <Link 
            href="/register"
            className="px-10 py-6 bg-slate-900 text-white font-black rounded-3xl text-center hover:bg-orange-primary transition-all shadow-2xl shadow-slate-900/20 text-lg"
          >
            Register Data
          </Link>
        </div>

        <footer className="mt-24 flex items-center gap-6 opacity-30">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-slate-900 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Kakuho Registry v2.0</span>
        </footer>
      </section>

      {/* Right Section: Visual (Desktop Only) */}
      <section className="hidden lg:flex flex-1 bg-slate-900 relative items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-primary/20 rounded-full blur-[160px]"></div>
        
        {/* Floating Card Mockup */}
        <div className="relative group perspective-1000">
          <div className="w-[400px] h-[260px] bg-white rounded-[40px] shadow-2xl shadow-black/50 rotate-[-5deg] group-hover:rotate-0 transition-all duration-1000 overflow-hidden border border-white/20">
             <div className="h-16 bg-slate-900 p-6 flex justify-between items-center">
                <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                <div className="w-24 h-2 bg-white/10 rounded-full"></div>
             </div>
             <div className="p-8 flex gap-6">
                <div className="w-16 h-20 bg-slate-50 rounded-2xl"></div>
                <div className="flex flex-col gap-3">
                   <div className="w-32 h-3 bg-slate-100 rounded-full"></div>
                   <div className="w-48 h-3 bg-slate-100 rounded-full"></div>
                   <div className="w-24 h-3 bg-orange-100 rounded-full"></div>
                </div>
             </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-primary rounded-3xl shadow-2xl flex items-center justify-center text-white rotate-[15deg] group-hover:rotate-0 transition-all duration-700">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
      </section>
    </div>
  );
}
