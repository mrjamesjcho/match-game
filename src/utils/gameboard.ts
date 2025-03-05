import { Gameboard, Tile, TileCoordinates } from '@/types/gameboard';
import {
  getRandomBackgroundColor,
  getRandomBackgroundColorWithoutMatches,
  Theme,
  TileThemeColorNumber,
} from './color';

const NUMBER_OF_COLS = 8;
const NUMBER_OF_ROWS = 8;

// initialize gameboard with random colors
// no three or more matching tiles in the same row or column
export const createGameboard = (theme: Theme) => {
  const newGameboard = Array.from(
    { length: NUMBER_OF_COLS },
    () => [] as Tile[]
  );
  newGameboard.forEach((col, idx) => {
    for (let row = 0; row < NUMBER_OF_ROWS; row++) {
      col.push({
        col: idx,
        row,
        color: getRandomBackgroundColorWithoutMatches(
          idx,
          row,
          newGameboard,
          theme
        ),
        selected: false,
        highlighted: false,
        deleted: false,
      });
    }
  });
  return newGameboard;
};

// set or restore selected and highlighted tiles
export const toggleSelectedAndHighlightedTiles = (
  gameboard: Gameboard,
  selectedTile: TileCoordinates,
  toggleValue: boolean
) => {
  const updatedNewMatrix = gameboard.map((col, colIdx) => {
    let newCol;
    if (colIdx === selectedTile.col) {
      newCol = col.map((tile, rowIdx) => {
        if (rowIdx === selectedTile.row) {
          return { ...tile, selected: toggleValue };
        }
        if (rowIdx === selectedTile.row + 1) {
          return { ...tile, highlighted: toggleValue, selected: false };
        }
        if (rowIdx === selectedTile.row - 1) {
          return { ...tile, highlighted: toggleValue, selected: false };
        }
        return { ...tile, highlighted: false, selected: false };
      });
    } else if (colIdx === selectedTile.col - 1) {
      newCol = col.map((tile, rowIdx) =>
        rowIdx === selectedTile.row
          ? { ...tile, highlighted: toggleValue, selected: false }
          : { ...tile, highlighted: false, selected: false }
      );
    } else if (colIdx === selectedTile.col + 1) {
      newCol = col.map((tile, rowIdx) =>
        rowIdx === selectedTile.row
          ? { ...tile, highlighted: toggleValue, selected: false }
          : { ...tile, highlighted: false, selected: false }
      );
    } else {
      newCol = col.map((tile) => ({
        ...tile,
        highlighted: false,
        selected: false,
      }));
    }
    return newCol ?? col;
  });
  return updatedNewMatrix;
};

export const threeOrMoreMatchingTilesInSameRow = (
  gameboard: Gameboard,
  tile: TileCoordinates,
  color?: TileThemeColorNumber,
  boundryColumn?: number
): TileCoordinates[] => {
  const matchingTiles: TileCoordinates[] = [];
  const colorToMatch = color ?? gameboard[tile.col][tile.row].color;

  // check to the left of col
  let currentCol = tile.col - 1;
  while (
    currentCol >= 0 &&
    gameboard[currentCol][tile.row].color === colorToMatch &&
    (!boundryColumn || currentCol !== boundryColumn)
  ) {
    matchingTiles.push({ col: currentCol, row: tile.row });
    currentCol--;
  }

  // check to the right of col
  currentCol = tile.col + 1;
  while (
    currentCol < NUMBER_OF_COLS &&
    gameboard[currentCol][tile.row].color === colorToMatch &&
    (!boundryColumn || currentCol !== boundryColumn)
  ) {
    matchingTiles.push({ col: currentCol, row: tile.row });
    currentCol++;
  }

  return matchingTiles.length >= 2
    ? matchingTiles.concat({ col: tile.col, row: tile.row })
    : [];
};

export const threeOrMoreMatchingTilesInSameColumn = (
  gameboard: Gameboard,
  tile: TileCoordinates,
  color?: TileThemeColorNumber,
  boundryRow?: number
): TileCoordinates[] => {
  const matchingTiles: TileCoordinates[] = [];
  const colorToMatch = color ?? gameboard[tile.col][tile.row].color;

  // check below row
  let currentRow = tile.row - 1;
  while (
    currentRow >= 0 &&
    gameboard[tile.col][currentRow].color === colorToMatch &&
    (!boundryRow || currentRow !== boundryRow)
  ) {
    matchingTiles.push({ col: tile.col, row: currentRow });
    currentRow--;
  }

  // check above row
  currentRow = tile.row + 1;
  while (
    currentRow < NUMBER_OF_ROWS &&
    gameboard[tile.col][currentRow].color === colorToMatch &&
    (!boundryRow || currentRow !== boundryRow)
  ) {
    matchingTiles.push({ col: tile.col, row: currentRow });
    currentRow++;
  }

  return matchingTiles.length >= 2
    ? matchingTiles.concat({ col: tile.col, row: tile.row })
    : [];
};

