import { useCallback } from "react";

export function useTokenAllowanceData() {
    return {
        tokensAllowanceData: {},
        tokensAllowanceDataLoading: false,
    };
}

export function useOracleKeeperFetcher() {
    return useCallback(() => {
        return Promise.resolve(null);
    }, []);
}

export function useAccountStats(chainId: number, options?: { account?: string; enabled?: boolean }) {
    return {
        data: {
            volume: 0n
        },
        loading: false
    };
}

export function usePeriodAccountStats(chainId: number, options?: { account?: string; from?: number; to?: number; enabled?: boolean }) {
    return {
        data: {
            volume: 0n
        },
        loading: false
    };
}

export function useIncentiveStats() {
    return {
        incentiveStats: null,
        loading: false,
    };
}

export function useV2Stats() {
    return {
        v2Stats: null,
        loading: false,
    };
}

export function useMarkets() {
    return {
        markets: [],
        marketsLoading: false,
    };
}

export function useOrders() {
    return {
        orders: [],
        ordersLoading: false,
    };
} 