import { Gameboard } from '@/types/gameboard';

export enum BackgroundColor {
  PINK = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-pink-500 tile',
  CYAN = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-cyan-500 tile',
  BLUE = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-blue-500 tile',
  GREEN = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-green-500 tile',
  // YELLOW = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-yellow-500 tile',
  PURPLE = 'w-10 h-10 border col-span-1 flex items-center justify-center bg-purple-500 tile',
}

export enum ClickedClassname {
  PINK = 'w-10 h-10 outline-orange-500 outline-double col-span-1 flex items-center justify-center bg-pink-500',
  CYAN = 'w-10 h-10 outline-orange-500 outline-double col-span-1 flex items-center justify-center bg-cyan-500',
  BLUE = 'w-10 h-10 outline-orange-500 outline-double col-span-1 flex items-center justify-center bg-blue-500',
  GREEN = 'w-10 h-10 outline-orange-500 outline-double col-span-1 flex items-center justify-center bg-green-500',
  YELLOW = 'w-10 h-10 outline-orange-500 outline-double col-span-1 flex items-center justify-center bg-yellow-500',
  PURPLE = 'w-10 h-10 outline-orange-500 outline-double col-span-1 flex items-center justify-center bg-purple-500',
}

export enum HighlightedClassname {
  PINK = 'w-10 h-10 outline-orange-500 outline-2 outline-dotted col-span-1 flex items-center justify-center bg-pink-500',
  CYAN = 'w-10 h-10 outline-orange-500 outline-2 outline-dotted col-span-1 flex items-center justify-center bg-cyan-500',
  BLUE = 'w-10 h-10 outline-orange-500 outline-2 outline-dotted col-span-1 flex items-center justify-center bg-blue-500',
  GREEN = 'w-10 h-10 outline-orange-500 outline-2 outline-dotted col-span-1 flex items-center justify-center bg-green-500',
  YELLOW = 'w-10 h-10 outline-orange-500 outline-2 outline-dotted col-span-1 flex items-center justify-center bg-yellow-500',
  PURPLE = 'w-10 h-10 outline-orange-500 outline-2 outline-dotted col-span-1 flex items-center justify-center bg-purple-500',
}

export enum DeletedClassname {
  PINK = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-pink-500',
  CYAN = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-cyan-500',
  BLUE = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-blue-500',
  GREEN = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-green-500',
  YELLOW = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-yellow-500',
  PURPLE = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-purple-500',
}

export enum DeleteTransitionClassname {
  PINK = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-pink-500 transition-scale delay-300 duration-500 scale-0 ease-in',
  CYAN = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-cyan-500 transition-scale delay-300 duration-500 scale-0 ease-in',
  BLUE = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-blue-500 transition-scale delay-300 duration-500 scale-0 ease-in',
  GREEN = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-green-500 transition-scale delay-300 duration-500 scale-0 ease-in',
  YELLOW = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-yellow-500 transition-scale delay-300 duration-500 scale-0 ease-in',
  PURPLE = 'w-10 h-10 blur-sm col-span-1 flex items-center justify-center bg-purple-500 transition-scale delay-300 duration-500 scale-0 ease-in',
}

export const getRandomBackgroundColor = (
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
