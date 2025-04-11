import React from "react";
import { TextWithAmount } from "@app/components/TextWithAmout";
import { Box, Card, Flex } from "theme-ui";
import BeamSmallCoin from '@app/components/icons/coin/beam-small.svg';
import { IconBeamx } from '@app/components/icons/index';
import { useSelector } from "react-redux";
import { selectStabilityDeposit } from "@app/store/StabilityDepositStore/selectors";
import { selectRate } from "@app/store/NephriteStore/selectors";
import { NotifyMessage } from "@app/components/Readable/NotifyMessage";
import { Button } from '@app/components';
import { StabilityDepositAction } from "@app/views/Actions/StabilityDepositAction";
import { ShaderTransactionComments } from "@app/library/nephrite/types";
import { TransactionWrapper } from "@app/library/transaction-react/TransactionWrapper";
import { getApi } from "@app/utils/getApi";
import { toGroths } from "@app/library/base/appUtils";
import { IsTransactionStatus } from "@app/library/transaction-react/IsTransactionStatus";
import { useCurrentTransactionState } from "@app/library/transaction-react/useCurrentTransactionState";

type ClaimProps = {
  disabled?: boolean;
};

export const Claim: React.FC<ClaimProps> = ({ disabled, children }) => {
  const originalDeposit = useSelector(selectStabilityDeposit());
  const beamPrice = useSelector(selectRate());

  const myTransactionState = useCurrentTransactionState(new RegExp(`${ShaderTransactionComments.setUpdateStabilityPool}`, "g"));
  const [isTransactionPending, isTransactionSuccess] = IsTransactionStatus({ transactionIdPrefix: ShaderTransactionComments.setUpdateStabilityPool });

  const claim = () => {
    if (!(originalDeposit.collateralGain.nonZero || originalDeposit.beamXReward.nonZero)) {
      throw new Error("There are not funds for claming and moving!");
    }

    const nephriteApiMethods: any/* ShaderActions */ = getApi();
    return nephriteApiMethods.userUpdStab({
      newVal: toGroths(+originalDeposit.currentNephrite)
    });
  }

  if (!(isNaN(+originalDeposit.beamXReward) || isNaN(+originalDeposit.collateralGain))) {
    return (
      <Card sx={{ gridArea: (originalDeposit.currentNephrite.isZero ? "1" : "3") + "/ 1 / 3 / 3", }}>
        <Box sx={{ background: '#F4F7EC', padding: '20px', flex: 2 }}>
          <Flex sx={{ flexDirection: 'column' }}>
            <Flex sx={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <TextWithAmount
                icon={<IconBeamx width={22} height={22} />}
                size={'21px'}
                value={originalDeposit.beamXReward.toString()}
                currency='BEAMX'
                text={'Reward'}
                color={'#000'}
                showConvertedToUsd={false}
                equalizer={false}
                fontWeight={600}
              />
              <Box>
                {
                  !isTransactionPending ?
                    <TransactionWrapper
                      id={`${ShaderTransactionComments.setUpdateStabilityPool}: claim from stab pool`}
                      send={() => claim()}
                    >
                      <Button pallete='transparent' variant='ghostBordered' style={{ marginBottom: '-4px', width: '135px' }}>CLAIM</Button>
                    </TransactionWrapper> :
                    <Button pallete='transparent' variant='ghostBordered' style={{ opacity: 0.2, marginBottom: '-4px', width: '135px' }}>CLAIM</Button>
                }

              </Box>
            </Flex>
            <Box sx={{ my: 4 }}>
              <TextWithAmount
                icon={<BeamSmallCoin width={22} height={22} style={{ marginTop: '3px' }} />}
                size={'21px'}
                value={originalDeposit.collateralGain.toString()}
                currency='BEAM'
                color={'#000'}
                text={'Liquidation revenue'}
                showConvertedToUsd={true}
                equalizer={() => beamPrice.mul(originalDeposit.collateralGain).prettify(2)}
                fontWeight={600}
              />
            </Box>
            {originalDeposit.currentNephrite.isZero &&
              <Box>
                <NotifyMessage color='rgba(0, 0, 0, 0.1)' italic={true}>
                  All your deposited NPH had been used for liquidations. Check your liquidation revenue.
                </NotifyMessage>
              </Box>
            }
          </Flex>
        </Box>
      </Card >
    );
  }

  return <></>;

};
