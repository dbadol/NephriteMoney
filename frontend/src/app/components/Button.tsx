import React from 'react';
import { styled } from '@linaria/react';
import { ButtonVariant, Pallete } from '@core/types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.FC;
  pallete?: Pallete;
  variant?: ButtonVariant;
  width?: string;
  height?: string;
  borderRadius?: string;
  padding?: string;
  color?: string;
}

const BaseButtonStyled = styled.button<ButtonProps>`
  &[disabled] {
    opacity: 0.5;

    &:hover,
    &:active {
      box-shadow: none !important;
      cursor: not-allowed !important;
    }
  }
`;

const ButtonStyled = styled(BaseButtonStyled)`
  display: block;
  width: 100%;
  max-width: 254px;
  margin: 0 auto;
  margin-bottom: 10px;
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  background: ${({ pallete }) => pallete === 'gradient' ? 'linear-gradient(273.6deg, #527B0B 0.88%, #73A30A 94.96%)' : `var(--color-${pallete})`};
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  color: #FFF;

  &:hover,
  &:active {
    box-shadow: 0 0 8px white;
    cursor: pointer;
  }

  > svg {
    vertical-align: middle;
    margin-right: 10px;
  }
`;

const GhostBorderedButtonStyled = styled(ButtonStyled)`
  color: #204501;
  border: 1px solid #204501;
  max-width: 215px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 10px;
  padding: 8px 18px;

  &:hover,
  &:active {
    box-shadow: 0 0 8px rgba(0, 246, 210, 0.15);
    background-color: rgba(0, 246, 210, 0.3);
  }

  > svg {
    vertical-align: middle;
    margin-right: 10px;
  }
`;

const GhostButtonStyled = styled(ButtonStyled)`
  background: linear-gradient(273.6deg, rgba(130, 130, 130, 0.5) 0.88%, rgba(175, 175, 175, 0.5) 94.96%);
  color: white;

  &:hover,
  &:active {
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const BlockButtonStyled = styled(GhostButtonStyled)`
  width: 100%;
  max-width: none;
  padding: 18px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.03);
  font-size: 14px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: ${({ pallete }) => `var(--color-${pallete})`};

  &:hover,
  &:active {
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
`;

const IconButtonStyled = styled(BaseButtonStyled)`
  display: inline-block;
  vertical-align: sub;
  margin: 0 10px;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${({ pallete }) => `var(--color-${pallete})`};

  > svg {
    vertical-align: middle;
  }
`;

const CustomButtonStyled = styled(ButtonStyled)`
  width: 190px;
  margin: 0 auto; 
  margin-top:24px;
  padding: 10px 20px;
`

const LinkButtonStyled = styled(IconButtonStyled)`
  margin: 20px 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ pallete }) => `var(--color-${pallete})`};

  > svg {
    vertical-align: middle;
    margin-right: 10px;
  }
`;

const VARIANTS = {
  regular: ButtonStyled,
  ghost: GhostButtonStyled,
  ghostBordered: GhostBorderedButtonStyled,
  link: LinkButtonStyled,
  icon: IconButtonStyled,
  block: BlockButtonStyled,
  custom: CustomButtonStyled,
};

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  pallete = 'green',
  variant = 'regular',
  width = 'auto',
  height = '37px',
  borderRadius = '10px',
  padding = '10px 20px',
  icon: IconComponent,
  children,
  ...rest
}) => {
  const ButtonComponent = VARIANTS[variant];

  return (
    <ButtonComponent type={type} pallete={pallete} {...rest}>
      {!!IconComponent && <IconComponent />}
      {children}
    </ButtonComponent>
  );
};

export default Button;
