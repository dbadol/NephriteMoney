import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNephriteSelector } from "@app/hooks/useNephriteSelector";
import { LiquidationViewContext } from "./LiquidationViewContext";
import type { LiquidationView, LiquidationEvent } from "./types";
import { useSelector } from 'react-redux';
import { dispatchEvent as commonDispatchEvent } from "../transitions/transitionDispatcher"
import { useLocation, useMatch } from "react-router-dom";

const getInitialView = (): LiquidationView => {
  const match = useMatch('/editable/:action/:view');

  if (match) {
    const { params: { view: view }, params: { action: action } } = match;
    return (action && action == "liquidation" && view) ? view : "NONE";
  }

  return "NONE";
};


export const LiquidationViewProvider: React.FC = props => {
  const { children } = props;
  const [view, setView] = useState<LiquidationView>(getInitialView());
  const viewRef = useRef<LiquidationView>(view);
  const location = useLocation();
  const match = useMatch('/editable/:action/:view');


  const dispatchEvent = commonDispatchEvent("liquidation", viewRef, setView);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    if (!match) {
      if ("NONE" !== view) {
        setView("NONE");
      }
    }
  }, [match, dispatchEvent]);

  useEffect(() => {
    const state = location.state as { action?: string }
    const action = state?.action;

    !!action && action === 'back' ? dispatchEvent("BACK") : null;
  }, [location]);

  const provider = {
    view,
    dispatchEvent
  };

  return <LiquidationViewContext.Provider value={provider}>{children}</LiquidationViewContext.Provider>;
};
