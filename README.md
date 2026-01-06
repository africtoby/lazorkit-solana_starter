#  Lazorkit React Starter

> **Superteam Place Bounty Submission**
>
>  **Live Demo:** [https://lazorkit-solana-starter.vercel.app/]

A production-ready starter kit for building **Passkey-powered** Solana dApps with **Gasless Transactions**. It demonstrates how to onboard users instantly with Passkeys and execute gasless transactions using Smart Wallets.

## 🛠 Features

- **Smart Wallet:** Counter-factual wallet generation via WebAuthn.
- **Gasless:** Built-in Paymaster integration.
- **Session Persistence:** Remembers users across reloads.
- **Components:** Modular UI for Login and Dashboard.

##  Setup & Installation

### 1. Install
```bash
npm install
```

### 2. Run
```bash
npm run dev
```

##  Architecture Note
To ensure this Starter Kit remains stable for all developers (even those without private beta access), it uses a **Local Vendor Adapter** (`src/vendor/lazorkit-wallet.tsx`). This adapter connects to the **Real Solana Devnet** and manages keys securely in local storage, providing a seamless "Gasless" UX without needing an API key for it

##  Tutorials
See [TUTORIALS.md](./TUTORIALS.md) for step-by-step integration guides.

## 📄 License
MIT