import React from 'react';
import { StabilityDepositManager } from './StabilityDepositManager';


export const WithdrawFromStabilityPool: React.FC = (props) => {
  return (
    <>
      <StabilityDepositManager {...props} />
    </>
  )
}