// cre-workflows/prediction-market/complete-workflow.ts

import {
    cre,
    type Runtime,
} from "@chainlink/cre-sdk";
import { askMinimax } from "./minimax";

type Config = {
    minimaxModel: string;
    evms: Array<{
        marketAddress: string;
        chainSelectorName: string;
        gasLimit: string;
    }>;
};

type SettlementRequestedLog = {
    marketId: string;
    question: string;
};

type LLMDecision = {
    result: "YES" | "NO";
    confidence: number;
};

export const workflow = cre.workflow<Config>("prediction-market-minimax", (runtime) => {
    const logTrigger = new cre.triggers.evm.EventTrigger({
        chainSelectorName: runtime.config.evms[0].chainSelectorName,
        address: runtime.config.evms[0].marketAddress,
        event: "event SettlementRequested(uint256 indexed marketId, string question)",
    });

    logTrigger.onEvent(async (log, ctx) => {
        const { runtime: rt } = ctx;

        const decoded = log.decoded as SettlementRequestedLog;
        const marketId = decoded.marketId;
        const question = decoded.question;

        rt.log(`[Workflow] SettlementRequested detectado para marketId=${marketId}`);
        rt.log(`[Workflow] Pergunta original do mercado: ${question}`);

        // 1) Pergunta para a MiniMax (Aguardando resposta assíncrona)
        const minimaxResult = await askMinimax(rt as Runtime<Config>, question);
        let parsed: LLMDecision;

        try {
            parsed = JSON.parse(minimaxResult.llmResponse) as LLMDecision;
        } catch (err) {
            rt.log("[Workflow] Erro ao fazer JSON.parse da resposta da MiniMax, resolvendo como NO com baixa confiança");
            parsed = { result: "NO", confidence: 0 };
        }

        rt.log(`[Workflow] LLM decidiu: result=${parsed.result}, confidence=${parsed.confidence}`);

        // 2) Regra de confiança
        if (parsed.confidence < 5000) {
            rt.log("[Workflow] Confiança muito baixa, abortando settlement automático");
            return;
        }

        // 3) Escrever o resultado onchain
        const evmClient = new cre.capabilities.EVMClient({
            chainSelectorName: runtime.config.evms[0].chainSelectorName,
        });

        const isYes = parsed.result === "YES";

        rt.log(`[Workflow] Enviando transação de settlement para marketId=${marketId}, isYes=${isYes}`);

        const tx = await evmClient.writeContract({
            address: runtime.config.evms[0].marketAddress,
            abi: [
                "function settleMarket(uint256 marketId, bool result) external",
            ],
            functionName: "settleMarket",
            args: [marketId, isYes],
            gasLimit: runtime.config.evms[0].gasLimit,
        });

        rt.log(`[Workflow] Tx enviada. hash=${tx.transactionHash}`);

        // 4) Enviar resultado para o backend Next.js em /api/settlements
        const httpClient = new cre.capabilities.HTTPClient();

        const payload = {
            marketId: marketId.toString(),
            question,
            result: parsed.result,
            confidence: parsed.confidence,
            txHash: tx.transactionHash,
        };

        rt.log("[Workflow] Enviando resultado para backend /api/settlements...");

        await httpClient.sendRequest(rt, {
            url: "https://seu-front-rwa.vercel.app/api/settlements",
            method: "POST",
            body: Buffer.from(JSON.stringify(payload), "utf-8").toString("base64"),
            headers: {
                "Content-Type": "application/json",
                "x-webhook-secret": process.env.WEBHOOK_SECRET || "",
            },
            cacheSettings: {
                store: false,
            },
        });

        rt.log("[Workflow] Resultado enviado para o backend com sucesso");
    });

    return {
        triggers: [logTrigger],
    };
});

