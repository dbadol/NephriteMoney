import React from "react";

import {
  Trove,
  TroveAdjustmentParams,
  TroveChange,
  TroveClosureParams,
  TroveCreationParams
} from "@app/library/nephrite";

import { Decimal, Percent } from "@app/library/base/Decimal"

import { COIN } from "@app/constants";

import { ActionDescription, Amount } from "@app/components/ActionDescription";
import { ErrorDescription } from "@app/components/ErrorDescription";
import {
  MINIMUM_COLLATERAL_RATIO,
  CRITICAL_COLLATERAL_RATIO,
  NEPHRITE_MINIMUM_DEBT,
  NEPHRITE_MINIMUM_NET_DEBT,
} from '@app/constants';
import { Box } from "theme-ui";
import { useSelector } from "react-redux";
import { selectIssueRate } from "@app/store/NephriteStore/selectors";

const mcrPercent = new Percent(MINIMUM_COLLATERAL_RATIO).toString(0);
const ccrPercent = new Percent(CRITICAL_COLLATERAL_RATIO).toString(0);

type TroveAdjustmentDescriptionParams = {
  params: TroveAdjustmentParams<Decimal>;
};

const TroveChangeDescription: React.FC<TroveAdjustmentDescriptionParams> = ({ params }) => {
  const issuanceFeeRate = useSelector(selectIssueRate());
  const issuanceFee = issuanceFeeRate.toString(4).split('%')[0];
  const borrowFee = params.borrowNephrite ? (Number(params.borrowNephrite.toString()) * Number(issuanceFee)) / 100 : 0;
  const borrowedReceived = params.borrowNephrite ? Number(params.borrowNephrite.toString()) - borrowFee : 0;

  const description = (
    params.depositCollateral && params.borrowNephrite ? null  : params.repayNephrite && params.withdrawCollateral ? null
             : params.depositCollateral && params.repayNephrite ? (
          <>
            You will deposit <Amount>{params.depositCollateral.toString()} BEAM</Amount> and pay{" "}
            <Amount>
              {params.repayNephrite.toString()} {COIN}
            </Amount>
          </>
        ) : params.borrowNephrite && params.withdrawCollateral ? (
          <>
            You will receive <Amount>{params.withdrawCollateral.toString()} BEAM</Amount> and{" "}
            <Amount>
              {params.borrowNephrite.toString()} {COIN}
            </Amount>
          </>
        ) : params.withdrawCollateral ? (
          <>
            You will receive <Amount>{params.withdrawCollateral.toString()} BEAM</Amount>
          </>
        ) : params.borrowNephrite ? (
          <>
            You will receive{" "}
            <Amount>
              {borrowedReceived} {COIN}
            </Amount>
          </>
        ) : null);



  return (
    description ?
      <ActionDescription>
        {description}
      </ActionDescription> :
      <></>
  );
};
export const selectForTroveChangeValidation = ({
  assetPrice,
  total,
  numberOfTroves
}) => ({ assetPrice, total, numberOfTroves });

export type TroveChangeValidationSelectedState = ReturnType<typeof selectForTroveChangeValidation>;

interface TroveChangeValidationContext extends TroveChangeValidationSelectedState {
  originalTrove: Trove;
  resultingTrove: Trove;
  recoveryMode: boolean;
  wouldTriggerRecoveryMode: boolean;
}

export const validateTroveChange = (
  originalTrove: Trove,
  adjustedTrove: Trove,
  borrowingRate: Decimal,
  selectedState: TroveChangeValidationSelectedState,
  viewAction?: string
): [
    validChange: Exclude<TroveChange<Decimal>, { type: "invalidCreation" }> | undefined,
    description: JSX.Element | undefined,
  ] => {

  const { total, assetPrice } = selectedState;

  const change = originalTrove.whatChanged(
    adjustedTrove, borrowingRate
  );

  if (!change) {
    return [undefined, undefined];
  }

  const resultingTrove = originalTrove.apply(change, borrowingRate);

  const fakeTotal = total instanceof Trove ? total : new Trove(Decimal.ZERO, Decimal.ZERO);

  const recoveryMode = fakeTotal.collateralRatioIsBelowCritical(assetPrice);
  const wouldTriggerRecoveryMode = fakeTotal
    .subtract(originalTrove)
    .add(resultingTrove)
    .collateralRatioIsBelowCritical(assetPrice);

  const context: TroveChangeValidationContext = {
    ...selectedState,
    originalTrove,
    resultingTrove,
    recoveryMode,
    wouldTriggerRecoveryMode
  };

  if (change.type === "invalidCreation") {
    return [
      undefined,
      <ErrorDescription>
        Total debt must be at least{" "}
        <Amount>
          {NEPHRITE_MINIMUM_DEBT.toString()} {COIN}
        </Amount>
        (including 1 NPH issuance fee)
      </ErrorDescription>
    ];
  }

  const errorDescription =
    change.type === "creation"
      ? validateTroveCreation(change.params, context)
      : change.type === "closure"
        ? validateTroveClosure(change.params, context)
        : validateTroveAdjustment(change.params, context);

  if (errorDescription) {
    return [undefined, errorDescription];
  }

  return [change, <TroveChangeDescription params={change.params} />];
};

