import { Gameboard } from '@/types/gameboard';

export enum BackgroundColor {
  PINK = 'min-h-[40px] flex items-center justify-center bg-pink-500 tile m-1',
  CYAN = 'min-h-[40px] flex items-center justify-center bg-cyan-500 tile m-1',
  BLUE = 'min-h-[40px] flex items-center justify-center bg-blue-500 tile m-1',
  GREEN = 'min-h-[40px] flex items-center justify-center bg-green-500 tile m-1',
  YELLOW = 'min-h-[40px] flex items-center justify-center bg-yellow-500 tile m-1',
  PURPLE = 'min-h-[40px] flex items-center justify-center bg-purple-500 tile m-1',
}

export enum ClickedClassname {
  PINK = 'min-h-[40px] outline-orange-500 outline-double flex items-center justify-center m-1 bg-pink-500',
  CYAN = 'min-h-[40px] outline-orange-500 outline-double flex items-center justify-center m-1 bg-cyan-500',
  BLUE = 'min-h-[40px] outline-orange-500 outline-double flex items-center justify-center m-1 bg-blue-500',
  GREEN = 'min-h-[40px] outline-orange-500 outline-double flex items-center justify-center m-1 bg-green-500',
  YELLOW = 'min-h-[40px] outline-orange-500 outline-double flex items-center justify-center m-1 bg-yellow-500',
  PURPLE = 'min-h-[40px] outline-orange-500 outline-double flex items-center justify-center m-1 bg-purple-500',
}

export enum HighlightedClassname {
  PINK = 'min-h-[40px] outline-orange-500 outline-2 outline-dotted flex items-center justify-center m-1 bg-pink-500',
  CYAN = 'min-h-[40px] outline-orange-500 outline-2 outline-dotted flex items-center justify-center m-1 bg-cyan-500',
  BLUE = 'min-h-[40px] outline-orange-500 outline-2 outline-dotted flex items-center justify-center m-1 bg-blue-500',
  GREEN = 'min-h-[40px] outline-orange-500 outline-2 outline-dotted flex items-center justify-center m-1 bg-green-500',
  YELLOW = 'min-h-[40px] outline-orange-500 outline-2 outline-dotted flex items-center justify-center m-1 bg-yellow-500',
  PURPLE = 'min-h-[40px] outline-orange-500 outline-2 outline-dotted flex items-center justify-center m-1 bg-purple-500',
}

export enum DeletedClassname {
  PINK = 'min-h-[40px] max-h-[40px] blur-sm flex items-center justify-center m-1 bg-pink-500 transition-scale delay-300 duration-500 scale-0 ease-in',
  CYAN = 'min-h-[40px] max-h-[40px] blur-sm flex items-center justify-center m-1 bg-cyan-500 transition-scale delay-300 duration-500 scale-0 ease-in',
  BLUE = 'min-h-[40px] max-h-[40px] blur-sm flex items-center justify-center m-1 bg-blue-500 transition-scale delay-300 duration-500 scale-0 ease-in',
  GREEN = 'min-h-[40px] max-h-[40px] blur-sm flex items-center justify-center m-1 bg-green-500 transition-scale delay-300 duration-500 scale-0 ease-in',
  YELLOW = 'min-h-[40px] max-h-[40px] blur-sm flex items-center justify-center m-1 bg-yellow-500 transition-scale delay-300 duration-500 scale-0 ease-in',
  PURPLE = 'min-h-[40px] max-h-[40px] blur-sm flex items-center justify-center m-1 bg-purple-500 transition-scale delay-300 duration-500 scale-0 ease-in',
}

export enum DeleteTransitionClassname {
  PINK = 'min-h-0 flex items-center justify-center m-0 bg-pink-500 transition-max-height duration-500 max-h-0 scale-0 ease-in',
  CYAN = 'min-h-0 flex items-center justify-center m-0 bg-cyan-500 transition-max-height duration-500 max-h-0 scale-0 ease-in',
  BLUE = 'min-h-0 flex items-center justify-center m-0 bg-blue-500 transition-max-height duration-500 max-h-0 scale-0 ease-in',
  GREEN = 'min-h-0 flex items-center justify-center m-0 bg-green-500 transition-max-height duration-500 max-h-0 scale-0 ease-in',
  YELLOW = 'min-h-0 flex items-center justify-center m-0 bg-yellow-500 transition-max-height duration-500 max-h-0 scale-0 ease-in',
  PURPLE = 'min-h-0 flex items-center justify-center m-0 bg-purple-500 transition-max-height duration-500 max-h-0 scale-0 ease-in',
}

export const getRandomBackgroundColorWithoutMatches = (
  col: number,
  row: number,
  matrix: Gameboard
) => {
  const keys = Object.keys(BackgroundColor);
  let randomKey;
  do {
    randomKey = keys[
      Math.floor(Math.random() * keys.length)
    ] as keyof typeof BackgroundColor;
  } while (
    prevTwoColorsInColumnSame(col, row, matrix, randomKey) ||
    prevTwoColorsinRowSame(col, row, matrix, randomKey)
  );
  return randomKey;
};

export const getRandomBackgroundColor = () => {
  const keys = Object.keys(BackgroundColor);
  return keys[
    Math.floor(Math.random() * keys.length)
  ] as keyof typeof BackgroundColor;
};

const prevTwoColorsInColumnSame = (
  col: number,
  row: number,
  matrix: Gameboard,
  color: keyof typeof BackgroundColor
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
  color: keyof typeof BackgroundColor
) => {
  if (col < 2) return false;
  return (
    (color === matrix[col - 1][row].color && matrix[col - 1][row].color) ===
    matrix[col - 2][row].color
  );
};
