import { NEPHRITE_CID } from "@app/constants";
import { getGlobalApiProviderValue } from "@app/contexts/Nephrite/ApiContext";
import methods from "@app/library/nephrite/methods";
import ShaderApi from "@app/library/base/api/ShaderApi";
import { delay } from "@app/library/base/appUtils";
import _ from "lodash";

export const getApi = () => {
    let nephriteApi;

    try {
        nephriteApi = !_.isEmpty(getGlobalApiProviderValue()) ? getGlobalApiProviderValue() : (() => {
            const nephriteShader = ShaderApi.useShaderStore.retriveShader(NEPHRITE_CID)
            const nephriteApi = new ShaderApi(nephriteShader, methods);

            return nephriteApi.getRegisteredMethods();
        })()
    } catch (e) {
        throw new Error(e.message);        
    }


    return nephriteApi;
}
