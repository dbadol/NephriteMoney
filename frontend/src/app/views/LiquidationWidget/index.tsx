import React from "react";
import { ReadOnlyLiquidation } from "@app/views/LiquidationWidget/containers/ReadOnlyLiquidation";
import { Liquidation } from "@app/views/LiquidationWidget/containers/Liquidation";
import { useLiquidationView } from "@app/contexts/Liquidation/LiquidationViewContext";

export const LiquidationWidget: React.FC<any> = props => {
    const { view } = props.view ? props : useLiquidationView();

    switch (view) {
        case "NONE": {
            return <ReadOnlyLiquidation { ...props } />;
        }
        case "ADJUSTING": {
            return <Liquidation {...props} />;
        }
    }
}
