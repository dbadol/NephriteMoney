import React, { useState, useEffect, useRef } from "react";
import { UserTroveStatus } from "@app/library/nephrite/Trove";
import { TroveViewContext } from "./TroveViewContext";
import type { TroveView, TroveEvent } from "./types";
import { selectUserSurplus, selectUserTrove, selectUserTroveStatus } from '@app/store/TroveStore/selector';
import { useSelector } from "react-redux";
import { dispatchEvent as commonDispatchEvent } from "../transitions/transitionDispatcher"
import { useLocation, useMatch, useNavigate } from "react-router-dom";


type TroveStateEvents = Partial<Record<UserTroveStatus, TroveEvent>>;

export const troveStatusEvents: TroveStateEvents = {
  open: "TROVE_OPENED",
  closedByOwner: "TROVE_CLOSED",
  closedByLiquidation: "TROVE_LIQUIDATED",
  closedByRedemption: "TROVE_REDEEMED",
  nonExistent: "TROVE_CLOSED"
};

const getInitialView = (troveStatus: UserTroveStatus): TroveView => {
  if (troveStatus === "closedByLiquidation") {
  }
  if (troveStatus === "closedByRedemption") {
    return "SURPLUS_ACTIVE";
  }
  if (troveStatus === "open") {
    return "ACTIVE";
  }

  return "NONE";
};

export const TroveViewProvider: React.FC = props => {
  const { children } = props;
  const troveStatus = useSelector(selectUserTroveStatus());
  const trove = useSelector(selectUserTrove());
  const surplus = useSelector(selectUserSurplus());
  const [view, setView] = useState<TroveView>(getInitialView(troveStatus));
  const viewRef = useRef<TroveView>(view);
  const location = useLocation();
  const match = useMatch('/editable/:action/:view');


  const dispatchEvent = commonDispatchEvent("trove", viewRef, setView);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    const event = troveStatusEvents[troveStatus] ?? null;

    if (event !== null) {
      dispatchEvent(event);
    }
  }, [troveStatus, dispatchEvent]);

  useEffect(() => {
    if (!match) {
      if (trove.isEmpty && surplus.isEmpty && "NONE" !== view) {
        setView("NONE");
      }
      if (trove.isEmpty && !surplus.isEmpty && "SURPLUS_ACTIVE" !== view) {
        setView("SURPLUS_ACTIVE");
      }
      if (!trove.isEmpty && surplus.isEmpty && "ACTIVE" !== view) {
        setView("ACTIVE");
      }
    } else {
      if (trove.isEmpty && "NONE" == view) {
        setView("NONE");
      }
    }
  }, [match, trove, dispatchEvent]);

  useEffect(() => {
    const state = location.state as { action?: string, previous?: string }
    const action = state?.action;

    (!!action && action === 'back') ? dispatchEvent("BACK") : null;
  }, [location]);


  const provider = {
    view,
    dispatchEvent
  };
  return <TroveViewContext.Provider value={provider}>{children}</TroveViewContext.Provider>;
};
