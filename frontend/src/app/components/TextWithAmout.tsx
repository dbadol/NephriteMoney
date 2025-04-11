import React from 'react';
import { styled } from '@linaria/react';
import { Text, Box, Flex } from 'theme-ui';
import { Amount } from './Amount';

interface TextWithAmountProps {
  size?: string,
  value: string,
  icon?: JSX.Element,
  currency?: string,
  showConvertedToUsd?: boolean,
  equalizer: any,
  text: string;
  fontWeight?: number,
  color?:string,
};

export const TextWithAmount: React.FC<TextWithAmountProps> = ({ size = '16px', value, icon, currency, showConvertedToUsd, text, equalizer, fontWeight, color = 'rgba(0,0,0,0.5)' }) => {
  
  return (
  <Flex sx={{flexDirection: 'column'}}>
    <Box sx={{ mb:1 }}>
      <Text variant='primary' sx={{color: 'rgba(0,0,0,0.5)', fontWeight: 700 }}>{text}</Text>
    </Box>
    <Amount color={color} icon={icon} size={size} value={value} currency={currency} showConvertedToUsd={showConvertedToUsd} equalizer={equalizer} fontWeight={fontWeight} />
  </Flex>
  )
};
