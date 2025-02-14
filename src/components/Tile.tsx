'use client';

import {
  BackgroundColor,
  ClickedClassname,
  DeletedClassname,
  HighlightedClassname,
} from '@/utils/color';

interface TileProps {
  col: number;
  row: number;
  color: string;
  selected: boolean;
  highlighted: boolean;
  deleted: boolean;
  onSelect: (col: number, row: number) => void;
  onHighlightedSelect: (col: number, row: number) => void;
}

export default function Tile({
  col,
  row,
  color,
  selected,
  highlighted,
  deleted,
  onSelect,
  onHighlightedSelect,
}: TileProps) {
  const handleClick = () => {
    onSelect(col, row);
  };

  const handleHighlightedClick = () => {
    onHighlightedSelect(col, row);
  };

  const getClassName = () => {
    if (selected)
      return ClickedClassname[color as keyof typeof ClickedClassname];

    if (highlighted)
      return HighlightedClassname[color as keyof typeof HighlightedClassname];

    if (deleted)
      return DeletedClassname[color as keyof typeof DeletedClassname];

    return BackgroundColor[color as keyof typeof BackgroundColor];
  };

  return (
    <div
      key={`${col}-${row}`}
      className={getClassName()}
      onClick={highlighted ? handleHighlightedClick : handleClick}
    >{`${col}-${row}`}</div>
  );
}
