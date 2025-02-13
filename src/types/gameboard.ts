import { BackgroundColor } from '@/utils/color';

export type Tile = {
  color: keyof typeof BackgroundColor;
  row: number;
  col: number;
  selected: boolean;
};

export type Gameboard = Tile[][];
