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

  const getWrapperClassName = () => {
    if (highlighted) {
      return 'tile-wrapper min-h-[44px] min-w-[44px] flex items-center justify-center m-[2px] z-0';
    }
    if (deleted && deletedCollapse) {
      return 'min-h-0 max-h-0 min-w-[44px] flex items-center justify-center m-0 transition-all duration-500 max-h-0 scale-0 ease-in z-0';
    }
    return 'min-h-[44px] min-w-[44px] flex items-center justify-center m-[2px] z-0';
  };

  return (
    <div className={getWrapperClassName()}>
      <div
        key={`${col}-${row}`}
        className={getClassName()}
        onClick={highlighted ? handleHighlightedClick : handleClick}
      ></div>
    </div>
  );
}
