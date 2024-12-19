export type TokenCategory = "meme" | "layer1" | "layer2" | "defi";

export type Token = {
  name: string;
  symbol: string;
  assetSymbol?: string;
  baseSymbol?: string;
  decimals: number;
  address: string;
  priceDecimals?: number;
  visualMultiplier?: number;
  visualPrefix?: string;
  wrappedAddress?: string;
  coingeckoUrl?: string;
  coingeckoSymbol?: string;
  metamaskSymbol?: string;
  explorerSymbol?: string;
  explorerUrl?: string;
  reservesUrl?: string;
  imageUrl?: string;
  categories?: TokenCategory[];
  isUsdg?: boolean;
  isNative?: boolean;
  isWrapped?: boolean;
  isShortable?: boolean;
  isStable?: boolean;
  isSynthetic?: boolean;
  isTempHidden?: boolean;
  isChartDisabled?: boolean;
  isV1Available?: boolean;
  isPlatformToken?: boolean;
  isPlatformTradingToken?: boolean;
};

export type TokenInfo = Token & {
  balance?: bigint;
  totalSupply?: bigint;
};

export type InfoTokens = {
  [key: string]: TokenInfo;
};

export type TokenPrices = {
  minPrice: bigint;
  maxPrice: bigint;
};
