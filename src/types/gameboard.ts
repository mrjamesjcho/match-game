import { TileThemeColorNumber } from '@/utils/style';

export type Tile = {
  color: TileThemeColorNumber;
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
