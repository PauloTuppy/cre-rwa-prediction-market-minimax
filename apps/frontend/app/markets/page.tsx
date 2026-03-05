// apps/frontend/app/markets/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";

// Tipagem baseada no que o Webhook do CRE traz
interface Market {
    marketId: string;
    question: string;
    status: "ACTIVE" | "SETTLED";
    result?: "YES" | "NO";
    confidence?: number;
    txHash?: string;
    resolveTimestamp?: number;
}

export default function MarketsDashboard() {
    const [markets, setMarkets] = useState<Market[]>([
        {
            marketId: "101",
            question: "Will Atlas Credit Vault experience a payment default on its Series A coupons before 2026-06-30?",
            status: "SETTLED",
            result: "NO",
            confidence: 9800,
            txHash: "0xabc...123",
            resolveTimestamp: 1782777600 // 2026-06-30
        },
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
                <title>RWA Prediction Market | Admin Dashboard</title>
            </Head>

            <header className="mb-12 border-b border-slate-800 pb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        RWA Markets Dashboard
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">
                        Oracle Automation via Chainlink CRE + MiniMax LLM
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2">
                        <span className="text-xs text-slate-500 uppercase font-bold block">Status CRE</span>
                        <span className="text-emerald-400 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Operational (Staging)
                        </span>
                    </div>
                </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Default Rate</span>
                    <div className="text-3xl font-bold mt-2 text-white">1.82%</div>
                    <div className="text-emerald-500 text-xs mt-1">Below Industry Avg</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Avg Credit Spread</span>
                    <div className="text-3xl font-bold mt-2 text-white">450 bps</div>
                    <div className="text-blue-400 text-xs mt-1">RWA Yield Premium</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Tokenized Debt TVL</span>
                    <div className="text-3xl font-bold mt-2 text-white">$4.2B</div>
                    <div className="text-emerald-500 text-xs mt-1">Institutional Credit</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-sm">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Liquidation Buffer</span>
                    <div className="text-3xl font-bold mt-2 text-white">125%</div>
                    <div className="text-slate-400 text-xs mt-1">Collateral Coverage</div>
                </div>
            </section>

            <main>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest">
                                <th className="px-6 py-4 font-semibold">Market Id</th>
                                <th className="px-6 py-4 font-semibold">Question</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Deadline</th>
                                <th className="px-6 py-4 font-semibold">Result (LLM)</th>
                                <th className="px-6 py-4 font-semibold">Confidence</th>
                                <th className="px-6 py-4 font-semibold">Tx Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {markets.map((m) => (
                                <tr key={m.marketId} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-5 font-mono text-blue-400 text-sm">#{m.marketId}</td>
                                    <td className="px-6 py-5 font-medium">{m.question}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-tighter ${m.status === 'SETTLED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-400 font-mono">
                                        {m.resolveTimestamp ? new Date(m.resolveTimestamp * 1000).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-5">
                                        {m.result ? (
                                            <span className={`font-bold ${m.result === 'YES' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {m.result}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-5">
                                        {m.confidence ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                                        style={{ width: `${m.confidence / 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-400">{(m.confidence / 100).toFixed(1)}%</span>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-5">
                                        {m.txHash ? (
                                            <a href={`https://sepolia.etherscan.io/tx/${m.txHash}`} className="text-xs text-slate-500 hover:text-blue-400 underline underline-offset-4 decoration-slate-700 transition">
                                                {m.txHash.slice(0, 10)}...
                                            </a>
                                        ) : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            <footer className="mt-20 text-center text-slate-600 text-sm">
                Built for Chainlink Constellation Hackathlon © 2026
            </footer>

            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Outfit', sans-serif; }
      `}</style>
        </div>
    );
}
