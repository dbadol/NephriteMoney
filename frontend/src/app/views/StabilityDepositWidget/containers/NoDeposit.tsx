import React, { useCallback, useState } from "react";
import { Box, Flex, Text } from "theme-ui";
import { InfoMessage } from "@app/components/InfoMessage";
import { useStabilityView } from "@app/contexts/StabilityDeposit/StabilityViewContext";
import { BlockNoView } from "@app/components/Block/BlockNoView";
import { BlockReadableView } from "@app/components/Block/BlockReadableView";
import BeamSmallCoin from '@app/components/icons/coin/beam-small.svg';
import { IconBeamx } from '@app/components/icons/index';
import { useSelector } from "react-redux";
import { selectStabilityDeposit } from "@app/store/StabilityDepositStore/selectors";

export const NoDeposit: React.FC = props => {
  const { dispatchEvent } = useStabilityView();
  const [isStablityDepositOpened, setIsStablityDepositOpened] = useState<boolean>(false);
  const stabilityDeposit = useSelector(selectStabilityDeposit());

  const handleOpenStabilityDeposit = useCallback(() => {
    dispatchEvent("OPEN_DEPOSIT_PRESSED");
  }, [dispatchEvent]);

  return (!stabilityDeposit.isClaimable ?
    <BlockNoView
      header="Stability Pool"
      description={<Text sx={{ display: 'inline-block', textAlign: 'center' }}>Earn BEAMX and BEAM <br /> by securing the system</Text>}
      buttonText="Deposit"
      action={handleOpenStabilityDeposit}
    /> :
    <BlockReadableView
      header="Stability Pool"
      description={
        <Flex sx={{ margin: '20px 0px', alignItems: "center", justifyContent: 'center', flexDirection: 'row' }}>
          <Flex>
            <BeamSmallCoin width={18} height={18} /> <Text variant='main' sx={{ mx: 2, lineHeight: "17px" }}>+</Text> <IconBeamx width={18} height={18} />
          </Flex>
        </Flex>
      }
      buttonText="Deposit"
      action={handleOpenStabilityDeposit}
    />
  );
};
