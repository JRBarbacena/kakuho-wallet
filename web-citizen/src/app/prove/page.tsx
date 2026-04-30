export default function ProvePage() {
  const [citizen, setCitizen] = useState<any>(null);
  const [isProving, setIsProving] = useState(false);
  const [proofData, setProofData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("citizen_license");
    if (data) {
      setCitizen(JSON.parse(data));
    }
  }, []);

  const handleProve = async () => {
    if (!citizen) return;
    setIsProving(true);
    setError(null);
    setProofData(null);

    try {
      const result = await generateIdentityProof(
        citizen.secret,
        citizen.private_license_data,
        citizen.merkle_path,
        citizen.leaf_index,
        citizen.public_name,
        citizen.public_merkle_root
      );
      setProofData(result);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate ZK Proof. Please ensure your inputs are valid.");
    } finally {
      setIsProving(false);
    }
  };

  if (!citizen) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-white mb-4">No Active Identity</h2>
          <p className="text-zinc-400 mb-6">You need to activate an identity from your wallet first.</p>
          <Link href="/wallet" className="bg-orange-primary text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-500 transition-all">
            Go to Wallet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-12 pb-24 text-white">
      <header className="flex items-center gap-4 mb-8">
        <Link href="/wallet" className="glass p-2 rounded-xl text-zinc-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Identity Prover</h1>
          <p className="text-zinc-500 text-sm">ZK-SNARK Circuit (Barretenberg)</p>
        </div>
      </header>

      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {/* Status Section */}
        <div className="glass rounded-2xl p-6 flex flex-col gap-4 border border-white/10 bg-white/5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Vault Status</span>
            <span className="flex items-center gap-2 text-green-400 text-xs font-bold">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              DATA LOADED
            </span>
          </div>
          <p className="text-sm text-zinc-300">Your identity secrets are ready to be used as private inputs for the circuit.</p>
        </div>

        {/* Public Inputs Section */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-1">Public Inputs</label>
          <div className="glass rounded-2xl p-5 flex flex-col gap-4 border border-white/10 bg-white/5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Public Name</span>
              <code className="text-sm text-white font-mono bg-black/40 px-3 py-2 rounded-xl border border-white/5">{citizen.public_name}</code>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Merkle Root</span>
              <code className="text-xs text-orange-400 font-mono bg-black/40 px-3 py-2 rounded-xl border border-white/5 overflow-hidden text-ellipsis">{citizen.public_merkle_root}</code>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">These are the public inputs that will be exposed to the verifier.</p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleProve}
          disabled={isProving}
          className={`mt-4 w-full py-4 rounded-2xl font-bold uppercase tracking-widest transition-all ${
            isProving 
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5" 
              : "bg-orange-primary text-white hover:bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] border border-orange-400/50"
          }`}
        >
          {isProving ? "Generating Proof (This may take a minute)..." : "Generate ZK Proof"}
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-2">
            <p className="text-xs text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Proof Result */}
        {proofData && (
          <div className="glass rounded-2xl p-6 flex flex-col gap-4 border border-green-500/30 bg-green-500/5 mt-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black text-green-400 uppercase tracking-widest">Proof Generated Successfully!</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Nullifier Hash</span>
              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <code className="text-xs font-mono text-blue-400">{proofData.nullifier}</code>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Proof Hex (Truncated)</span>
              <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                <code className="text-[10px] font-mono text-zinc-300 break-all">
                  {proofData.proof.substring(0, 120)}...
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
