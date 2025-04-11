import { getApi } from "@app/utils/getApi";


const useCouldLiquidate = async () => {
    const nephriteApiMethods: any = getApi();
    const prediction = await nephriteApiMethods.userLiquidate({ nMaxTroves: 10, predict: true });

    return !!prediction?.count ? true : false;
}

export default useCouldLiquidate;
