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
  const threeOrMoreHighlightedTilesInSameRow = (
    highlightedCol: number,
    highlightedRow: number
  ) => {
    if (!selectedTile) return false;
    // check if there are 3 or more tiles connected in the same row to the selected tile in the highlighted tile's position
    let color = matrix[selectedTile.col][selectedTile.row].color;
    let count = 1;
    let colLeft = highlightedCol - 1;
    let leftComplete = false;
    let colRight = highlightedCol + 1;
    let rightComplete = false;
    do {
      if (
        colLeft >= 0 &&
        matrix[colLeft][highlightedRow].color === color &&
        (colLeft !== selectedTile.col || highlightedRow !== selectedTile.row)
      ) {
        count++;
        colLeft--;
      } else {
        leftComplete = true;
      }
      if (
        colRight < NUMBER_OF_COLS &&
        matrix[colRight][highlightedRow].color === color &&
        (colRight !== selectedTile.col || highlightedRow !== selectedTile.row)
      ) {
        count++;
        colRight++;
      } else {
        rightComplete = true;
      }
    } while (!leftComplete || !rightComplete);
    if (count >= 3) return true;

    // check if there are 3 or more tiles connected in the same row to the highlighted tile in the selected tile's position
    color = matrix[highlightedCol][highlightedRow].color;
    count = 1;
    colLeft = selectedTile.col - 1;
    leftComplete = false;
    colRight = selectedTile.col + 1;
    rightComplete = false;
    do {
      if (
        colLeft >= 0 &&
        matrix[colLeft][selectedTile.row].color === color &&
        (colLeft !== highlightedCol || highlightedRow !== selectedTile.row)
      ) {
        count++;
        colLeft--;
      } else {
        leftComplete = true;
      }
      if (
        colRight < NUMBER_OF_COLS &&
        matrix[colRight][selectedTile.row].color === color &&
        (colRight !== highlightedCol || highlightedRow !== selectedTile.row)
      ) {
        count++;
        colRight++;
      } else {
        rightComplete = true;
      }
    } while (!leftComplete || !rightComplete);
    return count >= 3;
  };

  // checks if there will be 3 or more tiles connected in the same column to the selected tile
  // with the same color as the selected tile if the selected tile moves to the highlighted tile's position
  const threeOrMoreHighlightedTilesInSameColumn = (
    highlightedCol: number,
    highlightedRow: number
  ) => {
    if (!selectedTile) return false;
    console.log('matrix', matrix);
    let color = matrix[selectedTile.col][selectedTile.row].color;
    let count = 1;
    let rowTop = highlightedRow - 1;
    let topComplete = false;
    let rowBottom = highlightedRow + 1;
    let bottomComplete = false;
    do {
      if (
        rowTop >= 0 &&
        matrix[highlightedCol][rowTop].color === color &&
        (highlightedCol !== selectedTile.col || rowTop !== selectedTile.row)
      ) {
        count++;
        rowTop--;
      } else {
        topComplete = true;
      }
      if (
        rowBottom < NUMBER_OF_ROWS &&
        matrix[highlightedCol][rowBottom].color === color &&
        (highlightedCol !== selectedTile.col || rowBottom !== selectedTile.row)
      ) {
        count++;
        rowBottom++;
      } else {
        bottomComplete = true;
      }
    } while (!topComplete || !bottomComplete);
    if (count >= 3) return true;

    // check if there are 3 or more tiles connected in the same row to the highlighted tile in the selected tile's position
    color = matrix[highlightedCol][highlightedRow].color;
    count = 1;
    rowTop = selectedTile.row - 1;
    topComplete = false;
    rowBottom = selectedTile.row + 1;
    bottomComplete = false;
    do {
      console.log('rowTop', rowTop);
      if (
        rowTop >= 0 &&
        matrix[selectedTile.col][rowTop].color === color &&
        (selectedTile.col !== highlightedCol || rowTop !== highlightedRow)
      ) {
        count++;
        rowTop--;
      } else {
        topComplete = true;
      }
      console.log('count after top', count);
      console.log('rowBottom', rowBottom);
      if (
        rowBottom < NUMBER_OF_ROWS &&
        matrix[selectedTile.col][rowBottom].color === color &&
        (selectedTile.col !== highlightedCol || rowBottom !== highlightedRow)
      ) {
        count++;
        rowBottom++;
      } else {
        bottomComplete = true;
      }
      console.log('count after bottom', count);
    } while (!topComplete || !bottomComplete);
    return count >= 3;
  };

  const swapSelectedTileWithSelectedHighlightedTile = (
    highlightedCol: number,
    highlightedRow: number
  ) => {
    if (!selectedTile) return;
    const newMatrix = matrix.map((col, colIdx) =>
      colIdx === highlightedCol
        ? col.map((tile, rowIdx) =>
            rowIdx === highlightedRow
              ? {
                  ...tile,
                  color: matrix[selectedTile.col][selectedTile.row].color,
                  selected: false,
                }
              : tile
          )
        : col
    );
    newMatrix[selectedTile.col][selectedTile.row].color =
      matrix[highlightedCol][highlightedRow].color;
    newMatrix[selectedTile.col][selectedTile.row].selected = false;
    addOrRemoveHighlightedTilesAroundSelected(
      selectedTile.col,
      selectedTile.row,
      newMatrix
    );
    setMatrix(newMatrix);
    setSelectedTile(null);
  };

  const handleHighlightedTileSelect = (
    highlightedCol: number,
    highlightedRow: number
  ) => {
    console.log(
      `Highlighted tile selected: ${highlightedCol}-${highlightedRow}`
    );
    if (
      threeOrMoreHighlightedTilesInSameRow(highlightedCol, highlightedRow) ||
      threeOrMoreHighlightedTilesInSameColumn(highlightedCol, highlightedRow)
    ) {
      swapSelectedTileWithSelectedHighlightedTile(
        highlightedCol,
        highlightedRow
      );
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
          <div key={`col-${idx}`} className="grid grid-rows-8 gap-2">
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
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
