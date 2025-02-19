import { BackgroundColor } from '@/utils/color';

export type Tile = {
  color: keyof typeof BackgroundColor;
  row: number;
  col: number;
  selected: boolean;
  highlighted: boolean;
  deleted: boolean;
};

export type TileCoordinates = {
  col: number;
  row: number;
};

export type Gameboard = Tile[][];
