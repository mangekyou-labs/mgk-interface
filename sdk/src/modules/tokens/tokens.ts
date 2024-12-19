import { getContract } from "configs/contracts";
import { NATIVE_TOKEN_ADDRESS, getToken, getTokensMap, getV2Tokens, getWrappedToken } from "configs/tokens";
import { TokenBalancesData, TokenPricesData, TokensData, Token as TToken } from "types/tokens";

import Multicall from "abis/Multicall.json";
import Token from "abis/Token.json";

import { Module } from "../base";
import { parseContractPrice } from "utils/tokens";

type TokenPricesDataResult = {
  pricesData?: TokenPricesData;
  updatedAt?: number;
};

type TokensDataResult = {
  tokensData?: TokensData;
  pricesUpdatedAt?: number;
};

export class Tokens extends Module {
  _tokensConfigs: { [key: string]: TToken } | undefined = undefined;
  get tokensConfig() {
    if (this._tokensConfigs) {
      return this._tokensConfigs;
    }

    const tokenConfigs = this._tokensConfigs ?? getTokensMap(this.chainId);

    Object.entries(this.sdk.config.tokens ?? []).forEach(([address, token]) => {
      tokenConfigs[address] = {
        ...tokenConfigs[address],
        ...token,
      };
    });

    this._tokensConfigs = tokenConfigs;

    return tokenConfigs;
  }

  private getTokenRecentPrices(): Promise<TokenPricesDataResult> {
    return this.oracle.getTickers().then((priceItems) => {
      const result: TokenPricesData = {};

      priceItems.forEach((priceItem) => {
        let tokenConfig: any;

        try {
          tokenConfig = getToken(this.chainId, priceItem.tokenAddress);
        } catch (e) {
          // ignore unknown token errors

          return;
        }

        result[tokenConfig.address] = {
          minPrice: parseContractPrice(BigInt(priceItem.minPrice), tokenConfig.decimals),
          maxPrice: parseContractPrice(BigInt(priceItem.maxPrice), tokenConfig.decimals),
        };
      });

      const wrappedToken = getWrappedToken(this.chainId);

      if (result[wrappedToken.address] && !result[NATIVE_TOKEN_ADDRESS]) {
        result[NATIVE_TOKEN_ADDRESS] = result[wrappedToken.address];
      }

      return {
        pricesData: result,
        updatedAt: Date.now(),
      };
    });
  }

  private getTokensBalances(
    account?: string,
    tokensList?: {
      address: string;
      isSynthetic?: boolean;
    }[]
  ) {
    account = account || this.sdk.config.account;
    tokensList = tokensList || getV2Tokens(this.chainId);

    console.log("[Token Balance Debug] Starting balance fetch:", {
      chainId: this.chainId,
      account,
      tokensList,
      sdkConfig: this.sdk.config
    });

    if (!account) {
      console.log("[Token Balance Debug] No account provided");
      return Promise.resolve({});
    }

    const multicallRequests = tokensList.reduce((acc, token) => {
      // Skip synthetic tokens
      if (token.isSynthetic) {
        console.log("[Token Balance Debug] Skipping synthetic token:", token);
        return acc;
      }

      const address = token.address;

      console.log("[Token Balance Debug] Processing token for multicall:", {
        address,
        isNative: address === NATIVE_TOKEN_ADDRESS,
        token
      });

      if (address === NATIVE_TOKEN_ADDRESS) {
        acc[address] = {
          contractAddress: getContract(this.chainId, "Multicall"),
          abi: Multicall.abi,
          calls: {
            balance: {
              methodName: "getEthBalance",
              params: [account],
            },
          },
        };
      } else {
        acc[address] = {
          contractAddress: address,
          abi: Token.abi,
          calls: {
            balance: {
              methodName: "balanceOf",
              params: [account],
            },
          },
        };
      }

      return acc;
    }, {});

    console.log("[Token Balance Debug] Prepared multicall requests:", multicallRequests);

    return this.sdk
      .executeMulticall(multicallRequests)
      .then((res) => {
        console.log("[Token Balance Debug] Multicall response:", res);

        return Object.keys(res.data).reduce((tokenBalances: TokenBalancesData, tokenAddress) => {
          tokenBalances[tokenAddress] = res.data[tokenAddress].balance.returnValues[0];
          console.log("[Token Balance Debug] Processed balance for token:", {
            tokenAddress,
            balance: tokenBalances[tokenAddress]?.toString()
          });
          return tokenBalances;
        }, {} as TokenBalancesData);
      })
      .catch(error => {
        console.error("[Token Balance Debug] Error in multicall:", error);
        throw error;
      });
  }

  getNativeToken(): TToken {
    return this.tokensConfig[NATIVE_TOKEN_ADDRESS];
  }

  async getTokensData(): Promise<TokensDataResult> {
    console.log("[Tokens Debug] getTokensData called", {
      account: this.account,
      chainId: this.chainId
    });

    const tokenConfigs = this.tokensConfig;
    console.log("[Tokens Debug] tokenConfigs:", tokenConfigs);

    const [apiTokens, { pricesData, updatedAt: pricesUpdatedAt }] = await Promise.all([
      this.sdk.oracle.getTokens(),
      this.getTokenRecentPrices(),
    ]);

    console.log("[Tokens Debug] API response:", {
      apiTokens,
      pricesData,
      pricesUpdatedAt
    });

    const nativeToken = this.getNativeToken();
    const tokens = [nativeToken, ...apiTokens];
    console.log("[Tokens Debug] Tokens to fetch balances for:", tokens);

    const { balancesData } = this.account
      ? await this.getTokensBalances(this.account, tokens)
      : {
        balancesData: {},
      };

    if (!pricesData) {
      console.log("[Tokens Debug] No prices data available");
      return {
        tokensData: undefined,
        pricesUpdatedAt: undefined,
      };
    }

    console.log("[Tokens Debug] Final balances data:", balancesData);

    return {
      tokensData: tokens.reduce((acc: TokensData, token) => {
        const tokenAddress = token.address;
        const prices = pricesData[tokenAddress];
        const balance = balancesData?.[tokenAddress];
        const tokenConfig = tokenConfigs[tokenAddress];

        if (!prices) {
          return acc;
        }

        acc[tokenAddress] = {
          ...token,
          ...tokenConfig,
          prices,
          balance,
        };
        return acc;
      }, {} as TokensData),
      pricesUpdatedAt,
    };
  }
}
