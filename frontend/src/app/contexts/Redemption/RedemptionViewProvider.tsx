import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNephriteSelector } from "@app/hooks/useNephriteSelector";
import { RedemptionViewContext } from "./RedemptionViewContext";
import type { RedemptionView, RedemptionEvent } from "./types";
import { useSelector } from 'react-redux';
import { dispatchEvent as commonDispatchEvent } from "../transitions/transitionDispatcher"
import { useLocation, useMatch } from "react-router-dom";

const getInitialView = (): RedemptionView => {
  const match = useMatch('/editable/:action/:view');

  if (match) {
    const { params: { view: view }, params: { action: action } } = match;
    return (action && action == "Redemption" && view) ? view : "NONE";
  }

  return "NONE";
};


export const RedemptionViewProvider: React.FC = props => {
  const { children } = props;
  const [view, setView] = useState<RedemptionView>(getInitialView());
  const viewRef = useRef<RedemptionView>(view);
  const location = useLocation();
  const match = useMatch('/editable/:action/:view');



  const dispatchEvent = commonDispatchEvent("redemption", viewRef, setView);

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

  return <RedemptionViewContext.Provider value={provider}>{children}</RedemptionViewContext.Provider>;
};
