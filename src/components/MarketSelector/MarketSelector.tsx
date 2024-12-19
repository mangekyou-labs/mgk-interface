import { Trans } from "@lingui/macro";
import cx from "classnames";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { BiChevronDown } from "react-icons/bi";

import { getCategoryTokenAddresses } from "config/tokens";
import { stripBlacklistedWords } from "domain/tokens/utils";
import { importImage } from "lib/legacy";
import { formatTokenAmount, formatUsd } from "lib/numbers";
import { getByKey } from "lib/objects";
import { searchBy } from "lib/searchBy";

import FavoriteStar from "components/FavoriteStar/FavoriteStar";
import { FavoriteTabs } from "components/FavoriteTabs/FavoriteTabs";
import SearchInput from "components/SearchInput/SearchInput";
import { ButtonRowScrollFadeContainer } from "components/TableScrollFade/TableScrollFade";

import Modal from "../Modal/Modal";

import "./MarketSelector.scss";

type Props = {
  label?: string;
  className?: string;
  selectedToken?: string;
  onSelectToken: (token: string) => void;
  tokens: string[];
  showBalances?: boolean;
  showFavorites?: boolean;
  showSearch?: boolean;
  modalLabel?: string;
  renderToken?: (token: string) => ReactNode;
};

export default function MarketSelector({
  label,
  className,
  selectedToken,
  onSelectToken,
  tokens,
  showBalances = true,
  showFavorites = true,
  showSearch = true,
  modalLabel,
  renderToken,
}: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredTokens = useMemo(() => {
    if (!searchKeyword) return tokens;
    const searchStr = searchKeyword.toLowerCase();
    return tokens.filter((token) => token.toLowerCase().includes(searchStr));
  }, [tokens, searchKeyword]);

  const onSelect = useCallback(
    (token: string) => {
      onSelectToken(token);
      setIsModalVisible(false);
    },
    [onSelectToken]
  );

  return (
    <div className={cx("MarketSelector", className)}>
      {label && <div className="MarketSelector-label">{label}</div>}
      <div className="MarketSelector-box" onClick={() => setIsModalVisible(true)}>
        {selectedToken ? (
          <div className="MarketSelector-token">
            {renderToken ? renderToken(selectedToken) : selectedToken}
          </div>
        ) : (
          <div className="MarketSelector-placeholder">Select Market</div>
        )}
        <BiChevronDown className="MarketSelector-caret" />
      </div>

      <Modal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
        label={modalLabel || "Select Market"}
        position="center"
      >
        <div className="MarketSelector-modal-content">
          {showSearch && (
            <div className="MarketSelector-search">
              <SearchInput
                value={searchKeyword}
                setValue={setSearchKeyword}
                placeholder="Search Markets"
              />
            </div>
          )}
          <div className="MarketSelector-tokens">
            {filteredTokens.map((token) => (
              <div
                key={token}
                className="MarketSelector-token-row"
                onClick={() => onSelect(token)}
              >
                {renderToken ? renderToken(token) : token}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
