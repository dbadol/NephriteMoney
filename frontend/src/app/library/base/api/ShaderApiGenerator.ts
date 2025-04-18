import MethodAbstract, { MethodFactory, MethodReadable } from "@library/base/api/MethodAbstract";
import { action } from "typesafe-actions";
import { IMethod, IRegisteredMethods } from "./Interfaces";
import ShaderApiAbstract from "./ShaderApiAbstract";
import { MethodRoles } from "./types";

export class ShaderApiGenerator<ShaderActions> extends ShaderApiAbstract {

  protected methodFactory: MethodFactory;

  protected constructor(cid: string) {
    super(cid);

    this.methodFactory = new MethodFactory();
  }

  public static generateShaderApi<ShaderActions>(cid: string, methodsList: Array<IMethod<ShaderActions>>) {
    const generator = new ShaderApiGenerator(cid);
    let registeredMethods: any = {};

    for (const method of methodsList) {
      const methodClass = generator.methodFactory.createShaderMethod(method.type);

      const generatedMethod: MethodReadable<ShaderActions> = new methodClass(
        generator.getCid(),
        method?.role,
        method.action,
        method.requiredParams,
        method.allowedParams,
        method.couldPredict ?? false
      )

      registeredMethods = {
        ...registeredMethods, ...{
          ...{ [generator.snakeToCamel(method.role + "_" + method.action)]: generatedMethod }
        }
      }

    }

    return registeredMethods;
  }

  protected snakeToCamel(action) {
    return action.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }

  public getCid() {
    return this.cid;
  }

}
