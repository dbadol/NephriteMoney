import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TroveEvent, TroveView } from "../Trove/types";
import { Action } from "../types";
import * as actionTransitions from "./transitionsStates";

const transition = /* <TransitionType, T, S> */(transitions/* : TransitionType */, view/* : S */, event/* : T */)/* : TroveView */ => {
    const nextView = transitions[view][event] ?? view;
    return nextView;
};



export const dispatchEvent = (action/* : Action */, viewRef, setView) => {
    const navigate = useNavigate();

    return useCallback(/* <AType, TransitionType, T, S> */(event/* : T */)/* : T */ => {
        let transitions = null/* : TransitionType */;

        action = typeof action === "string" ? action.toLowerCase() : action;
        if (action == "trove") {
            transitions = actionTransitions.TroveTransitions;
        } else if (action == "stabilitydeposit") {
            transitions = actionTransitions.stabilityDepositTransitions;
        } else if (action == "liquidation") {
            transitions = actionTransitions.liquidationTransitions;
        } else if (action == "redemption") {
            transitions = actionTransitions.redemptionsTransitions;
        }

        const nextView = transition/* <TransitionType, T, S> */(transitions, viewRef.current, event);

        if (nextView !== viewRef.current) {

            setView(nextView);

            ["ACTIVE", "NONE", "SURPLUS_ACTIVE"].includes(nextView) ?
                navigate("/", { state: { previous: "editable" } }) :
                navigate(`/editable/${action}/${nextView}`, { state: { previous: "readable" } });
        }
    }, []);
}

