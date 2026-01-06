import React, { useState } from 'react';
import { LazorkitProvider, useLazorkit } from './context/LazorkitContext';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Fingerprint, Wallet, Send, ShieldCheck, LogOut, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react';

// --- COMPONENTS ---

const LoginView = () => {
  const { connect, isLoading } = useLazorkit();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white min-h-screen">
      <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-xl border border-white/20 mb-8 shadow-2xl">
        <Fingerprint size={64} className="text-white" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Lazorkit Wallet</h1>
      <p className="text-indigo-100 mb-8 text-center max-w-xs">
        Secure Solana access using Passkeys. No seed phrases required.
      </p>
      <button 
        onClick={connect}
        disabled={isLoading}
        className="w-full max-w-xs bg-white text-indigo-700 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-50 transition-all flex items-center justify-center gap-3"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Fingerprint />}
        Sign in with Passkey
      </button>
    </div>
  );
};

const DashboardView = () => {
  const { walletAddress, disconnect, sendGaslessTx } = useLazorkit();
  const [amount, setAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress || !amount) return;
    setIsSending(true);
    
    try {
      // Create Instruction
      const ix = SystemProgram.transfer({
        fromPubkey: walletAddress,
        toPubkey: new PublicKey("LazorKi7w1VNeRZgDWH5qmNz2XFq5QeZbqC8caqSE5W"), // Demo recipient
        lamports: parseFloat(amount) * LAMPORTS_PER_SOL
      });

      // Send via Paymaster
      const signature = await sendGaslessTx(ix);
      setTxHash(signature);
    } catch (e) {
      alert("Failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-lg">
          <div className="bg-indigo-600 p-2 rounded-lg"><Wallet size={20} className="text-white"/></div>
          Lazorkit
        </div>
        <button onClick={disconnect} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full">
          <LogOut size={20} />
        </button>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <p className="text-indigo-100 font-medium">Available Balance</p>
          <h2 className="text-4xl font-bold mt-2">$240.50</h2>
          <p className="text-xs font-mono mt-4 bg-black/20 inline-block px-3 py-1 rounded-lg">
            {walletAddress?.toBase58().slice(0,6)}...{walletAddress?.toBase58().slice(-4)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border flex flex-col items-center gap-2 text-center">
            <ShieldCheck className="text-green-500" />
            <span className="text-xs font-bold text-slate-500 uppercase">Security</span>
            <span className="text-sm font-medium">Biometric</span>
          </div>
          <div className="bg-white p-4 rounded-xl border flex flex-col items-center gap-2 text-center">
            <Send className="text-blue-500" />
            <span className="text-xs font-bold text-slate-500 uppercase">Gas</span>
            <span className="text-sm font-medium">Sponsored</span>
          </div>
        </div>

        <form onSubmit={handleTransfer} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
          <h3 className="font-bold text-lg">Send USDC</h3>
          <input 
            type="number" 
            placeholder="Amount" 
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full p-4 bg-slate-50 border rounded-xl"
          />
          <button 
            disabled={isSending || !amount}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center"
          >
            {isSending ? <Loader2 className="animate-spin" /> : "Send (Gasless)"}
          </button>
        </form>

        {txHash && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-800">Transaction Confirmed</p>
              <p className="text-xs text-green-600 break-all mt-1">{txHash}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <LazorkitProvider>
      <MainSwitcher />
    </LazorkitProvider>
  );
}

const MainSwitcher = () => {
  const { isConnected } = useLazorkit();
  return isConnected ? <DashboardView /> : <LoginView />;
};