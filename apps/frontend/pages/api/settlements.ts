// apps/frontend/pages/api/settlements.ts

import type { NextApiRequest, NextApiResponse } from "next";

type SettlementPayload = {
    marketId: string;
    question: string;
    result: "YES" | "NO";
    confidence: number;
    txHash: string;
};

declare global {
    // Para evitar problema de redeploy em dev (HMR)
    // eslint-disable-next-line no-var
    var _settlementsStore: SettlementPayload[] | undefined;
}

const getStore = () => {
    if (!global._settlementsStore) {
        global._settlementsStore = [];
    }
    return global._settlementsStore;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const store = getStore();

    if (req.method === "GET") {
        return res.status(200).json(store);
    }

    if (req.method === "POST") {
        // Validação do Webhook Secret (opcional, mas recomendado)
        const webhookSecret = req.headers['x-webhook-secret'];
        if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
            return res.status(401).json({ error: "Invalid webhook secret" });
        }

        const payload = req.body as SettlementPayload;
        if (
            !payload.marketId ||
            !payload.question ||
            !payload.result ||
            typeof payload.confidence !== "number" ||
            !payload.txHash
        ) {
            return res.status(400).json({ error: "Invalid payload" });
        }

        // Adiciona ao início do array (mais recente primeiro)
        store.unshift(payload);
        console.log(`[API] Settlement recebido para Market #${payload.marketId}`);

        return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
}
