import { canMoveOnGrid, getNextGridPosition, moveOnGrid } from "@/Games";
import type { Command, MazeLevel, Position } from "./types";

export const getNextPosition = getNextGridPosition;

export const canMove = (
	level: MazeLevel,
	position: Position,
	command: Command,
) => canMoveOnGrid(level.tiles, position, command);

export const executeCommand = (
	level: MazeLevel,
	position: Position,
	command: Command,
) => moveOnGrid(level.tiles, position, command);

export const isGoalReached = (level: MazeLevel, position: Position): boolean =>
	position.x === level.goal.x && position.y === level.goal.y;
