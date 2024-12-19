export function useAffiliateRewards(chainId: number) {
    return {
        affiliateRewardsData: {},
        affiliateRewardsDataLoading: false
    };
}

export function getTotalClaimableAffiliateRewardsUsd(marketsInfoData: any, affiliateRewardsData: any) {
    return 0n;
}

export function claimAffiliateRewardsTxn(chainId: number, signer: any, params: any) {
    return Promise.resolve();
} 