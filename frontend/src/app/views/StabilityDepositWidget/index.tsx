import React, { useEffect } from "react";
import { StabilityDepositManager } from "./containers/StabilityDepositManager";
import { ReadOnlyDeposit } from "./containers/ReadOnlyDeposit";
import { NoDeposit } from "./containers/NoDeposit";
import { useStabilityView } from "@app/contexts/StabilityDeposit/StabilityViewContext";
import { AdjustStabilityPool } from "./containers/AdjustStabilityPool";
import { WithdrawFromStabilityPool } from "./containers/WithdrawFromStabilityPool";
import { ShaderTransactionComments } from "@app/library/nephrite/types";
import { DepositToStabilityPool } from "./containers/DepositToStabilityPool";
import { useSelector } from "react-redux";
import { selectForStabilityDepositManager } from "@app/store/StabilityDepositStore/selectors";
import { Decimal } from "@app/library/base/Decimal";
import { useCurrentTransactionState } from "@app/library/transaction-react/useCurrentTransactionState";
import { IsTransactionStatus } from "@app/library/transaction-react/IsTransactionStatus";


export const StabilityDepositWidget: React.FC = props => {
  const { view, dispatchEvent } = useStabilityView();
  const { originalDeposit } = useSelector(selectForStabilityDepositManager());

  const myTransactionState = useCurrentTransactionState(new RegExp(`${ShaderTransactionComments.setUpdateStabilityPool}`, "g"));
  const [isTransactionPending, isTransactionFailed, isTransactionSuccess] = IsTransactionStatus({ transactionIdPrefix: ShaderTransactionComments.setUpdateStabilityPool });

  useEffect(() => {
    if (isTransactionSuccess) {
      dispatchEvent(!originalDeposit.currentNephrite.isZero ? "DEPOSIT_CONFIRMED" : "DEPOSIT_FULLY_WITHDRAWN");
    }
  }, [myTransactionState.type, isTransactionPending]);

  switch (view) {
    case "NONE": {
      return <NoDeposit {...props} />;
    }
    case "OPENING": {
      return <StabilityDepositManager {
        ...{
          ...props,
          ...{
            TRANSACTION_ID: `${ShaderTransactionComments.setUpdateStabilityPool}: open`,
            maxAmountRequired: false,
            fromEditedDeposit: originalDeposit.currentNephrite,
            view: view.toLowerCase(),
            title: "DEPOSIT TO Stability Pool"
          }
        }
      } />;
    }
    case "ACTIVE": {
      return <ReadOnlyDeposit {...props} />;
    }
    case "ADJUSTING": {
      return <AdjustStabilityPool {...{
        ...props,
        title: "ADJUST STABILITY POOL"
      }} />;
    }
    case "WITHDRAWING": {
      return <WithdrawFromStabilityPool {
        ...{
          ...props,
          ...{
            TRANSACTION_ID: `${ShaderTransactionComments.setUpdateStabilityPool}: withdraw`,
            maxAmountRequired: true,
            fromEditedDeposit: Decimal.ZERO,
            view: view.toLowerCase(),
            title: "WITHDRAW FROM STABILITY POOL"
          }
        }
      } />;
    }
    case "DEPOSITING": {
      return <DepositToStabilityPool {
        ...{
          ...props,
          ...{
            TRANSACTION_ID: `${ShaderTransactionComments.setUpdateStabilityPool}: deposit`,
            maxAmountRequired: false,
            fromEditedDeposit: Decimal.ZERO,
            view: view.toLowerCase(),
            title: "DEPOSIT TO STABILITY POOL"
          }
        }
      } />;
    }
  }
};
