import React, { useCallback } from "react";
import { Box, Flex, Spinner, Text } from "theme-ui";
import { useSelector } from 'react-redux';

import { useStabilityView } from "@app/contexts/StabilityDeposit/StabilityViewContext";
import { selectStabilityDeposit } from '../../../store/StabilityDepositStore/selectors';
import { Decimal } from '@app/library/base/Decimal';
import NephriteSmallCoin from '@app/components/icons/coin/nephrite-flat-small.svg';
import { Amount } from "@app/components/Amount";
import { IconBeamx } from '@app/components/icons/index';
import Separator from '@app/components/icons/separator.svg';
import { Button } from "@app/components";
import BeamSmallCoin from '@app/components/icons/coin/beam-small.svg';
import { IsTransactionPending } from "@app/library/transaction-react/IsTransactionStatus";
import { ShaderTransactionComments } from "@app/library/nephrite/types";


export const ReadOnlyDeposit: React.FC = () => {
  const { dispatchEvent } = useStabilityView();

  const stabilityDeposit = useSelector(selectStabilityDeposit());
  const nephriteInStabilityPool = stabilityDeposit.currentNephrite;

  const handleAdjustDeposit = useCallback(() => {
    dispatchEvent("ADJUST_DEPOSIT_PRESSED");
  }, [dispatchEvent]);

  const handleOpenDeposit = useCallback(() => {
    dispatchEvent("OPEN_DEPOSIT_PRESSED");
  }, [dispatchEvent]);

  const isTransactionPending = IsTransactionPending({
    transactionIdPrefix: ShaderTransactionComments.setUpdateStabilityPool,
  });


  const beamxValue = stabilityDeposit.beamXReward.lt(1) ? stabilityDeposit.beamXReward.toString(2) : (
    Decimal.from(Math.floor(+stabilityDeposit.beamXReward.toString())).shortenCustom());

  const beamValue = stabilityDeposit.collateralGain.lt(1) ? stabilityDeposit.collateralGain.toString(2) : (
    Decimal.from(Math.floor(+stabilityDeposit.collateralGain.toString())).shortenCustom());

  return (
    <>
      <Flex sx={{ background: '#F4F7EC', borderRadius: '20px'/* , height: '202px' */, justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ p: '40px 8px' }}>
          <Text variant="headerLink">Stability Pool</Text>
          <Flex sx={{ margin: '20px 0px', alignItems: "center", justifyContent: 'center', flexDirection: 'row' }}>
            {
              !stabilityDeposit.currentNephrite.isZero &&
              <Amount icon={<NephriteSmallCoin width={18} height={18} />} size={'16px'} value={
                nephriteInStabilityPool.lt(1) ? nephriteInStabilityPool.toString(2) : (
                  Decimal.from(
                    Math.floor(+nephriteInStabilityPool.toString())
                  ).shortenCustom()
                )
              } currency='NPH' />
            }
            {
              !stabilityDeposit.currentNephrite.isZero && stabilityDeposit.isClaimable &&
              <Box sx={{ mx: 4 }}>
                <Separator />
              </Box>
            }
            {
              stabilityDeposit.isClaimable && !stabilityDeposit.currentNephrite.isZero ?
                <Flex>
                  <BeamSmallCoin width={18} height={18} /> <Text variant='main' sx={{ mx: 2, lineHeight: "17px" }}>+</Text> <IconBeamx width={18} height={18} />
                </Flex>
                : stabilityDeposit.isClaimable &&
                <Flex>
                  <Amount icon={<BeamSmallCoin width={18} height={18} />} size={beamxValue.length > 4 || beamValue.length > 4 ? '14px' : '16px'} value={beamValue} currency='BEAM' />

                  <Text variant='main' sx={{ margin: '0px 4px', lineHeight: "17px" }}>+</Text>

                  <Amount
                    icon={
                      <IconBeamx
                        width={18}
                        height={18}
                      />}
                    size={beamxValue.length > 4 || beamValue.length > 4 ? '14px' : '16px'}
                    value={beamxValue} currency='BEAMX' />

                </Flex>

            }
          </Flex>
          <Button pallete='gradient' variant='custom' style={{ opacity: !isTransactionPending ? 1 : 0.3 }} onClick={
            handleAdjustDeposit
          }>
            <Text variant='header' sx={{ textTransform: 'uppercase' }}>{!stabilityDeposit.currentNephrite.isZero ? "ADJUST" : "CLAIM"}</Text>
            {isTransactionPending ? <Spinner size="15px" sx={{ color: "text", mr: 0, ml: "10px" }} /> : null}
          </Button>
        </Box>
      </Flex>
    </>
  );
};
