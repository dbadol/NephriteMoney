import React from "react";
import { Flex, Text } from "theme-ui";
import { Modal } from "@app/components/Modal/Modal";
import Button from "@app/components/Button";
import { useRedemptionView } from "@app/contexts/Redemption/RedemptionViewContext";

interface RedemptionModalProps {
  isShown: boolean;
  onCloseModal: () => void;
}
export const RedemptionModal: React.FC<RedemptionModalProps> = ({ onCloseModal, isShown }) => {
  const { dispatchEvent } = useRedemptionView();

  return (
    <Modal isShown={isShown} header="REDEMPTION">
      <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Text sx={{ color: '#000', textAlign: 'center' }}>
          There are some highly risky troves in the system.<br />
          NPH redemption will be allowed after the liquidation of that troves. <br />
          You could trigger the liquidation by yourself in the Liquidation tab.<br />
        </Text>
        <Flex sx={{ mt: 4 }}>
          <Button pallete='gradient' onClick={() => {dispatchEvent("BACK"), onCloseModal()}}> I UNDERSTAND </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}