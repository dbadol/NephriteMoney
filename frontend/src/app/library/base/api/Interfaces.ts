import UtilsShader from "../shader/utilsShader";
import { MethodRoles, MethodType } from "./types";

export interface IApiAbstract {
    cid?: string;
}

export interface IShaderApiGenerator extends IApiAbstract {
    methodFactory: IMethodFactory;
}

export interface IShaderApi extends IApiAbstract {

}

export interface IMethodFactory {
    createShaderMethod(type: string)
}

export interface IMethod<ShaderActions> {
    role: MethodRoles;
    action: ShaderActions;
    type: MethodType;
    requiredParams?: Array<string>;
    couldPredict?: boolean;
    allowedParams?:  Array<string>;
}

export interface IRegisteredMethods<ShaderActions> {
    (key: MethodRoles): any
}

export interface ShaderStore {
    addShaderToStore: void,
    retriveShader:  UtilsShader | undefined,
}

export interface IShaderStore {
    retriveShader(cid: string): UtilsShader | undefined;
}
