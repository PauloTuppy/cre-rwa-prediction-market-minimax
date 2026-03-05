# CRE RWA Prediction Market with MiniMax LLM Oracle

This repository contains a full-stack solution for an AI-powered RWA (Real World Asset) Prediction Market, utilizing **Chainlink Runtime Environment (CRE)** and **MiniMax LLM** as the core settlement oracle.

## 🏗️ Architecture Summary

1.  **Smart Contracts (`/contracts`)**: Prediction markets that emit `SettlementRequested` when a market is ready to be resolved.
2.  **CRE Workflow (`/cre-workflows`)**:
    *   **Trigger**: Listens for the `SettlementRequested` event on the EVM chain.
    *   **LLM Integration**: Calls the **MiniMax API** with a specialized prompt to evaluate the market question (real-world event).
    *   **Confidence Threshold**: Only settles if LLM confidence exceeds 50% (5,000/10,000).
    *   **On-chain Settlement**: Calls `settleMarket(marketId, isYes)` via the CRE `EVMClient`.
    *   **Webhook Notification**: Sends a POST request to the Next.js dashboard with full settlement details.
3.  **Frontend Dashboard (`/apps/frontend`)**:
    *   **Webhook Ingestion**: `/api/settlement-webhook` receives the settlement payload and updates the database.
    *   **Markets View**: `/markets` renders a premium dashboard showing active and settled markets with LLM confidence scores and on-chain transaction hashes.

## 🚀 Getting Started

### 1. Prerequisites
- [Chainlink CRE SDK](https://docs.chain.link/cre) installed.
- [MiniMax API Key](https://api.minimax.chat/).
- Next.js environment for the dashboard.

### 2. Environment Variables (CRE)
Configured via `.env` or CRE secrets:
```env
MINIMAX_API_KEY=your_minimax_key
MINIMAX_API_URL=https://api.minimax.chat/v1/chat
```

### 3. Deploy & Run Workflow
```bash
# Register and run the workflow
cre workflow register ./cre-workflows/prediction-market/complete-workflow.ts --config ./cre-workflows/prediction-market/config.staging.json
```

## 📄 License
MIT
