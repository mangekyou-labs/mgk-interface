import { Trans } from "@lingui/macro";
import { Provider, ethers } from "ethers";
import { Suspense, lazy, useEffect, useRef } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import type { Address } from "viem";

import { ARBITRUM } from "config/chains";
import { getContract } from "config/contracts";
import { isDevelopment } from "config/env";
import { useWebsocketProvider } from "context/WebsocketContext/WebsocketContextProvider";
import { subscribeToV1Events } from "context/WebsocketContext/subscribeToEvents";
import { useChainId } from "lib/chains";
import { useHasLostFocus } from "lib/useHasPageLostFocus";

import { AccountDashboard } from "pages/AccountDashboard/AccountDashboard";
import { buildAccountDashboardUrl } from "pages/AccountDashboard/buildAccountDashboardUrl";
import { VERSION_QUERY_PARAM } from "pages/AccountDashboard/constants";
import { AccountsRouter } from "pages/Actions/ActionsRouter";
import BeginAccountTransfer from "pages/BeginAccountTransfer/BeginAccountTransfer";
import Buy from "pages/Buy/Buy";
import BuyGMX from "pages/BuyGMX/BuyGMX";
import BuyGlp from "pages/BuyGlp/BuyGlp";
import ClaimEsGmx from "pages/ClaimEsGmx/ClaimEsGmx";
import CompleteAccountTransfer from "pages/CompleteAccountTransfer/CompleteAccountTransfer";
import DashboardV2 from "pages/Dashboard/DashboardV2";
import Ecosystem from "pages/Ecosystem/Ecosystem";
import { Exchange } from "pages/Exchange/Exchange";
import Jobs from "pages/Jobs/Jobs";
import NftWallet from "pages/NftWallet/NftWallet";
import OrdersOverview from "pages/OrdersOverview/OrdersOverview";
import PageNotFound from "pages/PageNotFound/PageNotFound";
import PositionsOverview from "pages/PositionsOverview/PositionsOverview";
import Referrals from "pages/Referrals/Referrals";
import ReferralsTier from "pages/ReferralsTier/ReferralsTier";
import Stake from "pages/Stake/Stake";
import Stats from "pages/Stats/Stats";

import VaultV2 from "sdk/abis/VaultV2.json";
import VaultV2b from "sdk/abis/VaultV2b.json";

const LazyUiPage = lazy(() => import("pages/UiPage/UiPage"));
export const UiPage = () => <Suspense fallback={<Trans>Loading...</Trans>}>{<LazyUiPage />}</Suspense>;

export function MainRoutes({ openSettings }: { openSettings: () => void }) {
  const exchangeRef = useRef<any>();
  const { hasV1LostFocus } = useHasLostFocus();
  const { chainId } = useChainId();

  const { wsProvider } = useWebsocketProvider();

  const vaultAddress = getContract(chainId, "Vault");

  useEffect(() => {
    const wsVaultAbi = chainId === ARBITRUM ? VaultV2.abi : VaultV2b.abi;
    if (hasV1LostFocus || !wsProvider) {
      return;
    }

    const wsVault = new ethers.Contract(vaultAddress, wsVaultAbi, wsProvider as Provider);

    const callExchangeRef = (method, ...args) => {
      if (!exchangeRef || !exchangeRef.current) {
        return;
      }

      exchangeRef.current[method](...args);
    };

    const unsubscribe = subscribeToV1Events(wsVault, null, callExchangeRef);

    return function cleanup() {
      unsubscribe();
    };
  }, [chainId, vaultAddress, wsProvider, hasV1LostFocus]);

  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/v1" />
      </Route>
      <Route exact path="/v1/:tradeType?">
        <Exchange ref={exchangeRef} openSettings={openSettings} />
      </Route>
      <Route exact path="/dashboard">
        <DashboardV2 />
      </Route>
      <Route exact path="/stats/v1">
        <Stats />
      </Route>
      <Redirect exact from="/stats/v2" to="/stats" />
      <Route exact path="/stats">
        <Stats />
      </Route>
      <Route exact path="/earn">
        <Stake />
      </Route>
      <Route exact path="/buy">
        <Buy />
      </Route>

      <Redirect exact from="/trade" to="/v1" />
      <Redirect exact from="/trade/:tradeType" to="/v1/:tradeType" />
      <Redirect from="/v2" to="/v1" />
      <Route exact path="/buy_glp">
        <BuyGlp />
      </Route>
      <Route exact path="/jobs">
        <Jobs />
      </Route>
      <Route exact path="/buy_gmx">
        <BuyGMX />
      </Route>
      <Route exact path="/ecosystem">
        <Ecosystem />
      </Route>
      <Route exact path="/referrals">
        <Referrals />
      </Route>
      <Route exact path="/referrals/:account">
        <Referrals />
      </Route>
      <Route exact path="/nft_wallet">
        <NftWallet />
      </Route>
      <Route exact path="/claim_es_gmx">
        <ClaimEsGmx />
      </Route>
      <Route exact path="/actions">
        <AccountsRouter />
      </Route>
      <Route exact path="/actions/:account">
        <AccountsRouter />
      </Route>
      <Route exact path="/orders_overview">
        <OrdersOverview />
      </Route>
      <Route exact path="/positions_overview">
        <PositionsOverview />
      </Route>
      <Route exact path="/begin_account_transfer">
        <BeginAccountTransfer />
      </Route>
      <Route exact path="/complete_account_transfer/:transferKey">
        <CompleteAccountTransfer />
      </Route>
      <Route exact path="/referral-terms">
        <ReferralsTier />
      </Route>
      {isDevelopment() && (
        <Route exact path="/ui">
          <UiPage />
        </Route>
      )}
      <Route exact path="/account">
        <Redirect to={buildAccountDashboardUrl({ version: VERSION_QUERY_PARAM.V1 })} />
      </Route>
      <Route exact path="/account/:view">
        <AccountDashboard />
      </Route>
      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  );
}
