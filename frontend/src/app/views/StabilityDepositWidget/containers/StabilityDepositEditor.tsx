import React, { useEffect, useMemo, useState } from 'react';
import { Heading, Box, Card, Button, Container, Flex, Text } from 'theme-ui';

import { Decimal, Decimalish, Difference } from '@app/library/base/Decimal';

import { StabilityDeposit } from '@app/library/nephrite';

import { COIN, GROTHS_IN_BEAM, GT } from '@app/constants';

import { Icon } from '@app/components/Icon';
import {
  EditableRow,
  StaticParamsRow,
  StaticRow,
} from '@app/components/Editor';
import { useNephriteSelector } from '@app/hooks/useNephriteSelector';
import store from 'index';
import { LoadingOverlay } from '@app/components/LoadingOverlay';
import { revertUserStabilityDepositToInitial } from '@app/store/StabilityDepositStore/actions';
import NephriteSmallCoin from '@app/components/icons/coin/nephrite-flat-small.svg';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { Statistic } from '@app/components/Statistic';
import { NotifyMessage } from '@app/components/Readable/NotifyMessage';
import { UserPoolShare } from '../components/UserPoolShare';
import { TextWithAmount } from '@app/components/TextWithAmout';
import { Claim } from '../components/Claim';
import useNephriteInStabilityPoolAfterChange from '@app/hooks/useNephriteInStabilityPoolAfterChange';
import { IsTransactionStatus } from '@app/library/transaction-react/IsTransactionStatus';
import { ShaderTransactionComments } from '@app/library/nephrite/types';
import { CollateralRatio } from '@app/views/TroveWidget/components/CollateralRatio';

const select = ({ appParams }) => ({
  nephriteInStabilityPool: Decimal.from(appParams.stab_pool.tok).div(
    GROTHS_IN_BEAM,
  ),
});

type StabilityDepositEditorProps = {
  originalDeposit: StabilityDeposit;
  editedAmount: Decimal;
  changePending: boolean;
  setEditedAmount?: any;
  maxAmountRequired?: boolean;
  editingState: string;
  setEditingState: any;
  view: string;
};

