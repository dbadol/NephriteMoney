import React from "react";
import { Flex, Text } from "theme-ui";
import { Modal } from "@app/components/Modal/Modal";
import Button from "@app/components/Button";
import { useStabilityView } from "@app/contexts/StabilityDeposit/StabilityViewContext";

interface StabilityPoolProps {
  isShown: boolean;
  onCloseModal: () => void;
}
export const StabilityPoolModal = ({isShown, setIsShown}) => {

  return (
    <Modal isShown={isShown}  header="STABILITY POOL">
    <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
      <Text sx={{ color: '#000', textAlign:'center' }}>There are some risky troves in the system.<br/>
NPH withdrawals will be allowed after the liquidation of that troves.<br/> You could trigger the liquidation by yourself in the Liquidation tab.</Text>
    <Flex sx={{ mt: 4 }}>
      <Button pallete='gradient' onClick={() => setIsShown(false)}> I UNDERSTAND </Button>
    </Flex>
    </Flex>
  </Modal>
  )
}
