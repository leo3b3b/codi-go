import { MazeRenderer } from "@/components";
import type { MazeLevel, MazeState } from "@/types";

const level: MazeLevel = {
	id: "level-1",
	tiles: [
		["wall", "wall", "wall", "wall", "wall"],
		["wall", "floor", "floor", "floor", "wall"],
		["wall", "floor", "wall", "floor", "wall"],
		["wall", "floor", "floor", "floor", "wall"],
		["wall", "wall", "wall", "wall", "wall"],
	],
	start: {
		x: 1,
		y: 1,
	},
	goal: {
		x: 3,
		y: 3,
	},
};

const state: MazeState = {
	level,
	playerPosition: level.start,
	commands: [],
	status: "editing",
};

export function MazeGame() {
	return (
		<MazeRenderer level={state.level} playerPosition={state.playerPosition} />
	);
}
