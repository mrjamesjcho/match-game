'use client';

import { NUMBER_OF_COLS, NUMBER_OF_ROWS } from '@/config';
import { useEffect, useState } from 'react';
import { getRandomBackgroundColor } from '@/utils/color';
import dynamic from 'next/dynamic';
import type { Gameboard, Tile, TilePosition } from '@/types/gameboard';

const Tile = dynamic(() => import('./Tile'), { ssr: false });

export default function Gameboard() {
  const [matrix, setMatrix] = useState<Gameboard>([]);
  const [selectedTile, setSelectedTile] = useState<TilePosition | null>(null);
  const [swapTile, setSwapTile] = useState<TilePosition | null>(null);
  const [tilesToDelete, setTilesToDelete] = useState<TilePosition[]>([]);

  useEffect(() => {
    const newMatrix = Array.from(
      { length: NUMBER_OF_COLS },
      () => [] as Tile[]
    );
    newMatrix.forEach((col, idx) => {
      for (let row = 0; row < NUMBER_OF_ROWS; row++) {
        col.push({
          col: idx,
          row,
          color: getRandomBackgroundColor(idx, row, newMatrix),
          selected: false,
          highlighted: false,
          deleted: false,
        });
      }
    });
    setMatrix(newMatrix);
  }, []);

  const addOrRemoveHighlightedTilesAroundSelected = (
    selectedCol: number,
    selectedRow: number,
    newMatrix: Gameboard
  ) => {
    if (selectedCol > 0) {
      newMatrix[selectedCol - 1][selectedRow].highlighted =
        !newMatrix[selectedCol - 1][selectedRow].highlighted;
    }
    if (selectedCol < NUMBER_OF_COLS - 1) {
      newMatrix[selectedCol + 1][selectedRow].highlighted =
        !newMatrix[selectedCol + 1][selectedRow].highlighted;
    }
    if (selectedRow > 0) {
      newMatrix[selectedCol][selectedRow - 1].highlighted =
        !newMatrix[selectedCol][selectedRow - 1].highlighted;
    }
    if (selectedRow < NUMBER_OF_ROWS - 1) {
      newMatrix[selectedCol][selectedRow + 1].highlighted =
        !newMatrix[selectedCol][selectedRow + 1].highlighted;
    }
  };

  const handleTileSelect = (selectedCol: number, selectedRow: number) => {
    const newMatrix = matrix.map((col, colIdx) =>
      colIdx === selectedCol
        ? col.map((tile, rowIdx) =>
            rowIdx === selectedRow
              ? { ...tile, selected: !tile.selected }
              : tile
          )
        : col
    );
    let newSelectedTile: TilePosition | null = {
      col: selectedCol,
      row: selectedRow,
    };

    if (
      selectedTile?.col === selectedCol &&
      selectedTile?.row === selectedRow
    ) {
      // if user selected the same tile again, deselect it
      newSelectedTile = null;
    } else if (selectedTile) {
      // if user selected a different tile, deselect the previously selected tile
      addOrRemoveHighlightedTilesAroundSelected(
        selectedTile?.col,
        selectedTile?.row,
        newMatrix
      );
      newMatrix[selectedTile.col][selectedTile.row].selected = false;
    }
    addOrRemoveHighlightedTilesAroundSelected(
      selectedCol,
      selectedRow,
      newMatrix
    );
    setMatrix(newMatrix);
    setSelectedTile(newSelectedTile);
  };

  // checks if there will be 3 or more tiles connected in the same row to the selected tile
  // with the same color as the selected tile if the selected tile moves to the highlighted tile's position
  const threeOrMoreMatchingTilesInSameRow = (
    highlightedCol: number,
    highlightedRow: number
  ) => {
    if (!selectedTile) return [];
    // check if there are 3 or more tiles connected in the same row to the selected tile in the highlighted tile's position
    let color = matrix[selectedTile.col][selectedTile.row].color;
    let colLeft = highlightedCol - 1;
    let leftComplete = false;
    let colRight = highlightedCol + 1;
    let rightComplete = false;
    let matchedTiles1: TilePosition[] = [];
    do {
      if (
        colLeft >= 0 &&
        matrix[colLeft][highlightedRow].color === color &&
        (colLeft !== selectedTile.col || highlightedRow !== selectedTile.row)
      ) {
        matchedTiles1.push({ col: colLeft, row: highlightedRow });
        colLeft--;
      } else {
        leftComplete = true;
      }
      if (
        colRight < NUMBER_OF_COLS &&
        matrix[colRight][highlightedRow].color === color &&
        (colRight !== selectedTile.col || highlightedRow !== selectedTile.row)
      ) {
        matchedTiles1.push({ col: colRight, row: highlightedRow });
        colRight++;
      } else {
        rightComplete = true;
      }
    } while (!leftComplete || !rightComplete);

    if (matchedTiles1.length < 2) {
      matchedTiles1 = [];
    } else {
      matchedTiles1.push({ col: highlightedCol, row: highlightedRow });
    }

    // check if there are 3 or more tiles connected in the same row to the highlighted tile in the selected tile's position
    color = matrix[highlightedCol][highlightedRow].color;
    colLeft = selectedTile.col - 1;
    leftComplete = false;
    colRight = selectedTile.col + 1;
    rightComplete = false;
    let matchedTiles2: TilePosition[] = [];
    do {
      if (
        colLeft >= 0 &&
        matrix[colLeft][selectedTile.row].color === color &&
        (colLeft !== highlightedCol || highlightedRow !== selectedTile.row)
      ) {
        matchedTiles2.push({ col: colLeft, row: selectedTile.row });
        colLeft--;
      } else {
        leftComplete = true;
      }
      if (
        colRight < NUMBER_OF_COLS &&
        matrix[colRight][selectedTile.row].color === color &&
        (colRight !== highlightedCol || highlightedRow !== selectedTile.row)
      ) {
        matchedTiles2.push({ col: colRight, row: selectedTile.row });
        colRight++;
      } else {
        rightComplete = true;
      }
    } while (!leftComplete || !rightComplete);

    if (matchedTiles2.length < 2) {
      matchedTiles2 = [];
    } else {
      matchedTiles2.push({ col: selectedTile.col, row: selectedTile.row });
    }

    return [...tilesToDelete, ...matchedTiles1, ...matchedTiles2];
  };

  // checks if there will be 3 or more tiles connected in the same column to the selected tile
  // with the same color as the selected tile if the selected tile moves to the highlighted tile's position
  const threeOrMoreMatchingTilesInSameColumn = (
    highlightedCol: number,
    highlightedRow: number
  ) => {
    if (!selectedTile) return [];
    let color = matrix[selectedTile.col][selectedTile.row].color;
    let rowTop = highlightedRow - 1;
    let topComplete = false;
    let rowBottom = highlightedRow + 1;
    let bottomComplete = false;
    let matchedTiles1: TilePosition[] = [];
    do {
      if (
        rowTop >= 0 &&
        matrix[highlightedCol][rowTop].color === color &&
        (highlightedCol !== selectedTile.col || rowTop !== selectedTile.row)
      ) {
        matchedTiles1.push({ col: highlightedCol, row: rowTop });
        rowTop--;
      } else {
        topComplete = true;
      }
      if (
        rowBottom < NUMBER_OF_ROWS &&
        matrix[highlightedCol][rowBottom].color === color &&
        (highlightedCol !== selectedTile.col || rowBottom !== selectedTile.row)
      ) {
        matchedTiles1.push({ col: highlightedCol, row: rowBottom });
        rowBottom++;
      } else {
        bottomComplete = true;
      }
    } while (!topComplete || !bottomComplete);
    if (matchedTiles1.length < 2) {
      matchedTiles1 = [];
    } else {
      matchedTiles1.push({ col: highlightedCol, row: highlightedRow });
    }

    // check if there are 3 or more tiles connected in the same row to the highlighted tile in the selected tile's position
    color = matrix[highlightedCol][highlightedRow].color;
    rowTop = selectedTile.row - 1;
    topComplete = false;
    rowBottom = selectedTile.row + 1;
    bottomComplete = false;
    let matchedTiles2 = [];
    do {
      if (
        rowTop >= 0 &&
        matrix[selectedTile.col][rowTop].color === color &&
        (selectedTile.col !== highlightedCol || rowTop !== highlightedRow)
      ) {
        matchedTiles2.push({ col: selectedTile.col, row: rowTop });
        rowTop--;
      } else {
        topComplete = true;
      }
      if (
        rowBottom < NUMBER_OF_ROWS &&
        matrix[selectedTile.col][rowBottom].color === color &&
        (selectedTile.col !== highlightedCol || rowBottom !== highlightedRow)
      ) {
        matchedTiles2.push({ col: selectedTile.col, row: rowBottom });
        rowBottom++;
      } else {
        bottomComplete = true;
      }
    } while (!topComplete || !bottomComplete);
    if (matchedTiles2.length < 2) {
      matchedTiles2 = [];
    } else {
      matchedTiles2.push({ col: selectedTile.col, row: selectedTile.row });
    }

    return [...tilesToDelete, ...matchedTiles1, ...matchedTiles2];
  };

  const threeOrMoreMatchingTilesInSameColumnOrRow = (
    highlightedCol: number,
    highlightedRow: number
  ) => {
    const matchingTilesInSameColumn = threeOrMoreMatchingTilesInSameColumn(
      highlightedCol,
      highlightedRow
    );
    const matchingTilesInSameRow = threeOrMoreMatchingTilesInSameRow(
      highlightedCol,
      highlightedRow
    );
    setTilesToDelete([...matchingTilesInSameColumn, ...matchingTilesInSameRow]);
    return matchingTilesInSameRow.length || matchingTilesInSameColumn.length;
  };

  useEffect(() => {
    if (tilesToDelete.length && swapTile && selectedTile) {
      const newMatrix = matrix.map((col, colIdx) => {
        let newCol;
        // swap the selected tile with the highlighted tile
        if (colIdx === swapTile.col) {
          newCol = col.map((tile, rowIdx) =>
            rowIdx === swapTile.row
              ? {
                  ...tile,
                  color: matrix[selectedTile.col][selectedTile.row].color,
                  selected: false,
                }
              : tile
          );
        }
        if (colIdx === selectedTile.col) {
          newCol = (newCol ?? col).map((tile, rowIdx) => {
            if (rowIdx === selectedTile.row) {
              return {
                ...tile,
                color: matrix[swapTile.col][swapTile.row].color,
                selected: false,
              };
            } else if (rowIdx === selectedTile.row + 1) {
              return {
                ...tile,
                highlighted: false,
              };
            } else if (rowIdx === selectedTile.row - 1) {
              return {
                ...tile,
                highlighted: false,
              };
            }
            return tile;
          });
        }
        // update the tiles to be deleted
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
        // remove the highlighted tiles
        if (colIdx === selectedTile.col + 1) {
          newCol = (newCol ?? col).map((tile, rowIdx) =>
            rowIdx === selectedTile.row ? { ...tile, highlighted: false } : tile
          );
        }
        if (colIdx === selectedTile.col - 1) {
          newCol = (newCol ?? col).map((tile, rowIdx) =>
            rowIdx === selectedTile.row ? { ...tile, highlighted: false } : tile
          );
        }
        return newCol || col;
      });
      setSelectedTile(null);
      setSwapTile(null);
      setTilesToDelete([]);
      setMatrix(newMatrix);
      console.log('newMatrix', newMatrix);
    }
  }, [tilesToDelete, swapTile, selectedTile, matrix]);

  const handleHighlightedTileSelect = (
    highlightedCol: number,
    highlightedRow: number
  ) => {
    if (
      threeOrMoreMatchingTilesInSameColumnOrRow(highlightedCol, highlightedRow)
    ) {
      console.log('three or more highlighted tiles in the same row or column');
      setSwapTile({ col: highlightedCol, row: highlightedRow });
    } else {
      console.log(
        'No three or more highlighted tiles in the same row or column'
      );
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="border p-2 flex items-center justify-center grid grid-cols-8 gap-2 min-w-[394px] min-h-[394px]">
        {matrix?.map((col: Tile[], idx: number) => (
          <div key={`col-${idx}`} className="flex flex-col-reverse gap-2">
            {col.map((cell, row) => (
              <Tile
                key={`${col}-${row}`}
                col={idx}
                row={row}
                color={cell.color}
                selected={cell.selected}
                highlighted={cell.highlighted}
                onSelect={handleTileSelect}
                onHighlightedSelect={handleHighlightedTileSelect}
                deleted={cell.deleted}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