export const tilesWithThreeOrMoreMatchingTilesInSameColumnOrRowIfSelectedAndHightlightedSwap =
  (
    gameboard: Gameboard,
    selectedTile: TileCoordinates,
    highlightedTile: TileCoordinates
  ): TileCoordinates[] => [
    ...threeOrMoreMatchingTilesInSameColumn(
      gameboard,
      selectedTile,
      gameboard[highlightedTile.col][highlightedTile.row].color,
      highlightedTile.row
    ),
    ...threeOrMoreMatchingTilesInSameRow(
      gameboard,
      selectedTile,
      gameboard[highlightedTile.col][highlightedTile.row].color,
      highlightedTile.col
    ),
    ...threeOrMoreMatchingTilesInSameColumn(
      gameboard,
      highlightedTile,
      gameboard[selectedTile.col][selectedTile.row].color,
      selectedTile.row
    ),
    ...threeOrMoreMatchingTilesInSameRow(
      gameboard,
      highlightedTile,
      gameboard[selectedTile.col][selectedTile.row].color,
      selectedTile.col
    ),
  ];

export const swapTiles = (
  gameboard: Gameboard,
  selectedTile: TileCoordinates,
  highlightedTile: TileCoordinates
): Gameboard => {
  let newGameboard = gameboard.map((col, colIdx) =>
    col.map((tile, rowIdx) => {
      if (colIdx === selectedTile.col && rowIdx === selectedTile.row) {
        return {
          ...tile,
          color: gameboard[highlightedTile.col][highlightedTile.row].color,
        };
      }
      if (colIdx === highlightedTile.col && rowIdx === highlightedTile.row) {
        return {
          ...tile,
          color: gameboard[selectedTile.col][selectedTile.row].color,
        };
      }
      return tile;
    })
  );

  newGameboard = toggleSelectedAndHighlightedTiles(
    newGameboard,
    selectedTile,
    false
  );
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

// add new tiles to the top of the column where tiles were deleted
export const addNewTiles = (prevGameboard: Gameboard, theme: Theme) => {
  return prevGameboard.map((col, colIdx) => {
    // if a column has tiles marked for deletion
    // - add a new tile to the top of the column for each tile marked for deletion
    // - update the row of each tile not marked for deletion to reflect the tiles that will be removed
    if (col.find((tile) => tile.deleted)) {
      let tilesRemoved = 0;
      const colorsInNewColumn: string[] = [];
      const newCol = [];
      for (let rowIdx = 0; rowIdx < NUMBER_OF_ROWS + tilesRemoved; rowIdx++) {
        if (rowIdx >= NUMBER_OF_ROWS) {
          // when setting the color of a new tile
          // make sure it doesn't match the color of the previous two tiles
          let newColor;
          do {
            newColor = getRandomBackgroundColor(theme);
          } while (
            newColor === colorsInNewColumn[colorsInNewColumn.length - 1] &&
            newColor === colorsInNewColumn[colorsInNewColumn.length - 2]
          );
          newCol.push({
            col: colIdx,
            row: rowIdx - tilesRemoved,
            color: newColor,
            selected: false,
            highlighted: false,
            deleted: false,
          });
          colorsInNewColumn.push(newColor);
          continue;
        }
        if (col[rowIdx].deleted) {
          newCol.push(col[rowIdx]);
          tilesRemoved++;
        } else if (!col[rowIdx].deleted && tilesRemoved) {
          // update rows of tiles not marked to be deleted
          // to reflect the tiles that will be removed
          newCol.push({
            ...col[rowIdx],
            row: col[rowIdx].row - tilesRemoved,
          });
          colorsInNewColumn.push(col[rowIdx].color);
        } else {
          newCol.push(col[rowIdx]);
          colorsInNewColumn.push(col[rowIdx].color);
        }
      }
      return newCol;
    }
    return col;
  });
};

export const findAdditionalTilesToDelete = (
  gameboard: Gameboard
): TileCoordinates[] => {
  // check every tile on the gameboard for matching tiles in the same row or column
  // TODO: optimize based on previously deleted tiles
  const tilesToDelete: TileCoordinates[] = [];
  gameboard.forEach((col, colIdx) => {
    col.forEach((_tile, rowIdx) => {
      const matchingTilesInRow = threeOrMoreMatchingTilesInSameRow(gameboard, {
        col: colIdx,
        row: rowIdx,
      });
      const matchingTilesInColumn = threeOrMoreMatchingTilesInSameColumn(
        gameboard,
        { col: colIdx, row: rowIdx }
      );
      if (matchingTilesInRow.length) {
        tilesToDelete.push(...matchingTilesInRow);
      }
      if (matchingTilesInColumn.length) {
        tilesToDelete.push(...matchingTilesInColumn);
      }
    });
  });

  // remove duplicates and return
  const tilesToDeleteSet = new Set(
    tilesToDelete.map((tile) => `${tile.col},${tile.row}`)
  );
  return Array.from(tilesToDeleteSet).map((tile) => {
    const [col, row] = tile.split(',').map(Number);
    return { col, row };
  });
};
