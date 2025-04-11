import React, { useMemo } from 'react'

import { Container, Flex, Grid } from "theme-ui";
import { TroveWidget } from "@app/views/TroveWidget/";
import { LiquidationWidget } from '@app/views/LiquidationWidget/';
import { StabilityDepositWidget } from '@app/views/StabilityDepositWidget';
import { TroveViewProvider } from '@app/contexts/Trove/TroveViewProvider';
import { StabilityViewProvider } from '@app/contexts/StabilityDeposit/StabilityViewProvider';
import { Link, useParams } from 'react-router-dom';
import { RedemptionWidget } from '@app/views/RedemptionWidget';

export const Editable: React.FC = () => {
  let SpecificAction = null;
  let { action, view } = useParams();

  const components = {
    trove: TroveWidget,
    stabilityDeposit: StabilityDepositWidget,
    liquidation: LiquidationWidget,
    redemption: RedemptionWidget,
  }

  try {
    SpecificAction = useMemo(() => {
      return Object.keys(components).filter((componentKey) => {
        return componentKey.toLowerCase() === action.toLowerCase();
      })
        .map((componentKey) => components[componentKey])
        .pop()
    }, [components, action]);

    if (!SpecificAction) throw new Error("there is no component to select in editable page");
  } catch (error) {
    throw new Error(error.message);
  }

  return (
    <>
      <Container>
          <Grid variant='readablePage'>
            <SpecificAction view={view} />
          </Grid>
      </Container>
    </>

  )
};
