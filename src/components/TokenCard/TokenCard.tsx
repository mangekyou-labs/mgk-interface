import { Trans } from "@lingui/macro";
import { useCallback } from "react";
import { Link } from "react-router-dom";

import { ARBITRUM, AVALANCHE } from "config/chains";
import { getIcon } from "config/icons";
import { getIncentivesV2Url } from "config/links";
import { useChainId } from "lib/chains";
import { isHomeSite } from "lib/legacy";
import { formatAmount } from "lib/numbers";
import { switchNetwork } from "lib/wallets";
import useWallet from "lib/wallets/useWallet";

import BannerButton from "components/Banner/BannerButton";
import Button from "components/Button/Button";
import ExternalLink from "components/ExternalLink/ExternalLink";
import APRLabel from "../APRLabel/APRLabel";
import { HeaderLink } from "../Header/HeaderLink";

import "./TokenCard.scss";

type Props = {
  showRedirectModal?: (to: string) => void;
};

export default function TokenCard({ showRedirectModal }: Props) {
  const { chainId } = useChainId();
  const { active } = useWallet();

  const changeNetwork = useCallback(
    (network: number) => {
      if (network === chainId) return;
      if (!active) return;
      switchNetwork(network);
    },
    [chainId, active]
  );

  const redirectToV1 = useCallback(() => {
    if (showRedirectModal) {
      showRedirectModal("/trade");
    }
  }, [showRedirectModal]);

  return (
    <div className="TokenCard">
      <div className="TokenCard-content">
        <div className="TokenCard-title">
          <Trans>Trade on GMX V1</Trans>
        </div>
        <div className="TokenCard-description">
          <Trans>Trade with zero price impact and up to 50x leverage.</Trans>
        </div>
        <div className="TokenCard-buttons">
          {active && chainId === ARBITRUM && (
            <BannerButton
              className="TokenCard-button"
              onClick={redirectToV1}
              icon={getIcon(chainId, "network")}
            >
              <Trans>Trade on Arbitrum</Trans>
            </BannerButton>
          )}
          {active && chainId === AVALANCHE && (
            <BannerButton
              className="TokenCard-button"
              onClick={redirectToV1}
              icon={getIcon(chainId, "network")}
            >
              <Trans>Trade on Avalanche</Trans>
            </BannerButton>
          )}
          {active && chainId !== ARBITRUM && chainId !== AVALANCHE && (
            <>
              <BannerButton
                className="TokenCard-button"
                onClick={() => changeNetwork(ARBITRUM)}
                icon={getIcon(ARBITRUM, "network")}
              >
                <Trans>Trade on Arbitrum</Trans>
              </BannerButton>
              <BannerButton
                className="TokenCard-button"
                onClick={() => changeNetwork(AVALANCHE)}
                icon={getIcon(AVALANCHE, "network")}
              >
                <Trans>Trade on Avalanche</Trans>
              </BannerButton>
            </>
          )}
          {!active && (
            <HeaderLink
              className="TokenCard-button"
              to="/trade"
              redirectPopupTimestamp={0}
              showRedirectModal={showRedirectModal}
            >
              <Trans>Trade Now</Trans>
            </HeaderLink>
          )}
        </div>
      </div>
    </div>
  );
}
