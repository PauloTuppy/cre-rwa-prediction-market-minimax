// apps/frontend/app/api/markets/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    console.log(`[GET /api/markets/${id}] Buscando mercado detalhado`);

    return NextResponse.json({ success: true, data: { id, question: "Exemplo?", status: "OPEN" } });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    const json = await req.json();
    const { question, status, deadline } = json;

    // Bloqueia mover para SETTLED via PATCH (apenas webhook CRE permitido)
    if (status === "SETTLED") {
        return NextResponse.json(
            { error: "Mudança para SETTLED permitida apenas via Webhook CRE" },
            { status: 403 }
        );
    }

    // Apenas OPEN ou CANCELLED permitidos no PATCH manual
    if (status && !["OPEN", "CANCELLED"].includes(status)) {
        return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    console.log(`[PATCH /api/markets/${id}] Atualizando:`, { status, question });
    return NextResponse.json({ success: true, message: "Mercado atualizado" });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    // Simulação de verificação: se já SETTLED, não pode deletar/cancelar na chain
    // if (market.status === "SETTLED") return NextResponse.json({ error: "Conflito: Mercado já finalizado" }, { status: 409 });

    console.log(`[DELETE /api/markets/${id}] Soft-delete -> CANCELLED`);
    return NextResponse.json({ success: true, message: "Mercado movido para CANCELLED" });
}
