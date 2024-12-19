import { Provider as EthersProvider } from "ethers";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useChainId } from "lib/chains";
import { getWsProvider } from "lib/rpc";
import { useHasLostFocus } from "lib/useHasPageLostFocus";

type WebsocketContextType = {
  wsProvider: EthersProvider | undefined;
};

const WebsocketContext = createContext<WebsocketContextType>({ wsProvider: undefined });

export function WebsocketContextProvider({ children }: { children: ReactNode }) {
  const { chainId } = useChainId();
  const [wsProvider, setWsProvider] = useState<EthersProvider>();
  const { hasPageLostFocus } = useHasLostFocus();

  useEffect(() => {
    if (hasPageLostFocus) {
      return;
    }

    const provider = getWsProvider(chainId);
    setWsProvider(provider);

    return function cleanup() {
      if (provider) {
        provider.destroy?.();
      }
    };
  }, [chainId, hasPageLostFocus]);

  return <WebsocketContext.Provider value={{ wsProvider }}>{children}</WebsocketContext.Provider>;
}

export function useWebsocketProvider() {
  return useContext(WebsocketContext);
}
