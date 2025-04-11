import React, { useCallback, useEffect } from 'react';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { Flex, Box, Text, Card } from 'theme-ui';
import { SystemStats } from '@app/views/SystemStats';
import { UserStats } from '@app/views/SystemStats/UserStats';
import { TextWithAmount } from '@app/components/TextWithAmout';
import { NotifyMessage } from '@app/components/Readable/NotifyMessage';
import { Button } from '@app/components';
import NephriteSmallCoin from '@app/components/icons/coin/nephrite-flat-small.svg';
import Beam from '@app/components/icons/coin/beam-small.svg';
import { useSelector } from 'react-redux';
import { selectUserTrove } from '@app/store/TroveStore/selector';
import { selectRate, selectTotal } from '@app/store/NephriteStore/selectors';
import { Decimal } from '@app/library/base/Decimal';
import { ActionDescription } from '@app/components/ActionDescription';
import { useTroveView } from '@app/contexts/Trove/TroveViewContext';
import { AdjustingTrove as AdjustingTroveOriginal } from './AdjustingTroveOriginal';
import { ClosingTrove } from './ClosingTrove';
import { useTitle } from '@app/contexts/Nephrite/TitleContext';
import { ErrorDescription } from '@app/components/ErrorDescription';

export const AdjustingTrove: React.FC<any> = (props) => {
  const { setCurrentTitle } = useTitle();
  setCurrentTitle(props?.title);

  const { dispatchEvent } = useTroveView();
  const originalTrove = useSelector(selectUserTrove());
  const beamPrice = useSelector(selectRate());
  const total = useSelector(selectTotal());
  const handleWithdrawFromCollateral = useCallback(() => {
    dispatchEvent("WITHDRAW_FROM_COLLATERAL_PRESSED");
  }, [dispatchEvent]);

  const handleDepositToCollateral = useCallback(() => {
    dispatchEvent("DEPOSIT_TO_COLLATERAL_PRESSED");
  }, [dispatchEvent]);

  const handleBorrowFromDebt = useCallback(() => {
    dispatchEvent("BORROW_FROM_DEBT_PRESSED");
  }, [dispatchEvent]);

  const handleRepayToDebt = useCallback(() => {
    dispatchEvent("REPAY_TO_DEBT_PRESSED");
  }, [dispatchEvent]);

  useEffect(() => {
    if (originalTrove.isEmpty) {
      dispatchEvent("TROVE_CLOSED")
    }
  }, [originalTrove, dispatchEvent])


  const recoveryMode = total.collateralRatioIsBelowCritical(beamPrice);

  return (
    <>
      <Card sx={{ gridArea: "1 / 1 / 3 / 3" }}>
        <Box sx={{ background: '#F4F7EC', padding: '20px', flex: 2 }}>
          <Flex sx={{ flex: 2, flexDirection: 'column' }}>

            <Flex sx={{ flexDirection: 'column' }}>
              <Flex sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <TextWithAmount
                  icon={<Beam width={22} height={22} style={{ marginTop: '4px' }} />}
                  size={'21px'}
                  value={originalTrove.collateral.toString(2)}
                  currency='BEAM'
                  text={'Collateral amount'}
                  color={'#000'}
                  showConvertedToUsd={true}
                  equalizer={() => beamPrice.mul(+originalTrove.collateral.toString()).prettify(2)}
                  fontWeight={600}
                />
                <Flex>
                  <Button pallete='transparent' variant='ghostBordered' onClick={!recoveryMode ? handleWithdrawFromCollateral : null} style={{ opacity: !recoveryMode ? 1 : 0.1, cursor: !recoveryMode ? "default" : "not-allowed", width: '135px' }}>WITHDRAW</Button>
                  <Button pallete='transparent' variant='ghostBordered' onClick={handleDepositToCollateral} style={{ marginLeft: '16px', width: '135px' }}>DEPOSIT</Button>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Card>
      <Card sx={{ gridArea: "3 / 1 / 3 / 3" }}>
        <Box sx={{ background: '#F4F7EC', padding: '20px', flex: 2 }}>
          <Flex sx={{ flexDirection: 'column' }}>
            <Flex sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <TextWithAmount
                icon={<NephriteSmallCoin style={{ marginTop: '3px' }} />}
                size={'21px'}
                color={'#C63E3E'}
                value={originalTrove.netDebt.toString(2)}
                currency='NPH'
                text={'Debt'}
                showConvertedToUsd={true}
                equalizer={() => originalTrove.netDebt.prettify(2)}
                fontWeight={600}
              />
              <Flex>
                <Button pallete='transparent' variant='ghostBordered' onClick={!recoveryMode ? handleBorrowFromDebt : null} style={{ opacity: !recoveryMode ? 1 : 0.1, cursor: !recoveryMode ? "default" : "not-allowed", width: '135px' }}>BORROW</Button>
                <Button pallete='transparent' variant='ghostBordered' onClick={handleRepayToDebt} style={{ marginLeft: '16px', width: '135px' }}>REPAY</Button>
              </Flex>
            </Flex>
            <Box sx={{ mt: 5 }}>
              <ActionDescription fontStyle='italic'>
                To close your trove you need to repay <Text sx={{ color: 'rgba(0,0,0)', fontWeight: 600, fontStyle: 'italic' }}>{originalTrove.netDebt.toString()} NPH</Text>
              </ActionDescription>
            </Box>
            <Box sx={{ mt: 1 }}>
              <ActionDescription fontStyle='italic'>
                Keeping your CR above <Text sx={{ color: 'rgba(0,0,0)', fontWeight: 600 }}>150%</Text> can help avoid liquidation under Recovery Mode
              </ActionDescription>
            </Box>

            {
              recoveryMode && <Box sx={{ mt: 1 }}>
                <ErrorDescription fontStyle='italic'>
                Recovery mode - ON.  Possible only increasing ICR.
                </ErrorDescription>
              </Box>
            }


          </Flex>
        </Box>
      </Card >
      <Card sx={{ gridArea: "4/1/4/3" }}>
      </Card >

    </>
  )
}
