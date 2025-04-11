import React from "react";
import {
    Decimal,
} from "@app/library/base/Decimal";

import {
    StabilityDeposit,
    StabilityDepositChange
} from "@app/library/nephrite";

import { ErrorDescription } from "@app/components/ErrorDescription";

export const selectForStabilityDepositChangeValidation = ({
    total,
    assetPrice
}) => ({
    total,
    assetPrice
});

type StabilityDepositChangeValidationContext = ReturnType<
    typeof selectForStabilityDepositChangeValidation
>;

export const validateStabilityDepositChange = (
    originalDeposit: StabilityDeposit,
    editedNephrite: Decimal,
    {
        total,
        assetPrice
    }: StabilityDepositChangeValidationContext,
    viewAction: "withdrawing" | "depositing"
): [
        validChange: StabilityDepositChange<Decimal> | undefined,
        description: JSX.Element | undefined,
        isValid?: boolean
    ] => {
    const change = originalDeposit.whatChanged(editedNephrite, viewAction);

    if (!change) {
        return [undefined, undefined, false];
    }

    if (change.withdrawNephrite && total.collateralRatioIsBelowCritical(assetPrice)) {
        return [
            undefined,
            <ErrorDescription>
                You're not allowed to withdraw Nephrite from your Stability Deposit when there are
                undercollateralized Troves. Please liquidate those Troves or try again later.
            </ErrorDescription>,
            false
        ];
    }
    return [change, null, true];
};
