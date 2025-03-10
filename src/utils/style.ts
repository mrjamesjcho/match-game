import { Gameboard } from '@/types/gameboard';

export enum GameboardStyle {
  DEFAULT = 'border p-1 grid grid-cols-8 min-w-[394px] min-h-[394px]',
  DIMMED = 'border p-1 grid grid-cols-8 min-w-[394px] min-h-[394px] brightness-[15%]',
}

export enum Theme {
  DEFAULT = 'Default',
  AQUA = 'Aqua',
  SOLAR = 'Solar',
  PLUM = 'Plum',
}

export type TileStatus =
  | 'INITIAL'
  | 'SELECTED'
  | 'HIGHLIGHTED'
  | 'DELETED'
  | 'COLLAPSED';

export type TileWrapperStatus = 'INITIAL' | 'HIGHLIGHTED' | 'COLLAPSED';

export enum TileStatusStyle {
  INITIAL = 'min-h-[40px] min-w-[40px] flex items-center justify-center tile z-20',
  SELECTED = 'min-h-[40px] min-w-[40px] outline-orange-500 outline-double flex items-center justify-center z-20',
  HIGHLIGHTED = 'min-h-[40px] min-w-[40px] flex items-center justify-center z-20',
  DELETED = 'min-h-[40px] max-h-[40px] min-w-[40px] blur-sm flex items-center justify-center transition-scale delay-300 duration-500 scale-0 ease-in z-20',
  COLLAPSED = 'min-h-0 max-h-0  min-w-[40px] flex items-center justify-center m-0 transition-all duration-500 max-h-0 scale-0 ease-in z-20',
}

export enum TileWrapperStatusStyle {
  INITIAL = 'min-h-[44px] min-w-[44px] flex items-center justify-center m-[2px] z-0',
  HIGHLIGHTED = 'tile-wrapper min-h-[44px] min-w-[44px] flex items-center justify-center m-[2px] z-0',
  COLLAPSED = 'min-h-0 max-h-0 min-w-[44px] flex items-center justify-center m-0 transition-all duration-500 max-h-0 scale-0 ease-in z-0',
}

export type TileThemeColorNumber =
  | 'ONE'
  | 'TWO'
  | 'THREE'
  | 'FOUR'
  | 'FIVE'
  | 'SIX';

export enum Default {
  ONE = 'bg-pink-500',
  TWO = 'bg-cyan-500',
  THREE = 'bg-blue-500',
  FOUR = 'bg-green-500',
  FIVE = 'bg-yellow-500',
  SIX = 'bg-purple-500',
}

export enum Aqua {
  ONE = 'bg-emerald-400',
  TWO = 'bg-cyan-300',
  THREE = 'bg-sky-500',
  FOUR = 'bg-blue-600',
  FIVE = 'bg-indigo-500',
  SIX = 'bg-violet-400',
}

export enum Solar {
  ONE = 'bg-red-400',
  TWO = 'bg-orange-600',
  THREE = 'bg-amber-500',
  FOUR = 'bg-yellow-300',
  FIVE = 'bg-pink-400',
  SIX = 'bg-rose-600',
}

export enum Plum {
  ONE = 'bg-blue-500',
  TWO = 'bg-indigo-600',
  THREE = 'bg-violet-500',
  FOUR = 'bg-purple-700',
  FIVE = 'bg-fuchsia-500',
  SIX = 'bg-pink-400',
}

export const getThemeEnum = (theme: Theme) => {
  switch (theme) {
    case Theme.DEFAULT:
      return Default;
    case Theme.AQUA:
      return Aqua;
    case Theme.SOLAR:
      return Solar;
    case Theme.PLUM:
      return Plum;
  }
};

export const getThemeClassname = (
  theme: Theme,
  status: TileStatus,
  colorNumber: TileThemeColorNumber
) => {
  const themeEnum = getThemeEnum(theme);
  return themeEnum[colorNumber] + ' ' + TileStatusStyle[status];
};

export const getWrapperStyle = (status: TileWrapperStatus) => {
  return TileWrapperStatusStyle[status];
};

export const getRandomBackgroundColorWithoutMatches = (
  col: number,
  row: number,
  matrix: Gameboard,
  theme: Theme
) => {
  const themeEnum = getThemeEnum(theme);
  const keys = Object.keys(themeEnum);
  let randomKey;
  do {
    randomKey = keys[
      Math.floor(Math.random() * keys.length)
    ] as keyof typeof themeEnum;
  } while (
    prevTwoColorsInColumnSame(col, row, matrix, randomKey) ||
    prevTwoColorsinRowSame(col, row, matrix, randomKey)
  );
  return randomKey;
};

export const getRandomBackgroundColor = (theme: Theme) => {
  const themeEnum = getThemeEnum(theme);
  const keys = Object.keys(themeEnum);
  return keys[
    Math.floor(Math.random() * keys.length)
  ] as keyof typeof themeEnum;
};

const prevTwoColorsInColumnSame = (
  col: number,
  row: number,
  matrix: Gameboard,
  color:
    | keyof typeof Default
    | keyof typeof Aqua
    | keyof typeof Solar
    | keyof typeof Plum
) => {
  if (row < 2) return false;
  return (
    (color === matrix[col][row - 1].color && matrix[col][row - 1].color) ===
    matrix[col][row - 2].color
  );
};

const prevTwoColorsinRowSame = (
  col: number,
  row: number,
  matrix: Gameboard,
  color:
    | keyof typeof Default
    | keyof typeof Aqua
    | keyof typeof Solar
    | keyof typeof Plum
) => {
  if (col < 2) return false;
  return (
    (color === matrix[col - 1][row].color && matrix[col - 1][row].color) ===
    matrix[col - 2][row].color
  );
};
