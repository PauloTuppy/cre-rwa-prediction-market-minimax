# 🏛️ Tokenized Private Credit Oracle – AI‑Powered Prediction Markets

**Automated Institutional Credit Analysis for Tokenized Prediction Markets**

Built for the Chainlink Constellation Hackathon, this project leverages **Chainlink CRE** and **MiniMax LLM** to provide high-fidelity, automated settlement for Real-World Asset (RWA) prediction markets, specifically focused on **Tokenized Private Credit**.

---

## 🏛️ Problem

Private credit markets are often:
- **Low‑transparency**: Defaults and covenant breaches are often reported late or opaquely.
- **Hard to monitor at scale**: Multiple vehicles, contracts, tranches and covenants.
- **Lacking liquid instruments**: Missing hedging and price discovery for on-chain debts.

Institutions want to **tokenize private credit** and still have near real‑time risk signals and a clear mechanism to resolve credit events.

---

## 💡 Solution

This project implements a **Tokenized Private Credit Oracle for Prediction Markets** built on three pillars:

1. **Onchain Prediction Markets (`SimpleMarket.sol`)**  
   - Each market represents a binary claim about a credit event (e.g. “Will pool X’s DSCR fall below 1.0x by Y?”).  
   - Users/institutions can take YES/NO positions, generating implied probabilities of credit risk.

2. **Orchestration via Chainlink CRE + AI (MiniMax)**  
   - CRE workflows listen to onchain events, enrich them with RWA/credit context and call MiniMax (M2.5) with a **Senior Institutional Credit Analyst** persona.  
   - The AI decides whether the event occurred (YES/NO) with confidence.

3. **Institutional Credit Risk Dashboard**  
   - Next.js front‑end showing **Global Default Rate**, **Avg Credit Spread**, **Tokenized Debt TVL**, and **Liquidation Buffer**.  
   - History of AI‑resolved markets including question, result, confidence, and transaction hash.

---

## 🏗️ Architecture

Full architecture details can be found in [`/docs/architecture.md`](./docs/architecture.md).

### Component Summary:

- **Smart Contracts**  
  - [`SimpleMarket.sol`](./contracts/SimpleMarket.sol): Handles market creation, YES/NO betting, and secure settlement via `settleMarket`.
  - `RWAPool` (Logical): Represents the tokenized private credit pool exposing risk parameters.

- **CRE Workflows**  
  - [`complete-workflow.ts`](./cre-workflows/prediction-market/complete-workflow.ts): Triggered by `SettlementRequested`. Enriches questions and calls MiniMax.
  - [`market-creator.ts`](./cre-workflows/prediction-market/market-creator.ts): HTTP endpoint `/create-credit-market` to programmatically build markets.
  - [`creditQuestionBuilder.ts`](./cre-workflows/prediction-market/creditQuestionBuilder.ts): Transforms financial parameters into institutional-grade questions.

- **AI / Oracle**  
  - [`minimax.ts`](./cre-workflows/prediction-market/minimax.ts): Integrates with MiniMax M2.5. Uses a specialized persona focusing on **Credit Events, Payment Delays, and Covenant Breaches**.

---

## 🔄 End-to-End Flow

1. **Market Creation**: Operator sends a request to `/create-credit-market`. The workflow generates a standardized question and calls `createMarket` onchain.
2. **Trading**: Users trade YES/NO positions, providing continuous price discovery for the credit risk.
3. **Resolution**: When a market matures, `requestSettlement` triggers the CRE Workflow.
4. **AI Analysis**: MiniMax analyzes the credit event context. If confidence ≥ threshold, it calls `settleMarket` onchain.
5. **Visualization**: The dashboard updates with the final result and the auditable resolution log.

---

## 🛡️ Security and Risk

This is a **hackathon MVP**, not production‑ready for real TVL.

### Current Measures:
- **`resolveTimestamp`**: Prevents premature resolution before the credit event deadline.
- **Circuit Breaker**: `SimpleMarket.sol` includes `pause()`/`unpause()` functions via OpenZeppelin `Pausable`.
- **Confidence Threshold**: Automated settlement is only triggered if AI confidence is above a set limit (e.g., 5000/10000).
- **Access Control**: `settleMarket` is restricted to authorized settlers (CRE addresses or Owner).

Full "Audit Ready" checklist: [`/docs/audit_status.md`](./docs/audit_status.md).

---

## 📄 Documentation Structure

- **Changelog**: [`/docs/changelog.md`](./docs/changelog.md)  
- **Architecture**: [`/docs/architecture.md`](./docs/architecture.md)  
- **Requirements**: [`/docs/requirements.md`](./docs/requirements.md)
- **Roadmap**: [`/docs/roadmap.md`](./docs/roadmap.md)  
- **Agents**: [`/docs/AGENTS_OVERVIEW.md`](./docs/AGENTS_OVERVIEW.md)  
- **Protocol**: [`/docs/CONVERSATION_PROTOCOL.md`](./docs/CONVERSATION_PROTOCOL.md)  

---

## 🚀 Running the Demo Locally

### 1. Prerequisites
- Node.js 20.x
- MiniMax API Key (configured in `secrets.yaml` and `.env`)

### 2. Install
```bash
npm install
```

### 3. Workflows
Run a CRE simulation:
```bash
cre workflow simulate ./cre-workflows/prediction-market/complete-workflow.ts \
  --config ./cre-workflows/prediction-market/config.staging.json
```

### 4. Dashboard
```bash
cd apps/frontend
npm run dev
# open http://localhost:3000
```

### 5. Bootstrap Markets
```bash
npm run bootstrap
```

---

*Built with ❤️ for the future of On-Chain Finance.*
