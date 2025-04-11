import React, { useMemo, useState, useEffect } from 'react';
import { Heading, Box, Card, Container, Text } from 'theme-ui';

import { Trove, NEPHRITE_LIQUIDATION_RESERVE } from '@app/library/nephrite';

import {
  Percent,
  Difference,
  Decimalish,
  Decimal,
} from '@app/library/base/Decimal';

import { EditableRow, StaticParamsRow } from '@app/components/Editor';
import { CollateralRatio } from '@app/views/TroveWidget/components/CollateralRatio';
import { useSelector } from 'react-redux';
import {
  selectIssueRate, selectNephriteAppParams,
  selectRate,
} from '@app/store/NephriteStore/selectors';
import BeamSmallCoin from '@app/components/icons/coin/beam-small.svg';
import NephriteSmallCoin from '@app/components/icons/coin/nephrite-flat-small.svg';
import { ActionDescription, Amount } from '@app/components/ActionDescription';
import { IsTransactionStatus } from '@app/library/transaction-react/IsTransactionStatus';
import { ShaderTransactionComments } from '@app/library/nephrite/types';
import { LoadingOverlay } from '@app/components/LoadingOverlay';
import {
  COIN, EstimatedICR,
  MINIMUM_COLLATERAL_RATIO,
  NEPHRITE_MINIMUM_NET_DEBT,
} from '@app/constants';
import { InfoIcon } from '@app/components/InfoIcon';
import useCalculateTroveFee from '@app/hooks/useCalculateTroveFee';
import {fromGroths} from "@library/base/appUtils";

type TroveEditorProps = {
  original: Trove;
  edited: Trove;
  fee: Decimal;
  borrowingRate: Decimal;
  changePending: boolean;
};

