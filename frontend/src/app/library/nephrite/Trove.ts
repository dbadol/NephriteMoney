import assert from "assert";

import { Decimal, Decimalish } from "@app/library/base/Decimal";

import {
  MINIMUM_COLLATERAL_RATIO,
  CRITICAL_COLLATERAL_RATIO,
  NEPHRITE_LIQUIDATION_RESERVE,
  MINIMUM_BORROWING_RATE
} from './constants';
import cuid from "cuid";

/** @internal */ export type _CollateralDeposit<T> = { depositCollateral: T };
/** @internal */ export type _CollateralWithdrawal<T> = { withdrawCollateral: T };
/** @internal */ export type _NephriteBorrowing<T> = { borrowNephrite: T };
/** @internal */ export type _NephriteRepayment<T> = { repayNephrite: T };

/** @internal */ export type _NoCollateralDeposit = Partial<_CollateralDeposit<undefined>>;
/** @internal */ export type _NoCollateralWithdrawal = Partial<_CollateralWithdrawal<undefined>>;
/** @internal */ export type _NoNephriteBorrowing = Partial<_NephriteBorrowing<undefined>>;
/** @internal */ export type _NoNephriteRepayment = Partial<_NephriteRepayment<undefined>>;

/** @internal */
export type _CollateralChange<T> =
  | (_CollateralDeposit<T> & _NoCollateralWithdrawal)
  | (_CollateralWithdrawal<T> & _NoCollateralDeposit);

/** @internal */
export type _NoCollateralChange = _NoCollateralDeposit & _NoCollateralWithdrawal;

/** @internal */
export type _DebtChange<T> =
  | (_NephriteBorrowing<T> & _NoNephriteRepayment)
  | (_NephriteRepayment<T> & _NoNephriteBorrowing);

/** @internal */
export type _NoDebtChange = _NoNephriteBorrowing & _NoNephriteRepayment;


export type TroveCreationParams<T = unknown> = _CollateralDeposit<T> &
  _NoCollateralWithdrawal &
  _NephriteBorrowing<T> &
  _NoNephriteRepayment;

export type TroveClosureParams<T> = _CollateralWithdrawal<T> &
  _NoCollateralDeposit &
  Partial<_NephriteRepayment<T>> &
  _NoNephriteBorrowing;


export type TroveAdjustmentParams<T = unknown> =
  | (_CollateralChange<T> & _NoDebtChange)
  | (_DebtChange<T> & _NoCollateralChange)
  | (_CollateralChange<T> & _DebtChange<T>);


export type TroveCreationError = "missingLiquidationReserve";

export type TroveChange<T> =
  | { type: "invalidCreation"; invalidTrove: Trove; error: TroveCreationError }
  | { type: "creation"; params: TroveCreationParams<T> }
  | { type: "closure"; params: TroveClosureParams<T> }
  | { type: "adjustment"; params: TroveAdjustmentParams<T>; setToZero?: "collateral" | "debt" };

type InvalidTroveCreation = Extract<TroveChange<never>, { type: "invalidCreation" }>;
type TroveCreation<T> = Extract<TroveChange<T>, { type: "creation" }>;
type TroveClosure<T> = Extract<TroveChange<T>, { type: "closure" }>;
type TroveAdjustment<T> = Extract<TroveChange<T>, { type: "adjustment" }>;

const invalidTroveCreation = (
  invalidTrove: Trove,
  error: TroveCreationError
): InvalidTroveCreation => ({
  type: "invalidCreation",
  invalidTrove,
  error
});

const troveCreation = <T>(params: TroveCreationParams<T>): TroveCreation<T> => ({
  type: "creation",
  params
});

const troveClosure = <T>(params: TroveClosureParams<T>): TroveClosure<T> => ({
  type: "closure",
  params
});

const troveAdjustment = <T>(
  params: TroveAdjustmentParams<T>,
  setToZero?: "collateral" | "debt"
): TroveAdjustment<T> => ({
  type: "adjustment",
  params,
  setToZero
});

const valueIsDefined = <T>(entry: [string, T | undefined]): entry is [string, T] =>
  entry[1] !== undefined;

type AllowedKey<T> = Exclude<
  {
    [P in keyof T]: T[P] extends undefined ? never : P;
  }[keyof T],
  undefined
>;

const allowedTroveCreationKeys: AllowedKey<TroveCreationParams>[] = [
  "depositCollateral",
  "borrowNephrite"
];

function checkAllowedTroveCreationKeys<T>(
  entries: [string, T][]
): asserts entries is [AllowedKey<TroveCreationParams>, T][] {
  const badKeys = entries
    .filter(([k]) => !(allowedTroveCreationKeys as string[]).includes(k))
    .map(([k]) => `'${k}'`);

  if (badKeys.length > 0) {
    throw new Error(`TroveCreationParams: property ${badKeys.join(", ")} not allowed`);
  }
}

