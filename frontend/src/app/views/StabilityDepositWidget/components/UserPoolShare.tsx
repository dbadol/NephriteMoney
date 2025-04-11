import React from "react";
import { StaticParamsRow } from "@app/components/Editor";
import useStabilityPoolShareCalculation from "@app/hooks/useStabilityPoolShareCalculation";

export const UserPoolShare: React.FC<any> = ({ view, editedNephrite, text }) => {

  const [amount, pendingAmount] = useStabilityPoolShareCalculation({ view, editedNephrite });
  text = text ?? "Your pool share";

  return (
    <>
      <StaticParamsRow
        label={text}
        inputId={'stability-pool-share'}
        labelId={'pool_share_input'}
        amount={amount.prettify()}
        pendingAmount={null}
        pendingColor={pendingAmount?.positive ? "success" : "danger"}
        unit="%"
        showPercent={false}
        showIfZero={true}
      />
    </>
  )
}
