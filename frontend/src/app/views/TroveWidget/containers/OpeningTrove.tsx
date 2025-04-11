import React, { useCallback, useEffect, useState } from 'react';
import { Decimal, Percent } from '@app/library/base/Decimal';

import { Trove } from '@app/library/nephrite';

import { useNephriteSelector } from '@app/hooks/useNephriteSelector';
import { useStableTroveChange } from '@app/hooks/useStableTroveChange';
import { useTroveView } from '@app/contexts/Trove/TroveViewContext';

import {
  validateTroveChange,
} from '@app/views/validators/validateTroveChange';
import { OpeningTrove as OpeningTroveComponent } from '../components/OpeningTrove';
import {
  COIN,
  NEPHRITE_LIQUIDATION_RESERVE,
  NEPHRITE_MINIMUM_NET_DEBT,
} from '@app/constants';
import { useCurrentTransactionState } from '@app/library/transaction-react/useCurrentTransactionState';
import { IsTransactionPending } from '@app/library/transaction-react/IsTransactionStatus';
import { ShaderTransactionComments } from '@app/library/nephrite/types';
import { useTitle } from '@app/contexts/Nephrite/TitleContext';
import useCalculateTroveFee from '@app/hooks/useCalculateTroveFee';
import {fromGroths} from "@library/base/appUtils";

const selectForTroveChangeValidation = ({
  assetPrice,
  total,
  numberOfTroves,
}) => ({ assetPrice, total, numberOfTroves });

const selector = (state ) => {
  const { appParams, fees, assetPrice /* , accountBalance */ } = state;
  return {
    fees,
    assetPrice,
    appParams,
    nephritePrice: appParams.price,
    validationContext: selectForTroveChangeValidation(state),
  };
};

const EMPTY_TROVE = new Trove(Decimal.ZERO, Decimal.ZERO);
const TRANSACTION_ID = `${ShaderTransactionComments.setTroveModify}: open`;

export const OpeningTrove: React.FC = () => {
  const { setCurrentTitle } = useTitle();

  const { dispatchEvent } = useTroveView();
  const {
    appParams,
    fees,
    assetPrice,
    nephritePrice,
    validationContext,
  } = useNephriteSelector(selector);

  const borrowingRate = Decimal.from(0 /* appParams.baserate */);
  const editingState = useState<string>();

  const [collateral, setCollateral] = useState<Decimal>(Decimal.ZERO);
  const [minCollateral, setMinCollateral] = useState<Decimal>(Decimal.ZERO);
  const [borrowAmount, setBorrowAmount] = useState<Decimal>(Decimal.from(90));
  const [issuanceFee, setIssuanceFee] = useState<Decimal>(Decimal.ZERO);
  const [redemptionFeePerc, setIssuanceFeePerc] = useState<string>(Decimal.ZERO + '%');
  const maxBorrowingRate = borrowingRate.add(0);

  const fee = borrowAmount.mul(borrowingRate);
  const feePct = new Percent(borrowingRate);
  const totalDebt = borrowAmount.add(NEPHRITE_LIQUIDATION_RESERVE).add(fee);
  const isDirty = !collateral.isZero || !borrowAmount.isZero;
  const trove = isDirty ? new Trove(collateral, totalDebt) : EMPTY_TROVE;
  const collateralRatio =
    !collateral.isZero && !borrowAmount.isZero
      ? trove.collateralRatio(nephritePrice)
      : undefined;

  const [troveChange, description] = validateTroveChange(
    EMPTY_TROVE,
    trove,
    borrowingRate,
    validationContext,
  );


  const stableTroveChange = useStableTroveChange(troveChange);

  const isTransactionPending = IsTransactionPending({
    transactionIdPrefix: ShaderTransactionComments.setTroveModify,
  });

  const handleCancelPressed = useCallback(() => {
    setCollateral(Decimal.ZERO);
    setBorrowAmount(Decimal.ZERO);
  }, [dispatchEvent]);

  useEffect(() => {
    setCurrentTitle('OPEN TROVE');
  }, []);

  useEffect(() => {
    (async () => {
      const {fee, fee_perc, amounts} = await useCalculateTroveFee(trove);
      setIssuanceFee(Decimal.from(fromGroths(fee)));
      setIssuanceFeePerc(Decimal.from(fee_perc) + "%")
      setCollateral((Decimal.from(fromGroths(amounts.col).toFixed(0))));
      setMinCollateral((Decimal.from(fromGroths(amounts.col).toFixed(0))))
    })();

    return () => {};
  }, []);

  useEffect(() => {
    (async () => {
      const {fee, fee_perc} = await useCalculateTroveFee(trove);
      setIssuanceFee(Decimal.from(fromGroths(fee)));
      setIssuanceFeePerc(Decimal.from(fee_perc) + "%")
      })();

    return () => {};
  }, [collateral, borrowAmount]);

  useEffect(() => {
    if (!collateral.isZero && borrowAmount.isZero) {
      setBorrowAmount(NEPHRITE_MINIMUM_NET_DEBT);
    }
  }, [collateral, borrowAmount]);

  return (
    <OpeningTroveComponent
      {...{
        isDirty,
        isTransactionPending,
        collateral,
        editingState,
        setCollateral,
        borrowAmount,
        setBorrowAmount,
        fee,
        issuanceFee,
        feePct,
        totalDebt,
        collateralRatio,
        description,
        handleCancelPressed,
        stableTroveChange,
        maxBorrowingRate,
        TRANSACTION_ID,
        redemptionFeePerc,
        minCollateral
      }}
    />
  );
};
