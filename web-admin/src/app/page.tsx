'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type CitizenSubject = {
  licenseID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  licenseType: string;
  expirationDate: string;
  restrictions: string;
  conditions: string;
  bloodType: string;
  addressCity: string;
};

const mockCitizens: { subject: CitizenSubject }[] = [
  { subject: { licenseID: "N01-26-711462", firstName: "Salvador", lastName: "Fernandez", dateOfBirth: "1975-06-06", licenseType: "NON-PROFESSIONAL", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "AB+", addressCity: "Carmona" } },
  { subject: { licenseID: "N01-26-827265", firstName: "Gloria", lastName: "Molina", dateOfBirth: "2002-07-16", licenseType: "NON-PROFESSIONAL", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "A-", addressCity: "Silang" } },
  { subject: { licenseID: "N01-26-889112", firstName: "Manuel", lastName: "Luna", dateOfBirth: "1987-01-27", licenseType: "NON-PROFESSIONAL", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "O+", addressCity: "GMA" } },
  { subject: { licenseID: "N01-26-759441", firstName: "Lucia", lastName: "Soto", dateOfBirth: "2000-08-04", licenseType: "NON-PROFESSIONAL", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "B+", addressCity: "Pasig" } },
  { subject: { licenseID: "N01-26-123419", firstName: "Salvador", lastName: "Diaz", dateOfBirth: "1979-12-27", licenseType: "NON-PROFESSIONAL", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "O+", addressCity: "Bacoor" } },
  { subject: { licenseID: "N01-26-210879", firstName: "Oscar", lastName: "Bravo", dateOfBirth: "1997-03-16", licenseType: "NON-PROFESSIONAL", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "AB+", addressCity: "Gen. Mariano Alvarez" } },
  { subject: { licenseID: "N01-26-484720", firstName: "Diana", lastName: "Garrido", dateOfBirth: "1996-06-11", licenseType: "NON-PROFESSIONAL", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "B-", addressCity: "Caloocan City" } },
  { subject: { licenseID: "N01-26-563853", firstName: "Teresa", lastName: "Delo Santos", dateOfBirth: "2003-05-22", licenseType: "NON-PROFESSIONAL", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "O-", addressCity: "General Trias" } },
  { subject: { licenseID: "N01-26-493916", firstName: "Marta", lastName: "Rojas", dateOfBirth: "1989-12-16", licenseType: "NON-PROFESSIONAL", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "O-", addressCity: "Cavite City" } },
  { subject: { licenseID: "N01-26-836889", firstName: "Eduardo", lastName: "Vega", dateOfBirth: "1995-10-06", licenseType: "NON-PROFESSIONAL", expirationDate: "2036-04-21", restrictions: "1, 2", conditions: "None", bloodType: "A+", addressCity: "Marikina" } },
];

type View = 'dashboard' | 'registry' | 'management' | 'logs';

const NAV_ITEMS: { id: View; label: string; icon: React.ReactNode }[] = [
  {
    id: 'dashboard', label: 'Dashboard',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
  },
  {
    id: 'registry', label: 'Citizen Registry',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
  },
  {
    id: 'management', label: 'ID Management',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
  },
  {
    id: 'logs', label: 'Blockchain Logs',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
  },
];

