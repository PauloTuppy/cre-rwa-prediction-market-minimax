// apps/frontend/app/markets/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";

// Tipagem baseada no que o Webhook do CRE traz
import { SettlementsHistory } from "@/components/SettlementsHistory";

interface Market {
    marketId: string;
    question: string;
    status: "ACTIVE" | "SETTLED";
    result?: "YES" | "NO";
    confidence?: number;
    txHash?: string;
    resolveTimestamp?: number;
}

// Helper determinístico para evitar hydration mismatch (Server vs Client)
function formatDate(timestamp: number) {
    const d = new Date(timestamp * 1000);
    const day = d.getUTCDate().toString().padStart(2, '0');
    const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
}

export default function MarketsDashboard() {
    const [markets, setMarkets] = useState<Market[]>([
        {
            marketId: "102",
            question: "Will the LTV of Helios Secured Loan Vault remain below 70% until 2026-07-31?",
            status: "ACTIVE",
            resolveTimestamp: 1785456000 // 2026-07-31
        },
        {
            marketId: "103",
            question: "Will Aurora Real Estate Credit Pool DSCR fall below 1.0x by 2026-08-31?",
            status: "ACTIVE",
            resolveTimestamp: 1788134400 // 2026-08-31
        }
    ]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans p-8">
            <Head>
                <title>RWA Credit Oracle | Dashboard</title>
            </Head>

            <header className="mb-12 border-b border-slate-800 pb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                        RWA Credit Oracle
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">
                        Automated Credit Analysis via Chainlink CRE & MiniMax AI
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2">
                        <span className="text-xs text-slate-500 uppercase font-bold block">Oracle Status</span>
                        <span className="text-emerald-400 flex items-center gap-2 font-medium">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Active & Monitoring
                        </span>
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm group hover:border-slate-700 transition-all">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Default Rate</span>
                    <div className="text-3xl font-bold mt-2 text-white">1.82%</div>
                    <div className="text-emerald-500 text-xs mt-1">Institutional Grade</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm group hover:border-slate-700 transition-all">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Avg Credit Spread</span>
                    <div className="text-3xl font-bold mt-2 text-white">450 bps</div>
                    <div className="text-blue-400 text-xs mt-1">Current Premium</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm group hover:border-slate-700 transition-all">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Tokenized Debt TVL</span>
                    <div className="text-3xl font-bold mt-2 text-white">$4.2B</div>
                    <div className="text-emerald-500 text-xs mt-1">Verified On-Chain</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm group hover:border-slate-700 transition-all">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Liquidation Buffer</span>
                    <div className="text-3xl font-bold mt-2 text-white">125%</div>
                    <div className="text-slate-400 text-xs mt-1">Safe Threshold</div>
                </div>
            </section>

            <main className="space-y-12">
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            Active Credit Markets
                        </h2>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-800">
                                    <th className="px-6 py-4 font-semibold">Market Id</th>
                                    <th className="px-6 py-4 font-semibold">Credit Question</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Resolution Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {markets.map((m) => (
                                    <tr key={m.marketId} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-5 font-mono text-blue-400 text-sm">#{m.marketId}</td>
                                        <td className="px-6 py-5 font-medium text-slate-200">{m.question}</td>
                                        <td className="px-6 py-5">
                                            <span className="px-2 py-1 rounded text-[10px] font-bold tracking-tighter bg-blue-500/10 text-blue-400 uppercase">
                                                {m.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-400 font-mono">
                                            {m.resolveTimestamp ? formatDate(m.resolveTimestamp) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <SettlementsHistory />
                </section>
            </main>

            <footer className="mt-20 border-t border-slate-900 pt-8 text-center text-slate-600 text-sm">
                RWA Prediction Market & Oracle Layer • Built for Chainlink Constellation © 2026
            </footer>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
                body { font-family: 'Outfit', sans-serif; background-color: #020617; }
            `}</style>
        </div>
    );
}
