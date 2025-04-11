import React from "react";
import Button from "@app/components/Button";

import { Trove, TroveChange, _normalizeTroveAdjustment } from "@app/library/nephrite";
import { Decimal } from "@app/library/base/Decimal";

import { useTransactionFunction } from "@app/library/transaction-react/useTransactionFunction";
import { toGroths } from '@app/library/base/appUtils';
import { useApi } from "@app/contexts/Nephrite/ApiContext";

type TroveActionProps = {
  transactionId: string;
  change: Exclude<TroveChange<Decimal>, { type: "invalidCreation" }>;
  maxBorrowingRate: Decimal;
  trove?: Trove;
  disabled?: boolean;
};

export const TroveAction: React.FC<TroveActionProps> = ({
  children,
  transactionId,
  change,
  maxBorrowingRate,
  trove,
  disabled = false
}) => {

  const { registeredMethods } = useApi();

  const apiCall = (change) => {

    if(!change?.type) return null;

    switch (change?.type) {

      case "creation":
        {
          const { collateral, debt } = Trove.create(change.params);

          return () => registeredMethods.userTroveModify({
            tok: toGroths(+debt),
            col: toGroths(+collateral),
            opTok: 1,
            opCol: 1
          });
        }

      case "adjustment":
        {
          const { collateral, debt } = trove.adjust(change.params);

          return () => registeredMethods.userTroveModify({
            tok: toGroths(+debt),
            col: toGroths(+collateral),
            opTok: 0,
            opCol: 0
          });
        }

      case "closure":
        return () => registeredMethods.userTroveModify({
          tok: 0,
          col: 0,
          opTok: 0,
          opCol: 0
        });
    }

  }

  const [sendTransaction] = useTransactionFunction(
    transactionId,
    apiCall(change)
  );

  return <Button style={{ opacity: disabled ? 0.2 : 1 , width: '140px', height:'37px', whiteSpace:'nowrap', marginLeft:0, letterSpacing: '0.1em' }} disabled={disabled ?? false} onClick={disabled ? null : sendTransaction}>{children}</Button>;
};
