import { styled } from '@linaria/react';

interface PageItemProps {
  isActive: boolean;
}

export const PaginationWrapper = styled.div`
  padding-top: 25px;
  display: flex;
  justify-content: center;
`
export const Separator = styled.div`
  width: 1rem;
  margin: 0 0.25rem;
  color: rgba(0, 0, 0, 0.3);
`

export const PageItem = styled.button<PageItemProps>`
  background: transparent;
  border: none;
  margin: 0 0.25rem;
  font-weight: 600;
  color: #204501;
  color: ${({ isActive }) => isActive ? '#204501' : ' rgba(0, 0, 0, 0.3)' };
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
  
  &:focus {
    outline: 0;
  }

 & > span {
    background: rgba(42, 90, 1, 0.1);
    border: 1px solid rgba(42, 90, 1, 0.1);
    border-radius: 33px;
    padding: 2px 20px;
 }
`
