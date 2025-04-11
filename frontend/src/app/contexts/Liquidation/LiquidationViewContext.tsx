import { createContext, useContext } from "react";
import type { LiquidationView, LiquidationEvent } from "./types";

type LiquidationViewContextType = {
  view: LiquidationView;
  dispatchEvent: (event: LiquidationEvent) => void;
};

export const LiquidationViewContext = createContext<LiquidationViewContextType | null>(null);

export const useLiquidationView = (): LiquidationViewContextType => {
  const context: LiquidationViewContextType | null = useContext(LiquidationViewContext);

  if (context === null) {
    throw new Error("You must add a <LiquidationViewProvider> into the React tree");
  }

  return context;
};
