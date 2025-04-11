import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Box, Card, Text, Container } from 'theme-ui';
import BeamSmallCoin from '@app/components/icons/coin/beam-small.svg';
import NephriteSmallCoin from '@app/components/icons/coin/nephrite-flat-small.svg';
import { EditableRow, StaticParamsRow, StaticRow } from '@app/components/Editor';
import { Statistic } from '@app/components/Statistic';
import { NotifyMessage } from '@app/components/Readable/NotifyMessage';
import { Button } from '@app/components';
import { Decimal, Percent } from '@app/library/base/Decimal';
import { useSelector } from 'react-redux';
import { selectIssueRate, selectRate, selectTotal } from '@app/store/NephriteStore/selectors';
import { ErrorDescription } from '@app/components/ErrorDescription';
import {ASSET, COIN, MINIMUM_COLLATERAL_RATIO, NEPHRITE_LIQUIDATION_RESERVE} from '@app/constants';
import { useTitle } from '@app/contexts/Nephrite/TitleContext';
import { InfoIcon } from '@app/components/InfoIcon';
import { TransactionWrapper } from '@app/library/transaction-react/TransactionWrapper';
import { ShaderTransactionComments } from '@app/library/nephrite/types';
import { getApi } from '@app/utils/getApi';
import {fromGroths, toGroths} from '@app/library/base/appUtils';
import { RedemptionModal } from '../components/RedemptionModal';
import { useCurrentTransactionState } from '@app/library/transaction-react/useCurrentTransactionState';
import { IsTransactionStatus } from '@app/library/transaction-react/IsTransactionStatus';
import { useRedemptionView } from '@app/contexts/Redemption/RedemptionViewContext';
import { loadUserView } from '@app/store/NephriteStore/actions';
import store from 'index';
import { LoadingOverlay } from '@app/components/LoadingOverlay';
import useCalculateRedemptionFee from '@app/hooks/useCalculateRedemptionFee';
import { Fees } from '@app/library/nephrite/Fees';
import useCouldLiquidate from "@app/hooks/useCouldLiquidate";

const mcrPercent = new Percent(MINIMUM_COLLATERAL_RATIO).toString(0);

