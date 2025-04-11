import React from 'react'

import { Box, Container, Flex, Grid, Text } from "theme-ui";
import { Link } from 'react-router-dom';
import { TroveWidget } from '@app/views/TroveWidget/';
import { StabilityDepositWidget } from '@app/views/StabilityDepositWidget';
import { LiquidationWidget } from '@app/views/LiquidationWidget';
import { RedemptionWidget } from '@app/views/RedemptionWidget/';
import FadeIn from 'react-fade-in';

export const ReadableDashboard: React.FC = () => (
  <>
    <FadeIn>
      <Grid variant='readablePage'>
        <TroveWidget/>
        <StabilityDepositWidget />
        <LiquidationWidget />
        <RedemptionWidget />
      </Grid>
    </FadeIn>
  </>
);
