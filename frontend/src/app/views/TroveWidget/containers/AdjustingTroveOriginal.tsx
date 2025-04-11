import React, { useCallback, useEffect, useState, useRef } from "react";

import {
    Decimal,
    Percent,
    Difference
} from "@app/library/base/Decimal";

import {
    Trove,
} from "@app/library/nephrite";

import { NEPHRITE_LIQUIDATION_RESERVE } from "@app/constants";

import { useStableTroveChange } from "@app/hooks/useStableTroveChange";
import { useCurrentTransactionState } from "@app/library/transaction-react/useCurrentTransactionState";
import { useTroveView } from "@app/contexts/Trove/TroveViewContext";
import { useNephriteSelector } from '@app/hooks/useNephriteSelector';
import {
    selectForTroveChangeValidation,
    validateTroveChange
} from "@app/views/validators/validateTroveChange";
import { useSelector } from "react-redux";
import { selectUserTrove } from "@app/store/TroveStore/selector";
import { AdjustingTrove as AdjustingTroveComponent } from '../components/AdjustingTrove';
import { IsTransactionStatus } from "@app/library/transaction-react/IsTransactionStatus";

const selector = (state) => {
    const { appParams, fees, assetPrice } = state;
    return {
        appParams,
        fees,
        assetPrice,
        validationContext: selectForTroveChangeValidation(state)
    };
};

const TRANSACTION_ID = "trove modify";
const GAS_ROOM_ETH = Decimal.from(0.1);

const feeFrom = (original: Trove, edited: Trove, borrowingRate: Decimal): Decimal => {
    const change = original.whatChanged(edited, borrowingRate);

    if (change && change.type !== "invalidCreation" && change.params.borrowNephrite) {
        return change.params.borrowNephrite.mul(borrowingRate);
    } else {
        return Decimal.ZERO;
    }
};

const applyUnsavedCollateralChanges = (unsavedChanges: Difference, trove: Trove) => {
    if (unsavedChanges.absoluteValue) {
        if (unsavedChanges.positive) {
            return trove.collateral.add(unsavedChanges.absoluteValue);
        }
        if (unsavedChanges.negative) {
            if (unsavedChanges.absoluteValue.lt(trove.collateral)) {
                return trove.collateral.sub(unsavedChanges.absoluteValue);
            }
        }
        return trove.collateral;
    }
    return trove.collateral;
};

const applyUnsavedNetDebtChanges = (unsavedChanges: Difference, trove: Trove) => {
    if (unsavedChanges.absoluteValue) {
        if (unsavedChanges.positive) {
            return trove.netDebt.add(unsavedChanges.absoluteValue);
        }
        if (unsavedChanges.negative) {
            if (unsavedChanges.absoluteValue.lt(trove.netDebt)) {
                return trove.netDebt.sub(unsavedChanges.absoluteValue);
            }
        }
        return trove.netDebt;
    }
    return trove.netDebt;
};

export const AdjustingTrove: React.FC = () => {
    const { dispatchEvent } = useTroveView();

    const { appParams, fees, assetPrice, validationContext } = useNephriteSelector(selector);
    const trove = useSelector(selectUserTrove());

    const editingState = useState<string>();
    const previousTrove = useRef<Trove>(trove);

    const [collateral, setCollateral] = useState<Decimal>(trove.collateral);
    const [netDebt, setNetDebt] = useState<Decimal>(trove.netDebt);

    const transactionState = useCurrentTransactionState(TRANSACTION_ID);
    const [isTransactionPending, isTransactionFailed, isTransactionSuccess] = IsTransactionStatus({transactionIdPrefix: TRANSACTION_ID});

    const borrowingRate = Decimal.from(appParams.baserate)

    useEffect(() => {
        if (isTransactionSuccess) {
            dispatchEvent("TROVE_ADJUSTED");
        }
    }, [transactionState.type, dispatchEvent]);

    useEffect(() => {
        if (!previousTrove.current.collateral.eq(trove.collateral)) {
            const unsavedChanges = Difference.between(collateral, previousTrove.current.collateral);
            const nextCollateral = applyUnsavedCollateralChanges(unsavedChanges, trove);
            setCollateral(nextCollateral);
        }
        if (!previousTrove.current.netDebt.eq(trove.netDebt)) {
            const unsavedChanges = Difference.between(netDebt, previousTrove.current.netDebt);
            const nextNetDebt = applyUnsavedNetDebtChanges(unsavedChanges, trove);
            setNetDebt(nextNetDebt);
        }
        previousTrove.current = trove;
    }, [trove, collateral, netDebt]);

    const isDirty = !collateral.eq(trove.collateral) || !netDebt.eq(trove.netDebt);
    const isDebtIncrease = netDebt.gt(trove.netDebt);
    const debtIncreaseAmount = isDebtIncrease ? netDebt.sub(trove.netDebt) : Decimal.ZERO;

    const fee = isDebtIncrease
        ? feeFrom(trove, new Trove(trove.collateral, trove.debt.add(debtIncreaseAmount)), borrowingRate)
        : Decimal.ZERO;
    const totalDebt = netDebt.add(NEPHRITE_LIQUIDATION_RESERVE).add(fee);
    const maxBorrowingRate = borrowingRate.add(0.005);
    const updatedTrove = isDirty ? new Trove(collateral, totalDebt) : trove;
    const feePct = new Percent(borrowingRate);

    const collateralRatio =
        !collateral.isZero && !netDebt.isZero ? updatedTrove.collateralRatio(appParams.price) : undefined;
    const collateralRatioChange = Difference.between(collateralRatio, trove.collateralRatio(assetPrice));

    const [troveChange, description] = validateTroveChange(
        trove,
        updatedTrove,
        borrowingRate,
        validationContext
    );

    const stableTroveChange = useStableTroveChange(troveChange);

    if (trove.status !== "open") {
        return null;
    }

    const reset = useCallback(() => {
        setCollateral(trove.collateral);
        setNetDebt(trove.netDebt);
    }, [trove.collateral, trove.netDebt]);

    const handleCancelPressed = useCallback(() => {
        dispatchEvent("CANCEL_ADJUST_TROVE_PRESSED");
    }, [dispatchEvent]);

    return <AdjustingTroveComponent {
        ...{
            reset,
            isDirty,
            isTransactionPending,
            collateral,
            setCollateral,
            editingState,
            netDebt,
            setNetDebt,
            fee,
            feePct,
            maxBorrowingRate,
            totalDebt,
            collateralRatio,
            collateralRatioChange,
            description,
            handleCancelPressed,
            stableTroveChange,
            TRANSACTION_ID,
            trove
        }
    } />;
};
