'use client';
import { useState } from 'react';

export default function LTOAdminDashboard() {
    const [scannedHash, setScannedHash] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleVerify = async () => {
        if (!scannedHash) {
            setStatusMessage("ERROR: Please enter a Hash to verify.");
            setIsSuccess(false);
            return;
        }
        setStatusMessage("Scanning database...");
        try {
            const response = await fetch('http://localhost:3000/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leafHash: scannedHash })
            });
            const data = await response.json();
            setStatusMessage(`[VERIFY RESULT]: ${data.status} - ${data.message}`);
            setIsSuccess(data.status === "VALID");
        } catch (error) {
            setStatusMessage("CRITICAL ERROR: Cannot reach Node.js Backend.");
            setIsSuccess(false);
        }
    };

    const handleRevoke = async () => {
        if (!scannedHash || !adminPassword) {
            setStatusMessage("ERROR: Both Hash and Admin Password required to revoke!");
            setIsSuccess(false);
            return;
        }
        setStatusMessage("Processing revocation...");
        try {
            const response = await fetch('http://localhost:3000/api/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    targetLeafHash: scannedHash,
                    adminPassword: adminPassword 
                })
            });
            const data = await response.json();
            setStatusMessage(`[REVOKE RESULT]: ${data.status} - ${data.message}`);
            setIsSuccess(data.status === "SUCCESS");
        } catch (error) {
            setStatusMessage("CRITICAL ERROR: Cannot reach Node.js Backend.");
            setIsSuccess(false);
        }
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ borderBottom: '3px solid #0056b3', paddingBottom: '15px', color: '#0056b3' }}>
                🏛️ LTO Master Command Center
            </h1>
            <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '10px', marginTop: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h3>Target License Hash (ZKP Leaf)</h3>
                <input type="text" placeholder="Paste the Citizen's ZKP Hash here..." value={scannedHash} onChange={(e) => setScannedHash(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px' }} />
                <h3>Admin Authorization</h3>
                <input type="password" placeholder="Enter LTO Admin Password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '30px' }} />
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button onClick={handleVerify} style={{ flex: 1, padding: '15px', background: '#28a745', color: 'white' }}>✅ VERIFY ID</button>
                    <button onClick={handleRevoke} style={{ flex: 1, padding: '15px', background: '#dc3545', color: 'white' }}>🚨 REVOKE ID</button>
                </div>
            </div>
            {statusMessage && <div style={{ marginTop: '30px', padding: '20px', background: isSuccess ? '#d4edda' : '#f8d7da' }}>{statusMessage}</div>}
        </div>
    );
}
