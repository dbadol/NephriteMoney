import React, { useEffect } from 'react';
import { PageTitle } from '@app/components/PageTitle/PageTitle';
import { Flex, Box, Text, Card } from 'theme-ui';
import { SystemStats } from '@app/views/SystemStats';
import { UserStats } from '@app/views/SystemStats/UserStats';
import { TextWithAmount } from '@app/components/TextWithAmout';
import { NotifyMessage } from '@app/components/Readable/NotifyMessage';
import { Button } from '@app/components';
import Beam from '@app/components/icons/coin/beam-small.svg';
import { TransactionWrapper } from '@app/library/transaction-react/TransactionWrapper';
import { ShaderTransactionComments } from '@app/library/nephrite/types';
import { useSelector } from 'react-redux';
import { selectUserSurplus } from '@app/store/TroveStore/selector';
import { selectRate } from '@app/store/NephriteStore/selectors';
import { useTitle } from '@app/contexts/Nephrite/TitleContext';
import { useCurrentTransactionState } from '@app/library/transaction-react/useCurrentTransactionState';
import { IsTransactionStatus } from '@app/library/transaction-react/IsTransactionStatus';
import store from 'index';
import { loadUserView } from '@app/store/NephriteStore/actions';
import { useTroveView } from '@app/contexts/Trove/TroveViewContext';
import { getApi } from '@app/utils/getApi';


export const TakeFunds: React.FC<any> = (props) => {
  const { setCurrentTitle } = useTitle();
  setCurrentTitle(props?.title);

  const { dispatchEvent } = useTroveView();

  const transactionState = useCurrentTransactionState(new RegExp(`${ShaderTransactionComments.setWithdrawSurplus}`, "g"));
  const [isTransactionPending, isTransactionFailed, isTransactionSuccess] = IsTransactionStatus({ transactionIdPrefix: ShaderTransactionComments.setWithdrawSurplus });

  const surplus = useSelector(selectUserSurplus());
  const beamPrice = useSelector(selectRate());

  const collateral = surplus.collateral;

  const withdrawSurplus = () => {
    if (surplus.collateral.isEmpty) {
      throw new Error("Invalid surplus collateral");
    }
    
    const nephriteApiMethods: any/* ShaderActions */ = getApi();
    return nephriteApiMethods.userWithdrawSurplus({ });
  }

  useEffect(() => {
    if (isTransactionSuccess) {
      store.dispatch(loadUserView.request())
      dispatchEvent("SURPLUS_WITHDRAW_CLOSED");
    }
  }, [transactionState])

  useEffect(() => {
  }, [surplus])

  return (
    <>
      <Card sx={{ gridArea: "1 / 1 / 3 / 3" }}>
        <Box sx={{ background: '#F4F7EC', padding: '20px', flex: 2 }}>
          <Flex sx={{ flexDirection: 'column' }}>
            <Flex sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <TextWithAmount
                icon={<Beam width={22} height={22} />}
                size={'21px'}
                value={collateral.toString()}
                currency='BEAM'
                color={'#000'}
                text={'Collateral amount'}
                showConvertedToUsd={true}
                equalizer={() => beamPrice.mul(+collateral.toString()).prettify(2)}
              />
              <Box>
                {!isTransactionPending ?
                  <TransactionWrapper
                    id={`${ShaderTransactionComments.setWithdrawSurplus}: ${collateral.toString()} BEAM`}
                    send={() => withdrawSurplus()}
                  >
                    <Button pallete='transparent' variant='ghostBordered' style={{ width: '135px' }}>WITHDRAW</Button>
                  </TransactionWrapper> :
                  <Button pallete='transparent' variant='ghostBordered' style={{ width: '135px', opacity: 0.2 }}>WITHDRAW</Button>
                }
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Card>
    </>
  )
}