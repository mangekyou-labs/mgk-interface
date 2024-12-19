import { useChainId } from "lib/chains";
import entries from "lodash/entries";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type TokenBalanceUpdate = {
  balance?: bigint;
  diff?: bigint;
};

export type TokensBalancesUpdates = {
  [tokenAddress: string]: TokenBalanceUpdate | undefined;
};

type TokensBalancesContextType = {
  tokensBalancesUpdates: TokensBalancesUpdates;
  setTokensBalancesUpdates: Dispatch<SetStateAction<TokensBalancesUpdates>>;
  resetTokensBalancesUpdates: (tokenAddresses: string[]) => void;
};

const Context = createContext<TokensBalancesContextType | null>(null);

export function TokensBalancesContextProvider({ children }: PropsWithChildren) {
  const { chainId } = useChainId();
  const [tokensBalancesUpdates, setTokensBalancesUpdates] = useState<TokensBalancesUpdates>({});

  const resetTokensBalancesUpdates = useCallback((tokenAddresses: string[]) => {
    setTokensBalancesUpdates((old) => {
      const newState = { ...old };
      tokenAddresses.forEach((tokenAddress) => {
        delete newState[tokenAddress];
      });
      return newState;
    });
  }, []);

  useEffect(() => {
    setTokensBalancesUpdates({});
  }, [chainId]);

  const state = useMemo(
    () => ({ tokensBalancesUpdates, setTokensBalancesUpdates, resetTokensBalancesUpdates }),
    [resetTokensBalancesUpdates, tokensBalancesUpdates]
  );

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

export function useTokensBalancesUpdates(): TokensBalancesContextType {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useTokensBalancesUpdates must be used within a TokensBalancesContextProvider");
  }

  return context;
}

type TokenWithBalance = {
  balance?: bigint;
  [key: string]: any;
};

export function useUpdatedTokensBalances<T extends Record<string, bigint | TokenWithBalance>>(balancesData?: T): T | undefined {
  const { tokensBalancesUpdates } = useTokensBalancesUpdates();

  return useMemo(() => {
    if (!balancesData) {
      return balancesData;
    }

    const result = { ...balancesData } as T;
    const updateEntries = entries(tokensBalancesUpdates);

    for (const [tokenAddress, balanceUpdate] of updateEntries) {
      if (!balanceUpdate || !(tokenAddress in result)) {
        continue;
      }

      const currentValue = result[tokenAddress];

      if (typeof currentValue === "bigint") {
        (result as any)[tokenAddress] = updateTokenBalance(balanceUpdate, currentValue);
      } else if (currentValue && typeof currentValue === "object" && typeof currentValue.balance === "bigint") {
        const tokenData = { ...currentValue };
        tokenData.balance = updateTokenBalance(balanceUpdate, tokenData.balance);
        (result as any)[tokenAddress] = tokenData;
      }
    }

    return result;
  }, [balancesData, tokensBalancesUpdates]);
}

export function updateTokenBalance(balanceUpdate: TokenBalanceUpdate, balance: bigint) {
  if (balanceUpdate.diff !== undefined) {
    return balance + balanceUpdate.diff;
  } else if (balanceUpdate.balance !== undefined) {
    return balanceUpdate.balance;
  }

  return balance;
}
