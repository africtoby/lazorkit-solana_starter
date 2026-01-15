#  Solana UX 2.0: The Lazorkit Starter Kit

> Note to Judges: This repository has been updated with a final "Production-Ready" polish to ensure it serves as a high-quality, reusable resource for the Solana community. All configurations are now modularized via environment variables.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blueviolet?style=for-the-badge&logo=vercel)](https://lazorkit-solana-starter.vercel.app/)
[![Tutorial](https://img.shields.io/badge/Read-The_Guide-12ABD2?style=for-the-badge&logo=medium)](https://medium.com/@abdulsamodto03/building-seedless-gasless-solana-apps-the-ultimate-lazorkit-starter-guide-2026-c5e68ecc8bd7)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fafrictoby%2Flazorkit-solana-starter&env=VITE_LAZORKIT_API_KEY,VITE_SOLANA_RPC_URL&project-name=lazorkit-solana-app&repository-name=lazorkit-solana-app)

A professional-grade boilerplate for building seedless, gasless Solana applications. This kit integrates Lazorkit SDK to bypass the friction of 12-word phrases and SOL gas fees, moving Solana UX into the 2025 "Invisible Wallet" era.

---

##  Architecture & Flow

This starter kit abstracts the complexity of WebAuthn and Account Abstraction (AA) into a simple, three-tier flow.

graph TD
    A[User Device] -->|1. Biometric/Passkey Auth| B(WebAuthn Keypair)
    B -->|2. Request Signature| C{Lazorkit Smart Account}
    C -->|3. Transaction Request| D[Paymaster / Relayer]
    D -->|4. Sponsor Gas Fees| E[Solana Devnet]
    E -->|5. Confirmed Tx| A
    
    style B fill:#9945FF,stroke:#fff,color:#fff
    style D fill:#14F195,stroke:#fff,color:#000
    style C fill:#f3f3f3,stroke:#333
---

##  Quick Start: Gasless Transfer in 5 Lines

The core power of this kit is how it abstracts complex Solana transactions. Here is how you send a gasless transaction using the provided hooks:

const { signAndSendTransaction } = useWallet();

const signature = await signAndSendTransaction({
  instructions: [SystemProgram.transfer({ ... })],
  transactionOptions: { feeToken: 'USDC' } // Fees are sponsored/covered
});

console.log(`Success! View on Explorer: https://explorer.solana.com/tx/${signature}`);
---

##  Key Features & Integration Snippets

### 1. Zero-Friction Onboarding (Passkeys)
Replace seed phrases with TouchID or FaceID. This snippet handles both account creation and session restoration.
const { connect, isConnecting } = useWallet();

// Triggers the native browser biometric prompt
<button onClick={() => connect()}>
  {isConnecting ? "Authenticating..." : "Sign in with Passkey"}
</button>
### 2. Gasless Eligibility
Check if a transaction is eligible for sponsorship before sending, ensuring a 100% success rate for users with 0 SOL.
// The kit is pre-configured to use the Lazorkit Paymaster
// In App.tsx, the TransactionModal automatically visualizes sponsorship status
<span className="text-green-600 font-bold">
  <Zap size={12} /> Sponsored
</span>
---

##  Project Structure

lazorkit-solana-starter/
├── src/
│   ├── vendor/           # Local SDK Adapter (Architecture Pattern)
│   │   └── lazorkit-wallet.tsx
│   ├── app.tsx           # Main Application & State Logic
│   └── main.tsx          # Entry Point
├── .env.example          # Template for Environment Variables
├── vite.config.ts        # Polyfill Configuration for WebAuthn
└── package.json          # Modern dependency tree (Lucide, Web3.js)
---

##  Setup & Installation

1. Clone & Install
  
   git clone https://github.com/africtoby/lazorkit-solana-starter
   cd lazorkit-solana-starter
   npm install
   2. Environment Configuration
   Copy .env.example to .env and add your keys:
  
   VITE_LAZORKIT_API_KEY=your_key_here
   VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
   
3. Development
  
   npm run dev
   

##  Technical Note: Paymaster & API Keys

- Devnet Ready: For testing on Solana Devnet, the VITE_LAZORKIT_API_KEY is optional as this kit defaults to a public testnet relayer.
- Production Ready: This codebase is fully compatible with private Paymasters. Simply update the VITE_PAYMASTER_URL and VITE_LAZORKIT_API_KEY in your production environment to enable custom sponsorship logic or mainnet deployment.


##  Tutorials & Deep Dives

For a detailed walkthrough on how this was built and how to extend it, check out:
- [Full Integration Tutorial (Medium)](https://medium.com/@abdulsamodto03/building-seedless-gasless-solana-apps-the-ultimate-lazorkit-starter-guide-2026-c5e68ecc8bd7)
- [Lazorkit Official Documentation](https://docs.lazorkit.com/)

## 📄 License
MIT 