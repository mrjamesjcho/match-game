import { Gameboard, Tile, TileCoordinates } from '@/types/gameboard';
import {
  getRandomBackgroundColor,
  getRandomBackgroundColorWithoutMatches,
} from './color';

const NUMBER_OF_COLS = 8;
const NUMBER_OF_ROWS = 8;

export const createGameboard = () => {
  const newGameboard = Array.from(
    { length: NUMBER_OF_COLS },
    () => [] as Tile[]
  );
  newGameboard.forEach((col, idx) => {
    for (let row = 0; row < NUMBER_OF_ROWS; row++) {
      col.push({
        col: idx,
        row,
        color: getRandomBackgroundColorWithoutMatches(idx, row, newGameboard),
        selected: false,
        highlighted: false,
        deleted: false,
      });
    }
  });
  return newGameboard;
};

export const markTilesForDeletion = (
  prevGameboard: Gameboard,
  tilesToDelete: TileCoordinates[]
) => {
  return prevGameboard.map((col, colIdx) => {
    let newCol;
    if (tilesToDelete.find((tile) => tile.col === colIdx)) {
      newCol = (newCol ?? col).map((tile, rowIdx) => {
        if (
          tilesToDelete.find(
            (tile) => tile.col === colIdx && tile.row === rowIdx
          )
        ) {
          return {
            ...tile,
            deleted: true,
          };
        }
        return tile;
      });
    }
    return newCol || col;
  });
};

export const addNewTiles = (prevGameboard: Gameboard) => {
  return prevGameboard.map((col, colIdx) => {
    if (col.find((tile) => tile.deleted)) {
      let tilesRemoved = 0;
      const newCol = [];
      for (let rowIdx = 0; rowIdx < NUMBER_OF_ROWS + tilesRemoved; rowIdx++) {
        if (rowIdx >= NUMBER_OF_ROWS) {
          newCol.push({
            col: colIdx,
            row: rowIdx - tilesRemoved,
            color: getRandomBackgroundColor(),
            selected: false,
            highlighted: false,
            deleted: false,
          });
          continue;
        }
        if (col[rowIdx].deleted) {
          tilesRemoved++;
        }
        if (!col[rowIdx].deleted && tilesRemoved) {
          newCol.push({
            ...col[rowIdx],
            row: col[rowIdx].row - tilesRemoved,
          });
        } else {
          newCol.push(col[rowIdx]);
        }
      }
      return newCol;
    }
    return col;
  });
};
