import React from "react";
import { Flex } from "theme-ui";

import { useNephriteSelector } from '@app/hooks/useNephriteSelector';

const selector = ({ remainingStabilityPoolBeamXReward }) => ({
    remainingStabilityPoolBeamXReward
});

export const RemainingBeamX: React.FC = () => {
  const { remainingStabilityPoolLQTYReward } = useNephriteSelector(selector);

  return (
    <Flex sx={{ mr: 2, fontSize: 2, fontWeight: "medium" }}>
      {remainingStabilityPoolLQTYReward.prettify(0)} BEAMX remaining
    </Flex>
  );
};
