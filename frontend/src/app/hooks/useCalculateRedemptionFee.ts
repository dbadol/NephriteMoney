import {fromGroths, toGroths} from "@app/library/base/appUtils";
import { Decimal } from "@app/library/base/Decimal";
import { getApi } from "@app/utils/getApi";

const useCalculateRedemptionFee = async ({ value }) => {
    const nephriteApiMethods: any = getApi();

    try {
        const prediction = await nephriteApiMethods.userRedeem({
            val: toGroths(value),
            predict: true
        })
        return prediction
    } catch(e) {
        return Decimal.ZERO;
    }

}

export default useCalculateRedemptionFee;
