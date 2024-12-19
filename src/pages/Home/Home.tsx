import { Trans } from "@lingui/macro";
import useSWR from "swr";

import { getServerUrl } from "config/backend";
import { ARBITRUM, AVALANCHE } from "config/chains";
import { USD_DECIMALS } from "config/factors";
import { useUserStat } from "domain/legacy";
import { getTotalVolumeSum, shouldShowRedirectModal } from "lib/legacy";
import { bigNumberify, formatAmount, numberWithCommas } from "lib/numbers";

import Footer from "components/Footer/Footer";
import { HeaderLink } from "components/Header/HeaderLink";
import TokenCard from "components/TokenCard/TokenCard";

import arbitrumIcon from "img/ic_arbitrum_96.svg";
import avaxIcon from "img/ic_avalanche_96.svg";
import costIcon from "img/ic_cost.svg";
import liquidityIcon from "img/ic_liquidity.svg";
import simpleSwapIcon from "img/ic_simpleswaps.svg";
import statsIcon from "img/ic_stats.svg";
import totaluserIcon from "img/ic_totaluser.svg";
import tradingIcon from "img/ic_trading.svg";

import { userAnalytics } from "lib/userAnalytics";
import { LandingPageLaunchAppEvent, LandingPageViewEvent } from "lib/userAnalytics/types";

import "./Home.css";

export default function Home({ showRedirectModal }) {
  const [shouldShowRedirectModalValue, setShouldShowRedirectModalValue] = useState(false);

  useEffect(() => {
    userAnalytics.pushEvent<LandingPageViewEvent>({ event: "LandingPageAction", data: { action: "PageView" } });
  }, []);

  return (
    <div className="Home">
      <div className="Home-top">
        <div className="Home-title-section-container default-container">
          <div className="Home-title-section">
            <div className="Home-title">
              <Trans>
                Decentralized
                <br />
                Perpetual Exchange
              </Trans>
            </div>
            <div className="Home-description">
              <Trans>Trade with zero price impact and up to 50x leverage.</Trans>
            </div>
            <HeaderLink
              className="default-btn"
              to="/trade"
              redirectPopupTimestamp={0}
              showRedirectModal={showRedirectModal}
            >
              <Trans>Launch App</Trans>
            </HeaderLink>
          </div>
        </div>
        <div className="Home-latest-info-container default-container">
          <div className="Home-latest-info">
            <img src={tradingIcon} alt="trading" className="Home-latest-info__icon" />
            <div className="Home-latest-info__content">
              <div className="Home-latest-info__title">
                <Trans>Total Trading Volume</Trans>
              </div>
              <div className="Home-latest-info__value">
                ${formatAmount(totalVolume, USD_DECIMALS, 0, true)}
              </div>
            </div>
          </div>
          <div className="Home-latest-info">
            <img src={totaluserIcon} alt="users" className="Home-latest-info__icon" />
            <div className="Home-latest-info__content">
              <div className="Home-latest-info__title">
                <Trans>Total Users</Trans>
              </div>
              <div className="Home-latest-info__value">{numberWithCommas(totalUsers.toString())}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="Home-benefits-section">
        <div className="Home-benefits default-container">
          <div className="Home-benefit">
            <div className="Home-benefit-icon">
              <img src={liquidityIcon} alt="liquidity" className="Home-benefit-icon-symbol" />
              <div className="Home-benefit-title">
                <Trans>Reduce Liquidation Risks</Trans>
              </div>
            </div>
            <div className="Home-benefit-description">
              <Trans>
                An aggregate of high-quality price feeds determine when liquidations occur. This keeps positions safe from
                temporary wicks.
              </Trans>
            </div>
          </div>
          <div className="Home-benefit">
            <div className="Home-benefit-icon">
              <img src={costIcon} alt="cost" className="Home-benefit-icon-symbol" />
              <div className="Home-benefit-title">
                <Trans>Save on Costs</Trans>
              </div>
            </div>
            <div className="Home-benefit-description">
              <Trans>
                Enter and exit positions with minimal spread and zero price impact. Get the optimal price without incurring
                additional costs.
              </Trans>
            </div>
          </div>
          <div className="Home-benefit">
            <div className="Home-benefit-icon">
              <img src={simpleSwapIcon} alt="simpleswap" className="Home-benefit-icon-symbol" />
              <div className="Home-benefit-title">
                <Trans>Simple Swaps</Trans>
              </div>
            </div>
            <div className="Home-benefit-description">
              <Trans>
                Open positions through a simple swap interface. Conveniently swap from any supported asset into the position
                of your choice.
              </Trans>
            </div>
          </div>
        </div>
      </div>
      <div className="Home-cta-section">
        <div className="Home-cta-container default-container">
          <div className="Home-cta-info">
            <div className="Home-cta-info__title">
              <Trans>Available on your preferred network</Trans>
            </div>
            <div className="Home-cta-info__description">
              <Trans>GMX is currently live on Arbitrum and Avalanche.</Trans>
            </div>
          </div>
          <div className="Home-cta-options">
            <div className="Home-cta-option Home-cta-option-arbitrum">
              <div className="Home-cta-option-icon">
                <img src={arbitrumIcon} alt="arbitrum" />
              </div>
              <div className="Home-cta-option-info">
                <div className="Home-cta-option-title">Arbitrum</div>
                <div className="Home-cta-option-action">
                  <HeaderLink
                    className="default-btn"
                    to="/trade"
                    redirectPopupTimestamp={0}
                    showRedirectModal={showRedirectModal}
                  >
                    <Trans>Launch App</Trans>
                  </HeaderLink>
                </div>
              </div>
            </div>
            <div className="Home-cta-option Home-cta-option-avalanche">
              <div className="Home-cta-option-icon">
                <img src={avaxIcon} alt="avalanche" />
              </div>
              <div className="Home-cta-option-info">
                <div className="Home-cta-option-title">Avalanche</div>
                <div className="Home-cta-option-action">
                  <HeaderLink
                    className="default-btn"
                    to="/trade"
                    redirectPopupTimestamp={0}
                    showRedirectModal={showRedirectModal}
                  >
                    <Trans>Launch App</Trans>
                  </HeaderLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer showRedirectModal={showRedirectModal} />
    </div>
  );
}
