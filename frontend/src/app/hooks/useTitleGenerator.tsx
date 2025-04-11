import { useTitle } from "@app/contexts/Nephrite/TitleContext";
import { useStabilityView } from "@app/contexts/StabilityDeposit/StabilityViewContext";
import { useTroveView } from "@app/contexts/Trove/TroveViewContext";
import { useLocation } from "react-router-dom";

const useTitleGenerator = () => {
    const { currentTitle } = useTitle();

    if(!!currentTitle)
        return currentTitle;

    const { view: troveView } = useTroveView();
    const { view: stabilityView } = useStabilityView();

    const { pathname } = useLocation();
    const [pathView, pathViewAction] = pathname.split('/').splice(-2);

    const getTroveTitle = (troveView) =>
      troveView === "OPENING" ? "OPEN TROVE" : (
        troveView === "ADJUSTING" ? "ADJUST TROVE" : (
          troveView === "WITHDRAWING" ? "WITHDRAW TROVE" : (
            troveView === "DEPOSITING" ? "DEPOSIT TO TROVE" : (
              troveView === "REPAYING" ? "REPAY DEBT" : (
                troveView === "BORROWING" ? "BORROW" : null
              )
            )
          )
        )
      );

    const getStabilityTitle = (stabilityView) =>
      stabilityView === "DEPOSITING" ? "DEPOSIT TO STABILITY POOL" : (
        stabilityView === "ADJUSTING" ? "ADJUST STABILITY POOL" : (
          stabilityView === "WITHDRAWING" ? "WITHDRAW FROM STABILITY POOL" : null
        )
      );

    const title = !["ACTIVE", "NONE"].includes(troveView) ? getTroveTitle(troveView) : (
      !["ACTIVE", "NONE"].includes(stabilityView) ? getStabilityTitle(stabilityView) : null
    );

    if (!title && !!pathView && !!pathViewAction) {
      return pathView === 'trove' ? getTroveTitle(pathViewAction) : (
        pathView === 'stabilitydeposit' ? getStabilityTitle(pathViewAction) : null
      )
    }

    return title;
  }

  export default useTitleGenerator;
