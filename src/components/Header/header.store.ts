import { useNavigate } from 'react-router';
import { proxy, subscribe } from 'valtio';

import { StorageKeys } from '@/lib/storage';
import { storage } from '@/lib/storage';

export enum TileType {
  NOTE = 'note',
  CANVAS = 'canvas',
  JOURNAL = 'journal',
}

export interface HeaderTile {
  title: string;
  icon?: React.ReactNode;
  id: string;
  type: TileType;
}

interface HeaderState {
  tiles: HeaderTile[];
  selectedTile: HeaderTile | null;
}

export const headerState = proxy<HeaderState>(
  storage.get(StorageKeys.headerState) || {
    tiles: [],
    selectedTile: null,
  },
);

subscribe(headerState, () => {
  storage.set(StorageKeys.headerState, headerState);
});

export const addTile = (tile: HeaderTile) => {
  const existingTile = headerState.tiles.find((t) => t.id === tile.id);

  if (existingTile) {
    headerState.selectedTile = existingTile;
  } else {
    headerState.tiles.push(tile);
    headerState.selectedTile = tile;
  }
};

export const useRemoveTile = () => {
  const navigate = useNavigate();

  const handleRemoveTile = (tileId: string) => {
    headerState.tiles = headerState.tiles.filter((t) => t.id !== tileId);

    if (headerState.tiles.length === 0) {
      navigate('/notes');
    }
  };
  return handleRemoveTile;
};

export const useSelectTile = () => {
  const navigate = useNavigate();

  const handleSelectTile = (tileId: string) => {
    const tile = headerState.tiles.find((t) => t.id === tileId);
    if (tile) {
      headerState.selectedTile = tile;
      navigate(tile.type === TileType.NOTE ? `/notes/${tile.id}` : `/${tile.type}`);
    }
  };
  return handleSelectTile;
};

export const updateTile = (tile: Partial<HeaderTile>) => {
  const updatedTile = {
    ...headerState.selectedTile,
    ...tile,
  };

  if (updatedTile.id) {
    const tileIndex = headerState.tiles.findIndex((t) => t.id === updatedTile.id);
    if (tileIndex !== -1) {
      headerState.tiles[tileIndex] = updatedTile as HeaderTile;
    }
  }
};
