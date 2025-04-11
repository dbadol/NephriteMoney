import React from 'react';
import { Flex, Box, Heading, Text } from 'theme-ui';
import { Amount } from '../Amount';
import Button from '../Button';
import { IconBeamx } from '@app/components/icons/index';
import Separator from '@app/components/icons/separator.svg';
import Beam from '@app/components/icons/coin/beam.svg';

type desc = string | JSX.Element;

interface BlockProps {
  header: string,
  description: desc,
  buttonText: string,
  action: () => void,
}
export const BlockReadableView: React.FC<BlockProps> = ({ header, description, buttonText, action }) => {
  return (
    <>
      <Flex sx={{ background: '#F4F7EC', borderRadius: '20px'/* , height: '202px' */, justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ p: '40px 24px' }}>
          <Text variant='headerLink'>{header}</Text>
          {description}
          <Button pallete='gradient' variant='custom' onClick={action}><Text variant='header'>{buttonText}</Text></Button>
        </Box>
      </Flex>
    </>
  )
}