import { useCallback, useEffect, useState } from 'react';
import Square from '../square';
import tigerImg from "../../assets/tiger.png";
import goatImg from "../../assets/goat.png";
import * as S from './styles';

type Cell = 'T' | 'G' | null;
type boardType = Cell[][];
interface IMoveTigers { 
  from: number[]; 
  to: number[]; 
  capture?: number[]; 
}

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
  const [algorithmType, setAlgorithmType] = useState<'miniMax' | 'podaAlfa'>('podaAlfa');
  const [gameStarted, setGameStarted] = useState(false);
  const [playAlone, setPlayAlone] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

const prohibitedMoves: ProhibitedMoves = {
 '0,1': [[1, 0], [1, 2], [2, 3]], 
 '4,1': [[3, 0], [3, 2], [2, 3]],
 '0,3': [[1, 2], [1, 4], [2, 1]],
 '4,3': [[3, 2], [3, 4], [2, 1]], 
 '1,0': [[0, 1], [2, 1], [3, 2]],
 '3,0': [[2, 1], [4, 1], [1, 2]],
 '1,4': [[0, 3], [2, 3], [3, 2]],
 '3,4': [[2, 3], [4, 3], [1, 2]],
 '2,1': [[3, 0], [1, 0], [3, 2], [1, 2], [4, 3], [0, 3]],
 '1,2': [[0, 1], [2, 1], [2, 3], [0, 3], [3, 0], [3, 4]],
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
  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
    // Movimento simples
    newBoard[tx][ty] = null;
    newBoard[x][y] = 'T';
    setTigers(tigers.map(t => (t[0] === tx && t[1] === ty ? [x, y] : t)));
    setSelectedTiger(null);
    setTurn('Goat');
  } else if (Math.abs(dx) === 2 && dy === 0) {
    // Captura horizontal
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
   // Captura vertical
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
     // Captura diagonal
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

  const canTigerMove = useCallback(() => {
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
  }, [board, tigers]);

  const checkGameOver = useCallback(() => {
    if (goatsEaten >= 5) {
        setWinner('Tiger')
    } else if (goatsToPlace === 0 && goatsEaten < 5) {
        setWinner('Goat')
    } else if (!canTigerMove){
        setWinner('Goat')
    }
  }, [canTigerMove, goatsEaten, goatsToPlace]);

  const calculate_potential_captures = (board: boardType, tiger: [number, number]) => {
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

  const calculate_tiger_mobility = (board: boardType, tiger: [number, number]) => {
    const [x, y] = tiger;
    let mobility = 0;
    const moves = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [2, 0], [-2, 0], [0, 2], [0, -2],
      [1, 1], [-1, -1], [1, -1], [-1, 1]
    ];
  
    for (const [dx, dy] of moves) {
      const [nx, ny] = [x + dx, y + dy];
  
      // Verifica se o movimento está dentro dos limites e se o quadrado de destino está vazio
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
  
  const is_tiger_blocked = (board: boardType, tiger: [number, number]) => {
    return calculate_tiger_mobility(board, tiger) === 0;
  };

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

  const evaluate_board = (board: boardType) => {
    let score = 0;
    tigers.forEach(tiger => {
      const potentialCaptures = calculate_potential_captures(board, tiger as [number, number]);
      const tigerMobility = calculate_tiger_mobility(board, tiger as [number, number]);
      const blockedTiger = is_tiger_blocked(board, tiger as [number, number]);
      const vulnerableGoats = calculate_vulnerable_goats(board);
  
      const W1 = 15; // Aumento de peso para possíveis capturas
      const W2 = 5;  // Peso para mobilidade do tigre
      const W3 = 10; // Aumento de peso para tigre bloqueado
      const W4 = 5;  // Peso ajustado para cabras vulneráveis
  
      score += (W1 * potentialCaptures) +
               (W2 * tigerMobility) -
               (W3 * Number(blockedTiger)) -
               (W4 * vulnerableGoats);
    });
    return score;
  };

  const evaluate_board_with_goat_focus = (board: boardType) => {
  let score = 0;
  const vulnerableGoats = calculate_vulnerable_goats(board);
  
  const W1 = -50; // Penalidade alta para cabras vulneráveis
  const W2 = 5;   // Peso para a mobilidade dos tigres (menor peso que antes)

  tigers.forEach(tiger => {
    const tigerMobility = calculate_tiger_mobility(board, tiger as [number, number]);
    score += (W2 * tigerMobility);
  });

  score += (W1 * vulnerableGoats);

  return score;
};

function isSafePosition(x: number, y: number, board: boardType) {
  const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],         [0, 1],
      [1, -1], [1, 0], [1, 1]
  ];

  for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < board.length && ny < board.length) {
          if (board[nx][ny] === "T") {
              return false;
          }
      }
  }
  return true;
}

