export type Position = {
	x: number;
	y: number;
};

export type Command = "up" | "down" | "left" | "right";

export type TileType = "floor" | "wall";

export type MazeLevel = {
	id: number;
	name: string;
	tiles: TileType[][];
	start: Position;
	goal: Position;
	maxCommands?: number;
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
};
