// cre-workflows/prediction-market/market-creator.ts

import { cre } from "@chainlink/cre-sdk";
import {
    buildCreditQuestion,
    type CreditMetricType,
} from "./creditQuestionBuilder";

type Config = {
    evms: Array<{
        marketAddress: string;       // endereço do SimpleMarket
        chainSelectorName: string;   // ex: "ETHEREUM_SEPOLIA"
        gasLimit: string;
    }>;
};

// Payload que seu front ou script vai mandar para o CRE via HTTP
type CreateMarketPayload = {
    poolName: string;             // "Atlas Credit Vault"
    facilityLabel?: string;       // "Private Credit Facility #24-Alpha"
    metricType: CreditMetricType; // "CUMULATIVE_DEFAULT_RATE", etc.
    threshold?: number | string;  // "5%", "1.0x", etc.
    deadlineISO: string;          // "2026-10-31"
};

export const workflow = cre.workflow<Config>("credit-market-creator", (runtime) => {
    const httpTrigger = new cre.triggers.HTTPTrigger({
        method: "POST",
        path: "/create-credit-market",
    });

    httpTrigger.onRequest(async (req, ctx) => {
        const { runtime: rt } = ctx;

        const body = JSON.parse(req.body) as CreateMarketPayload;

        const question = buildCreditQuestion({
            poolName: body.poolName,
            facilityLabel: body.facilityLabel,
            metricType: body.metricType,
            threshold: body.threshold,
            deadlineISO: body.deadlineISO,
        });

        rt.log(`[Creator] Building market with question: ${question}`);

        const evmClient = new cre.capabilities.EVMClient({
            chainSelectorName: runtime.config.evms[0].chainSelectorName,
        });

        const resolveTimestamp = Math.floor(
            new Date(body.deadlineISO).getTime() / 1000
        );

        // Chamada ao SimpleMarket
        const tx = await evmClient.writeContract({
            address: runtime.config.evms[0].marketAddress,
            abi: [
                "function createMarket(string question, uint256 resolveTimestamp) external returns (uint256)",
            ],
            functionName: "createMarket",
            args: [question, resolveTimestamp],
            gasLimit: runtime.config.evms[0].gasLimit,
        });

        rt.log(`[Creator] Market creation tx hash=${tx.transactionHash}`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                ok: true,
                question,
                resolveTimestamp,
                txHash: tx.transactionHash,
            }),
        };
    });

    return {
        triggers: [httpTrigger],
    };
});