export default function AdminPage() {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [pendingEntries, setPendingEntries] = useState<any[]>([]);
  const [logs, setLogs] = useState<{ time: string; type: string; msg: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [anchorSuccess, setAnchorSuccess] = useState<{ txHash: string; leafIndex: number } | null>(null);
  const [scannedHash, setScannedHash] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ found: boolean; name?: string; status?: string } | null>(null);
  const [revokeResult, setRevokeResult] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const addLog = (type: string, msg: string) => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), type, msg }, ...prev].slice(0, 50));
  };

  const fetchData = async () => {
    const { data } = await supabase.from('identities').select('*').order('created_at', { ascending: false });
    if (data) {
      setRegistrations(data.filter((r: any) => r.status !== 'PENDING'));
      setPendingEntries(data.filter((r: any) => r.status === 'PENDING'));
    }
  };

  useEffect(() => {
    fetchData();
    addLog('System', 'Kakuho Master Registry Online.');
  }, []);

  const handleAnchorCitizen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex === null) return;
    setLoading(true);
    setAnchorSuccess(null);

    const { subject } = mockCitizens[selectedIndex];
    const fullName = `${subject.firstName} ${subject.lastName}`;
    addLog('Chain', `Anchoring ${fullName} to blockchain...`);

    try {
      const res = await fetch('/api/admin/create-registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicName: fullName, subject }),
      });
      const data = await res.json();
      if (data.success) {
        setAnchorSuccess({ txHash: data.txHash, leafIndex: data.leafIndex });
        addLog('Success', `${fullName} anchored. Leaf #${data.leafIndex} | TX: ${data.txHash?.slice(0, 20)}...`);
        fetchData();
      } else {
        addLog('Error', data.error || 'Anchor failed.');
      }
    } catch (err: any) {
      addLog('Error', err.message);
    }
    setLoading(false);
  };

  const handleAnchorPending = async (entry: any) => {
    setLoading(true);
    addLog('Chain', `Anchoring pending: ${entry.public_name}...`);
    try {
      const res = await fetch('/api/admin/create-registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leafHash: entry.leaf_hash,
          publicName: entry.public_name,
          subject: entry.subject,
          licenseID: entry.license_id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addLog('Success', `${entry.public_name} anchored. Leaf #${data.leafIndex} | TX: ${data.txHash?.slice(0, 20)}...`);
        fetchData();
      } else {
        addLog('Error', data.error || 'Anchor failed.');
      }
    } catch (err: any) {
      addLog('Error', err.message);
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!scannedHash.trim()) return;
    setVerifyResult(null);
    setRevokeResult(null);
    addLog('Verifier', `Verifying hash: ${scannedHash.slice(0, 20)}...`);
    const { data } = await supabase.from('identities').select('*').eq('leaf_hash', scannedHash.trim()).single();
    if (data) {
      setVerifyResult({ found: true, name: data.public_name, status: data.status });
      addLog('Audit', `PASS: ${data.public_name} — Status: ${data.status}`);
    } else {
      setVerifyResult({ found: false });
      addLog('Warning', 'FAIL: Hash not found in registry.');
    }
  };

  const handleRevoke = async () => {
    if (!scannedHash.trim()) return;
    setRevokeResult(null);
    addLog('Admin', `Revoking: ${scannedHash.slice(0, 20)}...`);
    const res = await fetch('/api/admin/revoke', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leafHash: scannedHash.trim() }),
    });
    const data = await res.json();
    if (data.success) {
      setRevokeResult('success');
      addLog('Success', 'Credential revoked successfully.');
      fetchData();
    } else {
      setRevokeResult('error');
      addLog('Error', data.error || 'Revoke failed.');
    }
  };

  const selectedSubject = selectedIndex !== null ? mockCitizens[selectedIndex].subject : null;

  const Sidebar = () => (
    <aside className="flex flex-col w-64 bg-slate-900 border-r border-white/5 h-screen sticky top-0 flex-shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M4 16C4 16 5 19 8 20C11 21 14 20 16 19M16 19C18 18 20 16 20 13M16 19C15 19.5 13 20 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 4L5 7V11C5 15.42 8 19.54 12 21C16 19.54 19 15.42 19 11V7L12 4Z" fill="#F97316"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-black text-xs tracking-widest uppercase">Kakuho</p>
          <p className="text-white/30 text-[9px] font-bold">Admin Registry</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveView(item.id); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeView === item.id
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'text-white/30 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-3">
        <div className="flex items-center gap-2 px-2">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Registry Online</span>
        </div>
        <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Active Records</p>
          <p className="text-lg font-black text-white">{registrations.length}</p>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex text-white">

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)}></div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="flex items-center justify-between px-5 lg:px-8 py-4 border-b border-white/5 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-widest">
                {NAV_ITEMS.find(n => n.id === activeView)?.label}
              </h1>
              <p className="text-[9px] text-white/20 font-bold hidden lg:block">LTO Kakuho Master Registry · Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => { setIsRegisterOpen(true); setSelectedIndex(null); setAnchorSuccess(null); }}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
            <span className="hidden sm:inline">Anchor Citizen</span>
            <span className="sm:hidden">Anchor</span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8 overflow-y-auto">

          {/* DASHBOARD */}
          {activeView === 'dashboard' && (
            <div className="flex flex-col gap-6 max-w-5xl">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Active Identities', value: registrations.filter(r => r.status !== 'REVOKED').length, color: 'text-white' },
                  { label: 'Pending Anchor', value: pendingEntries.length, color: 'text-yellow-400' },
                  { label: 'Revoked', value: registrations.filter(r => r.status === 'REVOKED').length, color: 'text-red-400' },
                  { label: 'Total Records', value: registrations.length + pendingEntries.length, color: 'text-orange-400' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Pending anchor table */}
              {pendingEntries.length > 0 && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-yellow-500/10">
                    <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Pending Blockchain Anchor</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5">
                          {['Name', 'Leaf Hash', 'Action'].map(h => (
                            <th key={h} className="text-left px-6 py-3 text-[9px] font-black text-white/20 uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pendingEntries.map((entry, i) => (
                          <tr key={i} className="border-b border-white/5 last:border-0">
                            <td className="px-6 py-4 text-sm font-bold text-white">{entry.public_name}</td>
                            <td className="px-6 py-4"><code className="text-[10px] text-white/40 font-mono">{entry.leaf_hash?.slice(0, 22)}...</code></td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleAnchorPending(entry)}
                                disabled={loading}
                                className="text-[10px] font-black text-yellow-400 hover:text-white border border-yellow-400/30 hover:border-yellow-400 px-3 py-1.5 rounded-lg hover:bg-yellow-400/10 transition-all disabled:opacity-30 uppercase tracking-wider"
                              >
                                Anchor to Chain
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recent registrations */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Recent Registrations</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {['Name', 'License ID', 'Leaf Hash', 'Status'].map(h => (
                          <th key={h} className="text-left px-6 py-3 text-[9px] font-black text-white/20 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.slice(0, 6).map((reg, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all">
                          <td className="px-6 py-4 text-sm font-bold text-white">{reg.public_name}</td>
                          <td className="px-6 py-4"><code className="text-[10px] text-white/50 font-mono">{reg.license_id || '—'}</code></td>
                          <td className="px-6 py-4"><code className="text-[10px] text-white/40 font-mono">{reg.leaf_hash?.slice(0, 18)}...</code></td>
                          <td className="px-6 py-4">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${
                              reg.status === 'REVOKED'
                                ? 'text-red-400 bg-red-500/10 border-red-500/20'
                                : 'text-green-400 bg-green-500/10 border-green-500/20'
                            }`}>
                              {reg.status || 'ACTIVE'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {registrations.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-white/20 text-xs font-bold">No registrations yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* REGISTRY */}
          {activeView === 'registry' && (
            <div className="max-w-5xl">
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">National Citizen Registry</p>
                  <span className="text-[9px] font-black text-white/20">{registrations.length} records</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        {['Name', 'License ID', 'Merkle Leaf', 'Leaf Index', 'Status', 'Action'].map(h => (
                          <th key={h} className="text-left px-6 py-3 text-[9px] font-black text-white/20 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-all">
                          <td className="px-6 py-4 text-sm font-bold text-white">{reg.public_name}</td>
                          <td className="px-6 py-4"><code className="text-[10px] text-white/50 font-mono">{reg.license_id || '—'}</code></td>
                          <td className="px-6 py-4"><code className="text-[10px] text-white/40 font-mono">{reg.leaf_hash?.slice(0, 16)}...</code></td>
                          <td className="px-6 py-4"><code className="text-[10px] text-white/40 font-mono">#{reg.leaf_index ?? '—'}</code></td>
                          <td className="px-6 py-4">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${
                              reg.status === 'REVOKED'
                                ? 'text-red-400 bg-red-500/10 border-red-500/20'
                                : 'text-green-400 bg-green-500/10 border-green-500/20'
                            }`}>
                              {reg.status || 'ACTIVE'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {reg.status !== 'REVOKED' && (
                              <button
                                onClick={() => { setScannedHash(String(reg.leaf_hash || '')); setActiveView('management'); setVerifyResult(null); setRevokeResult(null); }}
                                className="text-[10px] font-black text-orange-400 hover:text-white uppercase tracking-wider transition-colors"
                              >
                                Manage
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {registrations.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-white/20 text-xs font-bold">No records found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MANAGEMENT */}
          {activeView === 'management' && (
            <div className="max-w-xl flex flex-col gap-5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-5">
                <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Target Leaf Hash</p>
                  <textarea
                    rows={3}
                    placeholder="Paste citizen leaf hash here..."
                    value={scannedHash}
                    onChange={e => { setScannedHash(e.target.value); setVerifyResult(null); setRevokeResult(null); }}
                    className="w-full bg-black/30 border border-white/10 px-4 py-3 rounded-xl text-xs font-mono text-white outline-none focus:border-orange-500/50 resize-none placeholder:text-white/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleVerify}
                    disabled={!scannedHash.trim()}
                    className="py-3 bg-green-500/10 border border-green-500/20 text-green-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-green-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Verify ID
                  </button>
                  <button
                    onClick={handleRevoke}
                    disabled={!scannedHash.trim()}
                    className="py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Revoke ID
                  </button>
                </div>
              </div>

              {/* Verify result */}
              {verifyResult && (
                <div className={`rounded-2xl p-5 border ${verifyResult.found ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                  <div className="flex items-center gap-3">
                    {verifyResult.found
                      ? <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      : <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                    }
                    <div>
                      <p className={`text-sm font-black ${verifyResult.found ? 'text-green-400' : 'text-red-400'}`}>
                        {verifyResult.found ? `VALID — ${verifyResult.name}` : 'INVALID — Hash not found'}
                      </p>
                      {verifyResult.found && (
                        <p className="text-[10px] text-white/30 font-bold mt-0.5">Status: {verifyResult.status}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Revoke result */}
              {revokeResult && (
                <div className={`rounded-2xl p-5 border ${revokeResult === 'success' ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                  <p className={`text-sm font-black ${revokeResult === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {revokeResult === 'success' ? 'Credential revoked successfully.' : 'Revoke failed. Check logs.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* BLOCKCHAIN LOGS */}
          {activeView === 'logs' && (
            <div className="max-w-4xl">
              <div className="bg-black border border-white/10 rounded-2xl p-5 h-[70vh] overflow-y-auto font-mono">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Live Terminal</span>
                </div>
                {logs.length === 0 && (
                  <p className="text-white/20 text-xs">No logs yet.</p>
                )}
                {logs.map((log, i) => (
                  <p key={i} className="text-xs mb-2 leading-relaxed">
                    <span className="text-white/20">[{log.time}]</span>{' '}
                    <span className={`font-bold ${
                      log.type === 'Success' ? 'text-green-400'
                      : log.type === 'Error' ? 'text-red-400'
                      : log.type === 'Warning' ? 'text-yellow-400'
                      : log.type === 'Chain' ? 'text-blue-400'
                      : log.type === 'Audit' ? 'text-purple-400'
                      : 'text-cyan-400'
                    }`}>{log.type}:</span>{' '}
                    <span className="text-white/60">{log.msg}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Anchor Citizen</h2>
                <p className="text-[10px] text-white/30 font-bold mt-0.5">Select citizen from registry to anchor on-chain</p>
              </div>
              <button
                onClick={() => { setIsRegisterOpen(false); setAnchorSuccess(null); setSelectedIndex(null); }}
                className="w-8 h-8 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all text-sm font-black"
              >✕</button>
            </div>

            {!anchorSuccess ? (
              <form onSubmit={handleAnchorCitizen} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Select Citizen</label>
                  <select
                    required
                    value={selectedIndex ?? ''}
                    onChange={e => setSelectedIndex(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/10 px-4 py-3 rounded-xl text-sm font-mono text-white outline-none focus:border-orange-500/50 transition-all"
                  >
                    <option value="" disabled className="bg-slate-900">-- Choose citizen --</option>
                    {mockCitizens.map((c, i) => (
                      <option key={i} value={i} className="bg-slate-900">
                        {c.subject.firstName} {c.subject.lastName} — {c.subject.licenseID}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                {selectedSubject && (
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-4">
                    {[
                      ['License ID', selectedSubject.licenseID],
                      ['Blood Type', selectedSubject.bloodType],
                      ['Date of Birth', selectedSubject.dateOfBirth],
                      ['Address', selectedSubject.addressCity],
                      ['License Type', selectedSubject.licenseType],
                      ['Expiration', selectedSubject.expirationDate],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[8px] text-white/20 font-black uppercase tracking-wider">{label}</p>
                        <p className="text-[11px] font-mono text-white/60 font-bold">{value}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || selectedIndex === null}
                  className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      Anchoring to Blockchain...
                    </span>
                  ) : 'Anchor to Blockchain'}
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    <span className="text-sm font-black text-green-400">Anchored Successfully!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Leaf Index</p>
                      <code className="text-sm font-mono text-white font-bold">#{anchorSuccess.leafIndex}</code>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">TX Hash</p>
                      <code className="text-[10px] font-mono text-white/60 break-all">{anchorSuccess.txHash?.slice(0, 24)}...</code>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setIsRegisterOpen(false); setAnchorSuccess(null); setSelectedIndex(null); }}
                  className="w-full py-3 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