function distanceFromTigers(x: number, y: number, board: boardType) {
  let minDistance = Infinity;
  for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
          if (board[i][j] === "T") {
              const distance = Math.abs(x - i) + Math.abs(y - j);
              minDistance = Math.min(minDistance, distance);
          }
      }
  }
  return minDistance;
}

function getPossibleGoatPositions(board: boardType) {
  const n = board.length;
  let hasGoat = false;
  const possiblePositions = [];
  const directions = [
      [-1, 0], [1, 0],
      [0, -1], [0, 1]
  ];

  // Verifica se existe alguma cabra no tabuleiro
  for (let x = 0; x < n; x++) {
      for (let y = 0; y < n; y++) {
          if (board[x][y] === "G") {
              hasGoat = true;
              break;
          }
      }
      if (hasGoat) break;
  }

  // Se não houver nenhuma cabra, adiciona uma no centro
  if (!hasGoat) {
      const centerX = Math.floor(n / 2);
      const centerY = Math.floor(n / 2);
      return [[centerX, centerY]];
  }

  // Se houver cabras, encontra todas as posições possíveis
  for (let x = 0; x < n; x++) {
      for (let y = 0; y < n; y++) {
          if (board[x][y] === null && isSafePosition(x, y, board)) {
              let isAdjacentToGoat = false;
              for (const [dx, dy] of directions) {
                  const nx = x + dx;
                  const ny = y + dy;
                  if (nx >= 0 && ny >= 0 && nx < n && ny < n && board[nx][ny] === "G") {
                      isAdjacentToGoat = true;
                      break;
                  }
              }
              if (isAdjacentToGoat) {
                  possiblePositions.push([x, y]);
              }
          }
      }
  }

  // Se nenhuma posição segura for encontrada próxima a uma cabra, busca a posição mais distante dos tigres
  if (possiblePositions.length === 0) {
      let maxDistance = -1;
      let bestPosition = null;

      for (let x = 0; x < n; x++) {
          for (let y = 0; y < n; y++) {
              if (board[x][y] === null) {
                  const distance = distanceFromTigers(x, y, board);
                  if (distance > maxDistance) {
                      maxDistance = distance;
                      bestPosition = [x, y];
                  }
              }
          }
      }

      if (bestPosition !== null) {
          return [bestPosition];
      }
  }

  return possiblePositions;
}

const minimax = (board: boardType, depth: number, isMaximizingPlayer: boolean) => {
  if (depth === 0) {
    return { score: turn === 'Goat' ? evaluate_board_with_goat_focus(board) : evaluate_board(board) };
  }

  let bestMove = null;
  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    const { captures = [], regularMoves = [] } = getAvailableMoves(playerRole === 'Goat' && turn === 'Tiger' ? 'Tiger' : 'Goat');
    const availableMoves = captures.length > 0 ? captures : regularMoves;

    for (const move of availableMoves) {
      const newBoard = makeMove(board, move);
      const evaluate = minimax(newBoard, depth - 1, false).score;
      if (evaluate > maxEval) {
        maxEval = evaluate;
        bestMove = move;
      }
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    const { regularMoves = [] } = getAvailableMoves(playerRole === 'Goat' && turn === 'Goat' ? 'Goat' : 'Tiger');
    const availableMoves = regularMoves;

    for (const move of availableMoves) {
      const newBoard = makeMove(board, move);
      const evaluate = minimax(newBoard, depth - 1, true).score;
      if (evaluate < minEval) {
        minEval = evaluate;
        bestMove = move;
      }
    }
    return { score: minEval, move: bestMove };
  }
};


