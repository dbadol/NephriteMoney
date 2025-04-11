type NoneView = "NONE";
type ActiveView = "ACTIVE";
type AdjustingView = "ADJUSTING";

export type RedemptionView = NoneView | ActiveView | AdjustingView;

type AdjustRedemptionPressedEvent = "ADJUST_REDEMPTION_PRESSED";
type CancelPressedEvent = "CANCEL_PRESSED";
type BackToDashboard = "BACK";
type RedeemedEvent = "REDEEMED";

export type RedemptionEvent =
  | AdjustRedemptionPressedEvent
  | CancelPressedEvent
  | BackToDashboard
  | RedeemedEvent
