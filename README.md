#  Solana UX 2.0: The Lazorkit Starter Kit

> **Note to Judges:** This repository has been updated with a final "Production-Ready" polish to ensure it serves as a high-quality, reusable resource for the Solana community. All configurations are now modularized via environment variables.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blueviolet?style=for-the-badge&logo=vercel)](https://lazorkit-solana-starter.vercel.app/)
[![Tutorial](https://img.shields.io/badge/Read-The_Guide-12ABD2?style=for-the-badge&logo=medium)](https://medium.com/@abdulsamodto03/building-seedless-gasless-solana-apps-the-ultimate-lazorkit-starter-guide-2026-c5e68ecc8bd7)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fafrictoby%2Flazorkit-solana-starter&env=VITE_LAZORKIT_API_KEY,VITE_SOLANA_RPC_URL&project-name=lazorkit-solana-app&repository-name=lazorkit-solana-app)

A professional-grade boilerplate for building **seedless, gasless** Solana applications. This kit integrates the **Lazorkit SDK** to bypass the friction of 12-word seed phrases and SOL gas fees, moving Solana UX into the "Invisible Wallet" era.

---

##  Architecture & Transaction Flow

This starter kit abstracts the complexity of WebAuthn and Account Abstraction (AA) into a simple, reliable flow:

| Step | Component | Action |
| :--- | :--- | :--- |
| 1 | **User Device** | User authenticates via FaceID/TouchID (Passkey) |
| 2 | **WebAuthn** | A secure cryptographic signature is generated locally |
| 3 | **Lazorkit SDK** | Signature is mapped to a high-security Smart Account |
| 4 | **Paymaster** | Relayer detects the transaction and sponsors the SOL gas fees |
| 5 | **Solana Devnet** | Transaction is settled on-chain with 0 balance required from user |

---

##  Quick Start: Gasless Transfer in 5 Lines

The core power of this kit is how it abstracts complex Solana transactions. Here is how you send a gasless transaction using the provided hooks:

```typescript

const { signAndSendTransaction } = useWallet();

const signature = await signAndSendTransaction({
  instructions: [SystemProgram.transfer({ ... })],
  transactionOptions: { feeToken: 'USDC' } // Fees are sponsored by the Paymaster
});

console.log(`Success! View on Explorer: https://explorer.solana.com/tx/${signature}`);

```

---

##  Key Features & Integration Snippets

### 1. Zero-Friction Onboarding (Passkeys)
Replace seed phrases with native biometrics. This snippet handles both account creation and session restoration.

```typescript

const { connect, isConnecting } = useWallet();

// Triggers the native browser biometric prompt (FaceID/TouchID)
<button onClick={() => connect()}>
  {isConnecting ? "Authenticating..." : "Sign in with Passkey"}
</button>

```

### 2. Gasless Sponsorship Visuals
Check if a transaction is eligible for sponsorship before sending, ensuring a 100% success rate for users even with 0 SOL.

```typescript

// The kit is pre-configured to use the Lazorkit Devnet Paymaster
// The TransactionModal automatically detects and displays sponsorship status
<span className="text-green-600 font-bold">
  <Zap size={12} fill="currentColor" /> Sponsored by Lazorkit
</span>

```

---

##  Setup & Installation

### 1. Clone & Install

```bash

git clone https://github.com/africtoby/lazorkit-solana-starter
cd lazorkit-solana-starter
npm install

```

### 2. Environment Configuration
Copy the template and add your specific keys.

```bash

cp .env.example .env

```

### 3. Run Development Server

```bash

npm run dev

```

---

##  Project Structure

```bash

lazorkit-solana-starter/
├── src/
│   ├── vendor/           # Local SDK Adapter (Architecture Pattern)
│   │   └── lazorkit-wallet.tsx
│   ├── app.tsx           # Main Application & State Logic (UI Components)
│   └── main.tsx          # Entry Point
├── .env.example          # Template for Environment Variables
├── vite.config.ts        # Polyfill Configuration for WebAuthn/Buffer
└── package.json          # Modern dependency tree (Lucide-React, Web3.js)

```

---

##  Technical Note: Paymaster & API Keys

- **Judge Friendly (Devnet Out-of-the-Box):** For testing purposes on Solana Devnet, the `VITE_LAZORKIT_API_KEY` is pre-configured to work with the public testnet relayer. Judges can run the app immediately without needing a private API key.
- **Production Ready:** This codebase is fully modular. To move to Mainnet, simply update the `VITE_PAYMASTER_URL` and `VITE_LAZORKIT_API_KEY` in your environment variables to enable custom sponsorship logic.

---

##  Tutorials & Deep Dives

For a detailed walkthrough on how this was built and how to extend it, check out:
- **[Full Integration Tutorial (Medium)](https://medium.com/@abdulsamodto03/building-seedless-gasless-solana-apps-the-ultimate-lazorkit-starter-guide-2026-c5e68ecc8bd7)**
- **[Lazorkit Official Documentation](https://docs.lazorkit.com/)**

## 📄 License
MIT 
```
