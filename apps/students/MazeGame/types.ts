export type Position = {
	x: number;
	y: number;
};

export type Command = "up" | "down" | "left" | "right";

export const tileImages = {
	floor: "/tiles/floor.png",
	left: "/tiles/left.png",
	right: "/tiles/right.png",
	top: "/tiles/wall.png",
	bottom: "/tiles/wall.png",
	wall: "/tiles/wall.png",
	"top-left": "/tiles/left.png",
	"top-right": "/tiles/right.png",
	"bottom-left": "/tiles/bottom-left.png",
	"bottom-right": "/tiles/bottom-right.png",
	roof: "/tiles/roof.png",
};

export type TileType = keyof typeof tileImages;

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
