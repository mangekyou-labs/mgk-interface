import { ARBITRUM, AVALANCHE } from "./chains";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getIsSyntheticsSupported() {
  return false;
}

export function getIsV1Supported(chainId: number) {
  return true;
}

export function getIsTestnetSupportEnabled() {
  return true;
}
