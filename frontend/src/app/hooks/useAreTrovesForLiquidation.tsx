import { MINIMUM_COLLATERAL_RATIO } from "@app/constants";
import { useNephriteSelector } from "./useNephriteSelector";


const useAreTrovesForLiquidation = () => {

    const {
        assetPrice: beamPrice,
        troves
    } = useNephriteSelector(({ troves, assetPrice }) => ({ troves, assetPrice }));

    return troves.some(trove => trove.collateralRatio(beamPrice).lt(MINIMUM_COLLATERAL_RATIO)) 
}

export default useAreTrovesForLiquidation;