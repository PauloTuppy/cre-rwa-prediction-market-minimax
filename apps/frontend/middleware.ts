// apps/frontend/middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const method = req.method;

    // 1. Camada de Cookies/Auth por Rota
    if (url.pathname.startsWith('/api')) {
        const authHeader = req.headers.get('authorization');
        const webhookSecret = req.headers.get('x-webhook-secret');

        // Libera GET público para mercados
        if (method === 'GET' && url.pathname.includes('/api/markets')) {
            return applySecurityHeaders(NextResponse.next());
        }

        // Valida Webhook do CRE
        if (url.pathname === '/api/settlement-webhook') {
            if (webhookSecret !== process.env.WEBHOOK_SECRET) {
                return new NextResponse(JSON.stringify({ error: 'Unauthorized Webhook' }), { status: 401 });
            }
        } else {
            // Valida API_SECRET para resto das operações
            if (authHeader !== `Bearer ${process.env.API_SECRET}`) {
                return new NextResponse(JSON.stringify({ error: 'Auth Required' }), { status: 401 });
            }
        }
    }

    // 2. Mock Simples de Rate Limiting (Poderia usar Upstash/Redis)
    // 60 req / 60s por IP (simulado aqui conceitualmente)

    const res = NextResponse.next();
    return applySecurityHeaders(res);
}

function applySecurityHeaders(res: NextResponse) {
    // 3. Security Headers
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.headers.set('X-XSS-Protection', '1; mode=block');

    // 4. CORS
    const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN || '*';
    res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-webhook-secret');

    return res;
}

export const config = {
    matcher: '/api/:path*',
};
