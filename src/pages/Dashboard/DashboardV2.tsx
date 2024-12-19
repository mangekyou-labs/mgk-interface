import React from "react";
import { Trans, t } from "@lingui/macro";

import { ARBITRUM, AVALANCHE } from "config/chains";
import { USD_DECIMALS } from "config/factors";

import { getWhitelistedV1Tokens } from "config/tokens";
import { useGmxPrice, useTotalGmxInLiquidity, useTotalGmxSupply } from "domain/legacy";
import { useInfoTokens } from "domain/tokens";
import { bigMath } from "lib/bigmath";
import { useChainId } from "lib/chains";
import { GLP_DECIMALS, GMX_DECIMALS, getPageTitle } from "lib/legacy";
import { expandDecimals } from "lib/numbers";
import { useTradePageVersion } from "lib/useTradePageVersion";
import useWallet from "lib/wallets/useWallet";
import { useDashboardChainStatsMulticall } from "./useDashboardChainStatsMulticall";

import SEO from "components/Common/SEO";
import ExternalLink from "components/ExternalLink/ExternalLink";
import Footer from "components/Footer/Footer";
import PageTitle from "components/PageTitle/PageTitle";
import { DashboardPageTitle } from "./DashboardPageTitle";
import { GlpCard } from "./GlpCard";
import { GmxCard } from "./GmxCard";
import { MarketsListV1 } from "./MarketsListV1";
import { OverviewCard } from "./OverviewCard";
import { StatsCard } from "./StatsCard";

import "./DashboardV2.css";

export const ACTIVE_CHAIN_IDS = [ARBITRUM, AVALANCHE];

export default function DashboardV2() {
  const { chainId } = useChainId();
  const { active } = useWallet();

  const [tradePageVersion] = useTradePageVersion();
  const isV1 = tradePageVersion === 1;

  const { totalGmxSupply, totalGmxInLiquidity } = useTotalGmxSupply(chainId);

  const gmxPrice = useGmxPrice(chainId, {
    arbitrum: chainId === ARBITRUM,
    avalanche: chainId === AVALANCHE,
  });

  let gmxMarketCap;
  if (gmxPrice && totalGmxSupply) {
    gmxMarketCap = bigMath.mul(gmxPrice, totalGmxSupply);
  }

  const { infoTokens } = useInfoTokens(chainId, active, undefined, undefined);
  const { totalTokenWeights, totalSupply: glpSupply } = useDashboardChainStatsMulticall(chainId);

  let glpPrice;
  let glpMarketCap;
  let adjustedUsdgSupply;

  if (glpSupply && totalTokenWeights && infoTokens) {
    const whitelistedTokens = getWhitelistedV1Tokens(chainId);
    adjustedUsdgSupply = bigMath.div(totalTokenWeights, expandDecimals(1, GLP_DECIMALS));

    if (glpSupply && adjustedUsdgSupply) {
      glpPrice = bigMath.div(adjustedUsdgSupply, glpSupply);
      glpMarketCap = bigMath.mul(glpPrice, glpSupply);
    }
  }

  return (
    <SEO title={getPageTitle("Dashboard")}>
      <div className="default-container DashboardV2 page-layout">
        <div className="section-title-block">
          <div className="section-title-icon"></div>
          <div className="section-title-content">
            <div className="Page-title">
              <Trans>Dashboard</Trans>
            </div>
            <div className="Page-description">
              <Trans>Overview of GMX stats.</Trans>
            </div>
          </div>
        </div>
        <div className="DashboardV2-content">
          <div className="DashboardV2-cards">
            <OverviewCard />
            <StatsCard />
          </div>
          <DashboardPageTitle />
          <div className="DashboardV2-token-cards">
            <div className="stats-wrapper stats-wrapper--gmx">
              <GmxCard
                chainId={chainId}
                gmxPrice={gmxPrice}
                totalGmxSupply={totalGmxSupply}
                gmxMarketCap={gmxMarketCap}
                totalGmxInLiquidity={totalGmxInLiquidity}
              />
              {isV1 && (
                <GlpCard
                  chainId={chainId}
                  glpPrice={glpPrice}
                  glpSupply={glpSupply}
                  glpMarketCap={glpMarketCap}
                  adjustedUsdgSupply={adjustedUsdgSupply}
                />
              )}
            </div>
            {isV1 && (
              <MarketsListV1
                chainId={chainId}
                infoTokens={infoTokens}
                totalTokenWeights={totalTokenWeights}
                adjustedUsdgSupply={adjustedUsdgSupply}
              />
            )}
          </div>
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
