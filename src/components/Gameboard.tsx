'use client';

import { NUMBER_OF_COLS, NUMBER_OF_ROWS } from '@/config';
import { useState } from 'react';
import { getRandomBackgroundColor } from '@/utils/color';
import dynamic from 'next/dynamic';

const Tile = dynamic(() => import('./Tile'), { ssr: false });

export default function Gameboard() {
  const [matrix, setMatrix] = useState(
    Array.from({ length: NUMBER_OF_COLS }, (_, col) =>
      Array.from({ length: NUMBER_OF_ROWS }, (_, row) => ({
        col,
        row,
        color: getRandomBackgroundColor(),
      }))
    )
  );

  const renderMatrix = () =>
    matrix.map((col, idx) => (
      <div key={`col-${idx}`} className="grid grid-rows-8 gap-2">
        {col.map((cell, row) => (
          <Tile key={`${col}-${row}`} col={idx} row={row} color={cell.color} />
        ))}
      </div>
    ));
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="border p-2 flex items-center justify-center grid grid-cols-8 gap-2">
        {renderMatrix()}
      </div>
    </div>
  );
}
