'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { getSupabase } from '@/lib/supabase';


export default function KakuhoRegistryPortal() {
    // Current Features & Content
    const [loading, setLoading] = useState(false);
    
    // UI Navigation & Logic
    const [activeView, setActiveView] = useState('view-dashboard');
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [logs, setLogs] = useState<{ time: string, type: string, msg: string }[]>([]);
    
    // Verification & Revoke State
    const [scannedHash, setScannedHash] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // New Registration State
    const [regFormData, setRegFormData] = useState({ name: '', age: '', gender: 'Male', nationality: 'Filipino', bloodType: 'O+', contact: '', licenseType: 'NON-PRO' });
    const [createdCID, setCreatedCID] = useState<string | null>(null);
    const [validationError, setValidationError] = useState('');

    const fetchData = async () => {
        const { data } = await getSupabase().from('identities').select('*').order('created_at', { ascending: false });
        if (data) setRegistrations(data);
    };

    const addLog = (type: string, msg: string) => {
        setLogs(prev => [{ time: new Date().toLocaleTimeString(), type, msg }, ...prev].slice(0, 30));
    };

    useEffect(() => {
        fetchData();
        addLog('System', 'Kakuho Master Registry Online.');
    }, []);

    const validateForm = () => {
        if (regFormData.name.trim().length < 3) return "Name must be at least 3 characters long.";
        const age = parseInt(regFormData.age);
        if (isNaN(age) || age < 16 || age > 100) return "Age must be between 16 and 100.";
        if (regFormData.nationality.trim().length < 3) return "Nationality is required.";
        // Philippines format validation (e.g. 09XXXXXXXXX or +639XXXXXXXXX)
        const contactRegex = /^(09|\+639)\d{9}$/;
        if (!contactRegex.test(regFormData.contact.trim())) return "Contact number must be a valid format (e.g., 09123456789).";
        return null;
    };

    const handleCreateRegistry = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');
        
        const error = validateForm();
        if (error) {
            setValidationError(error);
            return;
        }

        setLoading(true);
        addLog('System', 'Creating off-chain registry JSON entry...');
        try {
            const res = await fetch('/api/admin/create-registry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(regFormData)
            });
            const data = await res.json();
            if (data.success) {
                setCreatedCID(data.registryCID);
                addLog('Success', `Registry CID Created: ${data.registryCID}`);
            } else {
                addLog('Error', data.error || 'Failed to create registry.');
            }
        } catch (e: any) {
            addLog('Error', e.message);
        }
        setLoading(false);
    };

    // FEATURE: Verify & Revoke ID
    const handleVerify = async () => {
        if (!scannedHash) return;
        addLog('Verifier', 'Scanning Registry for ID Hash...');
        // Verify by leaf_hash (since user requested Merkle leaf to be used for everything again)
        const { data } = await getSupabase().from('identities').select('*').eq('leaf_hash', scannedHash.trim()).single();
        if (data) {
            setStatusMessage(`VALID: Identity verified for ${data.public_name}`);
            addLog('Audit', `VERIFICATION PASS: ${data.public_name}`);
        } else {
            setStatusMessage("INVALID: Hash not found in Registry.");
            addLog('Warning', "VERIFICATION FAIL: Unauthorized Hash.");
        }
    };

    const handleRevoke = async () => {
        if (!scannedHash || adminPassword !== 'LTO-2026-SECURE') {
            addLog('Security', 'Unauthorized revocation attempt.');
            return;
        }
        addLog('Admin', 'Purging Identity from Registry...');
        const { error } = await getSupabase()
            .from('identities')
            .update({ status: 'REVOKED' })
            .eq('leaf_hash', scannedHash.trim());

            
        if (!error) {
            addLog('Success', 'Credential Revoked Successfully.');
            fetchData();
        }
    };

    return (
        <div className="admin-portal">
            <style>{`
                .admin-portal { font-family: 'Inter', sans-serif; background: #020617; color: #f8fafc; height: 100vh; display: flex; overflow: hidden; }
                .glass-panel { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; }
                .sidebar { width: 280px; margin: 16px; padding: 24px 0; display: flex; flex-direction: column; }
                .logo-box { width: 44px; height: 44px; background: #F97316; border-radius: 12px; display: flex; items-center; justify-center; font-size: 1.5rem; margin: 0 24px 32px; }
                .menu-item { padding: 14px 24px; color: #64748b; cursor: pointer; transition: all 0.3s; font-weight: 600; font-size: 0.9rem; }
                .menu-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
                .menu-item.active { color: #F97316; border-left: 4px solid #F97316; background: linear-gradient(90deg, rgba(249,115,22,0.1), transparent); }
                .main-content { flex: 1; padding: 16px; display: flex; flex-direction: column; overflow: hidden; }
                .top-nav { padding: 12px 32px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
                .stat-card { padding: 24px; flex: 1; }
                .stat-val { font-size: 1.8rem; font-weight: 800; margin: 8px 0; }
                .btn-primary { background: #F97316; color: #fff; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
                .btn-secondary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 12px 24px; border-radius: 8px; cursor: pointer; }
                .data-table { width: 100%; border-collapse: collapse; }
                .data-table th { text-align: left; padding: 16px; color: #64748b; font-size: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
                .data-table td { padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .terminal { background: #000; border-radius: 12px; border: 1px solid #222; font-family: 'JetBrains Mono', monospace; height: 100%; overflow-y: auto; padding: 20px; font-size: 0.8rem; }
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 100; }
                .modal-content { width: 100%; max-width: 400px; }
            `}</style>

            <aside className="sidebar glass-panel">
                <div className="flex justify-center mb-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                        <svg className="w-7 h-7 text-slate-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 16C4 16 5 19 8 20C11 21 14 20 16 19M16 19C18 18 20 16 20 13M16 19C15 19.5 13 20 12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <path d="M12 4L5 7V11C5 15.42 8 19.54 12 21C16 19.54 19 15.42 19 11V7L12 4Z" fill="#F97316"/>
                        </svg>
                    </div>
                </div>
                <div className="menu-item active" onClick={() => setActiveView('view-dashboard')}>📊 Dashboard Overview</div>
                <div className="menu-item" onClick={() => setActiveView('view-registrations')}>🆔 Citizen Registry</div>
                <div className="menu-item" onClick={() => setActiveView('view-management')}>⚙️ ID Management</div>
                <div className="menu-item" onClick={() => setActiveView('view-blockchain')}>🔗 Blockchain Logs</div>
                <div className="mt-auto p-6"><div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div><span className="text-[10px] font-black uppercase text-emerald-500">Registry Online</span></div></div>
            </aside>

            <main className="main-content">
                <header className="top-nav glass-panel">
                    <h2 className="text-sm font-black uppercase tracking-widest text-white">Kakuho Master Registry</h2>
                    <div className="flex items-center gap-4"><button className="btn-primary" onClick={() => setIsRegisterOpen(true)}>+ Register Citizen</button></div>
                </header>

                <div className="flex-1 overflow-y-auto pr-4">
                    {activeView === 'view-dashboard' && (
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="stat-card glass-panel">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Identities</p>
                                    <div className="stat-val text-white">{registrations.length}</div>
                                </div>
                                <div className="stat-card glass-panel">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Barretenberg Hashes</p>
                                    <div className="stat-val text-cyan-400">{registrations.length}</div>
                                </div>
                            </div>
                            <div className="glass-panel p-8">
                                <h3 className="text-xs font-black uppercase text-slate-500 mb-6 tracking-[0.3em]">Recent Registrations</h3>
                                <table className="data-table">
                                    <thead><tr><th>Name</th><th>Registry CID</th><th>Status</th></tr></thead>
                                    <tbody>
                                        {registrations.slice(0, 5).map((reg, i) => (
                                            <tr key={i}>
                                                <td>{reg.public_name}</td>
                                                <td><code>{reg.registry_cid?.slice(0, 24) || 'Pending CID'}...</code></td>
                                                <td>
                                                    <span className={`${reg.status === 'REVOKED' ? 'text-red-500' : 'text-emerald-400'} text-[10px] font-bold`}>
                                                        {reg.status || 'ACTIVE'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeView === 'view-registrations' && (
                        <div className="glass-panel p-8 animate-in fade-in duration-500">
                            <h3 className="text-xs font-black uppercase text-slate-500 mb-6 tracking-[0.3em]">National Citizen Registry</h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Full Name</th>
                                        <th>Registry CID</th>
                                        <th>Merkle Leaf</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.map((reg, i) => (
                                        <tr key={i}>
                                            <td>{reg.public_name}</td>
                                            <td><code className="text-[10px]">{reg.registry_cid?.slice(0, 15)}...</code></td>
                                            <td><code className="text-[10px]">{reg.leaf_hash?.slice(0, 15)}...</code></td>
                                            <td>
                                                <span className={`${reg.status === 'REVOKED' ? 'text-red-500' : 'text-emerald-400'} text-[10px] font-bold`}>
                                                    {reg.status || 'ACTIVE'}
                                                </span>
                                            </td>
                                            <td>
                                                {reg.status !== 'REVOKED' && (
                                                    <button 
                                                        onClick={() => { setScannedHash(String(reg.leaf_hash || '')); setActiveView('view-management'); }}
                                                        className="text-[10px] font-black text-orange-primary hover:underline"
                                                    >
                                                        MANAGE
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeView === 'view-management' && (
                        <div className="glass-panel p-10 max-w-2xl mx-auto space-y-8">
                            <h2 className="text-2xl font-black text-white">ID Management Terminal</h2>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500">Target License Hash (ZKP Leaf)</label>
                                <input type="text" placeholder="Paste Hash here..." value={String(scannedHash || '')} onChange={(e) => setScannedHash(e.target.value)} className="w-full bg-black/30 border border-white/10 p-4 rounded-lg text-white font-mono text-xs outline-none focus:border-orange-500" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-slate-500">Admin Authorization</label>
                                <input type="password" placeholder="Enter Admin Password" value={String(adminPassword || '')} onChange={(e) => setAdminPassword(e.target.value)} className="w-full bg-black/30 border border-white/10 p-4 rounded-lg text-white font-mono text-xs outline-none focus:border-orange-500" />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleVerify} className="flex-1 btn-primary bg-emerald-600 hover:bg-emerald-500">✅ VERIFY ID</button>
                                <button onClick={handleRevoke} className="flex-1 btn-primary bg-red-600 hover:bg-red-500">🚨 REVOKE ID</button>
                            </div>
                            {statusMessage && <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center text-sm font-bold text-orange-500">{statusMessage}</div>}
                        </div>
                    )}

                    {activeView === 'view-blockchain' && (
                        <div className="terminal">
                            {logs.map((log, i) => (
                                <p key={i} className="mb-2"><span className="text-slate-500">[{log.time}]</span> <span className="font-bold text-cyan-500">{log.type}:</span> {log.msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {isRegisterOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel p-8">
                        <div className="flex justify-between mb-8"><h2 className="font-black text-white uppercase tracking-widest text-xs">Kakuho Registration Desk</h2><button onClick={() => { setIsRegisterOpen(false); setCreatedCID(null); setValidationError(''); }}>✕</button></div>
                        {!createdCID ? (
                            <form onSubmit={handleCreateRegistry} className="space-y-4 flex flex-col gap-2">
                                {validationError && <div className="bg-red-500/20 border border-red-500/50 text-red-300 text-xs p-3 rounded-lg font-bold">{validationError}</div>}
                                
                                <input type="text" placeholder="Full Name" required value={regFormData.name} onChange={e => setRegFormData({...regFormData, name: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white font-mono text-xs outline-none focus:border-orange-500" />
                                <input type="number" placeholder="Age" required value={regFormData.age} onChange={e => setRegFormData({...regFormData, age: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white font-mono text-xs outline-none focus:border-orange-500" />
                                
                                <select required value={regFormData.gender} onChange={e => setRegFormData({...regFormData, gender: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white font-mono text-xs outline-none focus:border-orange-500">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>

                                <input type="text" placeholder="Nationality" required value={regFormData.nationality} onChange={e => setRegFormData({...regFormData, nationality: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white font-mono text-xs outline-none focus:border-orange-500" />
                                
                                <select required value={regFormData.bloodType} onChange={e => setRegFormData({...regFormData, bloodType: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white font-mono text-xs outline-none focus:border-orange-500">
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>

                                <input type="text" placeholder="Contact Number (09XXXXXXXXX)" required value={regFormData.contact} onChange={e => setRegFormData({...regFormData, contact: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white font-mono text-xs outline-none focus:border-orange-500" />

                                <select required value={regFormData.licenseType} onChange={e => setRegFormData({...regFormData, licenseType: e.target.value})} className="w-full bg-black/30 border border-white/10 p-3 rounded-lg text-white font-mono text-xs outline-none focus:border-orange-500">
                                    <option value="STUDENT PERMIT">STUDENT PERMIT</option>
                                    <option value="NON-PRO">NON-PROFESSIONAL</option>
                                    <option value="PRO">PROFESSIONAL</option>
                                </select>
                                
                                <button type="submit" disabled={loading} className="w-full btn-primary uppercase tracking-[0.2em] text-xs mt-4">
                                    {loading ? 'Creating...' : 'Save off-chain & Generate CID'}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-6">
                                <div className="bg-white p-4 inline-block rounded-xl"><QRCodeSVG value={createdCID} size={150} /></div>
                                <p className="text-[10px] font-mono text-slate-500 break-all font-bold">Registry CID: <br/><span className="text-white text-sm mt-2 block">{createdCID}</span></p>
                                <p className="text-[10px] text-orange-400">Share this CID with the citizen. They will use it to complete registration on their device.</p>
                                <button onClick={() => { setIsRegisterOpen(false); setCreatedCID(null); setRegFormData({ name: '', age: '', gender: 'Male', nationality: 'Filipino', bloodType: 'O+', contact: '', licenseType: 'NON-PRO' }); setValidationError(''); }} className="btn-primary w-full mt-4">CLOSE TERMINAL</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}