// cre-workflows/prediction-market/creditQuestionBuilder.ts

export type CreditMetricType =
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

export interface CreditQuestionParams {
    poolName: string;            // ex: "Atlas Credit Vault"
    facilityLabel?: string;      // ex: "Private Credit Facility #24-Alpha"
    metricType: CreditMetricType;
    threshold?: number | string; // ex: 5, "5%", "1.0x", "70%", "8.0%"
    deadlineISO: string;         // ex: "2026-09-30"
}

export function buildCreditQuestion(params: CreditQuestionParams): string {
    const { poolName, facilityLabel, metricType, threshold, deadlineISO } = params;

    const name = facilityLabel ?? poolName;

    switch (metricType) {
        case "COUPON_DEFAULT":
            return `Will ${name} experience a payment default on any scheduled coupon before ${deadlineISO}?`;

        case "EVENT_OF_DEFAULT":
            return `Will the borrower in ${name} trigger a formal event of default (EOD) due to missed principal or interest payment by ${deadlineISO}?`;

        case "DSCR_BREACH":
            return `Will the onchain DSCR of ${name} fall below ${threshold} for two consecutive reporting periods before ${deadlineISO}?`;

        case "LTV_SAFETY":
            return `Will the LTV of ${name} remain at or below ${threshold} until ${deadlineISO}, avoiding any margin call or forced deleveraging event?`;

        case "DOWNGRADE":
            return `Will any tranche of ${name} be downgraded or placed on watchlist for downgrade by a recognized rating provider before ${deadlineISO}?`;

        case "CUMULATIVE_DEFAULT_RATE":
            return `Will ${name} exceed a cumulative default rate of ${threshold} of outstanding notional by ${deadlineISO}?`;

        case "INTEREST_COVERAGE_BREACH":
            return `Will the Covenant Package of ${name} be breached due to interest coverage ratio falling below ${threshold} by ${deadlineISO}?`;

        case "COLLATERAL_DRAWDOWN":
            return `Will the secured collateral backing ${name} suffer a mark-to-market value decline greater than ${threshold} from today’s level before ${deadlineISO}?`;

        case "YIELD_TARGET":
            return `Will ${name} distribute at least ${threshold} net annualized yield to tokenholders over the measurement period ending ${deadlineISO}?`;

        case "RESTRUCTURING":
            return `Will any borrower in ${name} undergo a formal restructuring process (including extension, haircut, or standstill) by ${deadlineISO}?`;

        default:
            return `Will ${name} experience a material credit event before ${deadlineISO}?`;
    }
}
