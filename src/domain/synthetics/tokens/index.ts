export function useOracleKeeperFetcher(chainId: number) {
    return {
        fetchPostFeedback: async () => { },
        fetchBars: async () => { },
        prefetchBars: async () => { },
        fetchPostBatchReport: async (body: { items: any[] }, debug?: boolean) => {
            if (debug) {
                console.log("sendBatchMetrics", body);
            }
            try {
                return new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                console.error("Error in fetchPostBatchReport:", error);
                return new Response(JSON.stringify({ success: false, error: error.message }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        },
        url: "http://localhost"
    };
}

export function useTokensAllowanceData() {
    return {
        tokensAllowanceData: {}
    };
}

export function useTokenAllowanceData(tokenAddress: string, account: string, spenderAddress: string) {
    return {
        allowance: "0",
        isLoading: false,
        error: undefined
    };
} 