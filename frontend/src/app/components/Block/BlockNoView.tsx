import React from 'react';
import { Flex, Box, Text } from 'theme-ui';
import Button from '@app/components/Button';

type desc = string | JSX.Element;
interface BlockProps {
  header: string,
  description: desc,
  buttonText: string,
  action: () => void,
}
export const BlockNoView = ({ header, description, buttonText, action, disabled = false }) => {
  return (
    <>
      <Flex sx={{ background: '#F4F7EC', borderRadius: '20px'/* , height: '202px' */, justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ p: '40px 24px' }}>
          <Text variant='headerLink'>{header}</Text>
          <Box sx={{ mt: '10px', mb: '24px', height: '32px' }}>
            <Text sx={{ color: disabled ? 'rgba(0,0,0,0.3)' : '#000', textAlign: 'center', display: 'block' }}>{description}</Text>
          </Box>
          <Button pallete='gradient' variant='custom' style={{ opacity: disabled ? 0.2 : 1 }} disabled={disabled ?? false} onClick={disabled ? null : action}>
            <Text variant='header' sx={{ textTransform: 'uppercase' }}>{buttonText}</Text>
          </Button>
        </Box>
      </Flex>
    </>
  )
}