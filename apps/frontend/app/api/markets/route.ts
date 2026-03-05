// apps/frontend/app/api/markets/route.ts

import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db"; // Exemplo de db client

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const status = searchParams.get("status");
    const query = searchParams.get("q");

    console.log(`[GET /api/markets] page=${page}, status=${status}, q=${query}`);

    // Simulação de busca com paginação e filtros
    // const markets = await db.market.findMany({
    //   where: {
    //     ...(status && { status }),
    //     ...(query && { question: { contains: query, mode: 'insensitive' } }),
    //   },
    //   skip: (page - 1) * 10,
    //   take: 10,
    //   include: { settlement: true }
    // });

    return NextResponse.json({
        success: true,
        data: [], // Retornar array vazio ou mock
        page
    });
}

export async function POST(req: NextRequest) {
    try {
        const json = await req.json();
        const { marketAddress, question, deadline } = json;

        // Validação de endereço Ethereum com Regex
        const ethRegex = /^0x[0-9a-fA-F]{40}$/;
        if (!marketAddress || !ethRegex.test(marketAddress)) {
            return NextResponse.json({ error: "Endereço Ethereum inválido" }, { status: 400 });
        }

        // Sanitização e validação de campos obrigatórios
        if (!question || question.trim().length < 5) {
            return NextResponse.json({ error: "Pergunta inválida ou muito curta" }, { status: 400 });
        }

        console.log("[POST /api/markets] Criando novo mercado:", { marketAddress, question });

        // Lógica de duplicata (409 Conflict)
        // const exists = await db.market.findUnique({ where: { id: marketId } });
        // if (exists) return NextResponse.json({ error: "Mercado já existe" }, { status: 409 });

        return NextResponse.json({ success: true, message: "Mercado criado com sucesso" }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: "Erro ao processar criação" }, { status: 500 });
    }
}
