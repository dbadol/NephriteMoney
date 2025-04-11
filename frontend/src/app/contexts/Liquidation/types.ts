type NoneView = "NONE";
type ActiveView = "ACTIVE";
type AdjustingView = "ADJUSTING";

export type LiquidationView = NoneView | ActiveView | AdjustingView;

type AdjustLiquidationPressedEvent = "ADJUST_LIQUIDATION_PRESSED";
type CancelPressedEvent = "CANCEL_PRESSED";
type BackToDashboard = "BACK";
type LiquidationEmptiedEvent = "LIQUIDATION_EMPTIED";

export type LiquidationEvent =
  | AdjustLiquidationPressedEvent
  | CancelPressedEvent
  | BackToDashboard
  | LiquidationEmptiedEvent
