import React, { useCallback, useEffect, useState } from "react";
import { Text } from 'theme-ui';
import { BlockNoView } from "@app/components/Block/BlockNoView";
import { useNavigate } from "react-router-dom";
import { selectContractHeight } from "@app/store/NephriteStore/selectors";
import { useSelector } from "react-redux";
import { useNephriteSelector } from "@app/hooks/useNephriteSelector";
import { useRedemptionView } from "@app/contexts/Redemption/RedemptionViewContext"
import { RedemptionModal } from "../components/RedemptionModal";
import useCouldLiquidate from "@app/hooks/useCouldLiquidate";


const select = ({ appParams }) => ({
  redemptionHeight: appParams.redemptionHeight
});

export const ReadOnlyRedemption = () => {
  const { dispatchEvent } = useRedemptionView();

  const contractHeight = useSelector(selectContractHeight());
  const { redemptionHeight } = useNephriteSelector(select);
  const isHeightReached = +redemptionHeight - +contractHeight > 0;

  const [isShownModal, setIsShownModal] = useState(false);
  const [couldLiquidate, setCouldLiquidate] = useState<boolean>();

  const toggleModal = () => setIsShownModal(!isShownModal);


  useEffect(() => {
    let couldLiquidateTimer = setTimeout(() => {/* tik tak */ }, 1000);

    (async () => {
      const result = await useCouldLiquidate();
      setCouldLiquidate(result);
    })();

    return () => {
      clearTimeout(couldLiquidateTimer);
    }
  }, [])


  const {
    assetPrice: beamPrice,
    total,
  } = useNephriteSelector(({
    assetPrice,
    total,
  }) => ({
    assetPrice,
    total,
  }));

  const handleAdjustRedemptionPressed = useCallback(() => {
    dispatchEvent("ADJUST_REDEMPTION_PRESSED");
  }, [dispatchEvent]);

  return (
    <>
      <BlockNoView
        header="REDEMPTION"
        description={
          !isHeightReached ?
            <Text sx={{ display: 'inline-block', textAlign: 'center' }}>Redemptions are disabled for <br />the first 14 days since Nephrite <br /> smart contracts deploy</Text> :
            <Text sx={{ display: 'inline-block', textAlign: 'center' }}>Redeem NPH at face value</Text>
        }
        buttonText="REDEEM NPH"
        disabled={!isHeightReached ? true : false}
        action={couldLiquidate ? toggleModal : handleAdjustRedemptionPressed}
      />

      <RedemptionModal onCloseModal={toggleModal} isShown={isShownModal} />
    </>

  )
}
