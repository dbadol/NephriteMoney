import { styled } from '@linaria/react';

interface ModalContentProps {
  width: string;
  height: string;
}
const bgColor = "#0e4d76";
export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  background-color: rgba(26, 22, 22, 0.27);
`;

export const ModalContent = styled.div<ModalContentProps>`
    padding: 40px;
    min-width: ${({ width }) => width ? width : '630px' };
    max-width:  800px;
    width: ${({ width }) => width ? width : 'auto' };
    height: ${({ height }) => height };
    border-radius: 10px;
    background-color: #F4F7EC;
`;

export const ModalHeader = styled.p`
    font-family: 'SFProDisplay';
    font-style: normal;
    font-weight: 800;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 2px;
    text-align: center;
    color: #204501;
    text-align: center;
    margin-bottom: 16px;
`
