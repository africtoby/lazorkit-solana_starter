# Lazorkit Integration Tutorials

## Tutorial 1: Configuring the Provider
To use Lazorkit in your React app, you must wrap your root component with the `LazorkitProvider`. This handles the WebAuthn session state.

### Implementation
1. Import the provider from the SDK.
2. Wrap your `App` component.

```tsx
import { LazorkitProvider } from './context/LazorkitContext';

function Root() {
  return (
    <LazorkitProvider>
      <App />
    </LazorkitProvider>
  );
}
```

## Tutorial 2: Creating a Smart Wallet (Passkey)
The `connect()` function triggers the browser's native credential manager (FaceID/TouchID).

### Code Example
```tsx
const { connect } = useLazorkit();

const handleLogin = async () => {
  try {
    // Triggers "Use FaceID to sign in?"
    await connect();
  } catch (err) {
    console.error("User cancelled biometric prompt");
  }
};
```

## Tutorial 3: Sending Gasless Transactions
Lazorkit Paymasters allow you to sponsor fees for your users.

### Code Example
```tsx
const { sendGaslessTx } = useLazorkit();

const sendUSDC = async () => {
  // Standard Solana Instruction
  const ix = SystemProgram.transfer({ ... });

  // The SDK wraps this in a meta-transaction and sends to Paymaster
  const signature = await sendGaslessTx(ix);
  console.log("Sponsored Tx:", signature);
};
```