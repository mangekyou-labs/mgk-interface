export type TradeSearchParams = {
  market?: string;
  collateralToken?: string;
  indexToken?: string;
  isLong?: boolean;
  mode?: string;
};

export default function useV1TradeParamsProcessor() {
  return {
    params: {},
    updateParams: () => { },
  };
}
