import { Decimal, Decimalish } from "@app/library/base/Decimal";
export type StabilityDepositChange<T> =
  | { openDepositNephrite: T; withdrawNephrite?: undefined }
  | { depositNephrite: T; withdrawNephrite?: undefined }
  | { openDepositNephrite?: undefined, depositNephrite?: undefined; withdrawNephrite: T; withdrawAllNephrite: boolean };

export class StabilityDeposit {
  readonly initialNephrite: Decimal;
  readonly currentNephrite: Decimal;
  readonly collateralGain: Decimal;
  readonly beamXReward: Decimal;


  /** @internal */
  constructor(
    initialNephrite: Decimal,
    currentNephrite: Decimal,
    collateralGain: Decimal,
    beamXReward: Decimal,
  ) {
    this.initialNephrite = initialNephrite;
    this.currentNephrite = currentNephrite;
    this.collateralGain = collateralGain;
    this.beamXReward = beamXReward;

    if (this.currentNephrite.gt(this.initialNephrite)) {
      throw new Error("currentNephrite can't be greater than initialNephrite");
    }
  }

  get isEmpty(): boolean {
    return (
      this.initialNephrite.isZero &&
      this.currentNephrite.isZero &&
      this.collateralGain.isZero &&
      this.beamXReward.isZero
    );
  }

  get isClaimable(): boolean {
    return !(
      this.collateralGain.isZero &&
      this.beamXReward.isZero
    );
  }

  /** @internal */
  toString(): string {
    return (
      `{ initialNephrite: ${this.initialNephrite}` +
      `, currentNephrite: ${this.currentNephrite}` +
      `, collateralGain: ${this.collateralGain}` +
      `, beamXReward: ${this.beamXReward}`
    );
  }
  equals(that: StabilityDeposit): boolean {
    return (
      this.initialNephrite.eq(that.initialNephrite) &&
      this.currentNephrite.eq(that.currentNephrite) &&
      this.collateralGain.eq(that.collateralGain) &&
      this.beamXReward.eq(that.beamXReward)
    );
  }

  whatChanged(thatNephrite: Decimalish, action?: "depositing" | "withdrawing"): StabilityDepositChange<Decimal> | undefined {
    thatNephrite = Decimal.from(thatNephrite);

    if (action) {

      const whatChangedByAction = action === "depositing" ?
        { depositNephrite: thatNephrite } :
        (
          action === "withdrawing" ?
            { withdrawNephrite: thatNephrite, withdrawAllNephrite: thatNephrite.eq(this.currentNephrite) } :
            null
        );

      if (whatChangedByAction) return whatChangedByAction;

    }

    if (this.currentNephrite.isZero && thatNephrite.gt(this.currentNephrite)) {
      return { openDepositNephrite: thatNephrite };
    }
  }
  apply(change: StabilityDepositChange<Decimalish> | undefined): Decimal {
    if (!change) {
      return this.currentNephrite;
    }

    if (change.withdrawNephrite !== undefined) {
      return change.withdrawAllNephrite || this.currentNephrite.lte(change.withdrawNephrite)
        ? Decimal.ZERO
        : this.currentNephrite.sub(change.withdrawNephrite);
    } else {
      return this.currentNephrite.add(change.depositNephrite);
    }
  }
}
