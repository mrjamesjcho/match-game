'use client';

import type { Gameboard, Tile, TileCoordinates } from '@/types/gameboard';
import { Theme } from '@/utils/color';
import {
  additionalMovesPossible,
  addNewTiles,
  calculatePoints,
  createGameboard,
  findAdditionalTilesToDelete,
  markTilesForDeletion,
  swapTiles,
  tilesWithThreeOrMoreMatchingTilesInSameColumnOrRowIfSelectedAndHightlightedSwap,
  toggleSelectedAndHighlightedTiles,
} from '@/utils/gameboard';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import Gameover from './Gameover';

const Tile = dynamic(() => import('./Tile'), { ssr: false });

interface GameboardProps {
  menuOpen: boolean;
  theme: Theme;
  onScoreUpdate: React.Dispatch<React.SetStateAction<number>>;
  onHighScoreUpdate: () => void;
}

export default function Gameboard({
  menuOpen,
  theme,
  onHighScoreUpdate,
  onScoreUpdate,
}: GameboardProps) {
  const [matrix, setMatrix] = useState<Gameboard>(createGameboard(theme));
  const [selectedTile, setSelectedTile] = useState<TileCoordinates | null>(
    null
  );
  const [preventClicks, setPreventClicks] = useState(false);
  const [tilesToDelete, setTilesToDelete] = useState<TileCoordinates[]>([]);
  const [tilesMarkedForDeletion, setTilesMarkedForDeletion] = useState(false);
  const [newTilesAdded, setNewTilesAdded] = useState(false);
  const [collapseDeletedTiles, setCollapseDeletedTiles] = useState(false);
  const [checkForAdditionalMatches, setCheckForAdditionalMatches] =
    useState(false);
  const [checkForAdditionalMoves, setCheckForAdditionalMoves] = useState(false);
  const [gameover, setGameover] = useState(false);

  // if the user selects a tile, mark the selected tile as selected and highlight the tiles around the selected tile
  // if the user selects the same tile, deselect the selected tile and restore highlighted tiles
  const handleTileSelect = (newSelectedCol: number, newSelectedRow: number) => {
    const newMatrix = toggleSelectedAndHighlightedTiles(
      matrix,
      { col: newSelectedCol, row: newSelectedRow },
      selectedTile ? false : true
    );
    if (selectedTile) {
      setSelectedTile(null);
    } else {
      setSelectedTile({ col: newSelectedCol, row: newSelectedRow });
    }
    setMatrix(newMatrix);
  };

  const handleHighlightedTileSelect = async (
    highlightedCol: number,
    highlightedRow: number
  ) => {
    if (!selectedTile) return;
    // check if there are 3 or more matching tiles in the same row or column if the selected tile moves to the highlighted tile's position
    // if there are, swap the selected tile with the highlighted tile
    setPreventClicks(true);
    const tilesToDelete =
      tilesWithThreeOrMoreMatchingTilesInSameColumnOrRowIfSelectedAndHightlightedSwap(
        matrix,
        selectedTile,
        { col: highlightedCol, row: highlightedRow }
      );
    if (tilesToDelete.length) {
      console.log('three or more matching tiles in the same row or column');
      const newMatrix = swapTiles(matrix, selectedTile, {
        col: highlightedCol,
        row: highlightedRow,
      });
      setMatrix(newMatrix);
      setSelectedTile(null);
      setTilesToDelete(tilesToDelete);
    } else {
      console.log(
        'No three or more highlighted tiles in the same row or column'
      );
      setPreventClicks(false);
    }
  };

  const handleResetGame = () => {
    setMatrix(createGameboard(theme));
    onScoreUpdate(0);
    setGameover(false);
    setPreventClicks(false);
  };

  // update the gameboard by marking the tiles to be deleted
  useEffect(() => {
    if (tilesToDelete.length) {
      setMatrix((prevMatrix) =>
        markTilesForDeletion(prevMatrix, tilesToDelete)
      );
      setTimeout(() => {
        onScoreUpdate(
          (prevScore) => prevScore + calculatePoints(matrix, tilesToDelete)
        );
      }, 1500);
      setTilesToDelete([]);
      setTilesMarkedForDeletion(true);
    }
  }, [matrix, onScoreUpdate, tilesToDelete]);

  // add new tiles to the columns with deleted tiles
  useEffect(() => {
    if (tilesMarkedForDeletion) {
      setTimeout(() => {
        setMatrix((prevMatrix) => addNewTiles(prevMatrix, theme));
        setTilesMarkedForDeletion(false);
        setNewTilesAdded(true);
      }, 1000);
    }
  }, [matrix, tilesMarkedForDeletion, theme]);

  // transition the deleted tiles to collapse
  useEffect(() => {
    if (newTilesAdded) {
      setNewTilesAdded(false);
      setCollapseDeletedTiles(true);
    }
  }, [matrix, newTilesAdded]);

  // remove the deleted tiles from the gameboard
  useEffect(() => {
    if (collapseDeletedTiles) {
      setTimeout(() => {
        setCollapseDeletedTiles(false);
        setCheckForAdditionalMatches(true);
        const newMatrix = matrix.map((col) =>
          col.filter((tile) => !tile.deleted)
        );
        setMatrix(newMatrix);
      }, 1000);
    }
  }, [collapseDeletedTiles, matrix]);

  // check for additional matches after the deleted tiles are removed
  useEffect(() => {
    if (checkForAdditionalMatches) {
      const additionalTilesToDelete = findAdditionalTilesToDelete(matrix);
      if (additionalTilesToDelete.length) {
        setTilesToDelete(additionalTilesToDelete);
      } else {
        setCheckForAdditionalMoves(true);
      }
      setCheckForAdditionalMatches(false);
    }
  }, [checkForAdditionalMatches, matrix]);

  // check for additional moves after no more tiles can be deleted
  useEffect(() => {
    if (checkForAdditionalMoves) {
      if (additionalMovesPossible(matrix)) {
        setPreventClicks(false);
      } else {
        console.log('No more moves possible');
        onHighScoreUpdate();
        setGameover(true);
      }
      setCheckForAdditionalMoves(false);
    }
  }, [checkForAdditionalMoves, matrix, onHighScoreUpdate]);

  const getClassName = () => {
    return menuOpen || gameover
      ? 'border p-1 grid grid-cols-8 min-w-[394px] min-h-[394px] brightness-[15%]'
      : 'border p-1 grid grid-cols-8 min-w-[394px] min-h-[394px]';
  };

  return (
    <>
      <div className={getClassName()}>
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
                deletedCollapse={collapseDeletedTiles}
                preventClicks={preventClicks}
                theme={theme}
              />
            ))}
          </div>
        ))}
      </div>
      {gameover && !menuOpen && <Gameover onPlayAgainClick={handleResetGame} />}
    </>
  );
}
