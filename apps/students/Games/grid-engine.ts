import type { GridDirection, GridPosition, GridTiles } from "./types";

export const getNextGridPosition = (
	position: GridPosition,
	direction: GridDirection,
): GridPosition => {
	switch (direction) {
		case "up":
			return { x: position.x, y: position.y - 1 };
		case "down":
			return { x: position.x, y: position.y + 1 };
		case "left":
			return { x: position.x - 1, y: position.y };
		case "right":
			return { x: position.x + 1, y: position.y };
	}
};

export const canMoveOnGrid = (
	tiles: GridTiles,
	position: GridPosition,
	direction: GridDirection,
): boolean => {
	const next = getNextGridPosition(position, direction);

	if (
		next.y < 0 ||
		next.y >= tiles.length ||
		next.x < 0 ||
		next.x >= tiles[next.y].length
	)
		return false;

	return tiles[next.y][next.x] === "floor";
};

export const moveOnGrid = (
	tiles: GridTiles,
	position: GridPosition,
	direction: GridDirection,
): GridPosition | null =>
	canMoveOnGrid(tiles, position, direction)
		? getNextGridPosition(position, direction)
		: null;
