import { Trans, t } from "@lingui/macro";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useChainId } from "lib/chains";
import { approveTokens } from "domain/tokens";
import { useLocalStorageSerializeKey } from "lib/localStorage";
import { helperToast } from "lib/helperToast";
import { getPageTitle } from "lib/legacy";

import Button from "components/Button/Button";
import Checkbox from "components/Checkbox/Checkbox";
import Footer from "components/Footer/Footer";
import Modal from "components/Modal/Modal";
import PageTitle from "components/PageTitle/PageTitle";
import SEO from "components/Common/SEO";

import "./BeginAccountTransfer.scss";

export default function BeginAccountTransfer() {
  const { chainId } = useChainId();
  const history = useHistory();
  const [isTransferring, setIsTransferring] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isTransferSubmitted, setIsTransferSubmitted] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [shouldDisableValidation, setShouldDisableValidation] = useLocalStorageSerializeKey(
    "begin-transfer-disable-validation",
    false
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  async function transfer() {
    setIsTransferring(true);
    try {
      // V1 doesn't support account transfers
      helperToast.error(t`Account transfers are not supported in V1`);
    } catch (e) {
      console.error(e);
      helperToast.error(t`Transfer failed`);
    }
    setIsTransferring(false);
  }

  function onConfirmationClick() {
    setIsConfirmationModalVisible(false);
    transfer();
  }

  function renderConfirmationModal() {
    return (
      <Modal
        isVisible={isConfirmationModalVisible}
        setIsVisible={setIsConfirmationModalVisible}
        label={t`Confirm Transfer`}
      >
        <div>
          <Trans>
            You need to be very careful with transferring accounts. If the recipient is not configured correctly, you may
            permanently lose access to your account.
          </Trans>
        </div>
        <div>
          <Trans>Are you sure you want to begin the account transfer process?</Trans>
        </div>
        <Button variant="primary-action" className="w-full mt-4" onClick={onConfirmationClick}>
          <Trans>Begin Transfer</Trans>
        </Button>
      </Modal>
    );
  }

  return (
    <SEO title={getPageTitle("Transfer Account")}>
      <div className="default-container page-layout">
        <div className="section-title-block">
          <PageTitle title={t`Transfer Account`} />
        </div>
        <div className="BeginAccountTransfer-content">
          <div className="BeginAccountTransfer-warning">
            <Trans>Account transfers are not supported in V1</Trans>
          </div>
          <div className="BeginAccountTransfer-buttons">
            <Button variant="primary-action" className="w-full" onClick={() => history.push("/")}>
              <Trans>Back to Home</Trans>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
