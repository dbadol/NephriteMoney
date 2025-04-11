import React from "react";
import { StabilityDeposit, StabilityDepositChange } from "@app/library/nephrite";
import { Decimal } from "@app/library/base/Decimal";

import { useNephriteSelector } from '@app/hooks/useNephriteSelector';
import { UpdateStabilityPoolAsync } from "@app/core/api";
import { toGroths } from "@app/library/base/appUtils";
import { useTransactionFunction } from "@app/library/transaction-react/useTransactionFunction";
import { useApi } from "@app/contexts/Nephrite/ApiContext";
import Button from "@app/components/Button";
import useCalculateDepositFromChange from "@app/hooks/useCalculateDepositFromChange";

type StabilityDepositActionProps = {
  transactionId: string;
  change: StabilityDepositChange<Decimal>;
  disabled?: boolean;
  originalDeposit: StabilityDeposit
};

export const StabilityDepositAction: React.FC<StabilityDepositActionProps> = ({
  children,
  transactionId,
  change,
  disabled = false,
  originalDeposit
}) => {

  if (!originalDeposit) return <></>;

  const { registeredMethods } = useApi();

  const apiCall = (change) => {


    const value = useCalculateDepositFromChange({
      originalDeposit, change
    })

    return () => registeredMethods.userUpdStab({
      newVal: toGroths(+value)
    });

  }

  const [sendTransaction] = useTransactionFunction(
    transactionId,
    apiCall(change)
  );

  return <Button pallete='gradient' style={{ opacity: disabled ? 0.2 : 1, width: '140px', height:'37px', marginLeft: 0, letterSpacing: '0.1em' }} disabled={disabled ?? false} onClick={disabled ? null : sendTransaction}>{children}</Button>;
};
