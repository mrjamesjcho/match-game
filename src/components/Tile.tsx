'use client';

import { getThemeClassname, Theme, TileThemeColorNumber } from '@/utils/color';

interface TileProps {
  col: number;
  row: number;
  color: TileThemeColorNumber;
  selected: boolean;
  highlighted: boolean;
  deleted: boolean;
  deletedCollapse: boolean;
  preventClicks: boolean;
  theme: Theme;
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
  theme,
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
    const status = selected
      ? 'SELECTED'
      : highlighted
        ? 'HIGHLIGHTED'
        : deleted && deletedCollapse
          ? 'COLLAPSED'
          : deleted
            ? 'DELETED'
            : 'INITIAL';
    return getThemeClassname(theme, status, color);
  };

  return (
    <div
      key={`${col}-${row}`}
      className={getClassName()}
      onClick={highlighted ? handleHighlightedClick : handleClick}
    ></div>
  );
}
