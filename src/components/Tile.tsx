'use client';

import {
  BackgroundColor,
  ClickedClassname,
  DeletedClassname,
  DeleteTransitionClassname,
  HighlightedClassname,
} from '@/utils/color';

interface TileProps {
  col: number;
  row: number;
  color: string;
  selected: boolean;
  highlighted: boolean;
  deleted: boolean;
  deletedCollapse: boolean;
  preventClicks: boolean;
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
  deletedCollapse,
  preventClicks,
  onSelect,
  onHighlightedSelect,
}: TileProps) {
  const handleClick = () => {
    if (preventClicks) return;
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

    if (deleted) {
      return deletedCollapse
        ? // collapse deleted tiles to 0 after new tiles are added
          DeleteTransitionClassname[
            color as keyof typeof DeleteTransitionClassname
          ]
        : // scale deleted tiles to 0
          DeletedClassname[color as keyof typeof DeletedClassname];
    }

    return BackgroundColor[color as keyof typeof BackgroundColor];
  };

  return (
    <div
      key={`${col}-${row}`}
      className={getClassName()}
      onClick={highlighted ? handleHighlightedClick : handleClick}
    ></div>
  );
}