const troveCreationParamsFromEntries = <T>(
  entries: [AllowedKey<TroveCreationParams>, T][]
): TroveCreationParams<T> => {
  const params = Object.fromEntries(entries) as Record<AllowedKey<TroveCreationParams>, T>;
  const missingKeys = allowedTroveCreationKeys.filter(k => !(k in params)).map(k => `'${k}'`);

  if (missingKeys.length > 0) {
    throw new Error(`TroveCreationParams: property ${missingKeys.join(", ")} missing`);
  }

  return params;
};

const decimalize = <T>([k, v]: [T, Decimalish]): [T, Decimal] => [k, Decimal.from(v)];
const nonZero = <T>([, v]: [T, Decimal]): boolean => !v.isZero;

/** @internal */
export const _normalizeTroveCreation = (
  params: Record<string, Decimalish | undefined>
): TroveCreationParams<Decimal> => {
  const definedEntries = Object.entries(params).filter(valueIsDefined);
  checkAllowedTroveCreationKeys(definedEntries);
  const nonZeroEntries = definedEntries.map(decimalize);

  return troveCreationParamsFromEntries(nonZeroEntries);
};

const allowedTroveAdjustmentKeys: AllowedKey<TroveAdjustmentParams>[] = [
  "depositCollateral",
  "withdrawCollateral",
  "borrowNephrite",
  "repayNephrite"
];

function checkAllowedTroveAdjustmentKeys<T>(
  entries: [string, T][]
): asserts entries is [AllowedKey<TroveAdjustmentParams>, T][] {
  const badKeys = entries
    .filter(([k]) => !(allowedTroveAdjustmentKeys as string[]).includes(k))
    .map(([k]) => `'${k}'`);

  if (badKeys.length > 0) {
    throw new Error(`TroveAdjustmentParams: property ${badKeys.join(", ")} not allowed`);
  }
}

const collateralChangeFrom = <T>({
  depositCollateral,
  withdrawCollateral
}: Partial<Record<AllowedKey<TroveAdjustmentParams>, T>>): _CollateralChange<T> | undefined => {
  if (depositCollateral !== undefined && withdrawCollateral !== undefined) {
    throw new Error(
      "TroveAdjustmentParams: 'depositCollateral' and 'withdrawCollateral' " +
      "can't be present at the same time"
    );
  }

  if (depositCollateral !== undefined) {
    return { depositCollateral };
  }

  if (withdrawCollateral !== undefined) {
    return { withdrawCollateral };
  }
};

const debtChangeFrom = <T>({
  borrowNephrite,
  repayNephrite
}: Partial<Record<AllowedKey<TroveAdjustmentParams>, T>>): _DebtChange<T> | undefined => {
  if (borrowNephrite !== undefined && repayNephrite !== undefined) {
    throw new Error(
      "TroveAdjustmentParams: 'borrowNephrite' and 'repayNephrite' can't be present at the same time"
    );
  }

  if (borrowNephrite !== undefined) {
    return { borrowNephrite };
  }

  if (repayNephrite !== undefined) {
    return { repayNephrite };
  }
};

const troveAdjustmentParamsFromEntries = <T>(
  entries: [AllowedKey<TroveAdjustmentParams>, T][]
): TroveAdjustmentParams<T> => {
  const params = Object.fromEntries(entries) as Partial<
    Record<AllowedKey<TroveAdjustmentParams>, T>
  >;

  const collateralChange = collateralChangeFrom(params);
  const debtChange = debtChangeFrom(params);

  if (collateralChange !== undefined && debtChange !== undefined) {
    return { ...collateralChange, ...debtChange };
  }

  if (collateralChange !== undefined) {
    return collateralChange;
  }

  if (debtChange !== undefined) {
    return debtChange;
  }

  throw new Error("TroveAdjustmentParams: must include at least one non-zero parameter");
};

export const _normalizeTroveAdjustment = (
  params: Record<string, Decimalish | undefined>
): TroveAdjustmentParams<Decimal> => {
  const definedEntries = Object.entries(params).filter(valueIsDefined);
  checkAllowedTroveAdjustmentKeys(definedEntries);
  const nonZeroEntries = definedEntries.map(decimalize).filter(nonZero);

  return troveAdjustmentParamsFromEntries(nonZeroEntries);
};

const applyFee = (borrowingRate: Decimalish, debtIncrease: Decimal) =>
  debtIncrease.mul(Decimal.ONE.add(borrowingRate));

