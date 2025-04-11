import React from 'react';
import { StabilityDepositManager } from './StabilityDepositManager';

export const DepositToStabilityPool: React.FC = (props) => {
  return (
    <>
      <StabilityDepositManager {...props} />
    </>
  )
}