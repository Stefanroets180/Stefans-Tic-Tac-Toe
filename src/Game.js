import React from "react";
import Board from "./Board";

const calculateWinner = (squares) => {
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

// AI Logic for bot moves
const minimax = (
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

const getBestMove = (squares, isBot1 = true) => {
  const botSymbol = isBot1 ? "O" : "X";
  let bestMove = -1;
  let bestValue = isBot1 ? -Infinity : Infinity;

  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      squares[i] = botSymbol;
      const moveValue = minimax(squares, 0, !isBot1);
      squares[i] = null;

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

//calculate the move the player has made
const getLocation = (move) => {
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

const GAME_MODES = {
  HUMAN_VS_HUMAN: "human_vs_human",
  HUMAN_VS_BOT: "human_vs_bot",
  BOT_VS_BOT: "bot_vs_bot",
};

const initialState = {
  history: [
    {
      squares: Array(9).fill(null),
    },
  ],
  currentStepNumber: 0,
  xIsNext: true,
  gameMode: GAME_MODES.HUMAN_VS_HUMAN,
  gameStarted: false,
  botThinking: false,
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.botMoveTimeout = null;
    this.safetyTimeout = null;
  }

  componentDidUpdate(prevProps, prevState) {
    // Handle bot moves
    if (this.state.gameStarted && !this.state.botThinking) {
      const history = this.state.history.slice(
        0,
        this.state.currentStepNumber + 1,
      );
      const current = history[history.length - 1];
      const { winner } = calculateWinner(current.squares);

      // Check if it's time for bot to move
      const gameJustStarted = !prevState.gameStarted && this.state.gameStarted;
      const moveWasMade =
        prevState.currentStepNumber !== this.state.currentStepNumber;
      const turnChanged = prevState.xIsNext !== this.state.xIsNext;

      if (
        !winner &&
        !this.state.botThinking &&
        (gameJustStarted || (moveWasMade && turnChanged)) &&
        this.shouldBotMove()
      ) {
        this.makeBotMove();

        // Safety timeout to prevent getting stuck
        if (this.state.gameMode === GAME_MODES.BOT_VS_BOT) {
          this.safetyTimeout = setTimeout(() => {
            if (this.state.botThinking) {
              this.setState({ botThinking: false });
              if (this.shouldBotMove()) {
                this.makeBotMove();
              }
            }
          }, 3000);
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.botMoveTimeout) {
      clearTimeout(this.botMoveTimeout);
    }
    if (this.safetyTimeout) {
      clearTimeout(this.safetyTimeout);
    }
  }

  shouldBotMove() {
    const { gameMode, xIsNext } = this.state;
    const history = this.state.history.slice(
      0,
      this.state.currentStepNumber + 1,
    );
    const current = history[history.length - 1];
    const { winner } = calculateWinner(current.squares);

    // Don't move if game is over
    if (winner || current.squares.every((square) => square !== null)) {
      return false;
    }

    if (gameMode === GAME_MODES.BOT_VS_BOT) {
      return true;
    }

    if (gameMode === GAME_MODES.HUMAN_VS_BOT) {
      // Bot plays as O (second player)
      return !xIsNext;
    }

    return false;
  }

  makeBotMove() {
    if (this.state.botThinking) return;

    if (this.safetyTimeout) {
      clearTimeout(this.safetyTimeout);
    }

    this.setState({ botThinking: true });

    // Add delay to make bot moves visible
    this.botMoveTimeout = setTimeout(() => {
      const history = this.state.history.slice(
        0,
        this.state.currentStepNumber + 1,
      );
      const current = history[history.length - 1];
      const squares = current.squares.slice();

      let bestMove;
      if (this.state.gameMode === GAME_MODES.BOT_VS_BOT) {
        // In bot vs bot, current player determines bot strategy
        bestMove = getBestMove(squares, this.state.xIsNext);
      } else {
        // Human vs bot mode - bot is always O (second player), so use false for isBot1
        bestMove = getBestMove(squares, false);
      }

      if (bestMove !== -1 && squares[bestMove] === null) {
        this.setState({ botThinking: false }, () => {
          this.makeMoveDirectly(bestMove);
        });
      } else {
        this.setState({ botThinking: false });
      }
    }, 800); // 800ms delay for bot moves
  }

  handleClick(i) {
    // Prevent human clicks during bot thinking or when it's bot's turn
    if (this.state.botThinking) return;

    if (
      this.state.gameMode === GAME_MODES.HUMAN_VS_BOT &&
      !this.state.xIsNext
    ) {
      return; // It's bot's turn in human vs bot mode
    }

    if (this.state.gameMode === GAME_MODES.BOT_VS_BOT) {
      return; // No human interaction in bot vs bot mode
    }

    this.makeMoveDirectly(i);
  }

  makeMoveDirectly(i) {
    const history = this.state.history.slice(
      0,
      this.state.currentStepNumber + 1,
    );
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }

    //THE CHARACTER WE ARE USING
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState(
      {
        history: history.concat([
          {
            squares,
            currentLocation: getLocation(i),
            stepNumber: history.length,
          },
        ]),
        xIsNext: !this.state.xIsNext,
        currentStepNumber: history.length,
      },
      () => {
        // After state update, trigger bot move if needed
        if (
          this.state.gameMode === GAME_MODES.BOT_VS_BOT &&
          this.shouldBotMove()
        ) {
          setTimeout(() => {
            this.makeBotMove();
          }, 100);
        }
      },
    );
  }

  jumpTo(step) {
    this.setState({
      currentStepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  sortMoves() {
    this.setState({
      history: this.state.history.reverse(),
    });
  }

  backToMenu() {
    if (this.botMoveTimeout) {
      clearTimeout(this.botMoveTimeout);
    }
    if (this.safetyTimeout) {
      clearTimeout(this.safetyTimeout);
    }
    this.setState(initialState);
  }

  newGame() {
    if (this.botMoveTimeout) {
      clearTimeout(this.botMoveTimeout);
    }
    if (this.safetyTimeout) {
      clearTimeout(this.safetyTimeout);
    }
    this.setState(
      {
        history: [
          {
            squares: Array(9).fill(null),
          },
        ],
        currentStepNumber: 0,
        xIsNext: true,
        botThinking: false,
      },
      () => {
        // If bot vs bot mode, start the first bot move
        if (this.state.gameMode === GAME_MODES.BOT_VS_BOT) {
          setTimeout(() => {
            if (this.shouldBotMove()) {
              this.makeBotMove();
            }
          }, 1000);
        }
      },
    );
  }

  selectGameMode(gameMode) {
    if (this.botMoveTimeout) {
      clearTimeout(this.botMoveTimeout);
    }
    if (this.safetyTimeout) {
      clearTimeout(this.safetyTimeout);
    }
    this.setState(
      {
        ...initialState,
        gameMode,
        gameStarted: true,
      },
      () => {
        // If bot vs bot mode, start the first bot move
        if (gameMode === GAME_MODES.BOT_VS_BOT) {
          setTimeout(() => {
            if (this.shouldBotMove()) {
              this.makeBotMove();
            }
          }, 1000);
        }
      },
    );
  }

  getPlayerName(isX) {
    const { gameMode } = this.state;

    if (gameMode === GAME_MODES.HUMAN_VS_HUMAN) {
      return isX ? "Player 1 (X)" : "Player 2 (O)";
    } else if (gameMode === GAME_MODES.HUMAN_VS_BOT) {
      return isX ? "You (X)" : "Bot (O)";
    } else {
      return isX ? "Bot 1 (X)" : "Bot 2 (O)";
    }
  }

  render() {
    const { history, gameStarted, gameMode, botThinking } = this.state;

    if (!gameStarted) {
      return (
        <div className="game">
          <div className="game-mode-selector">
            <h2>Choose Game Mode</h2>
            <div className="game-mode-buttons">
              <button
                className="mode-button"
                onClick={() => this.selectGameMode(GAME_MODES.HUMAN_VS_HUMAN)}
              >
                <span role="img" aria-label="people">
                  👥
                </span>{" "}
                Human vs Human
              </button>
              <button
                className="mode-button"
                onClick={() => this.selectGameMode(GAME_MODES.HUMAN_VS_BOT)}
              >
                <span role="img" aria-label="person">
                  👤
                </span>{" "}
                Human vs Bot
              </button>
              <button
                className="mode-button"
                onClick={() => this.selectGameMode(GAME_MODES.BOT_VS_BOT)}
              >
                <span role="img" aria-label="robots">
                  🤖
                </span>{" "}
                Bot vs Bot
              </button>
            </div>
          </div>
        </div>
      );
    }

    const current = history[this.state.currentStepNumber];
    const { winner, winnerRow } = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const currentLocation = step.currentLocation
        ? `(${step.currentLocation})`
        : "";
      const desc = step.stepNumber
        ? `Go to move #${step.stepNumber}`
        : "Go to game start";
      const classButton =
        move === this.state.currentStepNumber ? "button--purp" : "";

      return (
        <li key={move}>
          <button
            className={`${classButton} button`}
            onClick={() => this.jumpTo(move)}
          >
            {`${desc} ${currentLocation}`}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      const winnerName = this.getPlayerName(winner === "X");
      status = `Winner: ${winnerName}`;
    } else if (history.length === 10) {
      status = "Draw. No one won.";
    } else if (botThinking) {
      const thinkingPlayer = this.getPlayerName(!this.state.xIsNext);
      status = `${thinkingPlayer} is thinking...`;
    } else {
      const nextPlayer = this.getPlayerName(this.state.xIsNext);
      status = `Next player: ${nextPlayer}`;
    }

    const gameModeTitle = {
      [GAME_MODES.HUMAN_VS_HUMAN]: (
        <>
          <span role="img" aria-label="people">
            👥
          </span>{" "}
          Human vs Human
        </>
      ),
      [GAME_MODES.HUMAN_VS_BOT]: (
        <>
          <span role="img" aria-label="person">
            👤
          </span>{" "}
          Human vs Bot
        </>
      ),
      [GAME_MODES.BOT_VS_BOT]: (
        <>
          <span role="img" aria-label="robots">
            🤖
          </span>{" "}
          Bot vs Bot
        </>
      ),
    };

    return (
      <div className="game">
        <div className="game-header">
          <h2>{gameModeTitle[gameMode]}</h2>
        </div>
        <div className="game-content">
          <div className="game-board">
            <Board
              squares={current.squares}
              winnerSquares={winnerRow}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className="status">{status}</div>
            <div className="game-controls">
              <button className="button" onClick={() => this.backToMenu()}>
                <span role="img" aria-label="home">
                  🏠
                </span>{" "}
                Back to Menu
              </button>
              <div className="game-controls-right">
                <button className="button" onClick={() => this.newGame()}>
                  <span role="img" aria-label="refresh">
                    🔄
                  </span>{" "}
                  New Game
                </button>
                <button className="button" onClick={() => this.sortMoves()}>
                  <span role="img" aria-label="shuffle">
                    🔀
                  </span>{" "}
                  Sort Moves
                </button>
              </div>
            </div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