const unapplyFee = (borrowingRate: Decimalish, debtIncrease: Decimal) =>
  debtIncrease._divCeil(Decimal.ONE.add(borrowingRate));

const NOMINAL_COLLATERAL_RATIO_PRECISION = Decimal.from(100);

export class Trove {
  readonly collateral: Decimal;

  readonly debt: Decimal;

  readonly cuid: string;

  /** @internal */
  constructor(collateral = Decimal.ZERO, debt = Decimal.ZERO) {
    this.collateral = collateral;
    this.debt = debt;
    this.cuid = cuid()
  }

  get isEmpty(): boolean {
    return this.collateral.isZero && this.debt.isZero;
  }
  get netDebt(): Decimal {
  }

    return this.debt.sub(NEPHRITE_LIQUIDATION_RESERVE);
  }

  get _nominalCollateralRatio(): Decimal {
    return this.collateral.mulDiv(NOMINAL_COLLATERAL_RATIO_PRECISION, this.debt);
  }

  collateralRatio(price: Decimalish): Decimal {
    return this.collateral.mulDiv(price, this.debt);
  }

  collateralRatioIsBelowMinimum(price: Decimalish): boolean {
    return this.collateralRatio(price).lt(MINIMUM_COLLATERAL_RATIO);
  }

  collateralRatioIsBelowCritical(price: Decimalish): boolean {
    return this.collateralRatio(price).lt(CRITICAL_COLLATERAL_RATIO);
  }

  isOpenableInRecoveryMode(price: Decimalish): boolean {
    return this.collateralRatio(price).gte(CRITICAL_COLLATERAL_RATIO);
  }

  /** @internal */
  toString(): string {
    return `{ collateral: ${this.collateral}, debt: ${this.debt} }`;
  }

  equals(that: Trove): boolean {
    return this.collateral.eq(that.collateral) && this.debt.eq(that.debt);
  }

  add(that: Trove): Trove {
    return new Trove(this.collateral.add(that.collateral), this.debt.add(that.debt));
  }

  addCollateral(collateral: Decimalish): Trove {
    return new Trove(this.collateral.add(collateral), this.debt);
  }

  addDebt(debt: Decimalish): Trove {
    return new Trove(this.collateral, this.debt.add(debt));
  }

  subtract(that: Trove): Trove {
    const { collateral, debt } = that;

    return new Trove(
      this.collateral.gt(collateral) ? this.collateral.sub(collateral) : Decimal.ZERO,
      this.debt.gt(debt) ? this.debt.sub(debt) : Decimal.ZERO
    );
  }

  subtractCollateral(collateral: Decimalish): Trove {
    return new Trove(
      this.collateral.gt(collateral) ? this.collateral.sub(collateral) : Decimal.ZERO,
      this.debt
    );
  }

  subtractDebt(debt: Decimalish): Trove {
    return new Trove(this.collateral, this.debt.gt(debt) ? this.debt.sub(debt) : Decimal.ZERO);
  }

  multiply(multiplier: Decimalish): Trove {
    return new Trove(this.collateral.mul(multiplier), this.debt.mul(multiplier));
  }

  setCollateral(collateral: Decimalish): Trove {
    return new Trove(Decimal.from(collateral), this.debt);
  }

  setDebt(debt: Decimalish): Trove {
    return new Trove(this.collateral, Decimal.from(debt));
  }

  private _debtChange({ debt }: Trove, borrowingRate: Decimalish): _DebtChange<Decimal> {
    return debt.gt(this.debt)
      ? { borrowNephrite: unapplyFee(borrowingRate, debt.sub(this.debt)) }
      : { repayNephrite: this.debt.sub(debt) };
  }

  private _collateralChange({ collateral }: Trove): _CollateralChange<Decimal> {
    return collateral.gt(this.collateral)
      ? { depositCollateral: collateral.sub(this.collateral) }
      : { withdrawCollateral: this.collateral.sub(collateral) };
  }

  whatChanged(
    that: Trove,
    borrowingRate: Decimalish = MINIMUM_BORROWING_RATE,
  ): TroveChange<Decimal> | undefined {
    if (this.collateral.eq(that.collateral) && this.debt.eq(that.debt)) {
      return undefined;
    }

    if (this.isEmpty) {
      if (that.debt.lt(NEPHRITE_LIQUIDATION_RESERVE)) {
        return invalidTroveCreation(that, "missingLiquidationReserve");
      }

      return troveCreation({
        depositCollateral: that.collateral,
        borrowNephrite: unapplyFee(borrowingRate, that.netDebt)
      });
    }

    if (that.isEmpty) {
      return troveClosure(
        this.netDebt.nonZero
          ? { withdrawCollateral: this.collateral, repayNephrite: this.netDebt }
          : { withdrawCollateral: this.collateral }
      );
    }

    return this.collateral.eq(that.collateral)
      ? troveAdjustment<Decimal>(this._debtChange(that, borrowingRate), that.debt.zero && "debt")
      : this.debt.eq(that.debt)
        ? troveAdjustment<Decimal>(this._collateralChange(that), that.collateral.zero && "collateral")
        : troveAdjustment<Decimal>(
          {
            ...this._debtChange(that, borrowingRate),
            ...this._collateralChange(that)
          },
          (that.debt.zero && "debt") ?? (that.collateral.zero && "collateral")
        );
  }
  apply(
    change: TroveChange<Decimal> | undefined,
    borrowingRate: Decimalish = MINIMUM_BORROWING_RATE
  ): Trove {
    if (!change) {
      return this;
    }

    switch (change.type) {
      case "invalidCreation":
        if (!this.isEmpty) {
          throw new Error("Can't create onto existing Trove");
        }

        return change.invalidTrove;

      case "creation": {
        if (!this.isEmpty) {
          throw new Error("Can't create onto existing Trove");
        }

        const { depositCollateral, borrowNephrite } = change.params;

        return new Trove(
          depositCollateral,
          NEPHRITE_LIQUIDATION_RESERVE.add(borrowNephrite)
        );
      }

      case "closure":
        if (this.isEmpty) {
          throw new Error("Can't close empty Trove");
        }

        return _emptyTrove;

      case "adjustment": {
        const {
          setToZero,
          params: { depositCollateral, withdrawCollateral, borrowNephrite, repayNephrite }
        } = change;

        const collateralDecrease = withdrawCollateral ?? Decimal.ZERO;
        const collateralIncrease = depositCollateral ?? Decimal.ZERO;
        const debtDecrease = repayNephrite ?? Decimal.ZERO;

        const debtIncrease = borrowNephrite ? borrowNephrite : Decimal.ZERO;

        return setToZero === "collateral"
          ? this.setCollateral(Decimal.ZERO).addDebt(debtIncrease).subtractDebt(debtDecrease)
          : setToZero === "debt"
            ? this.setDebt(Decimal.ZERO)
              .addCollateral(collateralIncrease)
              .subtractCollateral(collateralDecrease)
            : this.add(new Trove(collateralIncrease, debtIncrease)).subtract(
              new Trove(collateralDecrease, debtDecrease)
            );
      }
    }
  }

  static create(params: TroveCreationParams<Decimalish>, borrowingRate?: Decimalish): Trove {
    return _emptyTrove.apply(troveCreation(_normalizeTroveCreation(params)), borrowingRate);
  }

  static recreate(that: Trove, borrowingRate?: Decimalish): TroveCreationParams<Decimal> {
    const change = _emptyTrove.whatChanged(that, borrowingRate);
    assert(change?.type === "creation");
    return change.params;
  }

  adjust(params: TroveAdjustmentParams<Decimalish>, borrowingRate?: Decimalish): Trove {
    return this.apply(troveAdjustment(_normalizeTroveAdjustment(params)), borrowingRate);
  }

  adjustTo(that: Trove, borrowingRate?: Decimalish): TroveAdjustmentParams<Decimal> {
    const change = this.whatChanged(that, borrowingRate);
    assert(change?.type === "adjustment");
    return change.params;
  }
}
export const _emptyTrove = new Trove();

