import Utils from '@app/library/base/utils.js';
import { NEPHRITE_CID } from '@app/constants';


export const OpenTroveAsync = async <T = any>({ tok, collateral }) => {
    let [opTok, opCol] = Array(6).fill(1);;

    try {
        let txId = await Utils.invokeContractAsyncAndMakeTx(
            `role=user,action=trove_modify,tok=${tok},col=${collateral},opTok=${opTok},opCol=${opCol},cid=${NEPHRITE_CID}`
        )

        if (!txId) {
            throw new Error("txId do not created!");
        }


        return () => waitTransactionStatusUntil(txId, "OpenTroveAsync")
    } catch (e) {
        throw new Error(e.error);
    }
}

export const AdjustTroveAsync = async <T = any>({ tok, collateral }) => {
    let [opTok, opCol] = Array(6).fill(0);;

    try {
        let txId = await Utils.invokeContractAsyncAndMakeTx(
            `role=user,action=trove_modify,tok=${tok},col=${collateral},opTok=${opTok},opCol=${opCol},cid=${NEPHRITE_CID}`
        )

        if (!txId) {
            throw new Error("txId do not created!");
        }


        return () => waitTransactionStatusUntil(txId, "AdjustTroveAsync")

    } catch (e) {
        throw new Error(e.error);
    }
}

export const CloseTroveAsync = async <T = any>() => {
    let [opTok, opCol, tok, collateral] = Array(6).fill(0);

    try {
        let txId = await Utils.invokeContractAsyncAndMakeTx(
            `role=user,action=trove_modify,tok=${tok},col=${collateral},opTok=${opTok},opCol=${opCol},cid=${NEPHRITE_CID}`
        )

        if (!txId) {
            throw new Error("txId do not created!");
        }

        return () => waitTransactionStatusUntil(txId, "CloseTroveAsync");

    } catch (e) {
        throw new Error(e.error);
    }
}

export const UpdateStabilityPoolAsync = async <T = any>({ value }) => {

    try {
        let txId = await Utils.invokeContractAsyncAndMakeTx(
            `role=user,action=upd_stab,newVal=${value},cid=${NEPHRITE_CID}`
        )

        if (!txId) {
            throw new Error("txId do not created!");
        }

        return () => waitTransactionStatusUntil(txId, "UpdateStabilityPoolAsync");

    } catch (e) {
        throw new Error(e.error);
    }
}

export const LiquidateTrovesPredictUpToAsync = async <T = any>({ upTo }) => {
    return new Promise((resolve, reject) => {
        Utils.invokeContractAsync(`role=user,action=liquidate,nMaxTroves=${upTo},cid=${NEPHRITE_CID},bPredictOnly=1`,
            (error, result, full) => {
                resolve(result.res);
            });
    });

    try {
        let txId = await Utils.invokeContractAsyncAndMakeTx(
            `role=user,action=liquidate,nMaxTroves=${upTo},cid=${NEPHRITE_CID},bPredictOnly=1`
        )

        if (!txId) {
            throw new Error("txId do not created!");
        }

        return () => waitTransactionStatusUntil(txId, "LiquidateTrovesUpToAsync");

    } catch (e) {
        throw new Error(e.error);
    }
}



export function LoadViewParams<T = any>(): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=manager,action=view_params,cid=" + NEPHRITE_CID,
            (error, result, full) => {
                resolve(result.params);
            });
    });
}

export function LoadOpenTroves<T = any>(): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=manager,action=view_all,cid=" + NEPHRITE_CID,
            (error, result, full) => {
                resolve(result.res);
            });
    });
}


export function LoadManagerView<T = any>(): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=manager,action=view",
            (error, result, full) => {
                resolve(result);
            });
    });
}

export function LoadModeratorsView<T = any>(): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=manager,action=view_moderators,cid=" + NEPHRITE_CID,
            (error, result, full) => {
                resolve(result.res);
            });
    });
}

export function LoadAdminKey<T = any>(): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=manager,action=my_admin_key,cid=" + NEPHRITE_CID,
            (error, result, full) => {
                resolve(result);
            });
    });
}

export function LoadUserView<T = any>(): Promise<T> {
    return new Promise((resolve, reject) => {
        Utils.invokeContract("role=user,action=view,cid=" + NEPHRITE_CID,
            (error, result, full) => {
                resolve(result.res);
            });
    });
}

const onMakeTx = (err, sres, full) => {
    if (err) {
        throw new Error(err);
    }

    Utils.callApi(
        'process_invoke_data', { data: full.result.raw_data },
        (...args) => console.log(...args)
    )
}


async function waitTransactionStatusUntil(txId, methodName?) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            try {
                let { res } = await Utils.callApiAsync('tx_status', { txId: txId, rates: false })

                if (["pending", "in progress", "registering"].indexOf(res.status_string) !== -1) {
                } else if (["canceled", "failed"].indexOf(res.status_string) !== -1) {
                    throw new Error(`${methodName ?? ''} error with status ${res.status_string}`);
                } else {
                    resolve(res);
                    clearInterval(interval)

                }
            }
            catch (err) {
                reject(err);
                clearInterval(interval);
                throw new Error(err);
            }
        }, 5000);
    });
}
