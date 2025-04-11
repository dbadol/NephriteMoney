import React, { useMemo } from "react";

import { StabilityDeposit, StabilityDepositChange } from "@app/library/nephrite";
import { Decimal } from "@app/library/base/Decimal";
import { COIN, GT } from "@app/constants";
import { ActionDescription, Amount } from "@app/components/ActionDescription";

type StabilityActionDescriptionProps = {
  originalDeposit: StabilityDeposit;
  change: StabilityDepositChange<Decimal>;
};

export const StabilityActionDescription: React.FC<StabilityActionDescriptionProps> = ({
  originalDeposit,
  change
}) => {
  const collateralGain = originalDeposit.collateralGain.nonZero?.prettify(4).concat(" Beam");
  const beamXReward = originalDeposit.beamXReward.nonZero?.prettify().concat(" ", GT);

  const actionDescriptionOutput = useMemo(() => {

    if (change.depositNephrite) {
      return (
        <>
          You are depositing{" "}
          <Amount>
            {change.depositNephrite.prettify()} {COIN}
          </Amount>{" "}
          in the Stability Pool
        </>
      )
    }

    if (change.withdrawNephrite) {
      return (
        <>
          You are withdrawing{" "}
          <Amount>
            {change.withdrawNephrite.prettify()} {COIN}
          </Amount>{" "}
          to your wallet
        </>
      )
    }
  }, [change])
  return (
    <ActionDescription>
      {actionDescriptionOutput}

      {(collateralGain || beamXReward) && (
        <>
          {" "}
          and claiming at least{" "}
          {collateralGain && beamXReward ? (
            <>
              <Amount>{collateralGain}</Amount> and <Amount>{beamXReward}</Amount>
            </>
          ) : (
            <Amount>{collateralGain ?? beamXReward}</Amount>
          )}
        </>
      )}
      .
    </ActionDescription>
  );
};
