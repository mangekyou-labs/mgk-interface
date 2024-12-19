import React from "react";
import { TradeHistory } from "components/Legacy/TradeHistory/TradeHistory";
import "./Actions.scss";

export default function Actions() {
    return (
        <div className="Actions-section">
            <TradeHistory shouldShowPaginationButtons />
        </div>
    );
} 