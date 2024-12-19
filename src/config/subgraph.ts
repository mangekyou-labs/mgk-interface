import { ARBITRUM, AVALANCHE, AVALANCHE_FUJI, ETH_MAINNET, HEDERA_TESTNET } from "./chains";
import { isDevelopment } from "./env";
import { getSubgraphUrlKey } from "./localStorage";

const SUBGRAPH_API_KEY = import.meta.env.VITE_APP_UI_SUBGRAPH_API_KEY;

const SUBGRAPH_URLS = {
  [ARBITRUM]: {
    stats: "https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/gmx-arbitrum-stats/api",
    referrals: "https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/gmx-arbitrum-referrals/api",
    nissohVault: "https://api.thegraph.com/subgraphs/name/nissoh/gmx-vault",
    syntheticsStats: "https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/synthetics-arbitrum-stats/api",
    subsquid: "https://gmx.squids.live/gmx-synthetics-arbitrum:live/api/graphql",
  },

  [AVALANCHE]: {
    stats: "https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/gmx-avalanche-stats/api",
    referrals: "https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/gmx-avalanche-referrals/api",
    syntheticsStats: "https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/synthetics-avalanche-stats/api",
    subsquid: "https://gmx.squids.live/gmx-synthetics-avalanche:live/api/graphql",
  },

  [AVALANCHE_FUJI]: {
    stats: "https://api.thegraph.com/subgraphs/name/gmx-io/gmx-avalanche-stats",
    referrals: "https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/gmx-fuji-referrals/api",
    syntheticsStats: "https://subgraph.satsuma-prod.com/3b2ced13c8d9/gmx/synthetics-fuji-stats/api",
    subsquid: "https://gmx.squids.live/gmx-synthetics-fuji:live/api/graphql",
  },

  [HEDERA_TESTNET]: {
    chainLink: `https://gateway.thegraph.com/api/${SUBGRAPH_API_KEY}/subgraphs/id/39QtNcs7YrvJUvh2sNVGFTKLeahMBpB3BKWypPrSNYLc`
  },

  common: {
    [ETH_MAINNET]: {
      chainLink: `https://gateway.thegraph.com/api/${SUBGRAPH_API_KEY}/subgraphs/id/39QtNcs7YrvJUvh2sNVGFTKLeahMBpB3BKWypPrSNYLc`,
    },
  },
};

export function getSubgraphUrl(chainId: number, subgraph: string): string | undefined {
  if (isDevelopment()) {
    const localStorageKey = getSubgraphUrlKey(chainId, subgraph);
    const url = localStorage.getItem(localStorageKey);
    if (url) {
      // eslint-disable-next-line no-console
      console.warn("%s subgraph on chain %s url is overriden: %s", subgraph, chainId, url);
      return url;
    }
  }

  if (chainId === ETH_MAINNET) {
    return SUBGRAPH_URLS.common[ETH_MAINNET]?.[subgraph];
  }

  return SUBGRAPH_URLS?.[chainId]?.[subgraph];
}
