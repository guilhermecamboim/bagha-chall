import { useState } from 'react';
import Square from '../square';
import tigerImg from "../../assets/tiger.png"
import goatImg from "../../assets/goat.png"
import * as S from './styles'

type ProhibitedMoves = {
    [key: string]: [number, number][];
};

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
  const [isAI, setIsAI] = useState(false);
  const [playerRole, setPlayerRole] = useState('Goat');
  const [gameStarted, setGameStarted] = useState(false);

  const prohibitedMoves: ProhibitedMoves = {
    '0,1': [[1, 0], [1, 2]], 
    '4,1': [[3, 0], [3, 2]],
    '0,3': [[1, 2], [1, 4]],
    '4,3': [[3, 2], [3, 4]], 
    '1,0': [[0, 1], [2, 1]],
    '3,0': [[2, 1], [4, 1]],
    '1,4': [[0, 3], [2, 3]],
    '3,4': [[2, 3], [4, 3]],
    '2,1': [[3, 0], [1, 0], [3, 2], [1, 2], [4, 3], [0, 3]],
    '1,2': [[0, 1], [2, 1], [2, 3], [0, 3]],
    '3,2': [[2, 1], [4, 1], [2, 3], [4, 3]],
    '2,3': [[1, 2], [3, 2], [1, 4], [3, 4], [0, 1], [4, 1]],
};

const generateGoatMoves = (board: (string[] | null[])[]) => {
    const moves = [];
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (board[x][y] === 'G') {
                const possibleMoves = [
                    [x - 1, y], [x + 1, y],
                    [x, y - 1], [x, y + 1]
                ];
                for (const [nx, ny] of possibleMoves) {
                    if (nx >= 0 && ny >= 0 && nx < 5 && ny < 5 && board[nx][ny] === null) {
                        moves.push([[x, y], [nx, ny]]);
                    }
                }
            }
        }
    }
    return moves;
};

const generateTigerMoves = (board: (string[] | null[])[], tigers: number[][]) => {
    const moves = [];
    for (const [x, y] of tigers) {
        const possibleMoves = [
            [x - 1, y], [x + 1, y],
            [x, y - 1], [x, y + 1],
            [x - 2, y], [x + 2, y],
            [x, y - 2], [x, y + 2],
            [x - 2, y - 2], [x + 2, y + 2],
            [x - 2, y + 2], [x + 2, y - 2]
        ];
        for (const [nx, ny] of possibleMoves) {
            if (nx >= 0 && ny >= 0 && nx < 5 && ny < 5 && board[nx][ny] === null) {
                if (Math.abs(nx - x) === 2 || Math.abs(ny - y) === 2) {
                    const mx = (nx + x) / 2;
                    const my = (ny + y) / 2;
                    if (board[mx][my] === 'G') {
                        moves.push([[x, y], [nx, ny], true]);
                    }
                } else {
                    moves.push([[x, y], [nx, ny], false]);
                }
            }
        }
    }
    return moves;
};

const evaluateBoard = (goatsEaten: number, goatsToPlace: number) => {
        return goatsEaten - (20 - goatsToPlace);
    };

const minimax = (board: (string[] | null[])[], tigers: number[][] , goatsEaten: number, goatsToPlace: number, depth: number, isMaximizingPlayer: boolean, alpha: number, beta: number) => {
    if (depth === 0 || goatsEaten >= 5 || goatsToPlace === 0) {
        return evaluateBoard(goatsEaten, goatsToPlace);
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        const tigerMoves = generateTigerMoves(board, tigers);
        for (const [from, to, isCapture] of tigerMoves) {
            const newBoard = board.map(row => row.slice());
            newBoard[from[0]][from[1]] = null;
            newBoard[to[0]][to[1]] = 'T';
            const newTigers = tigers.map(t => (t[0] === from[0] && t[1] === from[1] ? [to[0], to[1]] : t));
            let newGoatsEaten = goatsEaten;
            if (isCapture) {
                const mx = (from[0] + to[0]) / 2;
                const my = (from[1] + to[1]) / 2;
                newBoard[mx][my] = null;
                newGoatsEaten += 1;
            }
            const evaluation = minimax(newBoard, newTigers, newGoatsEaten, goatsToPlace, depth - 1, false, alpha, beta);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) {
                break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        const goatMoves = generateGoatMoves(board);
        for (const [from, to] of goatMoves) {
            const newBoard = board.map(row => row.slice());
            newBoard[from[0]][from[1]] = null;
            newBoard[to[0]][to[1]] = 'G';
            const evaluation = minimax(newBoard, tigers, goatsEaten, goatsToPlace, depth - 1, true, alpha, beta);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) {
                break;
            }
        }
        return minEval;
    }
};