const minimaxPodaAlfaBeta = (board: boardType, depth: number, isMaximizingPlayer: boolean, alpha: number, beta: number) => {
    if (depth === 0) {
      return { score:  turn === 'Goat' ? evaluate_board_with_goat_focus(board) : evaluate_board(board) };
    }
  
    let bestMove = null;
    if (isMaximizingPlayer) {
      let maxEval = -Infinity;
      const { captures = [], regularMoves = [] } = getAvailableMoves(playerRole === 'Goat' && turn === 'Tiger' ? 'Tiger' : 'Goat');
      const availableMoves = captures.length > 0 ? captures : regularMoves;
  
      for (const move of availableMoves) {
        const newBoard = makeMove(board, move);
        const evaluate = minimaxPodaAlfaBeta(newBoard, depth - 1, false, alpha, beta).score;
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
      const { regularMoves = [] } = getAvailableMoves(playerRole === 'Goat' && turn === 'Goat' ? 'Goat' : 'Tiger');
      const availableMoves = regularMoves;
  
      for (const move of availableMoves) {
        const newBoard = makeMove(board, move);
        const evaluate = minimaxPodaAlfaBeta(newBoard, depth - 1, true, alpha, beta).score;
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
      getPossibleGoatPositions(board).forEach((eachGoatOption) => {
        moves.push({ to: eachGoatOption });
      })
    }
    return { captures, regularMoves: moves };
  };
  

  const makeMove = (board: boardType, move: { from?: number[] | undefined | null; to: number[]; capture?: number[]; }) => {
    const newBoard = board.map(row => row.slice());
    const { from, to, capture } = move;
    const [tx, ty] = to;
  
    if (from) {
      const [fx, fy] = from;
      newBoard[fx][fy] = null;
    }
  
    newBoard[tx][ty] = from ? 'T' : 'G';
  
    if (capture) {
      const [cx, cy] = capture;
      newBoard[cx][cy] = null;
      setGoatsEaten(goatsEaten + 1);
    }
  
    return newBoard;
  };
  
  const aiMove = () => {
    if (turn === 'Tiger') {
      const { move } = algorithmType === "podaAlfa" ? minimaxPodaAlfaBeta(board, 3, true, -Infinity, Infinity) : minimax(board, 3, true);
      if (move) {
        const newBoard = makeMove(board, move);
        setBoard(newBoard);
        setTigers(tigers.map(t => (t[0] === (move as IMoveTigers).from[0] && t[1] === (move as IMoveTigers).from[1] ? [move.to[0], move.to[1]] : t)));
        if(playAlone){
          setTimeout(() => setTurn('Goat'), 750);
        } else {
          setTurn('Goat');
        }
      }
    } else if (turn === 'Goat' && goatsToPlace > 0) {
      const { move } = algorithmType === "podaAlfa" ? minimaxPodaAlfaBeta(board, 3, true, -Infinity, Infinity) : minimax(board, 3, true);
      if (move) {
        const newBoard = makeMove(board, { from: null, to: move.to });
        setBoard(newBoard);
        setGoatsToPlace(goatsToPlace - 1);
        if(playAlone){
          setTimeout(() => setTurn('Tiger'), 750);
        } else {
          setTurn('Tiger');
        }
      }
    }
  };
  
  
  useEffect(() => {
    if(!playAlone) {
      if (isAI && playerRole === 'Goat' && turn === 'Tiger') {
        aiMove();
      }
      if (isAI && playerRole === 'Tiger' && turn === 'Goat') {
        aiMove();
      }
    } else {
      aiMove();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAI, playerRole, turn]);

  useEffect(() => {
    checkGameOver()
  }, [checkGameOver, goatsEaten, goatsToPlace])

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
          <h1>Bagha Chall</h1>
          <h2>Escolha o algoritimo da IA</h2>
          <S.ContainerCheckbox>
          <div>
            <input
              type="radio"
              id="radioPodaAlfa"
              checked={algorithmType === "podaAlfa"}
              onChange={() => {setAlgorithmType('podaAlfa')}}
            />
            <label htmlFor="radioPodaAlfa">Poda Alfa Beta</label>
          </div>
          <div>
            <input
              type="radio"
              id="radioMiniMax"
              checked={algorithmType === "miniMax"}
              onChange={() => {setAlgorithmType('miniMax')}}
            />
            <label htmlFor="radioMiniMax">Mini max</label>
          </div>
          </S.ContainerCheckbox>
          <h2>Escolha o tipo de jogo</h2>
          <button onClick={() => { setIsAI(false); setPlayerRole('Goat'); setGameStarted(true); }}>{`Jogador vs Jogador`}</button>
          <button onClick={() => { setIsAI(true); setPlayerRole('Goat'); setGameStarted(true); }}>{`Jogador vs IA  👉 Jogar com a`} <span><S.GoatOrTiger src={goatImg}/></span></button>
          <button onClick={() => { setIsAI(true); setPlayerRole('Tiger'); setGameStarted(true); }}>{`Jogador vs IA  👉 Jogar com o`} <span><S.GoatOrTiger src={tigerImg}/></span></button>
          <button onClick={() => { setIsAI(true); setPlayAlone(true); setGameStarted(true); }}>{`IA  vs IA`}</button>
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