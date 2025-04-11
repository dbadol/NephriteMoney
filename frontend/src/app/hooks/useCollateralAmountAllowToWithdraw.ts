import { GROTHS_IN_BEAM, MINIMUM_COLLATERAL_RATIO, NEPHRITE_MINIMUM_NET_DEBT } from "@app/constants";
import { fromGroths, toGroths } from "@app/library/base/appUtils";
import { Decimal } from "@app/library/base/Decimal";
import { getApi } from "@app/utils/getApi";

const useCollateralAmountAllowToWithdraw = async ({ desiredCr, tok, col }) => {
  const nephriteApiMethods: any = getApi();

  try {
    const prediction = await nephriteApiMethods.userTroveModify({
      tok: toGroths(+tok),
      opTok: 0,
      opCol: 0,
      predict: true,
      tcr_mperc: desiredCr
    });
    return !!prediction?.amounts ? col.sub(Decimal.from(prediction.amounts.col / GROTHS_IN_BEAM)) : Decimal.ZERO;
  } catch (e) {
    return null;
  }

}
export default useCollateralAmountAllowToWithdraw;
