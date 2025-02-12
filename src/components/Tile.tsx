'use client';

import { BackgroundColor } from '@/utils/color';

interface TileProps {
  col: number;
  row: number;
  color: string;
}

export default function Tile({ col, row, color }: TileProps) {
  return (
    <div
      key={`${col}-${row}`}
      className={`${BackgroundColor[color as keyof typeof BackgroundColor]}`}
    >{`${col}-${row}`}</div>
  );
}
