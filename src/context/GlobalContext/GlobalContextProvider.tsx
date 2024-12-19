import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { REDIRECT_POPUP_TIMESTAMP_KEY, TRADE_LINK_KEY } from "config/localStorage";
import { useChainId } from "lib/chains";
import { useLocalStorageSerializeKey } from "lib/localStorage";
import { PendingTransaction, SetPendingTransactions } from "domain/legacy";
import { useLocalStorage } from "react-use";
import { matchPath, useHistory, useLocation } from "react-router-dom";

type GlobalContextType = null | {
  tradePageVersion: number;
  setTradePageVersion: (version: number) => void;

  pendingTxns: PendingTransaction[];
  setPendingTxns: SetPendingTransactions;

  redirectPopupTimestamp: number | undefined;
  setRedirectPopupTimestamp: Dispatch<SetStateAction<number | undefined>>;

  notifyModalOpen: boolean;
  setNotifyModalOpen: (nextState: boolean) => void;
};

const context = createContext<GlobalContextType>(null);

const { Provider } = context;

export const GlobalStateProvider = memo(
  ({
    pendingTxns,
    setPendingTxns,
    children,
  }: PropsWithChildren<{
    pendingTxns: PendingTransaction[];
    setPendingTxns: SetPendingTransactions;
  }>) => {
    const [tradePageVersion, setTradePageVersion] = useTradePageVersion();

    const [notifyModalOpen, setNotifyModalOpen] = useState(false);

    const [redirectPopupTimestamp, setRedirectPopupTimestamp] = useLocalStorage<number | undefined>(
      REDIRECT_POPUP_TIMESTAMP_KEY,
      undefined,
      {
        raw: false,
        deserializer: (val) => {
          if (!val) {
            return undefined;
          }
          const num = parseInt(val);

          if (Number.isNaN(num)) {
            return undefined;
          }

          return num;
        },
        serializer: (val) => (val ? val.toString() : ""),
      }
    );

    const value = useMemo(
      () => ({
        tradePageVersion,
        setTradePageVersion,
        pendingTxns,
        setPendingTxns,
        redirectPopupTimestamp,
        setRedirectPopupTimestamp,
        notifyModalOpen,
        setNotifyModalOpen,
      }),
      [
        tradePageVersion,
        setTradePageVersion,
        pendingTxns,
        setPendingTxns,
        redirectPopupTimestamp,
        setRedirectPopupTimestamp,
        notifyModalOpen,
        setNotifyModalOpen,
      ]
    );

    return <Provider value={value}>{children}</Provider>;
  }
);

export const useGlobalContext = () => {
  const value = useContext(context);
  if (value === null) {
    throw new Error("useGlobalContext must be used within a GlobalContextProvider");
  }

  return value;
};

function useTradePageVersion() {
  const { chainId } = useChainId();
  const location = useLocation();
  const history = useHistory();

  const isV1Matched = useMemo(() => matchPath(location.pathname, { path: "/v1/:tradeType?" }), [location.pathname]);

  // Always default to V1
  const defaultVersion = 1;

  const [savedTradePageVersion, setSavedTradePageVersion] = useLocalStorageSerializeKey(
    [chainId, TRADE_LINK_KEY],
    defaultVersion
  );

  // If we're on a specific path, that takes precedence over saved version
  const tradePageVersion = isV1Matched ? 1 : savedTradePageVersion ?? defaultVersion;

  // manual switch - only redirect if we're on the wrong path
  const setTradePageVersion = useCallback(
    (version: number) => {
      setSavedTradePageVersion(version);
      const isOnV1 = location.pathname.startsWith("/v1");

      if (version === 1 && !isOnV1) {
        history.replace("/v1");
      }
    },
    [history, setSavedTradePageVersion, location.pathname]
  );

  // Handle initial redirect and root path
  useEffect(() => {
    const shouldRedirectToV1 = location.pathname === "/" || location.pathname.startsWith("/trade");

    if (shouldRedirectToV1) {
      history.replace("/v1");
    }
  }, [chainId, savedTradePageVersion, history, location.pathname]);

  return [tradePageVersion, setTradePageVersion] as const;
}
