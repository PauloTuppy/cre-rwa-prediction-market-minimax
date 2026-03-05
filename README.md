# 🏛️ RWA Credit Oracle

**Automated Institutional Credit Analysis for Tokenized Prediction Markets**

Built for the Chainlink Constellation Hackathon, this project leverages **Chainlink CRE** and **MiniMax LLM** to provide high-fidelity, automated settlement for Real-World Asset (RWA) prediction markets, specifically focused on **Tokenized Private Credit**.

## 🚀 Overview

Traditional prediction markets often struggle with resolving complex, institutional-grade credit events (e.g., covenant breaches, DSCR drops, restructuring). This project solves that by:

1.  **Specialized LLM Persona**: A MiniMax-powered oracle trained as a *Senior Institutional Credit Analyst*.
2.  **Chainlink CRE Integration**: Secure, off-chain computation that fetches real-world financial data and triggers on-chain settlement.
3.  **Parametric Market Creation**: A `QuestionBuilder` that ensures every market created has professional, binary, and verifiable credit-related questions.

## 🛠️ Project Structure

-   `/apps/frontend`: Next.js dashboard for monitoring active markets and settlement history.
-   `/contracts`: `SimpleMarket.sol` - A lightweight market contract optimized for CRE triggers.
-   `/cre-workflows`:
    -   `complete-workflow.ts`: The main settlement engine using MiniMax.
    -   `market-creator.ts`: HTTP-triggered workflow for programmatically creating markets.
    -   `minimax.ts`: Oracle logic and specialized system prompts.
-   `/scripts`: Utilities like `bootstrap-markets.ts` for rapid demo seeding.

## ⚡ Quick Start

### 1. Requirements
- Node.js v18+
- Chainlink CRE SDK
- MiniMax API Key

### 2. Bootstrap Markets
Seed the blockchain with institutional credit markets:
```bash
npm install
npm run bootstrap
```

### 3. Run the Dashboard
```bash
cd apps/frontend
npm install
npm run dev
```

## 🧠 The AI Oracle (MiniMax)

The oracle is not just a general LLM. It is specialized to handle:
- **Default Events**: Missed coupons, principal payment delays.
- **Financial Covenants**: DSCR (Debt Service Coverage Ratio) drops, LTV (Loan-to-Value) spikes.
- **Credit Quality**: Rating downgrades, collateral drawdown.

## 🔗 Chainlink CRE Benefits

- **Low Latency**: Faster resolution than traditional multi-sig or governance-based oracles.
- **Privacy**: Perform complex analysis off-chain while only submitting the binary result.
- **Flexibility**: Easily connect to any private credit data provider API.

---

*Built with ❤️ for the future of On-Chain Finance.*
