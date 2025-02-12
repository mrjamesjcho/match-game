import { BackgroundColor } from '@/utils/color';

export type Tile = {
  color: keyof typeof BackgroundColor;
  row: number;
  col: number;
};

export type Gameboard = Tile[][];
