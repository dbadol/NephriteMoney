import React from 'react';
import { styled } from '@linaria/react';
import { Text } from 'theme-ui'
import IconBack from '@app/components/icons/icon-back.svg';

const BackBtn = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
    line-height: 17px;
    color: #527B0B;
    text-align: 'center';

    & svg {
      margin-right: 0.25em;
      width: 14px;
      height: 14px;
    }
`

export const BackButton: React.FC<{text:string}> = ({text}) => {
  return (
    <BackBtn>
      <IconBack/>
    <Text sx={{ ml: 2 }}>{ text }</Text>
  </BackBtn>
  )
}