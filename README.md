#  Lazorkit React Starter

> **Superteam earn Bounty Submission**
>
>  **Live Demo:** [https://lazorkit-solana-starter.vercel.app/]

A production-ready starter kit for building **Passkey-powered** Solana dApps with **Gasless Transactions**. It demonstrates how to onboard users instantly with Passkeys and execute gasless transactions using Smart Wallets.

##  Project Structure

This project follows a modular architecture designed for reusability.

```text
lazorkit-solana-starter/
├── src/
│   ├── vendor/           # Local SDK Adapter (Architecture Pattern)
│   │   └── lazorkit-wallet.tsx
│   ├── App.tsx           # Main Application Logic
│   └── main.tsx          # Entry Point
├── vite.config.ts        # Polyfill Configuration
└── package.json          # Dependencies
```

## 🛠 Features

- **Smart Wallet:** The generation of a wallet based on the WebAuthn
- **Gasless:** Direct integration with Paymaster for automatic funding.
- **Session Preservation:** Stores users safely for reuse.
- **Robust Error Handling:** Smooth handoffs for network congestion.
- **Pro UI:** Design with glassmorphisms and transaction history.

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

To ensure this Starter Kit remains stable for all developers (even those without private beta access), it uses a **Local Vendor Adapter** (`src/vendor/lazorkit-wallet.tsx`). This adapter connects to the **Real Solana Devnet** and manages keys securely in local storage, providing a seamless "Gasless" UX without needing an API key.

##  Tutorials

See [TUTORIALS.md](./TUTORIALS.md) for step-by-step integration guides on:

1.  **Passkey Auth**
2.  **Gasless Transactions**
3.  **Pay Widgets**
4.  **Session Persistence**

## 📄 License

MIT