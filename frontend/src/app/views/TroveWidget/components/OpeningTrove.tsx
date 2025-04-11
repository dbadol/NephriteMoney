import React, { useCallback, useEffect, useState } from 'react';

import { Flex, Box, Card, Heading, Text, Container } from 'theme-ui';

import { CollateralRatio } from './CollateralRatio';
import { ActionDescription } from '@app/components/ActionDescription';
import { TroveAction } from '@app/views/Actions/TroveAction';

import { Icon } from '@app/components/Icon';
import { InfoIcon } from '@app/components/InfoIcon';
import { LoadingOverlay } from '@app/components/LoadingOverlay';
import {
  EditableRow,
  StaticParamsRow,
  StaticRow,
} from '@app/components/Editor';
import { Decimal } from '@app/library/base/Decimal';
import { ASSET, NEPHRITE_LIQUIDATION_RESERVE } from '@app/constants';
import { OpeningTroveInterface } from '../interfaces';
import { COIN } from '@app/constants';
import BeamSmallCoin from '@app/components/icons/coin/beam-small.svg';
import NephriteSmallCoin from '@app/components/icons/coin/nephrite-flat-small.svg';
import {
  selectRawIssueRate,
  selectRate,
  selectIssueRate,
} from '@app/store/NephriteStore/selectors';
import { useSelector } from 'react-redux';
import Button from '@app/components/Button';

export const OpeningTrove: React.FC<OpeningTroveInterface & any> = ({
  isDirty,
  isTransactionPending,
  collateral,
  editingState,
  setCollateral,
  borrowAmount,
  setBorrowAmount,
  issuanceFee,
  totalDebt,
  collateralRatio,
  description,
  handleCancelPressed,
  stableTroveChange,
  maxBorrowingRate,
  TRANSACTION_ID,
  redemptionFeePerc,
  minCollateral
}) => {

  const beamPrice = useSelector(selectRate());
  return (
    <>
      <Card sx={{ gridArea: '1 / 1 / 3 / 3' }}>
        <Box sx={{ background: '#F4F7EC', padding: '20px 20px 10px', flex: 2 }}>
          <EditableRow
            label={`Collateral amount (min ${minCollateral} BEAM)`}
            labelId="trove-input"
            inputId="trove-input-collateral"
            amount={collateral.toString()}
            editingState={editingState}
            unit="BEAM"
            unitPosition="space-between"
            unitIcon={<BeamSmallCoin />}
            editedAmount={collateral.gt(0) ? collateral.toString() : ''}
            setEditedAmount={(amount: string) =>
              setCollateral(Decimal.from(!!amount ? amount : 0))
            }
            equalizer={() => beamPrice.mul(+collateral.toString()).prettify(2)}
            isInput={true}
          />

          <EditableRow
            label="Issuing volume (min 90 NPH)"
            labelId="trove-input-static"
            inputId="trove-input-borrow-amount"
            amount={borrowAmount.toString()}
            unit={'NPH'}
            unitPosition="space-between"
            unitIcon={<NephriteSmallCoin />}
            editingState={editingState}
            editedAmount={borrowAmount.gt(0) ? borrowAmount.toString() : ''}
            setEditedAmount={(amount: string) =>
              setBorrowAmount(Decimal.from(!!amount ? amount : 0))
            }
            equalizer={() => borrowAmount.prettify(2)}
            isInput={true}
            minAmount={90}
          />
          <Container
            sx={{ mt: '36px', mx: 0, width: '100%', maxWidth: '12rem' }}
          >
            <CollateralRatio
              value={collateralRatio}
              background="transparent"
              labelId="icr-static-input"
              inputId="trove-icr"
              labelFor={'collaterialRatio_trove'}
            />

            <Box>
              <StaticParamsRow
                label="Liquidation Reserve"
                labelId="trove-input-static"
                inputId="trove-liquidation-reserve"
                amount={`${NEPHRITE_LIQUIDATION_RESERVE}`}
                unit={COIN}
                infoIcon={
                  <InfoIcon
                    size="xs"
                    placement="left"
                    tooltip={
                      <Card variant="tooltip" sx={{ whiteSpace: 'normal' }}>
                        An amount set aside to cover the liquidator’s gas costs
                        if your Trove needs to be liquidated. The amount
                        increases your debt and is refunded if you close your
                        Trove by fully paying off its net debt.
                      </Card>
                    }
                  />
                }
              />
            </Box>
            <Box>
              <StaticParamsRow
                label="Issuance fee"
                labelId="trove-input-static"
                inputId="trove-borrowing-fee"
                amount={issuanceFee.toString()}
                showIfZero={true}
                pendingAmount={redemptionFeePerc.toString(1)}
                unit={COIN}
                infoIcon={
                  <InfoIcon
                    size="xs"
                    tooltip={
                      <Card variant="tooltip" sx={{ whiteSpace: 'normal' }}>
                        This amount is deducted from the borrowed amount as a
                        one-time fee. There are no recurring fees for borrowing,
                        which is thus interest-free.
                      </Card>
                    }
                  />
                }
              />
            </Box>
            <StaticParamsRow
              label="Total debt"
              labelId="trove-input-static"
              inputId="trove-total-debt"
              amount={totalDebt.prettify(2)}
              unit={COIN}
              infoIcon={
                <InfoIcon
                  size="xs"
                  tooltip={
                    <Card variant="tooltip" sx={{ whiteSpace: 'normal' }}>
                      The total amount of NEPHRITE your Trove will hold.{' '}
                      {isDirty && (
                        <>
                          You will need to repay{' '}
                          {totalDebt
                            .sub(NEPHRITE_LIQUIDATION_RESERVE)
                            .prettify(2)}{' '}
                          NEPHRITE to reclaim your collateral (
                          {NEPHRITE_LIQUIDATION_RESERVE.toString()} NEPHRITE
                          Liquidation Reserve excluded).
                        </>
                      )}
                    </Card>
                  }
                />
              }
            />
          </Container>
          <Flex sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            {!!description ? (
              <Box sx={{ marginTop: '24px' }}>{description}</Box>
            ) : null}
            {<Box
                sx={{ mt: 2 }}
              >
                <ActionDescription fontStyle={'italic'}>
                  Keeping your ICR above{' '}
                  <Text
                    sx={{
                      color: 'rgba(0,0,0)',
                      fontWeight: 600,
                      fontStyle: 'italic',
                    }}
                  >
                    150%
                  </Text>{' '}
                  can help avoid liquidation under Recovery Mode
                </ActionDescription>
              </Box>
            }
          </Flex>
          <Flex sx={{ justifyContent: 'center', marginTop: '10px' }}>
            <Box sx={{ marginRight: ' 24px' }}>
              <Button
                variant="ghost"
                style={{
                  marginRight: '10px',
                  width: '140px',
                  letterSpacing: '0.1em',
                }}
                onClick={handleCancelPressed}
              >
                CANCEL
              </Button>
            </Box>
            <Box>
              <TroveAction
                transactionId={TRANSACTION_ID}
                change={stableTroveChange}
                maxBorrowingRate={maxBorrowingRate}
                disabled={
                  !stableTroveChange ||
                  !stableTroveChange ||
                  isTransactionPending
                }
              >
                CONFIRM
              </TroveAction>
            </Box>
          </Flex>
        </Box>
        {isTransactionPending && <LoadingOverlay />}
      </Card>
    </>
  );
};
