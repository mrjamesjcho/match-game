'use client';

import { NUMBER_OF_COLS, NUMBER_OF_ROWS } from '@/config';
import type { Gameboard, Tile, TilePosition } from '@/types/gameboard';
import {
  getRandomBackgroundColor,
  getRandomBackgroundColorWithoutMatches,
} from '@/utils/color';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Tile = dynamic(() => import('./Tile'), { ssr: false });

export default function Gameboard() {
  const [matrix, setMatrix] = useState<Gameboard>([]);
  const [selectedTile, setSelectedTile] = useState<TilePosition | null>(null);
  const [preventClicks, setPreventClicks] = useState(false);
  const [tilesToDelete, setTilesToDelete] = useState<TilePosition[]>([]);
  const [newTilesAdded, setNewTilesAdded] = useState(false);
  const [scaleDeletedTiles, setScaleDeletedTiles] = useState(false);
  const [collapseDeletedTiles, setCollapseDeletedTiles] = useState(false);

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
          color: getRandomBackgroundColorWithoutMatches(idx, row, newMatrix),
          selected: false,
          highlighted: false,
          deleted: false,
        });
      }
    });
    setMatrix(newMatrix);
  }, []);

  const toggleSelectedAndHighlightedTiles = (
    selectedCol: number,
    selectedRow: number,
    gameboard: Gameboard
  ) => {
    const updatedNewMatrix = gameboard.map((col, colIdx) => {
      let newCol;
      // restore selected and highlighted tiles in the same column of the selected tile
      if (colIdx === selectedCol) {
        newCol = col.map((tile, rowIdx) => {
          if (rowIdx === selectedRow) {
            return { ...tile, selected: !tile.selected };
          }
          if (rowIdx === selectedRow + 1) {
            return { ...tile, highlighted: !tile.highlighted };
          }
          if (rowIdx === selectedRow - 1) {
            return { ...tile, highlighted: !tile.highlighted };
          }
          return tile;
        });
      }

      // restore highlighted tiles in the same row as the selected tile
      if (colIdx === selectedCol - 1) {
        newCol = (newCol ?? col).map((tile, rowIdx) =>
          rowIdx === selectedRow
            ? { ...tile, highlighted: !tile.highlighted }
            : tile
        );
      }
      if (colIdx === selectedCol + 1) {
        newCol = (newCol ?? col).map((tile, rowIdx) =>
          rowIdx === selectedRow
            ? { ...tile, highlighted: !tile.highlighted }
            : tile
        );
      }
      return newCol ?? col;
    });
    return updatedNewMatrix;
  };

  // if the user selects a tile, mark the selected tile as selected and highlight the tiles around the selected tile
  // if a previously selected tile exists, deselect the previously selected tile and restore highlighted tiles
  // if the user selects the same tile, deselect the selected tile and restore highlighted tiles
  const handleTileSelect = (newSelectedCol: number, newSelectedRow: number) => {
    let newGameboard;

    // deselect the previously selected tile and restore highlighted tiles
    // this also handles the case where the user selects the same previously selected tile
    if (selectedTile) {
      newGameboard = toggleSelectedAndHighlightedTiles(
        selectedTile.col,
        selectedTile.row,
        matrix
      );
    }

    // mark the new selected tile as selected and highlight the tiles around the selected tile
    // if the user did not select the same tile
    if (
      selectedTile?.col !== newSelectedCol &&
      selectedTile?.row !== newSelectedRow
    ) {
      newGameboard = toggleSelectedAndHighlightedTiles(
        newSelectedCol,
        newSelectedRow,
        newGameboard ?? matrix
      );
    }
    setMatrix(newGameboard!);

    // update the selected tile with the new selected tile
    const newSelectedTile: TilePosition | null = {
      col: newSelectedCol,
      row: newSelectedRow,
    };
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

  const tilesWithThreeOrMoreMatchingTilesInSameColumnOrRow = (
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
    return [...matchingTilesInSameColumn, ...matchingTilesInSameRow];
  };

  const swapSelectedTileWithHighlightedTile = (
    highlightedCol: number,
    highlightedRow: number
  ) => {
    if (!selectedTile) return;
    const newMatrix = matrix.map((col, colIdx) => {
      let newCol; // column with updated tiles

      // update the highlighted tile with the color of the selected tile
      // and remove the highlighted attribute
      if (colIdx === highlightedCol) {
        newCol = col.map((tile, rowIdx) =>
          rowIdx === highlightedRow
            ? {
                ...tile,
                color: matrix[selectedTile.col][selectedTile.row].color,
                highlighted: false,
              }
            : tile
        );
      }

      if (colIdx === selectedTile.col) {
        newCol = (newCol ?? col).map((tile, rowIdx) => {
          // update the selected tile with the color of the highlighted tile
          if (rowIdx === selectedTile.row) {
            return {
              ...tile,
              color: matrix[highlightedCol][highlightedRow].color,
              selected: false,
            };
          }

          // restore highlighted tiles in the same column of the selected tile
          if (rowIdx === selectedTile.row + 1) {
            return {
              ...tile,
              highlighted: false,
            };
          }
          if (rowIdx === selectedTile.row - 1) {
            return {
              ...tile,
              highlighted: false,
            };
          }
          return tile;
        });
      }

      // restore highlighted tiles in the same row as the selected tile
      if (colIdx === selectedTile.col - 1) {
        newCol = (newCol ?? col).map((tile, rowIdx) =>
          rowIdx === selectedTile.row ? { ...tile, highlighted: false } : tile
        );
      }
      if (colIdx === selectedTile.col + 1) {
        newCol = (newCol ?? col).map((tile, rowIdx) =>
          rowIdx === selectedTile.row ? { ...tile, highlighted: false } : tile
        );
      }
      return newCol ?? col;
    });
    setMatrix(newMatrix);
  };

  const handleHighlightedTileSelect = async (
    highlightedCol: number,
    highlightedRow: number
  ) => {
    // check if there are 3 or more matching tiles in the same row or column
    // if the selected tile moves to the highlighted tile's position
    // if there are, swap the selected tile with the highlighted tile
    setPreventClicks(true);
    const tilesToDelete = tilesWithThreeOrMoreMatchingTilesInSameColumnOrRow(
      highlightedCol,
      highlightedRow
    );
    if (tilesToDelete.length) {
      console.log('three or more matching tiles in the same row or column');
      swapSelectedTileWithHighlightedTile(highlightedCol, highlightedRow);
      setSelectedTile(null);
      setTilesToDelete(tilesToDelete);
    } else {
      console.log(
        'No three or more highlighted tiles in the same row or column'
      );
      setPreventClicks(false);
    }
  };

  // update the gameboard by marking the tiles to be deleted
  // and adding new tiles to the columns with deleted tiles
  useEffect(() => {
    if (tilesToDelete.length) {
      // mark tiles to be deleted
      let newMatrix = matrix.map((col, colIdx) => {
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

      // add new tiles to the columns with deleted tiles
      newMatrix = newMatrix.map((col, colIdx) => {
        if (col.find((tile) => tile.deleted)) {
          let tilesRemoved = 0;
          const newCol = [];
          for (
            let rowIdx = 0;
            rowIdx < NUMBER_OF_ROWS + tilesRemoved;
            rowIdx++
          ) {
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
      setTilesToDelete([]);
      setMatrix(newMatrix);
      setNewTilesAdded(true);
    }
  }, [matrix, tilesToDelete]);

  // transition the deleted tiles to scale to 0
  useEffect(() => {
    if (newTilesAdded) {
      setNewTilesAdded(false);
      setScaleDeletedTiles(true);
    }
  }, [newTilesAdded]);

  // transition the deleted tiles to collapse
  useEffect(() => {
    if (scaleDeletedTiles) {
      setTimeout(() => {
        setScaleDeletedTiles(false);
        setCollapseDeletedTiles(true);
      }, 1000);
    }
  }, [scaleDeletedTiles]);

  // remove the deleted tiles from the gameboard
  useEffect(() => {
    if (collapseDeletedTiles) {
      setTimeout(() => {
        setCollapseDeletedTiles(false);
        const newMatrix = matrix.map((col) =>
          col.filter((tile) => !tile.deleted)
        );
        setMatrix(newMatrix);
        setPreventClicks(false);
      }, 1000);
    }
  }, [collapseDeletedTiles, matrix]);

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div className="border p-1 grid grid-cols-8 min-w-[394px] min-h-[394px]">
        {matrix?.map((col: Tile[], idx: number) => (
          <div
            key={`col-${idx}`}
            className="flex flex-col-reverse max-h-[384.4px] overflow-hidden"
          >
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
                deletedScale={scaleDeletedTiles}
                deletedCollapse={collapseDeletedTiles}
                preventClicks={preventClicks}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
