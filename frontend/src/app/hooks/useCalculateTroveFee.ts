
import { toGroths } from "@app/library/base/appUtils";
import { Decimal } from "@app/library/base/Decimal";
import { Trove } from "@app/library/nephrite";
import { getApi } from "@app/utils/getApi";

const useCalculateTroveFee = async ({ debt, collateral }: Trove) => {
  const nephriteApiMethods: any = getApi();
  try {
    const prediction = await nephriteApiMethods.userTroveModify({
      tok: toGroths(+debt),
      col: toGroths(+collateral),
      opTok: 1,
      opCol: 1,
      predict: true,
      tcr_mperc: 120000,
    })
    return prediction
  } catch (e) {
    return Decimal.ZERO;
  }

}

export default useCalculateTroveFee;
