import type { GridDirection, GridPosition, GridTileType } from "@/Games";
import { gridTileImages } from "@/Games";

export type Position = GridPosition;
export type Command = GridDirection;
export type TileType = GridTileType;

export const tileImages = gridTileImages;

export type MazeLevel = {
	id: number;
	name: string;
	tiles: TileType[][];
	start: Position;
	goal: Position;
};

export type MazeLevelSummary = {
	id: number;
	name: string;
};

export type MazeState = {
	playerPosition: Position;
	level: MazeLevel;
	commands: Command[];
	status: "editing" | "running" | "success" | "failure";
	direction: Command;
};