export const TroveEditor: React.FC<any> = ({
  children,
  original,
  edited,
  fee,
  borrowingRate,
  changePending,
  editingState,
  maxAmountRequired,
  viewAction,
  setValue,
  value,
  collateralAmountAllowToWithdraw,
  tokAmountAllowToWithdraw
}) => {
  const [borrowAmount, setBorrowAmount] = useState<Decimal>(Decimal.ZERO);
  const [issuanceFee, setIssuanceFee] = useState<Decimal>(Decimal.ZERO);
  const [issuanceFeePerc, setIssuanceFeePerc] = useState<string>(Decimal.ZERO + "%");
  const beamPrice = useSelector(selectRate());
  const totalDebt = borrowAmount.add(NEPHRITE_LIQUIDATION_RESERVE).add(fee);
  const isDirty = !borrowAmount.isZero;
  const [
    isTransactionPending,
    isTransactionFailed,
    isTransactionSuccess,
  ] = IsTransactionStatus({
    transactionIdPrefix: ShaderTransactionComments.setTroveModify,
  });
  const issuanceFeeRate = useSelector(selectIssueRate());
  const EMPTY_TROVE = new Trove(Decimal.ZERO, Decimal.ZERO);

  let collateral = Decimal.ZERO;

  const originalCollateralRatio = !original.isEmpty
    ? original.collateralRatio(beamPrice)
    : undefined;
  const collateralRatio = !edited.isEmpty
    ? edited.collateralRatio(beamPrice)
    : undefined;
  const collateralRatioChange = Difference.between(
    collateralRatio,
    originalCollateralRatio,
  );
  const trove = isDirty
    ? new Trove((collateral = borrowAmount), totalDebt)
    : EMPTY_TROVE;

  const feePct = new Percent(borrowingRate);

  const currentValue = useMemo(
    () => {
      return original.isEmpty
        ? Decimal.ZERO
        : ['withdrawing', 'depositing', 'repaying'].includes(viewAction)
          ? original.collateral
          : original.netDebt;
    }, [original]
  );

  const maxAmountToWithdrawal = maxAmountRequired ?
    "withdrawing" == viewAction ? collateralAmountAllowToWithdraw : (
      "borrowing" == viewAction ? tokAmountAllowToWithdraw :
        currentValue
    ) :
    false;

  const maxedOut = maxAmountToWithdrawal ? value.eq(maxAmountToWithdrawal) : false;

  useEffect(() => {
    (async () => {
      const {fee, fee_perc, col} = await useCalculateTroveFee({ debt: value.toString(), collateral: edited.collateral } as Trove);
      setIssuanceFee(Decimal.from(fromGroths(fee)));
      if(fee_perc) {
        setIssuanceFeePerc(Decimal.from(fee_perc) + "%");
      }
    })();

    return () => { };
  }, [borrowAmount, value]);

  useEffect(() => {
    if (borrowAmount.isZero) {
      setBorrowAmount(NEPHRITE_MINIMUM_NET_DEBT);
    }
  }, [borrowAmount]);

  return (
    <>
      <Card sx={{ gridArea: '1 / 1 / 3 / 3' }}>
        <Box sx={{ background: '#F4F7EC', padding: '20px', flex: 2 }}>
          <EditableRow
            label="Amount"
            labelId="trove-input"
            inputId={`trove-${viewAction}`}
            amount={value.toString()}
            maxAmount={
              maxAmountToWithdrawal ? maxAmountToWithdrawal.toString() : ''
            }
            maxedOut={maxedOut}
            editingState={editingState}
            unit={
              ['withdrawing', 'depositing'].includes(viewAction)
                ? 'BEAM'
                : 'NPH'
            }
            unitPosition="space-between"
            unitIcon={
              ['withdrawing', 'depositing'].includes(viewAction) ? (
                <BeamSmallCoin />
              ) : (
                <NephriteSmallCoin />
              )
            }
            editedAmount={value.gt(0) ? value.toString() : ''}
            setEditedAmount={(amount: string) => {
              setValue(Decimal.from(!!amount ? amount : 0));
              setBorrowAmount(Decimal.from(!!amount ? amount : 0));
            }}
            isInput={true}
            equalizer={
              ['withdrawing', 'depositing'].includes(viewAction)
                ? () => beamPrice.mul(+value.toString()).prettify(2)
                : () => value.prettify(2)
            }
          />

          {
            <Container
              sx={{ mt: '36px', mx: 0, width: '100%', maxWidth: '12rem' }}
            >
              <Box>
                {['withdrawing'].includes(viewAction) || ['repaying'].includes(viewAction) || ['depositing'].includes(viewAction) ? null : <StaticParamsRow
                  label="Issuance fee"
                  labelFor="borrow"
                  labelId="trove-input-static"
                  inputId="trove-borrowing-fee"
                  amount={issuanceFee.toString()}
                  showIfZero={true}
                  pendingAmount={issuanceFeePerc.toString(1)}
                  unit={COIN}
                  infoIcon={
                    <InfoIcon
                      size="xs"
                      tooltip={
                        <Card variant="tooltip" sx={{ whiteSpace: 'normal' }}>
                          This amount is deducted from the borrowed amount as a
                          one-time fee. There are no recurring fees for
                          borrowing, which is thus interest-free.
                        </Card>
                      }
                    />
                  }
                />}
              </Box>
              {['borrowing'].includes(viewAction) || ['withdrawing'].includes(viewAction) || ['repaying'].includes(viewAction) || ['depositing'].includes(viewAction) ? null : <StaticParamsRow
                label="Total debt"
                labelFor="borrow"
                labelId="trove-input-static"
                inputId="trove-total-debt"
                amount={totalDebt.prettify(2)}
                unit={COIN}
                infoIcon={
                  <InfoIcon
                    size="xs"
                    placement="right"
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
              />}
            </Container>
          }
          {
            !original.isEmpty && (
              <Container
                sx={{
                  my: '14px',
                  mx: 0,
                  width: 'fit-content',
                  background:
                    viewAction == 'depositing'
                      ? 'rgba(0, 0, 0, 0.1)'
                      : viewAction == 'repaying'
                        ? 'rgba(112, 160, 11, 0.3)'
                        : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                }}
              >
                <CollateralRatio
                  value={collateralRatio}
                  change={collateralRatioChange}
                  italic={true}
                  icrPositive={
                    viewAction == 'repaying' || viewAction == 'depositing'
                      ? false
                      : true
                  }
                  label={
                    ['withdrawing'].includes(viewAction)
                      ? EstimatedICR.WITHDRAW
                      : ['borrowing'].includes(viewAction)
                        ? EstimatedICR.BORROW
                        : ['depositing'].includes(viewAction)
                          ? EstimatedICR.DEPOSIT
                          : ['repaying'].includes(viewAction)
                            ? EstimatedICR.REPAY
                            : EstimatedICR.DEFAULT}
                  labelId="icr"
                  inputId="icr_input"
                />
              </Container>
            )}

          {
            ['withdrawing'].includes(viewAction) && collateralAmountAllowToWithdraw && (
              <ActionDescription fontStyle='italic'>
                You can withdraw max <Text sx={{ color: 'rgba(0,0,0)', fontWeight: 600 }}>{collateralAmountAllowToWithdraw ? collateralAmountAllowToWithdraw.toString(3) : " "} BEAM</Text>
              </ActionDescription>
            )}

          {['borrowing'].includes(viewAction) && tokAmountAllowToWithdraw && (
            <ActionDescription fontStyle="italic">
              You can borrow{' '}
              <Text sx={{ color: 'rgba(0,0,0)', fontWeight: 600 }}>
                {tokAmountAllowToWithdraw
                  ? tokAmountAllowToWithdraw.toString(2)
                  : ' '}{' '}
                NPH max
              </Text>
            </ActionDescription>
          )}

          {['adjusting'].includes(viewAction) && (
            <ActionDescription fontStyle="italic">
              Keeping your CR above{' '}
              <Text sx={{ color: 'rgba(0,0,0)', fontWeight: 600 }}>150%</Text>{' '}
              can help avoid liquidation under Recovery Mode
            </ActionDescription>
          )}

          {viewAction === 'repaying' && !original.isEmpty && (
            <Box>
              <ActionDescription>
                To close the trove you need to repay{' '}
                <Amount>
                  {original.netDebt.toString()} {COIN}
                </Amount>{' '}
              </ActionDescription>
            </Box>
          )}

          {children}
        </Box>
        {isTransactionPending && <LoadingOverlay />}
      </Card>
    </>
  );
};
