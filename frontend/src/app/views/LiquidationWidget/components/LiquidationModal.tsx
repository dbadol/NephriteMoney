import React from "react";
import { Flex, Text } from "theme-ui";
import { Modal } from "@app/components/Modal/Modal";
import Button from "@app/components/Button";
import { TransactionWrapper } from "@app/library/transaction-react/TransactionWrapper";
import { getApi } from "@app/utils/getApi";
import { ShaderTransactionComments } from "@app/library/nephrite/types";

interface LiquidationModalProps {
  isShown: boolean;
  onCloseModal: () => void;
}
export const LiquidationModal: React.FC<LiquidationModalProps> = ({ onCloseModal, isShown }) => {
  
  const liquidateUpTo = (numberOfTrovesToLiquidate) => {
    if (!numberOfTrovesToLiquidate) {
      throw new Error("Invalid number");
    }
    
    const nephriteApiMethods: any/* ShaderActions */ = getApi();
    return nephriteApiMethods.userLiquidate({ nMaxTroves: numberOfTrovesToLiquidate });
  }

  return (
    <Modal isShown={isShown} header="INITIATE LIQUIDATION">
      <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Text sx={{ color: '#000', textAlign: 'center' }}>The beginning of the liquidation process will cause the liquidation of your <br /> trove</Text>
        <Flex sx={{ mt: 4 }}>
          <Button variant='ghost' onClick={onCloseModal} style={{ width: '140px', height:'37px', letterSpacing: '0.1em', marginRight: '24px'}}> CANCEL </Button>
          <TransactionWrapper
            id={`${ShaderTransactionComments.setTrovesLiquidate}: batch-liquidate`}
            send={() => liquidateUpTo(10)}
          >
            <Button pallete='gradient' style={{ width: '140px', height:'37px', letterSpacing: '0.1em'}}> LIQUIDATE </Button>
          </TransactionWrapper>
        </Flex>
      </Flex>
    </Modal>
  )
}