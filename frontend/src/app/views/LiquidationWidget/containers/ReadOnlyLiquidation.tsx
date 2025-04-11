import React, { useCallback }  from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "theme-ui";
import { BlockNoView } from "@app/components/Block/BlockNoView";
import { useLiquidationView } from "@app/contexts/Liquidation/LiquidationViewContext";


export const ReadOnlyLiquidation: React.FC = () => {
  const { dispatchEvent } = useLiquidationView();

  const handleAdjustLiquidationPressed = useCallback(() => {
    dispatchEvent("ADJUST_LIQUIDATION_PRESSED");
  }, [dispatchEvent]);
  
  return (
    <BlockNoView
      header="LIQUIDATION"
      description={<Text sx={{display: 'inline-block', textAlign:'center'}}>Earn NPH by initiating <br/> liquidations of risky troves</Text>}
      buttonText="liquidate trove"
      action={handleAdjustLiquidationPressed}
    />
  )
}