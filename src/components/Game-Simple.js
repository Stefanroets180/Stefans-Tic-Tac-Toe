import React, { useState } from 'react';

// Simple square component
function Square({ value, onClick, isWinner }) {
  return (
    <button
      className={`square ${isWinner ? 'winner' : ''}`}
      onClick={onClick}
      style={{
        width: '60px',
        height: '60px',
        fontSize: '24px',
        fontWeight: 'bold',
        border: '1px solid #999',
        background: isWinner ? '#ff6b6b' : '#fff',
        color: isWinner ? '#fff' : '#333',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {value}
    </button>
  );
}

// Simple board component
function Board({ squares, winnerSquares, onClick }) {
  const renderSquare = (i) => {
    const isWinner = winnerSquares && winnerSquares.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        isWinner={isWinner}
        onClick={() => onClick(i)}
      />
    );
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 60px)',
        gap: '2px',
        backgroundColor: '#333',
        padding: '4px',
        borderRadius: '8px',
      }}
    >
      {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
    </div>
  );
}

// Calculate winner function
function calculateWinner(squares) {
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winnerRow: lines[i] };
    }
  }

  return { winner: null, winnerRow: null };
}

// Simple minimax AI
function getBestMove(squares, isMaximizing) {
  const availableSpots = squares.map((spot, index) => spot === null ? index : null).filter(val => val !== null);

  // Simple AI - just pick first available spot for now
  // You can implement full minimax later if needed
  if (availableSpots.length > 0) {
    return availableSpots[0];
  }
  return -1;
}

// Main Game component
export function GameSimple() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [currentStepNumber, setCurrentStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [gameMode, setGameMode] = useState('human_vs_human');
  const [gameStarted, setGameStarted] = useState(false);

  const current = history[currentStepNumber];
  const { winner, winnerRow } = calculateWinner(current.squares);

  const handleClick = (i) => {
    const hist = history.slice(0, currentStepNumber + 1);
    const current = hist[hist.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';

    setHistory(hist.concat([{ squares: squares }]));
    setCurrentStepNumber(hist.length);
    setXIsNext(!xIsNext);

    // Simple bot move for human vs bot mode
    if (gameMode === 'human_vs_bot' && xIsNext) {
      setTimeout(() => {
        const newSquares = squares.slice();
        const botMove = getBestMove(newSquares, false);
        if (botMove !== -1 && newSquares[botMove] === null) {
          newSquares[botMove] = 'O';
          setHistory(prev => prev.concat([{ squares: newSquares }]));
          setCurrentStepNumber(prev => prev + 1);
          setXIsNext(true);
        }
      }, 500);
    }
  };

  const jumpTo = (step) => {
    setCurrentStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const newGame = () => {
    setHistory([{ squares: Array(9).fill(null) }]);
    setCurrentStepNumber(0);
    setXIsNext(true);
  };

  const backToMenu = () => {
    setGameStarted(false);
    newGame();
  };

  const selectGameMode = (mode) => {
    setGameMode(mode);
    setGameStarted(true);
    newGame();
  };

  if (!gameStarted) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#4f46e5',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Tic Tac Toe</h1>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.8 }}>Choose Game Mode</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={() => selectGameMode('human_vs_human')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            👥 Human vs Human
          </button>
          <button
            onClick={() => selectGameMode('human_vs_bot')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            🤖 Human vs Bot
          </button>
        </div>
      </div>
    );
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (current.squares.every(square => square !== null)) {
    status = 'Draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move} style={{ marginBottom: '0.5rem' }}>
        <button
          onClick={() => jumpTo(move)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: move === currentStepNumber ? '#7c3aed' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {desc}
        </button>
      </li>
    );
  });

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#4f46e5',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'white', marginBottom: '2rem', fontSize: '1.8rem' }}>
        {gameMode === 'human_vs_human' ? '👥 Human vs Human' : '🤖 Human vs Bot'}
      </h1>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div>
          <Board
            squares={current.squares}
            winnerSquares={winnerRow}
            onClick={handleClick}
          />
        </div>

        <div style={{ color: 'white', minWidth: '200px' }}>
          <div style={{
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '8px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {status}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={backToMenu}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🏠 Menu
            </button>
            <button
              onClick={newGame}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🔄 New Game
            </button>
          </div>

          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>Move History:</h3>
            <ol style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
              {moves}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
