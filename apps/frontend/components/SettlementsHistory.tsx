// apps/frontend/components/SettlementsHistory.tsx

"use client";

import { useEffect, useState } from "react";

type Settlement = {
    marketId: string;
    question: string;
    result: "YES" | "NO";
    confidence: number;
    txHash: string;
};

export function SettlementsHistory() {
    const [data, setData] = useState<Settlement[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSettlements = async () => {
        try {
            const res = await fetch("/api/settlements");
            if (!res.ok) throw new Error("Failed to fetch settlements");
            const json = (await res.json()) as Settlement[];
            setData(json);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettlements();
        // Polling a cada 10s para ver novos settlements do CRE
        const interval = setInterval(fetchSettlements, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-400 animate-pulse">Carregando histórico de settlements...</div>;
    }

    if (data.length === 0) {
        return (
            <div className="p-12 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20">
                <p className="text-slate-500">Nenhum mercado resolvido pela AI ainda.</p>
                <p className="text-xs text-slate-600 mt-2">Aguardando eventos 'SettlementRequested' na Chain.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/30">
                <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Histórico de Settlements (AI + CRE)
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-slate-800">
                    <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 text-left font-medium">Market ID</th>
                            <th className="px-6 py-4 text-left font-medium">Pergunta</th>
                            <th className="px-6 py-4 text-left font-medium">Resultado</th>
                            <th className="px-6 py-4 text-left font-medium">Confiança</th>
                            <th className="px-6 py-4 text-left font-medium">Tx Hash</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-transparent">
                        {data.map((s, idx) => (
                            <tr key={`${s.txHash}-${idx}`} className="hover:bg-slate-800/20 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-blue-400">#{s.marketId}</td>
                                <td className="px-6 py-4 text-slate-300 max-w-md truncate" title={s.question}>{s.question}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${s.result === "YES" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                        }`}>
                                        {s.result}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 font-medium">
                                    {(s.confidence / 100).toFixed(2)}%
                                </td>
                                <td className="px-6 py-4">
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${s.txHash}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-slate-500 hover:text-blue-400 underline underline-offset-4 decoration-slate-800 transition"
                                    >
                                        {s.txHash.slice(0, 10)}...
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
