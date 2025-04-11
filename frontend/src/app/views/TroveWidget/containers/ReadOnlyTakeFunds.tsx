import React, { useCallback, useEffect } from "react";
import { Box, Flex, Text } from "theme-ui";
import { useTroveView } from "@app/contexts/Trove/TroveViewContext";
import { useSelector } from 'react-redux';
import { selectUserSurplus } from "@app/store/TroveStore/selector";
import BeamSmallCoin from '@app/components/icons/coin/beam-small.svg';
import { Amount } from '@app/components/Amount';
import Button from '@app/components/Button';
import { Decimal } from "@app/library/base/Decimal";

export const ReadOnlyTakeFunds: React.FC = () => {
  const { dispatchEvent } = useTroveView();

  const handleAdjustTrove = useCallback(() => {
    dispatchEvent("SURPLUS_WITHDRAW_PRESSED");
  }, [dispatchEvent]);

  const surplus = useSelector(selectUserSurplus());

  useEffect(() => {
    if (surplus.collateral.isEmpty)
      dispatchEvent("SURPLUS_WITHDRAW_CLOSED");
  }, [surplus.collateral])

  return (
    <>
      <Flex sx={{ background: '#F4F7EC', borderRadius: '20px'/* , height: '202px' */, justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ p: '40px 24px' }}>
          <Text variant='headerLink'>Trove</Text>
          <Flex sx={{ margin: '20px 0px', alignItems: "center", justifyContent: 'center', flexDirection: 'row' }}>
            <Amount icon={<BeamSmallCoin width={18} height={18} />} size={'16px'} value={
              Decimal.from(+surplus.collateral.toString()).shortenCustom()
            } currency='BEAM' />
          </Flex>
          <Button pallete='gradient' variant='custom' onClick={handleAdjustTrove}><Text variant='header' sx={{ textTransform: 'uppercase' }}>Take Funds</Text></Button>
        </Box>
      </Flex>
    </>
  );
};
