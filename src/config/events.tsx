// date format: d MMM yyyy, H:mm, time should be specifed based on UTC time

import { Trans } from "@lingui/macro";
import { type JSX } from "react";
import { Link } from "react-router-dom";

import { ARBITRUM, AVALANCHE } from "./chains";
import { getNormalizedTokenSymbol } from "./tokens";

import ExternalLink from "components/ExternalLink/ExternalLink";
import { TokenSymbolWithIcon } from "components/TokenSymbolWithIcon/TokenSymbolWithIcon";

export type EventData = {
  id: string;
  title: string;
  isActive?: boolean;
  startDate?: string;
  endDate: string;
  bodyText: string | string[] | JSX.Element;
  chains?: number[];
  link?: {
    text: string;
    href: string;
    /**
     * @default false
     */
    newTab?: boolean;
  };
};

export const homeEventsData: EventData[] = [];

export const appEventsData: EventData[] = [
  {
    id: "trading-fees-reduction",
    title: "Trading fees are reduced",
    isActive: true,
    startDate: "28 Nov 2024, 00:00",
    endDate: "18 Dec 2024, 00:00",
    bodyText: (
      <>
        Open and close fees are reduced by 25% for <TokenSymbolWithIcon symbol="SOL" />
        /USD, <TokenSymbolWithIcon symbol="DOGE" />
        /USD, and <TokenSymbolWithIcon symbol="LINK" />
        /USD markets on Arbitrum.
        <br />
        <ExternalLink href="https://x.com/GMX_IO/status/1861743953537569043">Learn more</ExternalLink>.
      </>
    ),
  },
  {
    id: "auto-cancel",
    title: "TP/SL orders automatically cancelled with position closure",
    isActive: true,
    startDate: "01 Oct 2024, 00:00",
    endDate: "15 Nov 2024, 00:00",
    bodyText: (
      <>
        New Take-Profit and Stop-Loss orders will now be automatically cancelled when the associated position is fully
        closed. You can disable this feature in the settings.
        <br />
        <br />
        You can enable Auto-Cancel for your existing TP/SL orders by clicking{" "}
        <Link to="/trade?setOrdersAutoCancel=1">here</Link>.
      </>
    ),
  },
  {
    id: "max-leverage",
    title: "Max leverage increased",
    isActive: true,
    endDate: "14 Jun 2024, 0:00",
    bodyText: (
      <>
        Trade <TokenSymbolWithIcon symbol={getNormalizedTokenSymbol("DOGE")} />,{" "}
        <TokenSymbolWithIcon symbol={getNormalizedTokenSymbol("BNB")} />,{" "}
        <TokenSymbolWithIcon symbol={getNormalizedTokenSymbol("SOL")} />,{" "}
        <TokenSymbolWithIcon symbol={getNormalizedTokenSymbol("LTC")} />,{" "}
        <TokenSymbolWithIcon symbol={getNormalizedTokenSymbol("LINK")} />
        {" and "}
        <TokenSymbolWithIcon symbol={getNormalizedTokenSymbol("XRP")} /> with up to 100x leverage,
        <TokenSymbolWithIcon symbol={getNormalizedTokenSymbol("ARB")} /> with up to 75x leverage and{" "}
        <TokenSymbolWithIcon symbol={getNormalizedTokenSymbol("ATOM")} />,{" "}
        <TokenSymbolWithIcon symbol={getNormalizedTokenSymbol("AVAX")} />
        {" and "}
        <TokenSymbolWithIcon symbol={getNormalizedTokenSymbol("UNI")} /> with up to 60x on Arbitrum.
      </>
    ),
  },
];
