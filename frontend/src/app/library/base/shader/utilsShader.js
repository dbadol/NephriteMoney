import UtilsError from "../utilsError";

export default class UtilsShader {

    #shaderName;
    #cid;
    #path;
    #order;
    #bytes = null;


    constructor(shaderName, cid, path, order) {
        this.#shaderName = shaderName;
        this.#cid = cid;
        this.#path = path;
        this.#order = order;
    }

    get shaderName() {
        return this.#shaderName;
    }

    get cid() {
        return this.#cid;
    }

    get path() {
        return this.#path;
    }

    get order() {
        return this.#order;
    }

    isShaderBytesLoad() {
        return !!this.#bytes && this.#bytes instanceof Uint8Array;
    }

    get shaderBytes() {
        if (!this.#bytes || !(this.#bytes instanceof Uint8Array))
            throw new UtilsError(-103);

        return this.#bytes;
    }


    prepareAndSetShaderBytes(bytes) {
        let byteArray;

        if (!(bytes instanceof ArrayBuffer)) {
            throw new UtilsError(-104);
        }

        try {
            byteArray = new Uint8Array(bytes);
        } catch (e) {
            throw new UtilsError(-1, e.message);
        }

        this.#bytes = byteArray;
    }
}
