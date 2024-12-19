import { ARBITRUM, AVALANCHE, BSС_MAINNET } from "./chains";

export const BACKEND_URLS = {
  default: "https://gmx-server-mainnet.gmx.io",
  [ARBITRUM]: "https://gmx-server-arbitrum.gmx.io",
  [AVALANCHE]: "https://gmx-server-avalanche.gmx.io",
};

export const GMX_STATS_API_URL = "https://stats.gmx.io/api";

export const KEEPER_BOT_API_URL = "https://gmx-keeper-bot.gmx.io";
export const KEEPER_BOT_ARBITRUM_URL = "https://gmx-keeper-bot-arbitrum.gmx.io";
export const KEEPER_BOT_AVALANCHE_URL = "https://gmx-keeper-bot-avalanche.gmx.io";

export function getServerBaseUrl(chainId: number) {
  if (!chainId) {
    throw new Error("chainId is not provided");
  }

  if (document.location.hostname.includes("deploy-preview")) {
    const fromLocalStorage = localStorage.getItem("SERVER_BASE_URL");
    if (fromLocalStorage) {
      return fromLocalStorage;
    }
  }

  return BACKEND_URLS[chainId] || BACKEND_URLS.default;
}

export function getServerUrl(chainId: number, path: string) {
  return `${getServerBaseUrl(chainId)}${path}`;
}
