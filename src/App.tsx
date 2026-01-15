import React, { useState, useEffect } from 'react';
import { LazorkitProvider, useWallet } from './vendor/lazorkit-wallet';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { 
  Fingerprint, Wallet, LogOut, Loader2, Send, ShieldCheck, 
  CheckCircle2, ArrowUpRight, ArrowDownLeft, Zap, X, QrCode, Clock, ExternalLink, ShoppingBag 
} from 'lucide-react';

// --- CONFIGURATION USING ENVIRONMENT VARIABLES ---
// Using Vite's import.meta.env. Fallbacks are provided for Devnet stability.
const CONFIG = {
  RPC_URL: import.meta.env.VITE_SOLANA_RPC_URL || "https://api.devnet.solana.com",
  PORTAL_URL: import.meta.env.VITE_LAZORKIT_PORTAL_URL || "https://portal.lazor.sh",
  PAYMASTER: { 
    paymasterUrl: import.meta.env.VITE_PAYMASTER_URL || "https://kora.devnet.lazorkit.com" 
  },
  API_KEY: import.meta.env.VITE_LAZORKIT_API_KEY || "" // Crucial for SDK authentication
};

type Transaction = {
  id: string; type: 'send' | 'receive'; amount: string; time: string; status: 'Completed' | 'Pending'; hash?: string;
};

// --- TRANSACTION APPROVAL MODAL ---
const TransactionModal = () => {
  const { pendingTx, isProcessingTx, confirmTx, rejectTx } = useWallet();
  if (!pendingTx) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xs sm:max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <ShieldCheck size={48} className="mx-auto mb-2 opacity-80" />
          <h3 className="text-xl font-bold">Approve Transaction</h3>
          <p className="text-indigo-200 text-sm">Lazorkit Smart Wallet</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <span className="text-slate-500 text-sm font-bold uppercase">Network</span>
            <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>Solana Devnet
            </div>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <span className="text-slate-500 text-sm font-bold uppercase">Estimated Fee</span>
            <span className="text-green-600 font-bold text-sm flex items-center gap-1"><Zap size={12} fill="currentColor"/> Sponsored</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={rejectTx} disabled={isProcessingTx} className="py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50">Reject</button>
            <button onClick={confirmTx} disabled={isProcessingTx} className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 flex justify-center items-center gap-2">{isProcessingTx ? <Loader2 className="animate-spin" size={18}/> : "Confirm"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PAY WIDGET COMPONENT ---
const PayWidget = ({ recipient, amount, label, onSuccess }: { recipient: string, amount: string, label: string, onSuccess: (sig: string) => void }) => {
  const { signAndSendTransaction, wallet } = useWallet();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const ix = SystemProgram.transfer({
        fromPubkey: new PublicKey(wallet.smartWallet),
        toPubkey: new PublicKey(recipient),
        lamports: parseFloat(amount) * LAMPORTS_PER_SOL
      });
      // Note: FeeToken is usually USDC or SOL for sponsored transactions
      const sig = await signAndSendTransaction({ 
        instructions: [ix], 
        transactionOptions: { feeToken: 'USDC' } 
      });
      onSuccess(sig);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="bg-white border border-indigo-100 rounded-2xl p-4 shadow-sm flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600"><ShoppingBag size={20} /></div>
        <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</p><p className="font-bold text-slate-900 text-lg">{amount} SOL</p></div>
      </div>
      <button onClick={handlePay} disabled={loading} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2">{loading ? <Loader2 className="animate-spin" size={16}/> : "Pay Now"}</button>
    </div>
  );
};

// --- LOGIN VIEW ---
const LoginView = () => {
  const { connect, isConnecting } = useWallet();
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 min-h-screen text-center">
      <div className="mb-10">
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-indigo-900/50">
          <Wallet size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Lazorkit Wallet</h1>
        <p className="text-slate-400 max-w-xs mx-auto">The gasless, keyless wallet for Solana.</p>
      </div>
      <div className="w-full max-w-sm space-y-4">
        <button onClick={() => connect()} disabled={isConnecting} className="w-full bg-white hover:bg-slate-50 text-slate-900 py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl">
          {isConnecting ? <Loader2 className="animate-spin text-indigo-600" /> : <><Fingerprint className="text-indigo-600" size={24} /><span>Sign in with Passkey</span></>}
        </button>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm"><ShieldCheck size={14} /><span>Secured by WebAuthn</span></div>
      </div>
    </div>
  );
};

