import React from "react";
import { ReadOnlyRedemption } from "@app/views/RedemptionWidget/containers/ReadOnlyRedemption";
import { Redemption } from "@app/views/RedemptionWidget/containers/Redemption";
import { useRedemptionView } from "@app/contexts/Redemption/RedemptionViewContext";

export const RedemptionWidget: React.FC<any> = props => {
    const { view } = props.view ? props : useRedemptionView();

    switch (view) {
        case "NONE": {
            return <ReadOnlyRedemption { ...props } />;
        }
        case "ADJUSTING": {
            return <Redemption {...props} />;
        }
    }
}
