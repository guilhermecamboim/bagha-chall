import styled from 'styled-components';

export const ContainerBoard = styled.div``;

export const GameBoardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 75px;
  background-image: url('src/assets/bhaga-chall-board.png');
  width: 400px;
  height: 400px;
  background-size: 400px;
  object-fit: cover;
`;

export const BoardRow = styled.div`
  display: grid;
  grid-row-gap: 35px;
`;

export const Status = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  color: white;

  p {
    margin: 0;
    background: black;
    border-radius: 2px;
  }
`;
export const GoatOrTiger = styled.img`
  height: 30px;
  width: 30px;
`;

export const FirstStepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border-radius: 8px;
  background: #cccccc;
  border: 1px solid black;

  h1 {
    margin: 0;
    font-size: 40px;
    background: #107a26;
    border-radius: 2px;
    padding: 1rem;
    color: #aaf030;
  }

  h2 {
    font-size: 18px;
    margin: 0;
    background: #aaf030;
    border-radius: 2px;
    color: #107a26;
    padding: 0.5rem;
  }

  button {
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    min-width: 20rem;
    min-height: 3rem;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

export const GameBoardWrapperWinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('src/assets/bhaga-chall-board.png');
  width: 400px;
  height: 400px;
  background-size: 400px;
  object-fit: cover;

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #107a26;
    gap: 1rem;
  }

  img {
    height: 5rem;
    width: 5rem;
  }
`

export const WrapperWinner = styled.div`
  background: #cccccc;
  border: 1px solid black;
  padding: 2rem;
  border-radius: 16px;
  display: flex;
  flex-direction: column;

  button {
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    min-width: 18rem;
    min-height: 3rem;

    &:hover {
      transform: scale(1.05);
    }
  }
`

export const ContainerCheckbox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  p {
    font-size: 14px;
  }
  input {
    accent-color: #107a26;
  }
`