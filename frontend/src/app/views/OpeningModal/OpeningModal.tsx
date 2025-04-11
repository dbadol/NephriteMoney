import React from "react";
import { Flex, Text, Box } from "theme-ui";
import { Modal } from "@app/components/Modal/Modal";
import Button from "@app/components/Button";
import Logo from '@app/components/icons/logo/logo_text.svg';

interface OpeningModalProps {
  isShown: boolean;
  setIsShown: () => void;
  onCloseModal: () => void;
}
export const OpeningModal = ({ isShown, setIsShown }) => {
  const [checked, setChecked] = React.useState(false);

  return (
    <Modal isShown={isShown} width='600px' height='354px'>
    <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{marginBottom: '40px'}}>
        <Logo/>
      </Box>
      <Text variant='primary' sx={{ padding: '0 55px' }}>
      This is an experimental decentralized application developed by an anon team. 
      Despite the code of this application was tested, open-sourced, and audited,
      there are no guarantees of its correct work.
      <Text variant='primary' sx={{display:'block'}}>Use at your own risk.</Text>
      </Text>
    <Flex sx={{ mt: 4, flexDirection: 'column' }}>
      <Box sx={{ mb:5 }}>
        <label className="container">
          <input type="checkbox"
            defaultChecked={checked}
            onChange={() => setChecked(!checked)}
            className="opening-checkbox"
          />
            <span className="checkmark"></span>
          <Text variant="primary">I understand, and l agree to use this application at my own risk</Text>
        </label>
        
    </Box>
      <Button pallete='gradient' onClick={() => setIsShown(false)} disabled={!checked} style={{ width: '153px', height:'37px'}}>
        <Text sx={{letterSpacing: '0.1em'}}>CONTINUE</Text>
      </Button>
    </Flex>
    </Flex>
  </Modal>
  )
}