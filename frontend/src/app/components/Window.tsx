import React, { useRef, useState } from 'react';
import Utils from '@app/library/base/utils.js';
import { useNavigate } from 'react-router-dom';
import { Container, Heading } from 'theme-ui';
import { styled } from '@linaria/react';

interface WindowProps {
  onPrevious?: React.MouseEventHandler | undefined;
}

const Window: React.FC<WindowProps> = ({
  children
}) => {
  const navigate = useNavigate();
  const rootRef = useRef();

  const titleClicked = () => {
    navigate("/");
  };

  return (
    <>
      <Container variant="window" sx={(theme) => ({ background: "#fff" })}>
        {children}
      </Container>
    </>
  );
};

export default Window;