export type UserTroveStatus =
  | "nonExistent"
  | "open"
  | "closedByOwner"
  | "closedByLiquidation"
  | "closedByRedemption";
export class UserTrove extends Trove {
  readonly ownerAddress: string;
  status: UserTroveStatus;

  readonly cr: string;

  /** @internal */
  constructor(ownerAddress: string, status: UserTroveStatus, collateral?: Decimal, debt?: Decimal, cr?: string) {
    super(collateral, debt);

    this.ownerAddress = ownerAddress;
    this.status = status;
    this.cr = cr;
  }

  equals(that: UserTrove): boolean {
    return (
      super.equals(that) && this.ownerAddress === that.ownerAddress && this.status === that.status
    );
  }

  setStatus(status: UserTroveStatus): void {
    this.status = status;
  }

  /** @internal */
  toString(): string {
    return (
      `{ ownerAddress: "${this.ownerAddress}"` +
      `, collateral: ${this.collateral}` +
      `, debt: ${this.debt}` +
      `, status: "${this.status}" }`
    );
  }
}

export class Surplus extends Trove {

  readonly gov: Decimal;

  constructor(collateral = Decimal.ZERO, debt = Decimal.ZERO, gov = Decimal.ZERO) {
    super(collateral, debt);

    this.gov = gov;
  }

}
