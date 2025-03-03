import { useNavigate } from 'react-router';
import { proxy } from 'valtio';

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

export const headerState = proxy<HeaderState>({
  tiles: [],
  selectedTile: null,
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

export const removeTile = (tileId: string) => {
  headerState.tiles = headerState.tiles.filter((t) => t.id !== tileId);
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
