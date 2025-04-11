import React, { useCallback } from "react";
import { Box, Flex, Spinner, Text } from "theme-ui";
import { useTroveView } from "@app/contexts/Trove/TroveViewContext";
import { NEPHRITE_LIQUIDATION_RESERVE } from "@app/constants";
import { useSelector } from 'react-redux';
import { selectUserTrove } from "@app/store/TroveStore/selector";
import { selectNephriteAppParams, selectRate } from "@app/store/NephriteStore/selectors";
import BeamSmallCoin from '@app/components/icons/coin/beam-small.svg';
import NephriteSmallCoin from '@app/components/icons/coin/nephrite-flat-small.svg';
import Separator from '@app/components/icons/separator.svg';
import { Amount } from '@app/components/Amount';
import Button from '@app/components/Button';
import { Decimal } from "@app/library/base/Decimal";
import { IsTransactionPending } from "@app/library/transaction-react/IsTransactionStatus";
import { ShaderTransactionComments } from "@app/library/nephrite/types";

export const ReadOnlyTrove: React.FC = () => {
  const { dispatchEvent } = useTroveView();

  const handleAdjustTrove = useCallback(() => {
    dispatchEvent("ADJUST_TROVE_PRESSED");
  }, [dispatchEvent]);

  const [trove, appParams] = [
    useSelector(selectUserTrove()),
    useSelector(selectNephriteAppParams()),
  ];

  if (trove.isEmpty) return (<></>)

  const isTransactionPending = IsTransactionPending({
    transactionIdPrefix: ShaderTransactionComments.setTroveModify,
  });

  return (
    <>
      <Flex sx={{ background: '#F4F7EC', borderRadius: '20px'/* , height: '202px' */, justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ p: '40px 24px' }}>
          <Text variant='headerLink'>Trove</Text>
          <Flex sx={{ margin: '20px 0px', alignItems: "center", justifyContent: 'center', flexDirection: 'row' }}>
            <Amount icon={<BeamSmallCoin width={18} height={18} />} size={'16px'} value={
              trove.collateral.lt(1) ? trove.collateral.toString(2) : (
                Decimal.from(Math.floor(+trove.collateral.toString())).shortenCustom()
              )
            } currency='BEAM' />
            <Box sx={{ mx: 3 }}>
              <Separator />
            </Box>
            <Amount icon={<NephriteSmallCoin width={18} height={18} />} size={'16px'} value={
              trove.debt.gt(NEPHRITE_LIQUIDATION_RESERVE) && trove.netDebt.lt(1) ? trove.netDebt.toString(2) : (
                Decimal.from(
                  Math.floor(+trove.netDebt.toString())
                ).shortenCustom()
              )
            } currency='NPH' />
          </Flex>
          <Button pallete='gradient' variant='custom' style={{ opacity: !isTransactionPending ? 1 : 0.3 }} onClick={!isTransactionPending ? handleAdjustTrove : null}>
            <Text variant='header' sx={{ textTransform: 'uppercase' }}>Adjust</Text>
            {isTransactionPending ? <Spinner size="15px" sx={{ color: "text", mr: 0, ml: "10px" }} /> : null}
          </Button>
        </Box>
      </Flex>
    </>
  );
};
