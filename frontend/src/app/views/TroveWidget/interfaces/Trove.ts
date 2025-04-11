export interface OpeningTroveInterface {
  isDirty: any;
  isTransactionPending: any;
  collateral: any;
  editingState: any;
  setCollateral: any;
  borrowAmount: any;
  setBorrowAmount: any;
  fee: any;
  issuanceFee: any;
  feePct: any;
  totalDebt: any;
  collateralRatio: any;
  description: any;
  handleCancelPressed: any;
  stableTroveChange: any;
  maxBorrowingRate: any;
  reset: any;
  TRANSACTION_ID: any;
  redemptionFeePerc:any;
  minCollateral: any
}

export interface AdjustingTroveInterface {
  reset: any;
  isDirty: any;
  isTransactionPending: any;
  collateral: any;
  setCollateral: any;
  editingState: any;
  netDebt: any;
  setNetDebt: any;
  fee: any;
  feePct: any;
  maxBorrowingRate: any;
  totalDebt: any;
  collateralRatio: any;
  collateralRatioChange: any;
  description: any;
  handleCancelPressed: any;
  stableTroveChange: any;
  TRANSACTION_ID: any;
  trove: any;
}
