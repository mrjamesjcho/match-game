'use client';

import { BackgroundColor, ClickedClassname } from '@/utils/color';
import { useState } from 'react';

interface TileProps {
  col: number;
  row: number;
  color: string;
  onSelect: (col: number, row: number) => void;
}

export default function Tile({ col, row, color, onSelect }: TileProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    console.log('clicked');
    setClicked(!clicked);
    onSelect(col, row);
  };

  return (
    <div
      key={`${col}-${row}`}
      className={
        clicked
          ? ClickedClassname[color as keyof typeof ClickedClassname]
          : BackgroundColor[color as keyof typeof BackgroundColor]
      }
      onClick={handleClick}
    >{`${col}-${row}`}</div>
  );
}
