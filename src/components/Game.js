import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Board } from './Board';
import { Button } from './Button';
import { Users, User, Bot, Home, RotateCcw, ArrowUpDown } from 'lucide-react';
import {
  calculateWinner,
  getBestMove,
  getLocation,
  getPlayerName,
  initialState,
} from '../lib/game-logic';
import { cn } from '../lib/utils';

export function Game() {
  const [state, setState] = useState(initialState);
  const botMoveTimeoutRef = useRef(null);
  const safetyTimeoutRef = useRef(null);

  const { history, currentStepNumber, xIsNext, gameMode, gameStarted, botThinking } = state;

  const current = history[currentStepNumber];
  const { winner, winnerRow } = calculateWinner(current.squares);

  // Check if bot should move
  const shouldBotMove = useCallback(() => {
    const { winner: w } = calculateWinner(current.squares);

    // Don't move if game is over
    if (w || current.squares.every((square) => square !== null)) {
      return false;
    }

    if (gameMode === "bot_vs_bot") {
      return true;
    }

    if (gameMode === "human_vs_bot") {
      // Bot plays as O (second player)
      return !xIsNext;
    }

    return false;
  }, [current.squares, gameMode, xIsNext]);

  // Make bot move
  const makeBotMove = useCallback(() => {
    if (botThinking) return;

    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
    }

    setState((prev) => ({ ...prev, botThinking: true }));

    botMoveTimeoutRef.current = setTimeout(() => {
      setState((prev) => {
        const hist = prev.history.slice(0, prev.currentStepNumber + 1);
        const curr = hist[hist.length - 1];
        const squares = [...curr.squares];

        let bestMove;
        if (prev.gameMode === "bot_vs_bot") {
          // In bot vs bot, current player determines bot strategy
          bestMove = getBestMove(squares, prev.xIsNext);
        } else {
          // Human vs bot mode - bot is always O (second player)
          bestMove = getBestMove(squares, false);
        }

        if (bestMove !== -1 && squares[bestMove] === null) {
          squares[bestMove] = prev.xIsNext ? "X" : "O";
          const newHistory = hist.concat([
            {
              squares,
              currentLocation: getLocation(bestMove),
              stepNumber: hist.length,
            },
          ]);

          return {
            ...prev,
            history: newHistory,
            xIsNext: !prev.xIsNext,
            currentStepNumber: hist.length,
            botThinking: false,
          };
        }

        return { ...prev, botThinking: false };
      });
    }, 800);
  }, [botThinking]);

  // Handle bot moves after state changes
  useEffect(() => {
    if (gameStarted && !botThinking && shouldBotMove()) {
      const timeoutId = setTimeout(() => {
        makeBotMove();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [gameStarted, botThinking, shouldBotMove, makeBotMove, currentStepNumber]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (botMoveTimeoutRef.current) {
        clearTimeout(botMoveTimeoutRef.current);
      }
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, []);

  const handleClick = (i) => {
    // Prevent human clicks during bot thinking or when it's bot's turn
    if (botThinking) return;

    if (gameMode === "human_vs_bot" && !xIsNext) {
      return; // It's bot's turn in human vs bot mode
    }

    if (gameMode === "bot_vs_bot") {
      return; // No human interaction in bot vs bot mode
    }

    const hist = history.slice(0, currentStepNumber + 1);
    const curr = hist[hist.length - 1];
    const squares = [...curr.squares];

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? "X" : "O";

    setState((prev) => ({
      ...prev,
      history: hist.concat([
        {
          squares,
          currentLocation: getLocation(i),
          stepNumber: hist.length,
        },
      ]),
      xIsNext: !prev.xIsNext,
      currentStepNumber: hist.length,
    }));
  };

  const jumpTo = (step) => {
    setState((prev) => ({
      ...prev,
      currentStepNumber: step,
      xIsNext: step % 2 === 0,
    }));
  };

  const sortMoves = () => {
    setState((prev) => ({
      ...prev,
      history: [...prev.history].reverse(),
    }));
  };

  const backToMenu = () => {
    if (botMoveTimeoutRef.current) {
      clearTimeout(botMoveTimeoutRef.current);
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
    }
    setState(initialState);
  };

  const newGame = () => {
    if (botMoveTimeoutRef.current) {
      clearTimeout(botMoveTimeoutRef.current);
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
    }
    setState((prev) => ({
      ...prev,
      history: [{ squares: Array(9).fill(null), stepNumber: 0 }],
      currentStepNumber: 0,
      xIsNext: true,
      botThinking: false,
    }));
  };

  const selectGameMode = (mode) => {
    if (botMoveTimeoutRef.current) {
      clearTimeout(botMoveTimeoutRef.current);
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
    }
    setState({
      ...initialState,
      gameMode: mode,
      gameStarted: true,
    });
  };

  // Game mode selector
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Tic Tac Toe</h1>
          <h2 className="text-xl text-white/80 mb-8">Choose Game Mode</h2>
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Button
              onClick={() => selectGameMode("human_vs_human")}
              className="h-14 text-lg bg-emerald-600 hover:bg-emerald-500 text-white"
              size="lg"
            >
              <Users className="mr-2 h-5 w-5" />
              Human vs Human
            </Button>
            <Button
              onClick={() => selectGameMode("human_vs_bot")}
              className="h-14 text-lg bg-emerald-600 hover:bg-emerald-500 text-white"
              size="lg"
            >
              <User className="mr-2 h-5 w-5" />
              Human vs Bot
            </Button>
            <Button
              onClick={() => selectGameMode("bot_vs_bot")}
              className="h-14 text-lg bg-emerald-600 hover:bg-emerald-500 text-white"
              size="lg"
            >
              <Bot className="mr-2 h-5 w-5" />
              Bot vs Bot
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Game status
  let status;
  if (winner) {
    const winnerName = getPlayerName(winner === "X", gameMode);
    status = `Winner: ${winnerName}`;
  } else if (current.squares.every((s) => s !== null)) {
    status = "Draw. No one won.";
  } else if (botThinking) {
    const thinkingPlayer = getPlayerName(!xIsNext, gameMode);
    status = `${thinkingPlayer} is thinking...`;
  } else {
    const nextPlayer = getPlayerName(xIsNext, gameMode);
    status = `Next player: ${nextPlayer}`;
  }

  // Game mode title
  const gameModeTitle = {
    human_vs_human: (
      <>
        <Users className="mr-2 h-5 w-5" />
        Human vs Human
      </>
    ),
    human_vs_bot: (
      <>
        <User className="mr-2 h-5 w-5" />
        Human vs Bot
      </>
    ),
    bot_vs_bot: (
      <>
        <Bot className="mr-2 h-5 w-5" />
        Bot vs Bot
      </>
    ),
  };

  // Move history
  const moves = history.map((step, move) => {
    const currentLocation = step.currentLocation ? `(${step.currentLocation})` : "";
    const desc = step.stepNumber ? `Go to move #${step.stepNumber}` : "Go to game start";

    return (
      <li key={`move-${step.stepNumber}-${move}`} className="mb-1">
        <button
          className={cn(
            "w-full text-left px-3 py-1.5 rounded text-sm transition-colors",
            move === currentStepNumber
              ? "bg-purple-600 text-white font-bold"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          )}
          onClick={() => jumpTo(move)}
        >
          {`${desc} ${currentLocation}`}
        </button>
      </li>
    );
  });

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pt-[10vh]">
      {/* Header */}
      <div className="flex items-center justify-center mb-6 text-white text-xl font-semibold">
        {gameModeTitle[gameMode]}
      </div>

      {/* Game content */}
      <div className="flex flex-col lg:flex-row items-start justify-center gap-8 w-full max-w-4xl">
        {/* Board */}
        <div className="flex justify-center">
          <Board
            squares={current.squares}
            winnerSquares={winnerRow}
            onClick={handleClick}
          />
        </div>

        {/* Game info */}
        <div className="flex flex-col min-w-[280px] max-w-[320px]">
          {/* Status */}
          <div className="mb-4 p-3 bg-black/20 rounded-lg text-white font-bold text-center">
            {status}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={backToMenu}
              variant="secondary"
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-none"
            >
              <Home className="mr-1 h-4 w-4" />
              Menu
            </Button>
            <Button
              onClick={newGame}
              variant="secondary"
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-none"
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              New Game
            </Button>
            <Button
              onClick={sortMoves}
              variant="secondary"
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-none"
            >
              <ArrowUpDown className="mr-1 h-4 w-4" />
              Sort
            </Button>
          </div>

          {/* Move history */}
          <div className="max-h-[300px] overflow-y-auto pr-2">
            <ol className="list-none p-0">{moves}</ol>
          </div>
        </div>
      </div>
    </div>
  );
}
