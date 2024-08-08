import styled from 'styled-components';

interface IGoatOrTiger {
  $isTigerSelected: boolean;
}

export const SquareButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
`;

export const GoatOrTiger = styled.img<IGoatOrTiger>`
  position: absolute;
  width: 55px;
  height: 55px;
  object-fit: cover;

  transform: ${({ $isTigerSelected }) => ($isTigerSelected ? 'scale(1.2)' : 'scale(1)')};
`;
