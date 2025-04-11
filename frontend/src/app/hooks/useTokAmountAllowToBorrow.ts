import { GROTHS_IN_BEAM, MINIMUM_COLLATERAL_RATIO, NEPHRITE_LIQUIDATION_RESERVE, NEPHRITE_MINIMUM_NET_DEBT } from "@app/constants";
import { fromGroths, toGroths } from "@app/library/base/appUtils";
import { Decimal } from "@app/library/base/Decimal";
import { getApi } from "@app/utils/getApi";

const useTokAmountAllowToBorrow = async ({ desiredCr, tok, col, liqReserve }) => {
  const nephriteApiMethods: any = getApi();
 const TotalNPS = toGroths(+tok) - liqReserve

  try {
    const prediction = await nephriteApiMethods.userTroveModify({
      col: toGroths(+col),
      opTok: 0,
      opCol: 0,
      predict: true,
      tcr_mperc: +desiredCr,
      bAutoTok: 1
    });
      let b = !!prediction?.amounts ? Decimal.from(Math.abs(prediction.amounts.tok - TotalNPS) / GROTHS_IN_BEAM).sub(NEPHRITE_LIQUIDATION_RESERVE.add(1)).toString(8) : Decimal.ZERO;
      let c = prediction.fee_perc
      return {
          b,
          c
      }
  } catch (e) {
    return null;
  }

}
export default useTokAmountAllowToBorrow;
