import React, { useCallback, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BlockNoView } from "@app/components/Block/BlockNoView";
import { useTroveView } from "@app/contexts/Trove/TroveViewContext";
import { Card } from "theme-ui";

export const NoTrove: React.FC = props => {
  const { dispatchEvent } = useTroveView();
  const [isTroveOpened, setIsTroveOpened] = useState<boolean>(false);

  const handleOpenTrove = useCallback(() => {
    dispatchEvent("OPEN_TROVE_PRESSED");
  }, [dispatchEvent]);

  return (
    <BlockNoView
      header="TROVE"
      description="You haven't borrow any Nephrite yet? To get it you need to open a Trove."
      buttonText="Open"
      action={handleOpenTrove}
    />
  )
}