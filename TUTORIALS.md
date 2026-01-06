#  Lazorkit Integration Tutorials

## Tutorial 1: Setting up the Vendor Engine
Since the Lazorkit SDK is currently in private beta, we use a local vendor adapter to simulate the core features securely while connecting to the real blockchain.

### Implementation
1. Create a `vendor` folder in your `src` directory.
2. Add the `lazorkit-wallet.tsx` adapter which handles:
   - WebAuthn (Passkey) triggers via `navigator.credentials`
   - Solana Devnet connections via `@solana/web3.js`
   - Local session management

```tsx
// src/App.tsx
import { LazorkitProvider } from './vendor/lazorkit-wallet';

function Root() {
  return (
    <LazorkitProvider portalUrl="[https://portal.lazor.sh](https://portal.lazor.sh)">
      <App />
    </LazorkitProvider>
  );
}
```

## Tutorial 2: Authentication (Passkey Login)
Lazorkit replaces the typical "Connect Wallet" modal with a biometric prompt.

### Code Example
```tsx
const { connect, isConnecting } = useWallet();

const handleLogin = async () => {
  try {
    // Triggers the native browser FaceID/TouchID prompt
    await connect(); 
  } catch (err) {
    console.error("User cancelled passkey");
  }
};
```

## Tutorial 3: Gasless Transactions
We abstract the gas fee payment using a Paymaster configuration.

### Code Example
```tsx
const { signAndSendTransaction } = useWallet();

const sendUSDC = async () => {
  const ix = SystemProgram.transfer({ ... });

  // feeToken: 'USDC' tells the Paymaster to sponsor the SOL fee
  const signature = await signAndSendTransaction({
    instructions: [ix],
    transactionOptions: { feeToken: 'USDC' }
  });
  
  console.log("Sponsored Tx Hash:", signature);
};
```

## Tutorial 4: "Pay with Solana" Widget
You can create a reusable payment component for e-commerce flows.

### Code Example
```tsx
import { useWallet } from '../vendor/lazorkit-wallet';

const PayWidget = ({ amount }) => {
  const { signAndSendTransaction } = useWallet();

  const pay = async () => {
    const ix = SystemProgram.transfer({
      fromPubkey: userKey,
      toPubkey: merchantKey,
      lamports: amount * LAMPORTS_PER_SOL
    });

    await signAndSendTransaction({ instructions: [ix] });
  };

  return <button onClick={pay}>Pay {amount} SOL</button>;
};
```

## Tutorial 5: Persistent Sessions
The starter kit automatically persists user sessions securely.

### How it works
1. On login, the derived Keypair secret is stored in `localStorage` (simulating secure enclave storage).
2. On refresh, the `LazorkitProvider` checks for this key and auto-connects.
3. This ensures users don't have to scan FaceID or fingerprint on every page load.