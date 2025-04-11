import React from 'react';
import { Flex, Box, Card } from 'theme-ui';

import { Decimal, Difference, Percent } from '@app/library/base/Decimal';

import { StaticParamsRow, StaticRow } from '@app/components/Editor';
import { InfoIcon } from '@app/components/InfoIcon';
import { ActionDescription } from '@app/components/ActionDescription';
import { CRITICAL_COLLATERAL_RATIO } from '@app/constants/nephrite';

type CollateralRatioProps = {
  value?: Decimal;
  change?: Difference;
  italic?: boolean;
  background?: string;
  icrPositive?: boolean;
  labelId?: string;
  inputId?: string;
  label?: string;
  labelFor?: string;
};

export const CollateralRatio: React.FC<CollateralRatioProps> = ({
  value,
  change,
  italic = false,
  icrPositive = true,
  labelId = 'icr_input-static',
  label = 'ICR',
  inputId = 'estimated-icr',
  labelFor = 'collaterialRatio',
}) => {
  const collateralRatioPct = new Percent(value ?? 0);
  const collateralRatioNumber = Number(
    collateralRatioPct.prettify().split('%')[0],
  );

  const changePct = change && new Percent(change);
  return (
    <>
      <StaticParamsRow
        label={label}
        inputId={inputId}
        labelId={labelId}
        labelFor={labelFor}
        amount={collateralRatioPct.prettify()}
        icrPositive={collateralRatioNumber > 110 ? icrPositive : false}
        showIfZero={true}
        color={
          value?.gt(CRITICAL_COLLATERAL_RATIO)
            ? 'text'
            : value?.gt(1.2)
            ? 'warning'
            : value?.lte(1.2)
            ? 'danger'
            : 'text'
        }
        pendingAmount={
          null
        }
        infoIcon={
          inputId == 'trove-icr' ? (
            <InfoIcon
              size="xs"
              tooltip={
                <Card variant="tooltip" sx={{ whiteSpace: 'normal' }}>
                  The Individual Collateral Ratio (TCR) is the ratio of the US
                  dollar value of the collateral in your trove at the current
                  BEAM:USD price, to your debt.
                </Card>
              }
            />
          ) : null
        }
        pendingColor={change?.positive ? 'success' : 'danger'}
      />
    </>
  );
};
