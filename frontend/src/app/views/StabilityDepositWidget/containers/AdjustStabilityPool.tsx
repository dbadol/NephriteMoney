import React, { useCallback, useState } from 'react';
import { Flex, Box, Card, Container } from 'theme-ui';
import { useSelector } from 'react-redux';
import { TextWithAmount } from '@app/components/TextWithAmout';
import { NotifyMessage } from '@app/components/Readable/NotifyMessage';
import { Button } from '@app/components';
import NephriteSmallCoin from '@app/components/icons/coin/nephrite-flat-small.svg';
import BeamSmallCoin from '@app/components/icons/coin/beam-small.svg';
import { selectStabilityDeposit } from '@app/store/StabilityDepositStore/selectors';
import { Decimal } from '@app/library/base/Decimal';
import { useNephriteSelector } from '@app/hooks/useNephriteSelector';
import { UserPoolShare } from '../components/UserPoolShare';
import { useStabilityView } from '@app/contexts/StabilityDeposit/StabilityViewContext';
import { selectRate, selectTotal } from '@app/store/NephriteStore/selectors';
import { Claim } from '../components/Claim';
import { StabilityPoolModal } from '../components/StabilityPoolModal';

export const AdjustStabilityPool: React.FC = () => {
  const { dispatchEvent } = useStabilityView();
  const [isShownModal, setIsShownModal] = useState(false);

  const stabilityDeposit = useSelector(selectStabilityDeposit());
  const beamPrice = useSelector(selectRate());
  const total = useSelector(selectTotal());


  const handleWithdrawFromStabilityPool = useCallback(() => {
    total.collateralRatioIsBelowCritical(beamPrice)
      ? setIsShownModal(true)
      : dispatchEvent('WITHDRAW_FROM_DEPOSIT_PRESSED');
  }, [dispatchEvent]);

  const handleDepositToStabilityPool = useCallback(() => {
    dispatchEvent('DEPOSIT_TO_DEPOSIT_PRESSED');
  }, [dispatchEvent]);

  return (
    <>
      {!stabilityDeposit.currentNephrite.isZero && (
        <Card sx={{ gridArea: '1 / 1 / 3 / 3' }}>
          <Box sx={{ background: '#F4F7EC', padding: '20px', flex: 2 }}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Flex
                sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}
              >
                <TextWithAmount
                  icon={
                    <NephriteSmallCoin
                      width={22}
                      height={22}
                      style={{ marginTop: '4px' }}
                    />
                  }
                  size={'21px'}
                  value={stabilityDeposit.currentNephrite.prettify(2)}
                  currency="NPH"
                  color={'#000'}
                  text={'Deposited amount'}
                  showConvertedToUsd={true}
                  equalizer={() => stabilityDeposit.currentNephrite.prettify(2)}
                  fontWeight={600}
                />
                <Flex>
                  <Button
                    pallete="transparent"
                    variant="ghostBordered"
                    onClick={handleWithdrawFromStabilityPool}
                    style={{ width: '135px' }}
                  >
                    WITHDRAW
                  </Button>
                  <Button
                    pallete="transparent"
                    variant="ghostBordered"
                    onClick={handleDepositToStabilityPool}
                    style={{ marginLeft: '16px', width: '135px' }}
                  >
                    DEPOSIT
                  </Button>
                </Flex>
              </Flex>
              <Container
                sx={{
                  mt: '24px',
                  mb: '10px',
                  mx: 0,
                  width: '100%',
                  maxWidth: '10rem',
                }}
              >
                <UserPoolShare
                  view={'adjusting'}
                  editedNephrite={stabilityDeposit.currentNephrite}
                />
              </Container>
              <Box>
                {stabilityDeposit.collateralGain.nonZero && (
                  <NotifyMessage color="rgba(0, 0, 0, 0.1)" italic={true}>
                    A part of your deposited NPH had been used for liquidations.
                    Check your liquidation revenue.
                  </NotifyMessage>
                )}
              </Box>
              <Box>
                <NotifyMessage color="rgba(0, 0, 0, 0.1)" italic={true}>
                  Each time you adjust your deposit you withdraw all rewards and
                  liquidation revenue collected at the moment.
                </NotifyMessage>
              </Box>
            </Flex>
          </Box>
        </Card>
      )}

      {(stabilityDeposit.collateralGain.nonZero ||
        stabilityDeposit.beamXReward.nonZero) && <Claim />}

      {total.collateralRatioIsBelowCritical(beamPrice) && (
        <StabilityPoolModal
          isShown={isShownModal}
          setIsShown={setIsShownModal}
        />
      )}
    </>
  );
};
