import React from 'react';
import { styled } from '@linaria/react';
import { Text, Box } from 'theme-ui';
import { Decimal } from '@app/library/base/Decimal';

interface AmountProps {
  size: string,
  value: string,
  icon?: JSX.Element,
  currency?: string,
  showConvertedToUsd?: boolean,
  equalizer?: any,
  fontWeight?: number,
  color?: string,
};

interface ContainerStyles {
  size: string,
  showConvertedToUsd?: boolean,
}

const Container = styled.div<ContainerStyles>`
  font-size: ${props => props.size};
  font-weight: 700;
  display: flex;
  color: #000;
  font-family: 'SFProDisplay', sans-serif;
  font-weight: bolder;
  align-items: ${props => props.showConvertedToUsd ? 'start' : 'center'};

  & .text {
    font-size: ${props => props.size};
    white-space: nowrap;
    font-weight: 600;
  }

  & > *:not(:first-child) {
    margin-left: 8px;
  }
`
export const Amount: React.FC<AmountProps> = ({ size, value, icon, currency, showConvertedToUsd, equalizer, fontWeight = 400, color }) => {

  return (
    <Container size={size} showConvertedToUsd={showConvertedToUsd}>
    { icon }
    <Box>
      <Text variant='main' className='text' sx={{ fontWeight:fontWeight,color:color }}>{ value } { currency }</Text>
      {
       showConvertedToUsd && equalizer && <Text variant='subState' sx={{ display: 'block' }}>{equalizer()} USD</Text>
      }
    </Box>
  </Container>
  )
}

