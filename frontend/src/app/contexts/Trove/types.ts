type NoneView = "NONE";
type LiquidatedView = "LIQUIDATED";
type RedeemedView = "REDEEMED";
type OpeningView = "OPENING";
type AdjustingView = "ADJUSTING";
type ClosingView = "CLOSING";
type ActiveView = "ACTIVE";
type SurplusActiveView = "SURPLUS_ACTIVE";
type SurplusWithdrawView = "SURPLUS_WITHDRAW";
type WithdrawView = "WITHDRAWING";
type DepositView = "DEPOSITING";
type BorrowView = "BORROWING";
type RepayView = "REPAYING";


export type TroveView =
  | NoneView
  | OpeningView
  | AdjustingView
  | ClosingView
  | ActiveView
  | WithdrawView
  | DepositView
  | BorrowView
  | RepayView
  | SurplusActiveView
  | SurplusWithdrawView;

type OpenTrovePressedEvent = "OPEN_TROVE_PRESSED";
type AdjustTrovePressedEvent = "ADJUST_TROVE_PRESSED";
type SurplusWithdrawPressedEvent = "SURPLUS_WITHDRAW_PRESSED";
type CloseTrovePressedEvent = "CLOSE_TROVE_PRESSED";
type TroveAdjustedEvent = "TROVE_ADJUSTED";
type TroveOpenedEvent = "TROVE_OPENED";
type TroveClosedEvent = "TROVE_CLOSED";
type TroveLiquidatedEvent = "TROVE_LIQUIDATED";
type TroveRedeemedEvent = "TROVE_REDEEMED";
type TroveSurplusCollateralClaimedEvent = "TROVE_SURPLUS_COLLATERAL_CLAIMED";
type BackToDashboard = "BACK";
type WithdrawFromCollateralPressedEvent = "WITHDRAW_FROM_COLLATERAL_PRESSED";
type DepositToCollateralPressedEvent = "DEPOSIT_TO_COLLATERAL_PRESSED";
type BorrowFromDebtPressedEvent = "BORROW_FROM_DEBT_PRESSED";
type RepayToDebtPressedEvent = "REPAY_TO_DEBT_PRESSED";
type CancelWithdrawPressedEvent = "CANCEL_WITHDRAW_PRESSED";
type CancelDepositPressedEvent = "CANCEL_DEPOSIT_PRESSED";
type CancelBorrowPressedEvent = "CANCEL_BORROW_PRESSED";
type CancelRepayPressedEvent = "CANCEL_REPAY_PRESSED";
type CancelOpeningPressedEvent = "CANCEL_OPENING_TROVE_PRESSED";
type TrovWithdrawedEvent = "TROVE_WITHDRAWED";
type TrovDepositedEvent = "TROVE_DEPOSITED";
type TrovBorrowedEvent = "TROVE_BORROWED";
type TrovRepayedEvent = "TROVE_REPAYED";
type SurplusWithdrawClosedEvent = "SURPLUS_WITHDRAW_CLOSED";


export type TroveEvent =
  | OpenTrovePressedEvent
  | SurplusWithdrawPressedEvent
  | AdjustTrovePressedEvent
  | CloseTrovePressedEvent
  | TroveClosedEvent
  | TroveLiquidatedEvent
  | TroveRedeemedEvent
  | TroveAdjustedEvent
  | TroveSurplusCollateralClaimedEvent
  | BackToDashboard
  | TroveOpenedEvent
  | WithdrawFromCollateralPressedEvent
  | DepositToCollateralPressedEvent
  | BorrowFromDebtPressedEvent
  | RepayToDebtPressedEvent
  | CancelBorrowPressedEvent
  | CancelDepositPressedEvent
  | CancelRepayPressedEvent
  | CancelWithdrawPressedEvent
  | CancelOpeningPressedEvent
  | TrovWithdrawedEvent
  | TrovDepositedEvent
  | TrovBorrowedEvent
  | TrovRepayedEvent
  | SurplusWithdrawClosedEvent;
