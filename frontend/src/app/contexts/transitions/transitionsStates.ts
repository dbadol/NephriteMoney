import { LiquidationEvent, LiquidationView } from "../Liquidation/types";
import { RedemptionEvent, RedemptionView } from "../Redemption/types";
import { StabilityEvent, StabilityView } from "../StabilityDeposit/types";
import { TroveEvent, TroveView } from "../Trove/types";

type TroveEventTransitions = Record<TroveView, Partial<Record<TroveEvent, TroveView>>>;

type StabilityEventTransitions = Record<
  StabilityView,
  Partial<Record<StabilityEvent, StabilityView>>
>;

type LiquidationEventTransitions = Record<
  LiquidationView,
  Partial<Record<LiquidationEvent, LiquidationView>>
>;

type RedemptionEventTransitions = Record<
  RedemptionView,
  Partial<Record<RedemptionEvent, RedemptionView>>
>;

export const TroveTransitions: TroveEventTransitions = {
  NONE: {
    OPEN_TROVE_PRESSED: "OPENING",
    TROVE_OPENED: "ACTIVE"
  },
  OPENING: {
    CANCEL_OPENING_TROVE_PRESSED: "NONE",
    TROVE_OPENED: "ACTIVE",
    BACK: "NONE",
  },
  ADJUSTING: {
    WITHDRAW_FROM_COLLATERAL_PRESSED: "WITHDRAWING",
    DEPOSIT_TO_COLLATERAL_PRESSED: "DEPOSITING",
    BORROW_FROM_DEBT_PRESSED: "BORROWING",
    REPAY_TO_DEBT_PRESSED: "REPAYING",
    BACK: "ACTIVE",
  },
  WITHDRAWING: {
    CANCEL_WITHDRAW_PRESSED: "ADJUSTING",
    TROVE_WITHDRAWED: "ADJUSTING",
    BACK: "ADJUSTING",
  },
  DEPOSITING: {
    CANCEL_DEPOSIT_PRESSED: "ADJUSTING",
    TROVE_DEPOSITED: "ADJUSTING",
    BACK: "ADJUSTING",
  },
  BORROWING: {
    CANCEL_BORROW_PRESSED: "ADJUSTING",
    TROVE_BORROWED: "ADJUSTING",
    BACK: "ADJUSTING",
  },
  REPAYING: {
    CANCEL_REPAY_PRESSED: "ADJUSTING",
    TROVE_REPAYED: "ADJUSTING",
    TROVE_CLOSED: "NONE",
    BACK: "ADJUSTING",
  },
  CLOSING: {
    TROVE_CLOSED: "NONE",
    TROVE_ADJUSTED: "ACTIVE",
    BACK: "ACTIVE",
  },
  ACTIVE: {
    ADJUST_TROVE_PRESSED: "ADJUSTING",
    CLOSE_TROVE_PRESSED: "CLOSING",
    TROVE_CLOSED: "NONE",
  },
  SURPLUS_ACTIVE: {
    SURPLUS_WITHDRAW_PRESSED: "SURPLUS_WITHDRAW",
    SURPLUS_WITHDRAW_CLOSED: "NONE",
  },
  SURPLUS_WITHDRAW: {
    BACK: "SURPLUS_ACTIVE",
    SURPLUS_WITHDRAW_CLOSED: "NONE",
  },
};

export const stabilityDepositTransitions: StabilityEventTransitions = {
  NONE: {
    OPEN_DEPOSIT_PRESSED: "OPENING",
    DEPOSIT_CONFIRMED: "ACTIVE",
  },
  OPENING: {
    CANCEL_PRESSED: "NONE",
    DEPOSIT_CONFIRMED: "ACTIVE",
    BACK: "NONE",
  },
  ACTIVE: {
    REWARDS_CLAIMED: "ACTIVE",
    ADJUST_DEPOSIT_PRESSED: "ADJUSTING",
    OPEN_DEPOSIT_PRESSED: "OPENING",
    DEPOSIT_EMPTIED: "NONE",
  },
  ADJUSTING: {
    CANCEL_PRESSED: "ACTIVE",
    WITHDRAW_FROM_DEPOSIT_PRESSED: "WITHDRAWING",
    DEPOSIT_TO_DEPOSIT_PRESSED: "DEPOSITING",
    DEPOSIT_FULLY_WITHDRAWN: "NONE",
    BACK: "ACTIVE",
  },
  WITHDRAWING: {
    CANCEL_PRESSED: "ADJUSTING",
    WITHDRAW_FROM_DEPOSIT_PRESSED: "WITHDRAWING",
    DEPOSIT_TO_DEPOSIT_PRESSED: "DEPOSITING",
    DEPOSIT_CONFIRMED: "ADJUSTING",
    DEPOSIT_FULLY_WITHDRAWN: "NONE",
    BACK: "ADJUSTING",
  },
  DEPOSITING: {
    CANCEL_PRESSED: "ADJUSTING",
    WITHDRAW_FROM_DEPOSIT_PRESSED: "WITHDRAWING",
    DEPOSIT_TO_DEPOSIT_PRESSED: "DEPOSITING",
    DEPOSIT_CONFIRMED: "ADJUSTING",
    DEPOSIT_FULLY_WITHDRAWN: "NONE",
    BACK: "ADJUSTING",
  },
};

export const liquidationTransitions: LiquidationEventTransitions = {
  NONE: {
    ADJUST_LIQUIDATION_PRESSED: "ADJUSTING"
  },
  ACTIVE: {
  },
  ADJUSTING: {
    CANCEL_PRESSED: "NONE",
    LIQUIDATION_EMPTIED: "NONE",
    BACK: "NONE",
  },
};

export const redemptionsTransitions: RedemptionEventTransitions = {
  NONE: {
    ADJUST_REDEMPTION_PRESSED: "ADJUSTING"
  },
  ACTIVE: {
  },
  ADJUSTING: {
    CANCEL_PRESSED: "NONE",
    REDEEMED: "NONE",
    BACK: "NONE",
  },
};