export const StabilityDepositEditor: React.FC<StabilityDepositEditorProps> = ({
  originalDeposit,
  editedAmount,
  changePending,
  setEditedAmount,
  maxAmountRequired,
  editingState,
  setEditingState,
  view,
  children,
}) => {
  const userCurrentNeprite = useMemo(() => originalDeposit.currentNephrite, [
    originalDeposit,
  ]);

  const { nephriteInStabilityPool } = useNephriteSelector(select);
  const [poolShareCalculation, _setPoolShareCalculation] = useState<Decimalish>(
    userCurrentNeprite,
  );

  const [isTransactionPending] = IsTransactionStatus({
    transactionIdPrefix: ShaderTransactionComments.setUpdateStabilityPool,
  });

  const setPoolShareCalculation = value => {
    const result = ['depositing', 'opening'].includes(view)
      ? userCurrentNeprite.add(value)
      : userCurrentNeprite.gte(value)
        ? userCurrentNeprite.sub(value)
        : Decimal.ZERO;
    return _setPoolShareCalculation(result);
  };

  const edited = !editedAmount.eq(userCurrentNeprite);

  const maxAmountToWithdrawal = maxAmountRequired ? userCurrentNeprite : false;
  const maxedOut = maxAmountToWithdrawal
    ? editedAmount.eq(maxAmountToWithdrawal)
    : false;

  const nephriteInStabilityPoolAfterChange = useNephriteInStabilityPoolAfterChange(
    {
      view,
      nephriteInStabilityPool,
      originalDeposit,
      editedNephrite: editedAmount,
    },
  );

  useEffect(() => {
    setPoolShareCalculation(editedAmount);
  }, [editedAmount, view]);

  const newPoolShare = editedAmount.mulDiv(
    100,
    nephriteInStabilityPoolAfterChange,
  );

  return (
    <>
      <Card sx={{ gridArea: '1 / 1 / 3 / 3' }}>
        <Box sx={{ background: '#F4F7EC', padding: '20px', flex: 2 }}>
          <EditableRow
            label="Amount"
            labelId="pool-nephrite-input"
            inputId="pool-nephrite-actions"
            amount={editedAmount.toString()}
            maxAmount={
              maxAmountToWithdrawal ? maxAmountToWithdrawal.toString() : ''
            }
            maxedOut={maxedOut}
            unit={COIN}
            unitPosition="space-between"
            unitIcon={<NephriteSmallCoin />}
            editingState={[editingState, setEditingState]}
            editedAmount={editedAmount.gt(0) ? editedAmount.toString() : '0'}
            isInput={true}
            setEditedAmount={
              setEditedAmount
                ? newValue =>
                  setEditedAmount(Decimal.from(!!newValue ? newValue : 0))
                : newValue => store.dispatch({ type: 'setDeposit', newValue })
            }
            equalizer={() => editedAmount.prettify(2)}
          />

          {!editedAmount.isZero && (
            <Container
              sx={{
                mt: '30px',
                mx: 0,
                width: '100%',
                maxWidth: '18rem',
                borderRadius: '4px',
              }}
            >
              <Box
                sx={{
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  padding: '0px 10px',
                  width: 'fit-content',
                }}
              >
                {!newPoolShare.infinite && (
                  <UserPoolShare
                    view={view}
                    editedNephrite={editedAmount}
                    statistic={true}
                    text={
                      (view === 'depositing' || view == 'opening')
                        ? 'Your estimated pool share after the deposit is'
                        : 'Your estimated pool share after the withdrawal is'
                    }
                  />
                )}
              </Box>
            </Container>
          )}

          {children}
        </Box>
        {isTransactionPending && <LoadingOverlay />}
      </Card>

      {['depositing'].includes(view) &&
        !isNaN(+originalDeposit.currentNephrite) &&
        !originalDeposit.currentNephrite.isZero && (
          <Card sx={{ gridArea: '3 / 1 / 3 / 3' }}>
            <Box sx={{ background: '#F4F7EC', padding: '20px', flex: 2 }}>
              <Flex sx={{ flexDirection: 'column' }}>
                <Flex
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}
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
                    value={userCurrentNeprite.prettify(2)}
                    currency="NPH"
                    color={'#000'}
                    text={'Collateral amount'}
                    showConvertedToUsd={true}
                    equalizer={() => userCurrentNeprite.prettify(2)}
                  />
                </Flex>
                <Container
                  sx={{
                    mt: '24px',
                    mb: '10px',
                    mx: 0,
                    width: 'auto',
                    maxWidth: '10rem',
                  }}
                >
                  <UserPoolShare
                    text="Your pool share"
                    view={'adjusting'}
                    editedNephrite={userCurrentNeprite}
                  />
                </Container>
              </Flex>
            </Box>
            <Flex sx={{ flex: 1 }}></Flex>
          </Card>
        )}

      {['opening', 'depositing'].includes(view) && (
        <Card sx={{ gridArea: '4/3/4/1', background: 'transparent' }}>
          <Box sx={{ background: '#F4F7EC', padding: '24px', flex: 2 }}>
            <Text variant="note" sx={{ color: 'rgba(0,0,0)' }}>
              {' '}
              Please note{' '}
            </Text>
            <Text variant="note">
              that the purpose of the Stability pool is to act as a collective
              liquidator of risky troves. Consequently, when there are risky
              troves in the system - withdrawals from the Stability pool are
              disabled until the liquidation of these troves. By depositing your
              NPH to the Stability pool, you provide the right to use these NPH
              for liquidations to the system.
            </Text>
          </Box>
          <Flex sx={{ flex: 1 }}></Flex>
        </Card>
      )}

      {['opening'].includes(view) &&
        (originalDeposit.collateralGain.nonZero ||
          originalDeposit.beamXReward.nonZero) && <Claim />}
    </>
  );
};
