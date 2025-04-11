import { IMethod } from "../base/api/Interfaces";
import { ShaderActions } from "./types";


const methods: Array<IMethod<ShaderActions>> = [
    {
        role: "manager",
        action: "view",
        type: "readable"
    },
    {
        role: "manager",
        action: "view_params",
        type: "readable"
    },
    {
        role: "manager",
        action: "view_all",
        type: "readable"
    },
    {
        role: "user",
        action: "view",
        type: "readable"
    },
    {
        role: "user",
        action: "trove_modify",
        requiredParams: ["opTok", "opCol"],
        type: "writable",
        couldPredict: true,
        allowedParams: ["tok", "col", "opTok", "opCol", "bAutoTok", "tcr_mperc"]
    },
    {
        role: "user",
        action: "upd_stab",
        requiredParams: ["newVal"],
        type: "writable"
    },
    {
        role: "user",
        action: "liquidate",
        requiredParams: ["nMaxTroves"],
        type: "writable",
        couldPredict: true,
    },
    {
        role: "user",
        action: "withdraw_surplus",
        requiredParams: [""],
        type: "writable"
    },
    {
        role: "user",
        action: "redeem",
        requiredParams: ["val"],
        type: "writable",
        couldPredict: true,
    },
]


export default methods;
