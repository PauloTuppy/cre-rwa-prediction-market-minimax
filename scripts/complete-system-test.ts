// scripts/complete-system-test.ts

import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import { askMinimax } from '../cre-workflows/prediction-market/minimax';

dotenv.config();

/**
 * MOCK DO RUNTIME DA CHAINLINK CRE
 * Permite rodar a lógica da IA fora do ambiente de execução oficial.
 */
const mockRuntime: any = {
    config: {
        minimaxModel: "minimax-chat-v1"
    },
    log: (msg: string) => console.log(`[Runtime LOG]: ${msg}`),
    cre: {
        capabilities: {
            HTTPClient: class {
                async sendRequest(rt: any, req: any) {
                    console.log(`[Mock HTTP] Calling ${req.url}`);
                    const response = await fetch(req.url, {
                        method: req.method,
                        headers: req.headers,
                        body: Buffer.from(req.body, 'base64').toString('utf-8')
                    });
                    const text = await response.text();
                    return {
                        body: Buffer.from(text).toString('base64'),
                        status: response.status
                    };
                }
            }
        }
    }
};

async function runTest() {
    console.log("=== STARTING COMPLETE SYSTEM TEST: BACKEND -> AI -> FRONTEND ===");

    const testQuestion = "Will the onchain DSCR of Atlas Credit Vault fall below 1.1x during the current quarterly monitoring period ending 2026-06-30?";
    console.log(`\n[Test] Question: ${testQuestion}`);

    try {
        // 1. Chamar o Analista de Crédito (AI)
        console.log("\n[1/3] Querying MiniMax AI Oracle...");
        const { llmResponse } = await askMinimax(mockRuntime, testQuestion);
        console.log(`[MiniMax] Final Response Body: |${llmResponse}|`);

        // Parsear para garantir validade
        const decision = JSON.parse(llmResponse.replace(/```json/g, "").replace(/```/g, "").trim());
        console.log(`[Validator] Parsed Decision: Result=${decision.result}, Confidence=${decision.confidence}`);

        // 2. Enviar para o Frontend (Webhook)
        console.log("\n[2/3] Sending result to Dashboard Webhook...");
        const payload = {
            marketId: "TEST-001",
            question: testQuestion,
            result: decision.result,
            confidence: decision.confidence,
            txHash: "0x" + Math.random().toString(16).slice(2).padStart(64, '0'),
            simulated: true
        };
        console.log(`[Test] Payload: ${JSON.stringify(payload, null, 2)}`);

        const res = await fetch("http://localhost:3000/api/settlements", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            console.log("[Dashboard] Success: Data accepted by the API.");
        } else {
            console.error(`[Dashboard] Error: ${res.status} ${await res.text()}`);
        }

        // 3. Verificar Dashboard (opcional via log)
        console.log("\n[3/3] Verification complete.");
        console.log("You can now open http://localhost:3000/markets to see the live update!");

    } catch (error) {
        console.error("\n[FAILED] Test crashed:", error);
    }
}

runTest();
