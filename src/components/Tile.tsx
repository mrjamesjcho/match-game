'use client';

import { BackgroundColor, ClickedClassname } from '@/utils/color';

interface TileProps {
  col: number;
  row: number;
  color: string;
  selected: boolean;
  onSelect: (col: number, row: number) => void;
}

export default function Tile({
  col,
  row,
  color,
  selected,
  onSelect,
}: TileProps) {
  const handleClick = () => {
    console.log('clicked');
    if (selected) return;
    onSelect(col, row);
  };

  return (
    <div
      key={`${col}-${row}`}
      className={
        selected
          ? ClickedClassname[color as keyof typeof ClickedClassname]
          : BackgroundColor[color as keyof typeof BackgroundColor]
      }
      onClick={handleClick}
    >{`${col}-${row}`}</div>
  );
}
