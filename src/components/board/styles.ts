import styled from 'styled-components'

export const ContainerBoard = styled.div`

`

export const GameBoardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 75px;
  background-image: url("src/assets/bhaga-chall-board.png");
  width: 400px;
  height: 400px;
  background-size: 400px;
  object-fit: cover;
`

export const BoardRow = styled.div`
  display: grid;
  grid-row-gap: 35px;
`

export const Status = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  color: white;

  p{
    margin: 0;
    background: black;
    border-radius: 2px;
  }
`
export const GoatOrTiger = styled.img`
  height: 30px;
  width: 30px;
`

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
    background: #107A26;
    border-radius: 2px;
    padding: 1rem;
    color: #AAF030;
  }

  h2{
    font-size: 18px;
    margin: 0;
    background: #AAF030;
    border-radius: 2px;
    color: #107A26;
    padding: 0.5rem;
  }
  
  button{
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    min-width: 18rem;

    &:hover{
      transform: scale(1.05);
    }
}
`