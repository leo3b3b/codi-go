import type { GridPosition, GridTiles, GridTileType } from "./types";
import { gridTileImages } from "./types";

export const isGridPosition = (value: unknown): value is GridPosition =>
	typeof value === "object" &&
	value !== null &&
	"x" in value &&
	"y" in value &&
	typeof value.x === "number" &&
	typeof value.y === "number";

export const isGridTileType = (value: unknown): value is GridTileType =>
	typeof value === "string" && Object.hasOwn(gridTileImages, value);

const isGridTileRow = (value: unknown): value is GridTileType[] =>
	Array.isArray(value) && value.length > 0 && value.every(isGridTileType);

export const isGridTiles = (value: unknown): value is GridTiles => {
	if (!Array.isArray(value) || value.length === 0) return false;
	if (!value.every(isGridTileRow)) return false;

	const rows = value as GridTileType[][];

	return rows.every((row) => row.length === rows[0].length);
};
