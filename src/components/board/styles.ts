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