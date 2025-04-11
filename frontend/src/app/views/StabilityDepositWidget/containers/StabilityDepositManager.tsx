import React, { useCallback, useEffect, useState } from "react";
import { Box, Flex } from "theme-ui";
import { Decimal, Decimalish } from "@app/library/base/Decimal";


import { StabilityDepositEditor } from './StabilityDepositEditor';
import { StabilityDepositAction } from "@app/views/Actions/StabilityDepositAction";
import { useStabilityView } from "@app/contexts/StabilityDeposit/StabilityViewContext";
import { useNephriteSelector } from '@app/hooks/useNephriteSelector';
import {
  selectForStabilityDepositChangeValidation,
  validateStabilityDepositChange
} from "@app/views/validators/validateStabilityDepositChange";
import { selectForStabilityDepositManager } from "@app/store/StabilityDepositStore/selectors";
import { useSelector } from 'react-redux';
import store from "index";
import { actions } from "@app/store/StabilityDepositStore";
import { IsTransactionStatus } from "@app/library/transaction-react/IsTransactionStatus";
import { useCurrentTransactionState } from "@app/library/transaction-react/useCurrentTransactionState";
import { ShaderTransactionComments } from "@app/library/nephrite/types";
import Button from "@app/components/Button";
import { PageTitle } from "@app/components/PageTitle/PageTitle";
import { loadUserView } from "@app/store/NephriteStore/actions";
import { useTitle } from "@app/contexts/Nephrite/TitleContext";

const init = ({ stabilityDeposit }) => ({
  originalDeposit: stabilityDeposit,
  editedNephrite: stabilityDeposit.currentNephrite,
  changePending: false
});

type StabilityDepositManagerAction =
  | { type: "updateStore"; newState: any; oldState: any; stateChange: any; }
  | { type: "updateStore"; }
  | { type: "startChange" | "finishChange" | "revert" }
  | { type: "setDeposit"; newValue: Decimalish };


export const StabilityDepositManager: React.FC<any> = ({
  TRANSACTION_ID,
  maxAmountRequired,
  fromEditedDeposit,
  view,
  title
}) => {
  const { setCurrentTitle } = useTitle();

  const { originalDeposit } = useSelector(selectForStabilityDepositManager());

  const [editedDeposit, _setEditedDeposit] = useState<Decimal>(fromEditedDeposit);
  const [changePending, setChangePending] = useState<boolean>(false);
  const [editingState, setEditingState] = useState<string>();

  const setEditedDeposit = (value) => {
    value = value.lte(Decimal.ZERO) ? Decimal.ZERO : value;

    if (originalDeposit.currentNephrite.eq(Decimal.ZERO)) {
      return _setEditedDeposit(value);
    }

    return _setEditedDeposit(
      originalDeposit.currentNephrite.lte(value) && view === "withdrawing" ? originalDeposit.currentNephrite : value
    );
  }

  const validationContext = useNephriteSelector(selectForStabilityDepositChangeValidation);
  const { dispatchEvent } = useStabilityView();

  const handleCancel = useCallback(() => {
    setChangePending(false), setEditedDeposit(Decimal.ZERO), setEditingState('');
  }, [dispatchEvent]);

  const [validChange, description, isValid] = validateStabilityDepositChange(
    originalDeposit,
    editedDeposit,
    validationContext,
    view
  );
  const myTransactionState = useCurrentTransactionState(new RegExp(`${ShaderTransactionComments.setUpdateStabilityPool}`, "g"));
  const [isTransactionPending, isTransactionFailed, isTransactionSuccess] = IsTransactionStatus({ transactionIdPrefix: ShaderTransactionComments.setUpdateStabilityPool });

  useEffect(() => {
    setCurrentTitle(title);
  }, [])

  useEffect(() => {
    if (isTransactionPending) {
      setChangePending(true);
      store.dispatch(actions.startChangeUserStabilityDeposit());
    } else if (isTransactionFailed) {
      setChangePending(false);
      store.dispatch(actions.finishChangeUserStabilityDeposit());
    } else if (isTransactionSuccess) {
      store.dispatch(loadUserView.request());
      dispatchEvent(!originalDeposit.currentNephrite.isZero ? "DEPOSIT_CONFIRMED" : "DEPOSIT_FULLY_WITHDRAWN");
    }
  }, [myTransactionState.type, isTransactionPending]);

  return (
    <>
      <StabilityDepositEditor
        originalDeposit={originalDeposit}
        editedAmount={editedDeposit}
        setEditedAmount={setEditedDeposit}
        changePending={changePending}
        maxAmountRequired={maxAmountRequired}
        editingState={editingState}
        setEditingState={setEditingState}
        view={view}
      >

        {!!description ? <Box sx={{ mt: 2, color: 'rgb(0,0,0)' }}>{description}</Box> : <></>}

        <Flex sx={{ justifyContent: 'center', mt: ' 20px' }}>
          <Button variant="ghost" onClick={handleCancel} style={{ marginRight: "10px", width: '140px', height: '37px', letterSpacing: '0.1em' }}>
            CANCEL
          </Button>

          {validChange && !editedDeposit.isZero ? (
            <StabilityDepositAction
              transactionId={`${TRANSACTION_ID} ${editedDeposit} NPH`}
              change={validChange}
              originalDeposit={originalDeposit}
              disabled={!isValid || !validChange || isTransactionPending}
            >
              CONFIRM
            </StabilityDepositAction>
          ) : (
            <Button pallete="gradient" style={{ marginLeft: 0, width: '140px', height: '37px', letterSpacing: '0.1em', opacity: 0.3 }} disabled>CONFIRM</Button>
          )}
        </Flex>
      </StabilityDepositEditor>
    </>
  );
};
