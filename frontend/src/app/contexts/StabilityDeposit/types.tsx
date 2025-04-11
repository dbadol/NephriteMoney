type NoneView = "NONE";
type OpeningView = "OPENING";
type ActiveView = "ACTIVE";
type AdjustingView = "ADJUSTING";
type WithdrawView = "WITHDRAWING";
type DepositView = "DEPOSITING";

export type StabilityView = NoneView | OpeningView | ActiveView | AdjustingView | WithdrawView | DepositView;

type OpenDepositPressedEvent = "OPEN_DEPOSIT_PRESSED";
type AdjustDepositPressedEvent = "ADJUST_DEPOSIT_PRESSED";
type CancelPressedEvent = "CANCEL_PRESSED";
type CancelWithdrawPressedEvent = "CANCEL_WITHDRAW_PRESSED";
type CancelDepositPressedEvent = "CANCEL_DEPOSIT_PRESSED";
type DepositConfirmedEvent = "DEPOSIT_CONFIRMED";
type RewardsClaimedEvent = "REWARDS_CLAIMED";
type DepositEmptiedEvemt = "DEPOSIT_EMPTIED";
type DepositFullyWithdrawnEvemt = "DEPOSIT_FULLY_WITHDRAWN";
type BackToDashboard = "BACK";
type WithdrawFromDepositPressedEvent = "WITHDRAW_FROM_DEPOSIT_PRESSED";
type DepositToDepositPressedEvent = "DEPOSIT_TO_DEPOSIT_PRESSED";

export type StabilityEvent =
  | OpenDepositPressedEvent
  | AdjustDepositPressedEvent
  | CancelPressedEvent
  | CancelWithdrawPressedEvent
  | CancelDepositPressedEvent
  | DepositConfirmedEvent
  | RewardsClaimedEvent
  | BackToDashboard
  | DepositEmptiedEvemt
  | WithdrawFromDepositPressedEvent
  | DepositToDepositPressedEvent
  | DepositFullyWithdrawnEvemt;