// --- DASHBOARD VIEW ---
const DashboardView = () => {
  const { wallet, disconnect, signAndSendTransaction } = useWallet();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showReceive, setShowReceive] = useState(false);
  
  const [balance, setBalance] = useState(() => {
    const s = localStorage.getItem('lazor_balance');
    return s ? parseFloat(s) : 2.45;
  });
  
  const [history, setHistory] = useState<Transaction[]>(() => {
    const s = localStorage.getItem('lazor_history');
    return s ? JSON.parse(s) : [{ id: 'init', type: 'receive', amount: '2.45', time: 'Initial Funding', status: 'Completed' }];
  });

  useEffect(() => {
    localStorage.setItem('lazor_history', JSON.stringify(history));
    localStorage.setItem('lazor_balance', balance.toString());
  }, [history, balance]);

  const balanceUsd = (balance * 145.20).toFixed(2);
  const walletAddress = wallet?.smartWallet || "";

  const handleSuccess = (signature: string, sentAmount: string) => {
    setTxHash(signature);
    setBalance(prev => prev - parseFloat(sentAmount));
    const newTx: Transaction = {
      id: signature,
      type: 'send',
      amount: sentAmount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Completed',
      hash: signature
    };
    setHistory(prev => [newTx, ...prev]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress || !amount || !recipient) return;
    setIsSending(true);
    setTxHash(null);
    try {
      const destination = new PublicKey(recipient);
      const instruction = SystemProgram.transfer({
        fromPubkey: new PublicKey(walletAddress),
        toPubkey: destination,
        lamports: parseFloat(amount) * LAMPORTS_PER_SOL
      });
      const signature = await signAndSendTransaction({
        instructions: [instruction],
        transactionOptions: { feeToken: 'USDC' }
      });
      handleSuccess(signature, amount);
      setAmount('');
    } catch (error) { console.error(error); } 
    finally { setIsSending(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative">
        <header className="p-5 flex justify-between items-center bg-white sticky top-0 z-10 border-b border-slate-100">
          <div className="flex items-center gap-2"><div className="bg-indigo-600 p-1.5 rounded-lg"><Wallet size={18} className="text-white"/></div><span className="font-bold text-lg tracking-tight">Lazorkit</span></div>
          <button onClick={() => disconnect()} className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full"><LogOut size={18}/></button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 mb-6 relative overflow-hidden">
             <div className="relative z-10 text-center">
               <p className="text-indigo-200 text-sm font-medium mb-1">Total Balance</p>
               <h1 className="text-4xl font-bold tracking-tight mb-1">${balanceUsd}</h1>
               <div className="flex items-center justify-center gap-2 text-indigo-200 text-sm bg-black/10 py-1 px-3 rounded-full mx-auto w-fit">
                 <span>{balance.toFixed(4)} SOL</span>
               </div>
             </div>
             <div className="grid grid-cols-2 gap-4 mt-8">
               <button onClick={() => setShowReceive(true)} className="bg-white/10 hover:bg-white/20 backdrop-blur-md py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95"><ArrowDownLeft size={18} /> Receive</button>
               <button onClick={() => document.getElementById('send-form')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-indigo-600 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"><ArrowUpRight size={18} /> Send</button>
             </div>
          </div>

          {txHash && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 mb-6 shadow-sm">
              <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" />
              <div className="overflow-hidden w-full">
                <p className="font-bold text-green-800 text-sm">Transaction Sent!</p>
                <p className="text-xs text-green-600 truncate font-mono mt-1 mb-2 bg-green-100/50 p-1 rounded select-all">{txHash}</p>
                <a href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank" rel="noreferrer" className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-bold hover:bg-green-200 inline-flex items-center gap-1">View on Explorer <ExternalLink size={12} /></a>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 bg-green-50 border border-green-200 p-3 rounded-xl mb-8">
            <div className="bg-green-500 text-white p-1 rounded-full"><Zap size={14} fill="currentColor"/></div>
            <div><p className="text-xs font-bold text-green-800">Gasless Mode Active</p><p className="text-[10px] text-green-700">Fees sponsored by Paymaster.</p></div>
          </div>

          <PayWidget 
            label="Demo Store Item" 
            amount="0.05" 
            recipient="LazorKi7w1VNeRZgDWH5qmNz2XFq5QeZbqC8caqSE5W" 
            onSuccess={(sig) => handleSuccess(sig, "0.05")}
          />

          <div id="send-form" className="mb-8">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Send Assets</h3>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100"><label className="text-xs font-bold text-slate-400 uppercase block mb-1">Recipient</label><input type="text" placeholder="Address or .sol" value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full bg-transparent outline-none font-mono text-sm text-slate-800"/></div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center"><div className="flex-1"><label className="text-xs font-bold text-slate-400 uppercase block mb-1">Amount</label><input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-transparent outline-none text-xl font-bold text-slate-800"/></div><div className="flex items-center gap-1 bg-white shadow-sm border border-slate-100 px-2 py-1 rounded-lg"><span className="font-bold text-sm">SOL</span></div></div>
              <button disabled={isSending || !amount || !recipient} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-xl shadow-slate-200">{isSending ? <Loader2 className="animate-spin" /> : "Confirm Send"}</button>
            </form>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {history.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                   <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-full ${tx.type === 'receive' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'}`}>{tx.type === 'receive' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}</div>
                     <div><p className="font-bold text-sm text-slate-800 capitalize">{tx.type} SOL</p><p className="text-xs text-slate-400 flex items-center gap-1"><Clock size={10}/> {tx.time}</p></div>
                   </div>
                   <div className="text-right"><p className={`font-bold text-sm ${tx.type === 'receive' ? 'text-green-600' : 'text-slate-900'}`}>{tx.type === 'receive' ? '+' : '-'}{tx.amount} SOL</p><p className="text-xs text-slate-400">{tx.status}</p></div>
                </div>
              ))}
            </div>
          </div>
        </main>
        {showReceive && <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in"><div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10"><div className="flex justify-between items-center mb-6"><h3 className="font-bold text-xl">Receive Assets</h3><button onClick={() => setShowReceive(false)} className="p-1 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20}/></button></div><div className="bg-white border-2 border-dashed border-indigo-100 rounded-2xl p-8 flex flex-col items-center justify-center mb-6"><QrCode size={120} className="text-slate-900 mb-4 opacity-80" /><p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Scan to Pay</p></div><div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3 border border-slate-100"><div className="flex-1 overflow-hidden"><p className="text-xs text-slate-400 font-bold uppercase mb-1">Your Address</p><p className="font-mono text-sm truncate text-slate-800">{walletAddress}</p></div><button onClick={() => navigator.clipboard.writeText(walletAddress)} className="bg-white border shadow-sm px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50">Copy</button></div></div></div>}
        <TransactionModal />
      </div>
    </div>
  );
};

const MainSwitcher = () => {
  const { isConnected, wallet } = useWallet();
  return (isConnected && wallet) ? <DashboardView /> : <LoginView />;
};

export default function App() {
  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
      <MainSwitcher />
    </LazorkitProvider>
  );
}