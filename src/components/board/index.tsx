import { useState } from 'react';
import Square from '../square';
import tigerImg from "../../assets/tiger.png"
import goatImg from "../../assets/goat.png"
import * as S from './styles'

const GameBoard = () => {
  const initialBoard = Array(5).fill(null).map(() => Array(5).fill(null));
  const initialTigers = [
      [0, 0],
      [0, 4],
      [4, 0],
      [4, 4]
  ];

  initialTigers.forEach(([x, y]) => {
      initialBoard[x][y] = 'T';
  });

  const [board, setBoard] = useState(initialBoard);
  const [tigers, setTigers] = useState(initialTigers);
  const [selectedTiger, setSelectedTiger] = useState<[number, number] | null >(null);
  const [turn, setTurn] = useState('Goat');
  const [goatsToPlace, setGoatsToPlace] = useState(20);
  const [goatsEaten, setGoatsEaten] = useState(0);

  const handleClick = (x: number, y: number) => {
      const newBoard = board.map(row => row.slice());

      if (turn === 'Goat' && newBoard[x][y] === null && goatsToPlace > 0) {
          newBoard[x][y] = 'G';
          setGoatsToPlace(goatsToPlace - 1);
          setTurn('Tiger');
      } else if (turn === 'Tiger') {
          if (newBoard[x][y] === 'T') {
              setSelectedTiger([x, y]);
          } else if (selectedTiger) {
              const [tx, ty] = selectedTiger;
              const dx = x - tx;
              const dy = y - ty;

              // Ensure the move is within bounds and to an empty square
              if (newBoard[x][y] === null) {
                  // Move or capture logic
                  if (Math.abs(dx) <= 2 && Math.abs(dy) <= 2) {
                      // Capture logic for horizontal and vertical moves
                      if (Math.abs(dy) === 2 && dx === 0) {
                          const my = ty + dy / 2;
                          if (newBoard[tx][my] === 'G') {
                              newBoard[tx][my] = null;
                              setGoatsEaten(goatsEaten + 1);
                          } else {
                              return;
                          }
                      } else if (Math.abs(dx) === 2 && dy === 0) {
                          const mx = tx + dx / 2;
                          if (newBoard[mx][ty] === 'G') {
                              newBoard[mx][ty] = null;
                              setGoatsEaten(goatsEaten + 1);
                          } else {
                              return;
                          }
                      }

                      // Capture logic for diagonal moves
                      if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
                          const mx = tx + dx / 2;
                          const my = ty + dy / 2;
                          if (newBoard[mx][my] === 'G') {
                              newBoard[mx][my] = null;
                              setGoatsEaten(goatsEaten + 1);
                          } else {
                              return;
                          }
                      }

                      // Move the tiger
                      newBoard[tx][ty] = null;
                      newBoard[x][y] = 'T';
                      setTigers(tigers.map(t => (t[0] === tx && t[1] === ty ? [x, y] : t)));
                      setSelectedTiger(null);
                      setTurn('Goat');
                  }
              }
          }
      }

      setBoard(newBoard);
      checkGameOver();
  };

  const checkGameOver = () => {
      if (goatsEaten >= 5) {
          alert('Tigres venceram!');
      } else if (goatsToPlace === 0 && !canGoatMove()) {
          alert('Tigres venceram!');
      } else if (!canTigerMove()) {
          alert('Cabras venceram!');
      }
  };

  const canGoatMove = () => {
      for (let x = 0; x < 5; x++) {
          for (let y = 0; y < 5; y++) {
              if (board[x][y] === 'G') {
                  const moves = [
                      [x - 1, y], [x + 1, y],
                      [x, y - 1], [x, y + 1]
                  ];
                  for (const [nx, ny] of moves) {
                      if (nx >= 0 && ny >= 0 && nx < 5 && ny < 5 && board[nx][ny] === null) {
                          return true;
                      }
                  }
              }
          }
      }
      return false;
  };

  const canTigerMove = () => {
      for (const [x, y] of tigers) {
          const moves = [
              [x - 1, y], [x + 1, y],
              [x, y - 1], [x, y + 1],
              [x - 2, y - 2], [x + 2, y + 2],
              [x - 2, y + 2], [x + 2, y - 2],
              [x + 2, y], [x - 2, y],
              [x, y + 2], [x, y - 2]
          ];
          for (const [nx, ny] of moves) {
              if (nx >= 0 && ny >= 0 && nx < 5 && ny < 5 && board[nx][ny] === null) {
                  return true;
              }
          }
      }
      return false;
  };

  const renderSquare = (x: number, y: number) => {
      return (
          <Square
              coordinateTigerSelected={selectedTiger}
              coordinateEach={[x,y]}
              value={board[x][y]}
              onClick={() => handleClick(x, y)}
              key={`${x}-${y}`}
          />
      );
  };

  const renderBoard = () => {
      return board.map((row, x) => (
          <S.BoardRow key={x}>
              {row.map((_, y) => renderSquare(x, y))}
          </S.BoardRow>
      ));
  };

  return (
      <S.ContainerBoard>
          <S.BoardRow>
            <S.Status>
                <p>Turno: <span><S.GoatOrTiger src={turn === 'Tiger' ? tigerImg : goatImg}/></span></p>
                <p>{`Cabras a serem preenchidas: ${goatsToPlace}`}</p>
                <p>{`Cabras perdidas: ${goatsEaten}`}</p>
            </S.Status>
            <S.GameBoardWrapper>
                {renderBoard()}
            </S.GameBoardWrapper>
          </S.BoardRow>
      </S.ContainerBoard>
  );
};

export default GameBoard;