export const Redemption: React.FC = () => {
  const { setCurrentTitle } = useTitle();
  const { dispatchEvent } = useRedemptionView();

  const editingState = React.useState<string>();
  const [nephriteAmount, setNephriteAmount] = useState<Decimal>(Decimal.ZERO);
  const [redemptionFee, setRedemptionFee] = useState<Decimal | { fee: Decimal; percent: Decimal; }>(Decimal.ZERO);
  const [redemptionFeePerc, setRedemptionFeePerc] = useState<string>(Decimal.ZERO+'%');
  const [couldLiquidate, setCouldLiquidate] = useState<boolean>();

  const total = useSelector(selectTotal());
  const beamPrice = useSelector(selectRate());
  const issuanceFeeRate = useSelector(selectIssueRate());
  const beamAmount = nephriteAmount.div(beamPrice);
  const transactionState = useCurrentTransactionState(new RegExp(`${ShaderTransactionComments.setRedeem}`, "g"));
  const [isTransactionPending, isTransactionFailed, isTransactionSuccess] = IsTransactionStatus({ transactionIdPrefix: ShaderTransactionComments.setRedeem });

  const [canRedeem, description] = couldLiquidate
    ? [
      false,
      <ErrorDescription>
        You can't redeem NEPHRITE when the total collateral ratio is less than{" "}
        {mcrPercent}. Please try again later.
      </ErrorDescription>
    ]
    : [
      true,
      !nephriteAmount.isZero ? <Box sx={{ my: '14px' }}><NotifyMessage color='rgba(0, 0, 0, 0.1)' italic={true}>
        <div style={{display:"flex", width: "max-content"}}>
          <span>You will receive</span><InfoIcon
            size="xs"
            placement="left"
            tooltip={
              <Card variant="tooltip" sx={{ whiteSpace: 'normal' }}>
                Minus the fee
              </Card>
            }
        />
          <Text style={{marginLeft:"10px"}} sx={{ color: 'rgba(0,0,0)', fontWeight: 700 }}>{beamAmount.sub(0).prettify(2)} BEAM{" "}</Text>
        </div>
      </NotifyMessage>
  </Box> : <></>
    ];

  const redeem = (value) => {
    const nephriteApiMethods: any = getApi();
    return nephriteApiMethods.userRedeem({ val: toGroths(value) });
  }

  const [isShownModal, setIsShownModal] = useState(false);
  const toggleModal = () => setIsShownModal(!isShownModal);

  useEffect(() => {
    setCurrentTitle("Redemption")
  }, []);

  useEffect(() => {
    (async () => {
      const {fee, fee_perc} = await useCalculateRedemptionFee({ value: nephriteAmount });
      setRedemptionFee( Decimal.from(fromGroths(fee)));
      setRedemptionFeePerc(Decimal.from(fee_perc) + "%")
    })();

    return () => { }
  }, [nephriteAmount])

  useEffect(() => {
    if (!canRedeem) {
      toggleModal();
    }
  }, [canRedeem]);

  useEffect(() => {
    if (isTransactionPending) {
      setIsShownModal(false);
    }

    if (isTransactionSuccess) {
      store.dispatch(loadUserView.request())
    }
  }, [transactionState.type])

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

  const handleCancel = useCallback(() => {
    setNephriteAmount(Decimal.ZERO);
  }, [dispatchEvent]);


  return (
    <>
      <Card sx={{ gridArea: "1 / 1 / 3 / 3" }}>

        <Box sx={{ background: '#F4F7EC', padding: '20px', flex: 2 }}>
          <EditableRow
            label="Amount"
            labelId="redeem-input"
            inputId="redeem"
            amount={nephriteAmount.toString()}
            unit={COIN}
            unitPosition="space-between"
            unitIcon={<NephriteSmallCoin />}
            editingState={editingState}
            editedAmount={nephriteAmount.toString()}
            setEditedAmount={(amount: string) => { setNephriteAmount(Decimal.from(!!amount ? amount : 0)) }}
            equalizer={() => nephriteAmount.prettify(2)}
            isInput={true}
          />

          <Container sx={{ mt: '36px', mx: 0, width: "100%", maxWidth: "15rem" }}>
            <StaticParamsRow
              label="Redemption fee"
              labelId="redemption-fee"
              inputId="redeem-fee"
              labelFor='redemption-fee'
              amount={redemptionFee.toString(2)}
              pendingAmount={redemptionFeePerc.toString(2)}
              unit={ASSET}
              showIfZero={true}
            />
            <Box sx={{ mb: '14px' }}>
              {canRedeem && description}
            </Box>
          </Container>

          <Flex sx={{ justifyContent: 'center', marginTop: '40px' }}>
            <Box sx={{ marginRight: ' 24px' }}>
              <Button variant="ghost" style={{ width: '140px', height: '37px', letterSpacing: '0.1em' }} onClick={handleCancel}>CANCEL</Button>
            </Box>
            <Box>
              {
                canRedeem && !isTransactionPending && !nephriteAmount.isZero ?
                  <TransactionWrapper
                    id={`${ShaderTransactionComments.setRedeem}: ${nephriteAmount} NPH for ${beamAmount.prettify()} BEAM `}
                    send={() => redeem(nephriteAmount)}
                  >
                    <Button pallete="gradient" style={{ width: '140px', height: '37px', letterSpacing: '0.1em' }} disabled={nephriteAmount.isZero}>CONFIRM</Button>
                  </TransactionWrapper> :
                  <Button style={{ opacity: "0.3", width: '140px', height: '37px', letterSpacing: '0.1em' }} pallete="gradient" disabled={!nephriteAmount.isZero}>CONFIRM</Button>
              }
            </Box>
          </Flex>
        </Box>
        {isTransactionPending && <LoadingOverlay />}
      </Card>

      <RedemptionModal onCloseModal={toggleModal} isShown={isShownModal} />
    </>
  )
}
