import type { Command, MazeLevel, Position } from "@/types";

export function getNextPosition(
	position: Position,
	command: Command,
): Position {
	switch (command) {
		case "up":
			return { x: position.x, y: position.y - 1 };
		case "down":
			return { x: position.x, y: position.y + 1 };
		case "left":
			return { x: position.x - 1, y: position.y };
		case "right":
			return { x: position.x + 1, y: position.y };
	}
}

export function canMove(
	level: MazeLevel,
	position: Position,
	command: Command,
): boolean {
	const next = getNextPosition(position, command);

	if (
		next.y < 0 ||
		next.y >= level.tiles.length ||
		next.x < 0 ||
		next.x >= level.tiles[next.y].length
	) {
		return false;
	}

	return level.tiles[next.y][next.x] !== "wall";
}

export function executeCommand(
	level: MazeLevel,
	position: Position,
	command: Command,
): Position | null {
	if (!canMove(level, position, command)) {
		return null;
	}

	return getNextPosition(position, command);
}

export function isGoalReached(level: MazeLevel, position: Position): boolean {
	return position.x === level.goal.x && position.y === level.goal.y;
}
