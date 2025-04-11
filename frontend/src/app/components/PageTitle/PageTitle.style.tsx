import { styled } from '@linaria/react';

export const TitleContainer = styled.div`
  min-height: 45px;
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  user-select: none;
  margin-bottom: 30px;
  & > * {
    flex-grow: 1;
    flex-basis: 0;
  }
`

export const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'SFProDisplay', sans-serif;
  font-weight: 800;
  font-size: 16px;
  line-height: 19px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #204501;
`
export const TitleChildren = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;

    &:last-child {
      margin-right: 6px;
    }
`