const validateTroveCreation = (
  { depositCollateral, borrowNephrite }: TroveCreationParams<Decimal>,
  {
    resultingTrove,
    recoveryMode,
    wouldTriggerRecoveryMode,
    assetPrice
  }: TroveChangeValidationContext
): JSX.Element | null => {
  if (borrowNephrite.lt(NEPHRITE_MINIMUM_NET_DEBT)) {
    return (
      <Box sx={{ mt: 1 }}>
        <ActionDescription fontStyle={'italic'} bgColor={'rgba(198, 62, 62, 0.3)'}>
          You must issue at least{" "}
          <Amount>
            {NEPHRITE_MINIMUM_NET_DEBT.toString()} {COIN}
          </Amount>
        </ActionDescription>
      </Box>
    );
  }

  if (recoveryMode) {
    if (!resultingTrove.isOpenableInRecoveryMode(assetPrice)) {
      return (
        <ErrorDescription>
          You're not allowed to open a Trove with less than <Amount>{ccrPercent}</Amount> Collateral
          Ratio during recovery mode. Please increase your Trove's Collateral Ratio.
        </ErrorDescription>
      );
    }
  } else {
    if (resultingTrove.collateralRatioIsBelowMinimum(assetPrice)) {
      return (
        <ErrorDescription fontStyle='italic'>
          ICR should be more than <Amount>{mcrPercent}</Amount>.
        </ErrorDescription>
      );
    }

    if (wouldTriggerRecoveryMode) {
      return (
        <ErrorDescription>
          You're not allowed to open a Trove that would cause the Total Collateral Ratio to fall
          below <Amount>{ccrPercent}</Amount>. Please increase your Trove's Collateral Ratio.
        </ErrorDescription>
      );
    }
  }

  return null;
};

const validateTroveAdjustment = (
  { depositCollateral, withdrawCollateral, borrowNephrite, repayNephrite }: TroveAdjustmentParams<Decimal>,
  {
    originalTrove,
    resultingTrove,
    recoveryMode,
    wouldTriggerRecoveryMode,
    assetPrice,
  }: TroveChangeValidationContext
): JSX.Element | null => {
  if (recoveryMode) {
    if (withdrawCollateral) {
      return (
        <ErrorDescription>
          You're not allowed to withdraw collateral during recovery mode.
        </ErrorDescription>
      );
    }

    if (borrowNephrite) {
      if (resultingTrove.collateralRatioIsBelowCritical(assetPrice)) {
        return (
          <ErrorDescription>
            Your ICR should be more than <Amount>{ccrPercent}</Amount>
          </ErrorDescription>
        );
      }

      if (resultingTrove.collateralRatio(assetPrice).lt(originalTrove.collateralRatio(assetPrice))) {
        return (
          <ErrorDescription>
            You're not allowed to decrease your collateral ratio during recovery mode.
          </ErrorDescription>
        );
      }
    }
  } else {
    if (resultingTrove.collateralRatioIsBelowMinimum(assetPrice)) {
      return (
        <ErrorDescription>
          ICR should be more than <Amount>{mcrPercent}</Amount>.
        </ErrorDescription>
      );
    }

    if (wouldTriggerRecoveryMode) {
      return (
        <ErrorDescription>
          The adjustment you're trying to make would cause the Total Collateral Ratio to fall below{" "}
          <Amount>{ccrPercent}</Amount>. Please increase your Trove's Collateral Ratio.
        </ErrorDescription>
      );
    }
  }

  if (repayNephrite) {
    if (resultingTrove.debt.lt(NEPHRITE_MINIMUM_DEBT)) {
      return (
        <ErrorDescription>
          Total debt must be at least{" "}
          <Amount>
            {NEPHRITE_MINIMUM_DEBT.toString()} {COIN}
          </Amount>
          .
        </ErrorDescription>
      );
    }
  }

  return null;
};

const validateTroveClosure = (
  { repayNephrite }: TroveClosureParams<Decimal>,
  {
    recoveryMode,
    wouldTriggerRecoveryMode,
    numberOfTroves,
  }: TroveChangeValidationContext
): JSX.Element | null => {
  if (numberOfTroves === 1) {
    return (
      <ErrorDescription>
        You're not allowed to close your Trove when there are no other Troves in the system.
      </ErrorDescription>
    );
  }

  return null;
};
