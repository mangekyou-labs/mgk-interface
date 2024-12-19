import { t } from "@lingui/macro";
import { Trans } from "@lingui/macro";
import cx from "classnames";
import { ReactNode, useEffect, useMemo, useState, useCallback } from "react";
import { BiChevronDown } from "react-icons/bi";
import { getToken } from "config/tokens";
import type { InfoTokens, Token, TokenInfo } from "domain/tokens";
import { stripBlacklistedWords } from "domain/tokens/utils";
import dropDownIcon from "img/DROP_DOWN.svg";
import { bigMath } from "lib/bigmath";
import { expandDecimals, formatAmount } from "lib/numbers";
import { searchBy } from "lib/searchBy";

import SearchInput from "components/SearchInput/SearchInput";
import TokenIcon from "components/TokenIcon/TokenIcon";
import Modal from "../Modal/Modal";
import TooltipWithPortal from "../Tooltip/TooltipWithPortal";

import "./TokenSelector.scss";

type TokenState = {
  disabled?: boolean;
  message?: string;
};

type ExtendedToken = Token & {
  balance?: bigint;
  decimals: number;
};

export type TokenSelectorProps = {
  chainId: number;
  label?: string;
  className?: string;
  tokenAddress?: string;
  tokens: ExtendedToken[];
  infoTokens?: InfoTokens;
  showMintingCap?: boolean;
  mintingCap?: number;
  disabled?: boolean;
  selectedToken?: ExtendedToken;
  showTokenImgInDropdown?: boolean;
  showSymbolImage?: boolean;
  showTokenImgInModal?: boolean;
  showBalance?: boolean;
  showBalancePercentage?: boolean;
  showTokenName?: boolean;
  showTokenSymbol?: boolean;
  showPrice?: boolean;
  modalLabel?: string;
  modalTitle?: string;
  getTokenState?: (token: ExtendedToken) => TokenState;
  onSelectToken: (token: ExtendedToken) => void;
  renderToken?: (token: ExtendedToken) => ReactNode;
  renderCancel?: () => ReactNode;
  disableBodyScrollLock?: boolean;
  isSideMenu?: boolean;
  showCloseButton?: boolean;
  expandedTokens?: ExtendedToken[];
  zIndex?: number;
  isWarning?: boolean;
  hideBalances?: boolean;
  modalClassName?: string;
  modalBodyClassName?: string;
  onClose?: () => void;
};

export default function TokenSelector({
  chainId,
  label,
  className,
  tokenAddress,
  tokens,
  infoTokens,
  showMintingCap,
  mintingCap,
  disabled,
  selectedToken,
  showTokenImgInDropdown = true,
  showSymbolImage = false,
  showTokenImgInModal = true,
  showBalance = true,
  showBalancePercentage = false,
  showTokenName = true,
  showTokenSymbol = true,
  showPrice = true,
  modalLabel,
  modalTitle,
  getTokenState = () => ({ disabled: false }),
  onSelectToken,
  renderToken,
  renderCancel,
  disableBodyScrollLock,
  isSideMenu,
  showCloseButton = true,
  expandedTokens,
  zIndex = 1,
  isWarning,
  hideBalances,
  modalClassName,
  modalBodyClassName,
  onClose,
}: TokenSelectorProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentToken, setCurrentToken] = useState<ExtendedToken | undefined>(selectedToken);

  const visibleTokens = useMemo(() => {
    if (!searchKeyword) return tokens;
    const lowerSearchKeyword = searchKeyword.toLowerCase();
    return tokens.filter((item) => {
      return (
        item.symbol.toLowerCase().includes(lowerSearchKeyword) ||
        item.name.toLowerCase().includes(lowerSearchKeyword)
      );
    });
  }, [tokens, searchKeyword]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsModalVisible(true);
    }
  }, [disabled]);

  const handleTokenSelect = useCallback((token: ExtendedToken) => {
    onSelectToken(token);
    setCurrentToken(token);
    setIsModalVisible(false);
  }, [onSelectToken]);

  const handleModalClose = useCallback(() => {
    setIsModalVisible(false);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (tokenAddress && tokens.length) {
      const token = tokens.find((token) => token.address === tokenAddress);
      if (token && !currentToken) {
        setCurrentToken(token);
      }
    }
  }, [tokenAddress, tokens, currentToken]);

  const _handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && visibleTokens.length === 1) {
      handleTokenSelect(visibleTokens[0]);
    }
  }, [visibleTokens, handleTokenSelect]);

  const selectedTokenLabel = useMemo(() => {
    if (!currentToken) return;
    const token = getToken(chainId, currentToken.address);
    return token.symbol;
  }, [chainId, currentToken]);

  return (
    <div className={cx("TokenSelector", { disabled }, className)} onClick={(e) => e.stopPropagation()}>
      {label && <div className="TokenSelector-label">{label}</div>}
      <div
        className={cx("TokenSelector-box", { "TokenSelector-box-warning": isWarning })}
        onClick={handleClick}
      >
        {currentToken && (
          <>
            {showTokenImgInDropdown && (
              <TokenIcon
                className="TokenSelector-box-symbol"
                symbol={currentToken.symbol}
                displaySize={24}
                importSize={24}
              />
            )}
            {showSymbolImage && (
              <img src={currentToken.imageUrl} alt={currentToken.symbol} className="TokenSelector-box-image" />
            )}
          </>
        )}
        <div className="TokenSelector-box-info">
          <div className="TokenSelector-box-symbol-text">{selectedTokenLabel}</div>
        </div>
        <BiChevronDown className="TokenSelector-caret" />
      </div>
      <Modal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        label={modalLabel}
        headerContent={
          <div className="TokenSelector-modal-title">
            {modalTitle || t`Select Token`}
          </div>
        }
        className={modalClassName}
        contentClassName={modalBodyClassName}
        disableBodyScrollLock={disableBodyScrollLock}
        isSideMenu={isSideMenu}
        showCloseButton={showCloseButton}
        zIndex={zIndex}
        onClose={handleModalClose}
      >
        <div className="TokenSelector-modal-content" onClick={(e) => e.stopPropagation()}>
          <SearchInput
            className="TokenSelector-search"
            value={searchKeyword}
            onValueChange={(value: string) => setSearchKeyword(value)}
            onKeyDown={_handleKeyDown}
            placeholder={t`Search Token`}
            autoFocus
          />
          <div className="TokenSelector-token-list">
            {visibleTokens.map((token) => {
              const tokenState = getTokenState(token) || {};
              return (
                <div
                  key={token.address}
                  className={cx("TokenSelector-token-row", { disabled: tokenState.disabled })}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!tokenState.disabled) {
                      handleTokenSelect(token);
                    }
                  }}
                >
                  {showTokenImgInModal && (
                    <TokenIcon
                      className="TokenSelector-token-logo"
                      symbol={token.symbol}
                      displaySize={40}
                      importSize={40}
                    />
                  )}
                  <div className="TokenSelector-token-info">
                    <div className="TokenSelector-token-symbol">
                      {showTokenSymbol && token.symbol}
                      {showTokenName && (
                        <span className="TokenSelector-token-name">{token.name}</span>
                      )}
                    </div>
                    {showBalance && !hideBalances && token.balance !== undefined && (
                      <div className="TokenSelector-token-balance">
                        {formatAmount(token.balance, token.decimals, 4, true)}
                      </div>
                    )}
                  </div>
                  {tokenState.message && (
                    <div className="TokenSelector-token-message">{tokenState.message}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
