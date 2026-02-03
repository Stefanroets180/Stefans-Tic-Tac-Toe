import React from 'react';
import { cn } from '../lib/utils';

export function Square({ value, onClick, isWinner }) {
  return (
    <button
      className={cn(
        "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28",
        "border border-emerald-900/20",
        "text-3xl sm:text-4xl md:text-5xl font-bold",
        "flex items-center justify-center",
        "cursor-pointer transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-emerald-800",
        isWinner
          ? "bg-red-500 text-white"
          : "bg-emerald-600 hover:bg-emerald-500 text-white"
      )}
      onClick={onClick}
      aria-label={value ? `Square with ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}
