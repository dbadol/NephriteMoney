import React from 'react';
import { Card, Heading, Link, Box, Text } from 'theme-ui';
import theme from '../../theme';
import { Statistic } from '@app/components/Statistic';
import { useNephriteSelector } from '@app/hooks/useNephriteSelector';
import { Decimal, Percent } from '@app/library/base/Decimal';
import { COIN, GROTHS_IN_BEAM, GT } from '@app/constants';
import { useSelector } from 'react-redux';
import { selectUserTrove } from '@app/store/TroveStore/selector';
import { fromGroths } from '../../library/base/appUtils';
import { selectRate } from '@app/store/NephriteStore/selectors';
import { selectForStabilityDepositManager } from '@app/store/StabilityDepositStore/selectors';

export const UserStats: React.FC = () => {
  const userTrove = useSelector(selectUserTrove());
  const beamPrice = useSelector(selectRate());
  const { originalDeposit } = useSelector(selectForStabilityDepositManager());

  return (
    <Card
      sx={{
        p: [4],
        m: '0px !important',
        minWidth: '280px',
        position: 'static',
      }}
    >
      <Heading
        as="h3"
        sx={{
          color: '#000',
          letterSpacing: '2px',
          fontWeight: 800,
          mb: '16px',
        }}
      >
        MY POSITION
      </Heading>
      <Statistic
        name="ICR"
        tooltip="The Individual Collateral Ratio (TCR) is the ratio of the US dollar value of the collateral in your trove at the current BEAM:USD price, to your debt."
      >
        <Box
          color={
            !userTrove.isEmpty &&
            +Decimal.from(userTrove.cr).toString(1) < 120
              ? 'danger' : (+Decimal.from(userTrove.cr).toString(1) >= 120 && +Decimal.from(userTrove.cr).toString(1) <= 150) ? 'warning'
              : '#000'
          }
        >
          {!userTrove.isEmpty
            ? Decimal.from(userTrove.cr).toString(1) + '%'
            : '–'}
        </Box>
      </Statistic>
      <Statistic
        name="Total NPH Debt"
        tooltip="Total NPH Debt = Amount of NPH you should provide to the system to withdraw all collateral from your trove + Liquidation Reserve you should not repay."
      >
        {!userTrove.isEmpty ? userTrove.debt.prettify() : '–'}
      </Statistic>
      <Statistic
        name="NPH in Stability Pool"
        tooltip="Your NPH currently held in the Stability Pool, expressed as an amount and a fraction of the NPH supply."
      >
        {!originalDeposit.currentNephrite.isZero
          ? originalDeposit.currentNephrite.prettify()
          : '–'}
      </Statistic>
    </Card>
  );
};
