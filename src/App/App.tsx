import "@wagmi/connectors";

import { i18n } from "@lingui/core";
import { Trans } from "@lingui/macro";
import { I18nProvider } from "@lingui/react";
import { useEffect, useState } from "react";
import { HashRouter as Router } from "react-router-dom";
import { SWRConfig } from "swr";

import "react-toastify/dist/ReactToastify.css";
import "styles/Font.css";
import "styles/Input.css";
import "styles/Shared.scss";
import "styles/recharts.css";
import "./App.scss";

import SEO from "components/Common/SEO";

import { getExplorerUrl } from "config/chains";
import { LANGUAGE_LOCALSTORAGE_KEY } from "config/localStorage";
import { GlobalStateProvider } from "context/GlobalContext/GlobalContextProvider";
import { SettingsContextProvider } from "context/SettingsContext/SettingsContextProvider";
import { WebsocketContextProvider } from "context/WebsocketContext/WebsocketContextProvider";
import { PendingTransaction } from "domain/legacy";
import { useChainId } from "lib/chains";
import { helperToast } from "lib/helperToast";
import { defaultLocale, dynamicActivate } from "lib/i18n";
import { RainbowKitProviderWrapper } from "lib/wallets/WalletProvider";
import { useEthersSigner } from "lib/wallets/useEthersSigner";
import { SWRConfigProp } from "./swrConfig";
import { TokensBalancesContextProvider } from "context/TokensBalancesContext/TokensBalancesContextProvider";

import ExternalLink from "components/ExternalLink/ExternalLink";
import { AppRoutes } from "./AppRoutes";

function App() {
  const signer = useEthersSigner();
  const { chainId } = useChainId();

  const [pendingTxns, setPendingTxns] = useState<PendingTransaction[]>([]);

  useEffect(() => {
    const defaultLanguage = localStorage.getItem(LANGUAGE_LOCALSTORAGE_KEY) || defaultLocale;
    dynamicActivate(defaultLanguage);
  }, []);

  let app = <AppRoutes />;
  app = <WebsocketContextProvider>{app}</WebsocketContextProvider>;
  app = <TokensBalancesContextProvider>{app}</TokensBalancesContextProvider>;
  app = <SEO>{app}</SEO>;
  app = <RainbowKitProviderWrapper>{app}</RainbowKitProviderWrapper>;
  app = <I18nProvider i18n={i18n as any}>{app}</I18nProvider>;
  app = <SettingsContextProvider>{app}</SettingsContextProvider>;
  app = (
    <SWRConfig key={chainId} value={SWRConfigProp}>
      {app}
    </SWRConfig>
  );
  app = (
    <GlobalStateProvider pendingTxns={pendingTxns} setPendingTxns={setPendingTxns}>
      {app}
    </GlobalStateProvider>
  );
  app = <Router>{app}</Router>;

  return app;
}

export default App;
