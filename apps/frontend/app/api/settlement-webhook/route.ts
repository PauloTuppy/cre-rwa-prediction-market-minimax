// apps/frontend/app/api/settlement-webhook/route.ts

import { NextRequest, NextResponse } from "next/server";

type SettlementWebhookPayload = {
    marketId: string;
    question: string;
    result: "YES" | "NO";
    confidence: number;
    txHash: string;
    settledAt: string; // ISO string
};

// Exemplo de persistência fictício no dashboard RWA
async function saveSettlementToDB(payload: SettlementWebhookPayload) {
    // TODO: Conectar com Prisma (db.settlements.upsert({ ... })) ou Firebase/Supabase
    console.log("[Webhook] Settlement recebido do CRE:", {
        Id: payload.marketId,
        Pergunta: payload.question,
        Resultado: payload.result,
        Confianca: payload.confidence,
        Hash: payload.txHash,
    });
}

export async function POST(req: NextRequest) {
    try {
        const json = (await req.json()) as SettlementWebhookPayload;

        // Validação mínima para garantir payload do CRE
        if (!json.marketId || !json.question || !json.txHash) {
            return NextResponse.json(
                { error: "Payload inválido ou incompleto" },
                { status: 400 },
            );
        }

        await saveSettlementToDB(json);

        return NextResponse.json({
            ok: true,
            message: `Market ${json.marketId} settlement saved.`
        });
    } catch (err) {
        console.error("[Webhook] Erro ao processar payload:", err);
        return NextResponse.json(
            { error: "Erro interno no processamento do webhook" },
            { status: 500 },
        );
    }
}
