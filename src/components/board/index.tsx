import { useEffect, useState } from 'react';
import Square from '../square';
import tigerImg from "../../assets/tiger.png";
import goatImg from "../../assets/goat.png";
import * as S from './styles';

type Cell = 'T' | 'G' | null;
type boardType = Cell[][];

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
  const [selectedTiger, setSelectedTiger] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState('Goat');
  const [goatsToPlace, setGoatsToPlace] = useState(20);
  const [goatsEaten, setGoatsEaten] = useState(0);
  const [isAI, setIsAI] = useState(false);
  const [playerRole, setPlayerRole] = useState('Goat');
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

const prohibitedMoves: ProhibitedMoves = {
 '0,1': [[1, 0], [1, 2]], 
 '4,1': [[3, 0], [3, 2]],
 '0,3': [[1, 2], [1, 4]],
 '4,3': [[3, 2], [3, 4]], 
 '1,0': [[0, 1], [2, 1], [3,2]],
 '3,0': [[2, 1], [4, 1]],
 '1,4': [[0, 3], [2, 3]],
 '3,4': [[2, 3], [4, 3]],
 '2,1': [[3, 0], [1, 0], [3, 2], [1, 2], [4, 3], [0, 3]],
 '1,2': [[0, 1], [2, 1], [2, 3], [0, 3], [3, 0], [3,4]],
 '3,2': [[2, 1], [4, 1], [2, 3], [4, 3], [1, 0], [1, 4]],
 '2,3': [[1, 2], [3, 2], [1, 4], [3, 4], [0, 1], [4, 1]],
};

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
        setWinner('Tiger')
    } else if (goatsToPlace === 0 && goatsEaten < 5) {
        setWinner('Goat')
    } else if (!canTigerMove){
        setWinner('Goat')
    }
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

  // Calculate the number of potential captures for the currently moving tiger
  const calculate_potential_captures = (board: boardType, tiger: any) => {
    const [x, y] = tiger;
    let captures = 0;
    const moves = [
        [2, 0], [-2, 0], [0, 2], [0, -2],
        [2, 2], [-2, -2], [2, -2], [-2, 2]
    ];

    for (const [dx, dy] of moves) {
        const [nx, ny] = [x + dx, y + dy];
        const [mx, my] = [x + dx / 2, y + dy / 2];
        if (nx >= 0 && ny >= 0 && nx < 5 && ny < 5 && board[nx][ny] === null && board[mx][my] === 'G') {
            captures += 1;
        }
    }
    return captures;
  };

  // Calculate the mobility of the currently moving tiger
  const calculate_tiger_mobility = (board: boardType, tiger: number[] | [any, any]) => {
    const [x, y] = tiger;
    let mobility = 0;
    const moves = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [2, 0], [-2, 0], [0, 2], [0, -2],
      [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];
  
    for (const [dx, dy] of moves) {
      const [nx, ny] = [x + dx, y + dy];
  
      // Check if the move is within bounds and the destination square is empty
      if (nx >= 0 && ny >= 0 && nx < 5 && ny < 5 && board[nx][ny] === null) {
        const tigerPositionKey = `${x},${y}`;
        let isProhibited = false;
  
        if (prohibitedMoves[tigerPositionKey]) {
          for (const [px, py] of prohibitedMoves[tigerPositionKey]) {
            if (nx === px && ny === py) {
              isProhibited = true;
              break;
            }
          }
        }
  
        if (!isProhibited) {
          mobility += 1;
        }
      }
    }
    return mobility;
  };
  

  // Check if the tiger is blocked
  const is_tiger_blocked = (board: boardType, tiger: number[] | [any, any]) => {
    return calculate_tiger_mobility(board, tiger) === 0;
  };

  // Calculate the number of goats in vulnerable positions
  const calculate_vulnerable_goats = (board: boardType) => {
    let vulnerableGoats = 0;
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (board[x][y] === 'G') {
                const moves = [
                    [2, 0], [-2, 0], [0, 2], [0, -2],
                    [2, 2], [-2, -2], [2, -2], [-2, 2]
                ];
                for (const [dx, dy] of moves) {
                    const [nx, ny] = [x + dx, y + dy];
                    const [mx, my] = [x + dx / 2, y + dy / 2];
                    if (nx >= 0 && ny >= 0 && nx < 5 && ny < 5 && board[nx][ny] === 'T' && board[mx][my] === null) {
                        vulnerableGoats += 1;
                        break;
                    }
                }
            }
        }
    }
    return vulnerableGoats;
  };

  // Adjust the evaluation function
  const evaluate_board = (board: boardType) => {
    let score = 0;
    tigers.forEach(tiger => {
      const potentialCaptures = calculate_potential_captures(board, tiger);
      const tigerMobility = calculate_tiger_mobility(board, tiger);
      const blockedTiger = is_tiger_blocked(board, tiger);
      const vulnerableGoats = calculate_vulnerable_goats(board);
  
      const W1 = 15; // Increased weight for potential captures
      const W2 = 5;  // Weight for tiger mobility
      const W3 = 10; // Increased weight for blocked tiger
      const W4 = 5;  // Adjusted weight for vulnerable goats
  
      score += (W1 * potentialCaptures) +
               (W2 * tigerMobility) -
               (W3 * Number(blockedTiger)) -
               (W4 * vulnerableGoats);
    });
    return score;
  };