const getBestMove = (board: (string[] | null[])[], tigers: number[][], goatsEaten: number, goatsToPlace: number, depth: number, isMaximizingPlayer: boolean) => {
    let bestMove = null;
    let bestValue = isMaximizingPlayer ? -Infinity : Infinity;

    const moves = isMaximizingPlayer ? generateTigerMoves(board, tigers) : generateGoatMoves(board);

    for (const move of moves) {
        const newBoard = board.map(row => row.slice());
        const [[fromX, fromY], [toX, toY], isCapture] = move;
        newBoard[fromX][fromY] = null;
        newBoard[toX][toY] = isMaximizingPlayer ? 'T' : 'G';

        if (isCapture) {
            const mx = (fromX + toX) / 2;
            const my = (fromY + toY) / 2;
            newBoard[mx][my] = null;
        }

        const newTigers = isMaximizingPlayer
            ? tigers.map(t => (t[0] === fromX && t[1] === fromY ? [toX, toY] : t))
            : tigers;

        const newGoatsEaten = isMaximizingPlayer && isCapture ? goatsEaten + 1 : goatsEaten;
        const newGoatsToPlace = isMaximizingPlayer ? goatsToPlace : goatsToPlace - 1;

        const boardValue = minimax(newBoard, newTigers, newGoatsEaten, newGoatsToPlace, depth - 1, !isMaximizingPlayer, -Infinity, Infinity);

        if (isMaximizingPlayer ? boardValue > bestValue : boardValue < bestValue) {
            bestValue = boardValue;
            bestMove = move;
        }
    }

    return bestMove;
};

console.log('max',getBestMove(board, tigers, goatsEaten, goatsToPlace, 3, true))
console.log('min',getBestMove(board, tigers, goatsEaten, goatsToPlace, 3, false))

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

                const tigerPositionKey = `${tx},${ty}`;
                if (prohibitedMoves[tigerPositionKey]) {
                    for (const [px, py] of prohibitedMoves[tigerPositionKey]) {
                        if (x === px && y === py) {
                            return;
                        }
                    }
                }

                // Ensure the move is within bounds and to an empty square
                if (newBoard[x][y] === null) {
                    
                    // Only allow moves within one square or valid jumps
                    if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
                        // Simple move
                        newBoard[tx][ty] = null;
                        newBoard[x][y] = 'T';
                        setTigers(tigers.map(t => (t[0] === tx && t[1] === ty ? [x, y] : t)));
                        setSelectedTiger(null);
                        setTurn('Goat');
                    } else if (Math.abs(dx) === 2 && dy === 0) {
                        // Horizontal capture
                        const mx = tx + dx / 2;
                        if (newBoard[mx][ty] === 'G') {
                            newBoard[mx][ty] = null;
                            setGoatsEaten(goatsEaten + 1);
                            newBoard[tx][ty] = null;
                            newBoard[x][y] = 'T';
                            setTigers(tigers.map(t => (t[0] === tx && t[1] === ty ? [x, y] : t)));
                            setSelectedTiger(null);
                            setTurn('Goat');
                        }
                    } else if (dx === 0 && Math.abs(dy) === 2) {
                        // Vertical capture
                        const my = ty + dy / 2;
                        if (newBoard[tx][my] === 'G') {
                            newBoard[tx][my] = null;
                            setGoatsEaten(goatsEaten + 1);
                            newBoard[tx][ty] = null;
                            newBoard[x][y] = 'T';
                            setTigers(tigers.map(t => (t[0] === tx && t[1] === ty ? [x, y] : t)));
                            setSelectedTiger(null);
                            setTurn('Goat');
                        }
                    } else if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
                        // Diagonal capture
                        const mx = tx + dx / 2;
                        const my = ty + dy / 2;
                        if (newBoard[mx][my] === 'G') {
                            newBoard[mx][my] = null;
                            setGoatsEaten(goatsEaten + 1);
                            newBoard[tx][ty] = null;
                            newBoard[x][y] = 'T';
                            setTigers(tigers.map(t => (t[0] === tx && t[1] === ty ? [x, y] : t)));
                            setSelectedTiger(null);
                            setTurn('Goat');
                        }
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
      } else if (goatsEaten < 5 && goatsToPlace === 0) {
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
    <>
    {!gameStarted ? (
        <S.FirstStepContainer>
          <h1>Bhaga Chall</h1>
          <h2>Escolha o tipo de jogo</h2>
          <button onClick={() => { setIsAI(false); setPlayerRole('Goat'); setGameStarted(true); }}>{`Jogador vs Jogador  👉 Jogar com a`} <span><S.GoatOrTiger src={goatImg}/></span></button>
          <button onClick={() => { setIsAI(false); setPlayerRole('Tiger'); setGameStarted(true); }}>{`Jogador vs Jogador  👉 Jogar com o`} <span><S.GoatOrTiger src={tigerImg}/></span></button>
          <button onClick={() => { setIsAI(true); setPlayerRole('Goat'); setGameStarted(true); }}>{`Jogador vs AI  👉 Jogar com a`} <span><S.GoatOrTiger src={goatImg}/></span></button>
          <button onClick={() => { setIsAI(true); setPlayerRole('Tiger'); setGameStarted(true); }}>{`Jogador vs AI  👉 Jogar com o`} <span><S.GoatOrTiger src={tigerImg}/></span></button>
        </S.FirstStepContainer>
      ) : (
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
      )}
    </>
  );
};

export default GameBoard;
