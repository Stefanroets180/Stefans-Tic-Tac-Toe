// Calculate winner
export const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winnerRow: lines[i] };
    }
  }

  return { winner: null, winnerRow: null };
};

// AI Logic using minimax algorithm with alpha-beta pruning
export const minimax = (
  squares,
  depth,
  isMaximizing,
  alpha = -Infinity,
  beta = Infinity,
) => {
  const { winner } = calculateWinner(squares);

  if (winner === "O") return 10 - depth; // Bot wins (O)
  if (winner === "X") return depth - 10; // Human wins (X)
  if (squares.every((square) => square !== null)) return 0; // Draw

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "O";
        const evaluation = minimax(squares, depth + 1, false, alpha, beta);
        squares[i] = null;
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = "X";
        const evaluation = minimax(squares, depth + 1, true, alpha, beta);
        squares[i] = null;
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
    }
    return minEval;
  }
};

export const getBestMove = (squares, isBot1 = true) => {
  const botSymbol = isBot1 ? "O" : "X";
  let bestMove = -1;
  let bestValue = isBot1 ? -Infinity : Infinity;

  const squaresCopy = [...squares];

  for (let i = 0; i < squaresCopy.length; i++) {
    if (squaresCopy[i] === null) {
      squaresCopy[i] = botSymbol;
      const moveValue = minimax(squaresCopy, 0, !isBot1);
      squaresCopy[i] = null;

      if (
        (isBot1 && moveValue > bestValue) ||
        (!isBot1 && moveValue < bestValue)
      ) {
        bestMove = i;
        bestValue = moveValue;
      }
    }
  }

  return bestMove;
};

// Calculate the location string for a move
export const getLocation = (move) => {
  const locationMap = {
    0: "row: 1, col: 1",
    1: "row: 1, col: 2",
    2: "row: 1, col: 3",
    3: "row: 2, col: 1",
    4: "row: 2, col: 2",
    5: "row: 2, col: 3",
    6: "row: 3, col: 1",
    7: "row: 3, col: 2",
    8: "row: 3, col: 3",
  };

  return locationMap[move];
};

// Get player name based on game mode
export const getPlayerName = (isX, gameMode) => {
  if (gameMode === "human_vs_human") {
    return isX ? "Player 1 (X)" : "Player 2 (O)";
  } else if (gameMode === "human_vs_bot") {
    return isX ? "You (X)" : "Bot (O)";
  } else {
    return isX ? "Bot 1 (X)" : "Bot 2 (O)";
  }
};

// Initial game state
export const initialState = {
  history: [
    {
      squares: Array(9).fill(null),
      stepNumber: 0,
    },
  ],
  currentStepNumber: 0,
  xIsNext: true,
  gameMode: "human_vs_human",
  gameStarted: false,
  botThinking: false,
};