const minimax = (board: boardType, depth: number, isMaximizingPlayer: boolean, alpha: number, beta: number) => {
    if (depth === 0 || checkGameOver()) {
      return { score: evaluate_board(board) };
    }
  
    let bestMove = null;
    if (isMaximizingPlayer) {
      let maxEval = -Infinity;
      const { captures = [], regularMoves = [] } = getAvailableMoves('Tiger');
      const availableMoves = captures.length > 0 ? captures : regularMoves;
  
      for (const move of availableMoves) {
        const newBoard = makeMove(board, move);
        const evaluate = minimax(newBoard, depth - 1, false, alpha, beta).score;
        if (evaluate > maxEval) {
          maxEval = evaluate;
          bestMove = move;
        }
        alpha = Math.max(alpha, evaluate);
        if (beta <= alpha) {
          break;
        }
      }
      return { score: maxEval, move: bestMove };
    } else {
      let minEval = Infinity;
      const { regularMoves = [] } = getAvailableMoves('Goat');
      const availableMoves = regularMoves;
  
      for (const move of availableMoves) {
        const newBoard = makeMove(board, move);
        const evaluate = minimax(newBoard, depth - 1, true, alpha, beta).score;
        if (evaluate < minEval) {
          minEval = evaluate;
          bestMove = move;
        }
        beta = Math.min(beta, evaluate);
        if (beta <= alpha) {
          break;
        }
      }
      return { score: minEval, move: bestMove };
    }
  };
  

  const getAvailableMoves = (player: 'Tiger' | 'Goat') => {
    const moves: { from?: number[]; to: number[]; }[] = [];
    const captures: { from?: number[]; to: number[]; capture?: number[]; }[] = [];
  
    if (player === 'Tiger') {
      tigers.forEach(([x, y]) => {
        const potentialMoves = [
          [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
          [x - 1, y - 1], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y + 1],
        ];
  
        potentialMoves.forEach(([nx, ny]) => {
          if (nx >= 0 && ny >= 0 && nx < 5 && ny < 5) {
            const tigerPositionKey = `${x},${y}`;
            let isProhibited = false;
  
            if (board[nx][ny] === null) {
              if (prohibitedMoves[tigerPositionKey]) {
                for (const [px, py] of prohibitedMoves[tigerPositionKey]) {
                  if (nx === px && ny === py) {
                    isProhibited = true;
                    break;
                  }
                }
              }
              if (!isProhibited) {
                moves.push({ from: [x, y], to: [nx, ny] });
              }
            } else if (board[nx][ny] === 'G') {
              const [cx, cy] = [x + (nx - x) * 2, y + (ny - y) * 2];
              if (cx >= 0 && cy >= 0 && cx < 5 && cy < 5 && board[cx][cy] === null) {
                let isCaptureProhibited = false;
                if (prohibitedMoves[tigerPositionKey]) {
                  for (const [px, py] of prohibitedMoves[tigerPositionKey]) {
                    if (cx === px && cy === py) {
                      isCaptureProhibited = true;
                      break;
                    }
                  }
                }
                if (!isCaptureProhibited) {
                  captures.push({ from: [x, y], to: [cx, cy], capture: [nx, ny] });
                }
              }
            }
          }
        });
      });
    } else {
      // Generate Goat moves (placing new goats)
      for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
          if (board[x][y] === null) {
            moves.push({ to: [x, y] });
          }
        }
      }
    }
    return { captures, regularMoves: moves };
  };
  

  const makeMove = (board: boardType, move: { from: any; to: any; capture?: any; }) => {
    const newBoard = board.map(row => row.slice());
    const { from, to, capture } = move;
    const [tx, ty] = to;
  
    if (from) {
      const [fx, fy] = from;
      newBoard[fx][fy] = null;
    }
  
    newBoard[tx][ty] = from ? 'T' : 'G'; // 'T' if it's a tiger move, 'G' if it's a goat placement
  
    if (capture) {
      const [cx, cy] = capture;
      newBoard[cx][cy] = null; // Remove the captured goat
      setGoatsEaten(goatsEaten + 1);
    }
  
    return newBoard;
  };
  
  
  const aiMove = () => {
    if (turn === 'Tiger') {
      const { move } = minimax(board, 3, true, -Infinity, Infinity);
      if (move) {
        const newBoard = makeMove(board, move);
        setBoard(newBoard);
        setTigers(tigers.map(t => (t[0] === move.from[0] && t[1] === move.from[1] ? [move.to[0], move.to[1]] : t)));
        setTurn('Goat');
      }
    } else if (turn === 'Goat' && goatsToPlace > 0) {
      const { regularMoves } = getAvailableMoves('Goat');
      if (regularMoves.length > 0) {
        const move = regularMoves[Math.floor(Math.random() * regularMoves.length)];
        const newBoard = makeMove(board, { from: null, to: move.to });
        setBoard(newBoard);
        setGoatsToPlace(goatsToPlace - 1);
        setTurn('Tiger');
      }
    }
  };
  
  
  useEffect(() => {
    if (isAI && playerRole === 'Goat' && turn === 'Tiger') {
      aiMove();
    }
    if (isAI && playerRole === 'Tiger' && turn === 'Goat') {
      aiMove();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAI, playerRole, turn]);

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
          <button onClick={() => { setIsAI(false); setPlayerRole('Goat'); setGameStarted(true); }}>{`Jogador vs Jogador`}</button>
          <button onClick={() => { setIsAI(true); setPlayerRole('Goat'); setGameStarted(true); }}>{`Jogador vs AI  👉 Jogar com a`} <span><S.GoatOrTiger src={goatImg}/></span></button>
          <button onClick={() => { setIsAI(true); setPlayerRole('Tiger'); setGameStarted(true); }}>{`Jogador vs AI  👉 Jogar com o`} <span><S.GoatOrTiger src={tigerImg}/></span></button>
        </S.FirstStepContainer>
      ) : (
      <S.ContainerBoard>
        {!winner ? (
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
      ) : (
        <S.GameBoardWrapperWinner>
          <S.WrapperWinner>

          <p><span><S.GoatOrTiger src={winner === 'Tiger' ? tigerImg : goatImg}/></span> Ganharam!</p>
          <button onClick={() => window.location.reload()}>Jogar novamente</button>

          </S.WrapperWinner>
          
        </S.GameBoardWrapperWinner>

      )}
          
      </S.ContainerBoard>
      )}
    </>
  );
};

export default GameBoard;