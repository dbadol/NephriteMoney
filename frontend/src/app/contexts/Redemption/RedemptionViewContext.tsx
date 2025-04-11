import { createContext, useContext } from "react";
import type { RedemptionView, RedemptionEvent } from "./types";

type RedemptionViewContextType = {
  view: RedemptionView;
  dispatchEvent: (event: RedemptionEvent) => void;
};

export const RedemptionViewContext = createContext<RedemptionViewContextType | null>(null);

export const useRedemptionView = (): RedemptionViewContextType => {
  const context: RedemptionViewContextType | null = useContext(RedemptionViewContext);

  if (context === null) {
    throw new Error("You must add a <RedemptionViewProvider> into the React tree");
  }

  return context;
};
