import React from 'react';
import { styled } from '@linaria/react';

import { fromGroths, getSign, toUSD } from '@app/library/base/appUtils';
import { useSelector } from 'react-redux';
import { selectRate } from '@app/store/NephriteStore/selectors';

interface Props {
  value: number;
  income?: boolean;
  groths?: boolean;
  className?: string;
}

const Ratetyled = styled.div`
  margin-top: 4px;
  color: var(--color-gray);
`;

const Rate: React.FC<Props> = ({
  value, income, groths, className,
}) => {
  const rate = useSelector(selectRate());
  const sign = income ? getSign(income) : '';
  const amount = groths ? fromGroths(value) : value;
  return (
    <Ratetyled className={className}>
      {sign}
      {toUSD(amount, rate)}
    </Ratetyled>
  );
};

export default Rate;
