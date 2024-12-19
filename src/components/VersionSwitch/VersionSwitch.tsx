import cx from "classnames";
import "./VersionSwitch.scss";
import { useChainId } from "lib/chains";
import { getIsV1Supported } from "config/features";
import { useTradePageVersion } from "lib/useTradePageVersion";

type Props = {
  className?: string;
};

export function VersionSwitch({ className }: Props) {
  const { chainId } = useChainId();
  const [currentVersion, setCurrentVersion] = useTradePageVersion();

  return (
    <div className={cx("VersionSwitch text-body-medium", className)}>
      {getIsV1Supported(chainId) && (
        <div
          className={cx("VersionSwitch-option v1", { active: currentVersion === 1 })}
          onClick={() => setCurrentVersion(1)}
        >
          V1
        </div>
      )}
    </div>
  );
}
