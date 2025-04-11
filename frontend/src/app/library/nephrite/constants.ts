import { Decimal, Decimalish } from "@app/library/base/Decimal";

export const CRITICAL_COLLATERAL_RATIO = Decimal.from(1.5);
export const MINIMUM_COLLATERAL_RATIO = Decimal.from(1.1);
export const NEPHRITE_LIQUIDATION_RESERVE = Decimal.from(10);
export const NEPHRITE_MINIMUM_NET_DEBT = Decimal.from(1);
export const NEPHRITE_MINIMUM_DEBT = NEPHRITE_LIQUIDATION_RESERVE
export const MINIMUM_BORROWING_RATE = Decimal.from(0.005);
export const MAXIMUM_BORROWING_RATE = Decimal.from(0.05);
export const MINIMUM_REDEMPTION_RATE = Decimal.from(0.005);
