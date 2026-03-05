// scripts/bootstrap-markets.ts

import fetch from "node-fetch";

const CRE_WORKFLOW_URL =
    process.env.CRE_WORKFLOW_URL ?? "http://localhost:4010/create-credit-market";

type CreditMetricType =
    | "COUPON_DEFAULT"
    | "EVENT_OF_DEFAULT"
    | "DSCR_BREACH"
    | "LTV_SAFETY"
    | "DOWNGRADE"
    | "CUMULATIVE_DEFAULT_RATE"
    | "INTEREST_COVERAGE_BREACH"
    | "COLLATERAL_DRAWDOWN"
    | "YIELD_TARGET"
    | "RESTRUCTURING";

interface CreateMarketPayload {
    poolName: string;
    facilityLabel?: string;
    metricType: CreditMetricType;
    threshold?: number | string;
    deadlineISO: string;
}

async function createMarket(payload: CreateMarketPayload) {
    console.log(`\n[bootstrap] Creating market for ${payload.poolName} (${payload.metricType})`);

    try {
        const res = await fetch(CRE_WORKFLOW_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error(`[bootstrap] Failed: ${res.status} ${res.statusText}`);
            console.error(text);
            return;
        }

        const json = await res.json();
        console.log("[bootstrap] Success:", json);
    } catch (err) {
        console.error(`[bootstrap] Exception: ${err.message}`);
        console.log("Note: Make sure the CRE workflow is running at", CRE_WORKFLOW_URL);
    }
}

async function main() {
    console.log("Starting bootstrap process for RWA Credit Markets...");

    // 1) Mercado de default em cupom
    await createMarket({
        poolName: "Atlas Credit Vault",
        facilityLabel: "Private Credit Facility #24-Alpha",
        metricType: "COUPON_DEFAULT",
        deadlineISO: "2026-06-30",
    });

    // 2) Mercado de DSCR breach
    await createMarket({
        poolName: "Aurora Real Estate Credit Pool",
        metricType: "DSCR_BREACH",
        threshold: "1.0x",
        deadlineISO: "2026-08-31",
    });

    // 3) Mercado de LTV safety
    await createMarket({
        poolName: "Helios Secured Loan Vault",
        metricType: "LTV_SAFETY",
        threshold: "70%",
        deadlineISO: "2026-07-31",
    });

    console.log("\n[bootstrap] Done seeding initial credit markets");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
