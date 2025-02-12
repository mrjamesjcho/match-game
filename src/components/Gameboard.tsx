'use client';

import { NUMBER_OF_COLS, NUMBER_OF_ROWS } from '@/config';
import { useEffect, useState } from 'react';
import { getRandomBackgroundColor } from '@/utils/color';
import dynamic from 'next/dynamic';
import type { Gameboard, Tile } from '@/types/gameboard';

const Tile = dynamic(() => import('./Tile'), { ssr: false });

export default function Gameboard() {
  const [matrix, setMatrix] = useState<Gameboard>();

  useEffect(() => {
    const newMatrix = Array.from(
      { length: NUMBER_OF_COLS },
      () => [] as Tile[]
    );
    newMatrix.forEach((col, idx) => {
      for (let row = 0; row < NUMBER_OF_ROWS; row++) {
        col.push({
          col: idx,
          row,
          color: getRandomBackgroundColor(idx, row, newMatrix),
        });
      }
    });
    setMatrix(newMatrix);
  }, []);

  const renderMatrix = () =>
    matrix?.map((col: Tile[], idx: number) => (
      <div key={`col-${idx}`} className="grid grid-rows-8 gap-2">
        {col.map((cell, row) => (
          <Tile key={`${col}-${row}`} col={idx} row={row} color={cell.color} />
        ))}
      </div>
    ));

  if (!matrix?.length) return null;

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="border p-2 flex items-center justify-center grid grid-cols-8 gap-2 min-w-[394px] min-h-[394px]">
        {renderMatrix()}
      </div>
    </div>
  );
}
