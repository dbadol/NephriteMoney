import React, { useState } from "react";
import { useCallback, useEffect } from "react";
import { Flex, Card, Heading, Box } from "theme-ui";

import { Decimal, Decimalish } from "@app/library/base/Decimal";
import { Trove } from "@app/library/nephrite";
import { NEPHRITE_MINIMUM_DEBT } from "@app/constants";

import { ActionDescription } from "@app/components/ActionDescription";
import { useCurrentTransactionState } from "@app/library/transaction-react/useCurrentTransactionState";

import { TroveAction } from "@app/views/Actions/TroveAction";
import { useTroveView } from "@app/contexts/Trove/TroveViewContext";

import {
  selectForTroveChangeValidation,
  validateTroveChange
} from "@app/views/validators/validateTroveChange";
import { useNephriteSelector } from "@app/hooks/useNephriteSelector";
import { useSelector } from "react-redux";
import { selectForTroveManager } from "@app/store/TroveStore/selector";
import { LoadingOverlay } from "@app/components/LoadingOverlay";
import store from "index";
import { setUserTrove } from '../../../store/TroveStore/actions';
import { IsTransactionPending } from "@app/library/transaction-react/IsTransactionStatus";
import Button from "@app/components/Button";

const select = (state) => ({
  appParams: state.appParams,
  fees: state.fees,
  validationContext: selectForTroveChangeValidation(state)
});

const TRANSACTION_ID = "trove close";

type TroveManagerProps = {
  collateral?: Decimalish;
  debt?: Decimalish;
};

export const ClosingTrove: React.FC<TroveManagerProps> = ({ }) => {
  const { originalTrove } = useSelector(selectForTroveManager());

  const { appParams, fees, validationContext } = useNephriteSelector(select);

  const borrowingRate = Decimal.from(appParams.baserate)
  const maxBorrowingRate = borrowingRate.add(0.005);

  const [validChange, description] = validateTroveChange(
    originalTrove,
    new Trove(Decimal.ZERO, Decimal.ZERO),
    borrowingRate,
    validationContext
  );

  const { dispatchEvent: dispatchTroveViewEvent } = useTroveView();

  const handleCancel = useCallback(() => {
    dispatchTroveViewEvent("CANCEL_ADJUST_TROVE_PRESSED");
  }, [dispatchTroveViewEvent]);

  const transactionState = useCurrentTransactionState(TRANSACTION_ID);
  const isTransactionPending = IsTransactionPending({ transactionIdPrefix: TRANSACTION_ID });

  useEffect(() => {
    if (transactionState.id === TRANSACTION_ID && transactionState.type === "completed") {

      dispatchTroveViewEvent("TROVE_CLOSED");

      return () => {
        store.dispatch(setUserTrove(null))
      }
    }

  }, [transactionState, dispatchTroveViewEvent]);

  return (
    <Card sx={{ gridArea: "1 / 1 / 3 / 3" }}>
      <Box sx={{ background: '#F4F7EC', padding: '20px', flex: 2 }}>

        {description ?? (
          <ActionDescription>
            Adjust your Trove by modifying its collateral, debt, or both.
          </ActionDescription>
        )}

        <Flex variant="layout.actions">
          <Button variant="ghost" style={{ marginRight: "10px", width: '140px', height:'37px', letterSpacing: '0.1em'}} onClick={handleCancel}>
            CANCEL
          </Button>

          {validChange ? (
            <TroveAction
              transactionId={TRANSACTION_ID}
              change={validChange}
              maxBorrowingRate={maxBorrowingRate}
            >
              CLOSE TROVE
            </TroveAction>
          ) : (
            <Button pallete="gradient" style={{ marginLeft: 0, width: 'auto', height:'37px', whiteSpace:'nowrap' }} disabled>CLOSE TROVE</Button>
          )}
        </Flex>
      </Box>
      {isTransactionPending && <LoadingOverlay />}
    </Card >
  );
};
