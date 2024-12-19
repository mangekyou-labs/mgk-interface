export type MarketInfo = any;
export type MarketsInfoData = any;
export type MarketsData = any;
export type GlvInfo = any;
export type GlvOrMarketInfo = any;
export type GlvAndGmMarketsInfoData = any;
export type Market = any;
export type MarketTokensAPRData = any;
export type UserEarningsData = any;
export type MarketsInfoResult = any;
export type GlvInfoData = any;
export type TokenData = any;
export type TokensData = any;
export type OrderType = any;
export type LeaderboardAccount = any;
export type LeaderboardPosition = any;
export type RemoteData = any;
export type CompetitionType = any;
export type LeaderboardPageKey = any;
export type LeaderboardTimeframe = any;
export type LeaderboardPageConfig = any;
export type PnlSummaryPoint = any;
export type UserFeedback = any;
export type TradeMode = any;
export type TradeType = any;
export type DecreasePositionSwapType = any;

export enum TokenPoolType {
    SWAP,
    BORROW,
    LONG,
    SHORT
}

// Stub functions
export const getMarketFullName = () => "";
export const getMarketIndexName = () => "";
export const getMarketPoolName = () => "";
export const getContractMarketPrices = () => ({});
export const getTokenPoolType = () => TokenPoolType.SWAP;
export const getAvailableUsdLiquidityForCollateral = () => 0;
export const getOppositeCollateral = () => "";
export const getCappedPoolPnl = () => 0;
export const getMarketPnl = () => 0;
export const getOpenInterestUsd = () => 0;
export const getPoolUsdWithoutPnl = () => 0;
export const getMaxPoolUsd = () => 0;
export const getTotalAccruedFundingUsd = () => 0;
export const marketTokenAmountToUsd = () => 0;
export const usdToMarketTokenAmount = () => 0;
export const getGlvDisplayName = () => "";
export const getMarketBadge = () => "";
export const getGlvOrMarketAddress = () => "";
export const isMarketInfo = () => false;
export const isMarketIndexToken = () => false;
export const getAvailableUsdLiquidityForPosition = () => 0;
export const getMaxLeverageByMinCollateralFactor = () => 0;
export const getMintableMarketTokens = () => 0;
export const getSellableMarketToken = () => 0;
export const getMarketName = () => "";
export const getGlvMarketName = () => "";
export const getTotalGmInfo = () => ({});
export const getUsedLiquidity = () => 0;
export const getTradeboxLeverageSliderMarks = () => [];
export const getMaxAllowedLeverageByMinCollateralFactor = getMaxLeverageByMinCollateralFactor;
export const isGlvEnabled = () => false;
export const isGlvInfo = () => false;
export const useMarketsInfoRequest = () => ({
    marketsInfoData: {},
    tokensData: {},
    pricesUpdatedAt: Date.now(),
});
export const useMarketsConfigsRequest = useMarketsInfoRequest;
export const useMarketsValuesRequest = useMarketsInfoRequest;
export const useMarketTokensData = () => ({});
export const useMarkets = () => ({
    marketsInfoData: {},
    marketsData: {},
    tokensData: {},
});
export const useTokenBalances = () => ({});
export const useTokensAllowanceData = () => ({});
export const getNeedTokenApprove = () => false;
export const convertToUsd = () => 0;
export const getTokenData = () => ({});
export const useGmMarketsApy = () => ({});
export const useGovTokenAmount = () => 0;
export const useGovTokenDelegates = () => ({});
export const useAnyAirdroppedTokenTitle = () => "";
export const useIncentiveStats = () => ({});
export const useAccountStats = () => ({});
export const usePeriodAccountStats = () => ({});
export const useIsLargeAccountData = () => ({});
export const usePnlSummaryData = () => ({});
export const getLiquidationPrice = () => 0;
export const convertToContractPrice = () => 0; 