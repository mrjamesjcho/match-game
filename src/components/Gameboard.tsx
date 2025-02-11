'use client';

import { NUMBER_OF_COLS, NUMBER_OF_ROWS } from '@/config';
import { useState } from 'react';

export default function Gameboard() {
  const [matrix, setMatrix] = useState(
    Array.from({ length: NUMBER_OF_COLS }, (_, col) =>
      Array.from({ length: NUMBER_OF_ROWS }, (_, row) => (
        <div
          key={`${col}-${row}`}
          className="w-8 h-8 border flex items-center justify-center"
        >{`${col}-${row}`}</div>
      ))
    )
  );
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="border p-2 flex items-center justify-center grid-cols-8 gap-2">
        {matrix.map((row, i) => (
          <div key={i} className="grid grid-rows-8 gap-2">
            {row.map((cell) => cell)}
          </div>
        ))}
      </div>
    </div>
  );
}
