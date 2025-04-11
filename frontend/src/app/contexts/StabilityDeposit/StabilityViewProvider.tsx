import React, { useState, useCallback, useEffect, useRef } from "react";
import { StabilityDeposit } from "@app/library/nephrite/StabilityDeposit";
import { StabilityViewContext } from "./StabilityViewContext";
import type { StabilityView, StabilityEvent } from "./types";
import { selectStabilityDeposit } from '@app/store/StabilityDepositStore/selectors';
import { useSelector } from 'react-redux';
import { dispatchEvent as commonDispatchEvent } from "../transitions/transitionDispatcher"
import { useLocation, useMatch } from "react-router-dom";

const getInitialView = (stabilityDeposit: StabilityDeposit): StabilityView => {
  const match = useMatch('/editable/:action/:view');

  if (match) {
    const { params: { view: view }, params: { action: action } } = match;
    return (action && action == "stabilitydeposit" && view) ? view : "ACTIVE";
  }
  return stabilityDeposit.currentNephrite.isZero ? "NONE" : "ACTIVE";
};

export const StabilityViewProvider: React.FC = props => {
  const { children } = props;
  const stabilityDeposit = useSelector(selectStabilityDeposit());
  const [view, setView] = useState<StabilityView>(getInitialView(stabilityDeposit));
  const viewRef = useRef<StabilityView>(view);
  const location = useLocation();
  const match = useMatch('/editable/:action/:view');


  const dispatchEvent = commonDispatchEvent("stabilitydeposit", viewRef, setView);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    if (!match) {
      if (stabilityDeposit.isEmpty && "NONE" !== view) {
        setView("NONE");
      }
      if (!stabilityDeposit.isEmpty && "ACTIVE" !== view) {
        setView("ACTIVE");
      }
    } else {
      if (stabilityDeposit.isEmpty && "NONE" == view) {
        setView("NONE");
      }
    }

    if (view == "NONE" && !stabilityDeposit.isEmpty) {
      dispatchEvent("DEPOSIT_CONFIRMED");
    }

    if (view == "ACTIVE" && stabilityDeposit.isEmpty) {
      dispatchEvent("DEPOSIT_EMPTIED");
    }

    if(view == 'ADJUSTING' && stabilityDeposit.isEmpty) {
      dispatchEvent("DEPOSIT_FULLY_WITHDRAWN");
    }

  }, [match, stabilityDeposit, dispatchEvent]);

  useEffect(() => {
    const state = location.state as { action?: string }
    const action = state?.action;

    !!action && action === 'back' ? dispatchEvent("BACK") : null;
  }, [location]);

  const provider = {
    view,
    dispatchEvent
  };

  return <StabilityViewContext.Provider value={provider}>{children}</StabilityViewContext.Provider>;
};
