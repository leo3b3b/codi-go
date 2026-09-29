export type Position = {
	x: number;
	y: number;
};

export type Command = "up" | "down" | "left" | "right";

export const tileImages = {
	floor: "/tiles/floor.png",
	left: "/tiles/left.png",
	right: "/tiles/right.png",
	wall: "/tiles/wall.png",
	"left-top": "/tiles/left-top.png",
	"right-top": "/tiles/right-top.png",
};

export type TileType = keyof typeof tileImages;

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
	direction: Command;
};
