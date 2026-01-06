import React, { createContext, useContext, useEffect, useState } from 'react';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { LazorkitSDK } from '../lib/lazorkit';

interface LazorkitContextType {
  isConnected: boolean;
  walletAddress: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  sendGaslessTx: (ix: TransactionInstruction) => Promise<string>;
  isLoading: boolean;
}

const LazorkitContext = createContext<LazorkitContextType | null>(null);

export const LazorkitProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<PublicKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Session Persistence (Bonus Feature!)
  useEffect(() => {
    const session = LazorkitSDK.getSession();
    if (session) setWalletAddress(session);
  }, []);

  const connect = async () => {
    setIsLoading(true);
    try {
      const address = await LazorkitSDK.connect();
      setWalletAddress(address);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    LazorkitSDK.logout();
    setWalletAddress(null);
  };

  const sendGaslessTx = async (ix: TransactionInstruction) => {
    return await LazorkitSDK.signAndSendGasless(ix);
  };

  return (
    <LazorkitContext.Provider value={{
      isConnected: !!walletAddress,
      walletAddress,
      connect,
      disconnect,
      sendGaslessTx,
      isLoading
    }}>
      {children}
    </LazorkitContext.Provider>
  );
};

export const useLazorkit = () => {
  const context = useContext(LazorkitContext);
  if (!context) throw new Error("useLazorkit must be used within LazorkitProvider");
  return context;
};