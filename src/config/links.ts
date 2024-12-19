import { ARBITRUM, AVALANCHE } from "config/chains";
import { TOKENS_BY_SYMBOL_MAP } from "./tokens";

const oneInchTokensMap = {
  [ARBITRUM]: {
    BTC: "WBTC",
  },
  [AVALANCHE]: {
    BTC: "BTC.b",
    ETH: "WETH.e",
    WBTC: "WBTC.e",
  },
};

export function get1InchSwapUrl(chainId: number, from?: string, to?: string) {
  const rootUrl = `https://app.1inch.io/#/${chainId}/simple/swap`;
  const chainTokensMap = TOKENS_BY_SYMBOL_MAP[chainId];
  const isInvalidInput = !from || !to || !chainTokensMap[from] || !chainTokensMap[to];
  if (isInvalidInput) {
    return rootUrl;
  }
  const fromToken = oneInchTokensMap[chainId]?.[from] || from;
  const toToken = oneInchTokensMap[chainId]?.[to] || to;
  return `${rootUrl}/${fromToken}/${toToken}`;
}

export function get1InchSwapUrlFromAddresses(chainId: number, fromAddress?: string, toAddress?: string) {
  const addressesStr = [fromAddress, toAddress].filter(Boolean).join("/");
  return `https://app.1inch.io/#/${chainId}/simple/swap/${addressesStr}`;
}

export function getLeaderboardLink(chainId) {
  if (chainId === ARBITRUM) {
    return "https://www.gmx.house/arbitrum/leaderboard";
  }
  if (chainId === AVALANCHE) {
    return "https://www.gmx.house/avalanche/leaderboard";
  }
  return "https://www.gmx.house";
}

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/MGKProtocol",
  discord: "https://discord.gg/mgk",
  github: "https://github.com/mgk-protocol",
  telegram: "https://t.me/MGKProtocol",
  medium: "https://mgkprotocol.medium.com/",
};

export const TRADING_LINKS = {
  arbitrum: "https://app.mgk.io/#/trade",
  avalanche: "https://app.mgk.io/#/trade?chain=avalanche",
};

export const DOCS_LINKS = {
  website: "https://mgk.io/",
  referrals: "https://docs.mgk.io/referrals",
  swapFAQs: "https://docs.mgk.io/trading",
  levFAQs: "https://docs.mgk.io/trading",
  // ... rest of the links ...
};

export const ARBITRUM_INCENTIVES_V2_URL =
  "https://gmxio.notion.site/GMX-STIP-Bridge-Incentives-6967a56615b644eabc10f9a1a81b83ab";
export const AVALANCHE_INCENTIVES_V2_URL =
  "https://gmxio.notion.site/GMX-Summer-Boost-provide-liquidity-and-trade-perpetuals-to-grab-your-share-of-AVAX-rewards-13638f2e28934460a242f72def4f7d36";

export function getIncentivesV2Url(chainId: number): string {
  if (chainId === ARBITRUM) {
    return ARBITRUM_INCENTIVES_V2_URL;
  }

  if (chainId === AVALANCHE) {
    return AVALANCHE_INCENTIVES_V2_URL;
  }

  return ARBITRUM_INCENTIVES_V2_URL;
}
