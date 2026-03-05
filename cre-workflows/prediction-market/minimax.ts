// cre-workflows/prediction-market/minimax.ts

import type { Runtime } from "@chainlink/cre-sdk";

type MinimaxResponse = {
    llmResponse: string;
};

const SYSTEM_PROMPT = `
You are a Senior Institutional Credit Analyst and specialized RWA Resolution Oracle. Your expertise is in TOKENIZED PRIVATE CREDIT, corporate debt, and structured finance.

Your task:
- Resolve binary events for private credit markets (Loans, Bonds, Vaults).
- Focus strictly on:
  - CREDIT EVENTS: Default, restructuring, maturity defaults.
  - PAYMENT DELAYS: Grace period violations or missed coupons.
  - COVENANT BREACHES: Violations of LTV, DSCR, or interest coverage ratios.
  - COLLATERAL PERFORMANCE: Significant drops in underlying asset values.
- Ignore market sentiment or rumors. Use only verified reports, trustee notifications, or official governance/ledger data.

OUTPUT FORMAT (CRITICAL):
- You MUST respond with a SINGLE JSON object: {"result": "YES" | "NO", "confidence": <integer 0-10000>}
- Output MUST be MINIFIED. No prose, no markdown labels.

DECISION RULES:
- "YES" = The credit event or default explicitly described in the question has occurred.
- "NO" = The borrower is performing, or no official default notification has been issued.

STRICT MODE: If evidence is ambiguous, weight towards "NO" with low confidence.
`;

const USER_PROMPT_PREFIX = `As a Private Credit Oracle, resolve the following credit-related claim. 
Analyze the borrower risk and payment status within the context of tokenized onchain debt:

Market question:
`;

export async function askMinimax(
    runtime: Runtime<{ minimaxModel: string }>,
    question: string,
): Promise<MinimaxResponse> {
    const httpClient = runtime.cre.capabilities.HTTPClient
        ? new runtime.cre.capabilities.HTTPClient()
        : new (require("@chainlink/cre-sdk").cre.capabilities.HTTPClient)();

    const body = {
        model: runtime.config.minimaxModel,
        messages: [
            {
                role: "system",
                content: SYSTEM_PROMPT,
            },
            {
                role: "user",
                content: `${USER_PROMPT_PREFIX}\n${question}`,
            },
        ],
    };

    const res = await httpClient.sendRequest(runtime, {
        url: process.env.MINIMAX_API_URL ?? "https://api.minimax.chat/v1/chat",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
        },
        body: Buffer.from(JSON.stringify(body), "utf-8").toString("base64"),
    });

    const raw = Buffer.from(res.body, "base64").toString("utf-8");

    runtime.log(`[MiniMax] Resposta bruta: ${raw}`);

    let llmResponse = raw;
    try {
        const parsed = JSON.parse(raw);
        llmResponse = parsed.choices?.[0]?.message?.content ?? raw;
    } catch {
        runtime.log("[MiniMax] Falha ao parsear JSON da resposta da API");
    }

    return { llmResponse };
}
