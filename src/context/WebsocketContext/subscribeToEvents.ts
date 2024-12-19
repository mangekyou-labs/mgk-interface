import { Contract, Provider } from "ethers";

const vaultEvents = {
  UpdatePosition: "onUpdatePosition",
  ClosePosition: "onClosePosition",
  IncreasePosition: "onIncreasePosition",
  DecreasePosition: "onDecreasePosition",
} as const;

const positionRouterEvents = {
  CancelIncreasePosition: "onCancelIncreasePosition",
  CancelDecreasePosition: "onCancelDecreasePosition",
} as const;

export function subscribeToV1Events(
  wsVault: Contract,
  wsPositionRouter: Contract | null,
  callExchangeRef: (method: any, ...args: any[]) => void
) {
  const unsubs: (() => void)[] = [];

  Object.keys(vaultEvents).forEach((eventName) => {
    const handlerName = vaultEvents[eventName];
    const handler = (...args) => callExchangeRef(handlerName, ...args);
    wsVault.on(eventName, handler);
    unsubs.push(() => wsVault.off(eventName, handler));
  });

  if (wsPositionRouter) {
    Object.keys(positionRouterEvents).forEach((eventName) => {
      const handlerName = positionRouterEvents[eventName];
      const handler = (...args) => callExchangeRef(handlerName, ...args);
      wsPositionRouter.on(eventName, handler);
      unsubs.push(() => wsPositionRouter.off(eventName, handler));
    });
  }

  return () => {
    unsubs.forEach((unsub) => unsub());
  };
}

export function getTotalSubscribersEventsCount(chainId: number, provider: Provider, { v1 }: { v1: boolean }) {
  const v1Count = v1 ? Object.keys(vaultEvents).length + Object.keys(positionRouterEvents).length : 0;
  return v1Count;
}

// Stub exports for V2 functionality to prevent import errors
export const subscribeToApprovalEvents = () => () => { };
export const subscribeToTransferEvents = () => () => { };
export const subscribeToV2Events = () => () => { };
