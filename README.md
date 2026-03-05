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
-   `/docs`: Core project documentation: [Architecture](docs/architecture.md), [Roadmap](docs/roadmap.md), [Agent Profiles](docs/AGENTS_OVERVIEW.md).
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

## 🪙 Asset Modeling

To ensure clarity for participants and institutional auditors, this project follows a strict asset model:
- **1 Prediction Token = 1 USD Claim**: Each token represents a conditional claim of 1 USD on the underlying collateral of the RWA pool, payable only if the credit event occurs (or doesn't, depending on the side).
- **Legal Binding**: While this demo focuses on the technological layer, in production, each market is tied to a specific **SPV (Special Purpose Vehicle)** or **Trust Deed**, where the oracle's on-chain settlement triggers the legal release of funds.

## ⚠️ Risk Factors & Safety

- **Oracle Dependency**: Settlement relies on the MiniMax AI's interpretation of credit events. 
- **Data Integrity**: The workflow's accuracy depends on the quality of the financial data fetched (e.g., trustee reports).
- **Circuit Breaker**: The `SimpleMarket` contract includes a `pause()` function allowing the owner to freeze operations in case of detected data anomalies or contract vulnerabilities.
- **Non-Production**: This code is a demonstration for the Chainlink Constellation Hackathon and is **not audited** for managing real capital.

---

*Built with ❤️ for the future of On-Chain Finance.*
