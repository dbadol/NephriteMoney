import React, { FC } from 'react';
import ReactDOM from 'react-dom';

import {
  Wrapper,
  ModalContent,
  ModalHeader
} from './modal.style';

export interface ModalProps {
  isShown: boolean;
  children: JSX.Element;
  header?: string;
  width?: string;
  height?: string;
}

export const Modal: FC<ModalProps> = ({
  isShown,
  header,
  width,
  height,
  children
}) => {
  const modal = (
    <React.Fragment>
      <Wrapper>
        <ModalContent width={width} height={height}>
        {
          header && (
            <ModalHeader>
              { header }
            </ModalHeader>
        )} 
          { children }
        </ModalContent>
      </Wrapper>
    </React.Fragment>
  );

  return isShown ? ReactDOM.createPortal(modal, document.body) : null;
};
