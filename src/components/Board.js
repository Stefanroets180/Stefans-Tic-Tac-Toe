import React from 'react';
import { Square } from './Square';

export function Board({ squares, winnerSquares, onClick }) {
  const renderSquare = (i) => {
    const isWinner = winnerSquares !== null && winnerSquares.includes(i);

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
    <div className="grid grid-cols-3 gap-1 bg-emerald-800 p-1 rounded-lg shadow-xl">
      {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
    </div>
  );
}
