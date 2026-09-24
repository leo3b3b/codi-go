import { supabase, type Tables } from "@codi-go/supabase";
import type { MazeLevel, MazeLevelSummary, Position, TileType } from "@/types";

type LevelRow = Omit<Tables<"levels">, "game_key">;

function isPosition(value: unknown): value is Position {
	return (
		typeof value === "object" &&
		value !== null &&
		"x" in value &&
		"y" in value &&
		typeof value.x === "number" &&
		typeof value.y === "number"
	);
}

function isTileType(value: unknown): value is TileType {
	return value === "floor" || value === "wall";
}

function isTileRow(value: unknown): value is TileType[] {
	return Array.isArray(value) && value.every(isTileType);
}

function isTiles(value: unknown): value is TileType[][] {
	return Array.isArray(value) && value.length > 0 && value.every(isTileRow);
}

function parseMazeLevel(row: LevelRow): MazeLevel {
	const config = row.config;

	if (
		typeof config !== "object" ||
		config === null ||
		!("tiles" in config) ||
		!("start" in config) ||
		!("goal" in config) ||
		!isPosition(config.start) ||
		!isPosition(config.goal) ||
		!isTiles(config.tiles)
	) {
		throw new Error(`Invalid maze level configuration: ${row.id}`);
	}

	const tiles = config.tiles;
	const firstRowLength = tiles[0].length;

	if (!tiles.every((row) => row.length === firstRowLength)) {
		throw new Error(`Maze level has inconsistent row sizes: ${row.id}`);
	}

	return {
		id: row.id,
		name: row.name,
		tiles,
		start: config.start,
		goal: config.goal,
		...(typeof config.maxCommands === "number"
			? { maxCommands: config.maxCommands }
			: {}),
	};
}

export async function listMazeLevels(): Promise<MazeLevelSummary[]> {
	const { data, error } = await supabase
		.from("levels")
		.select("id, name")
		.eq("game_key", "maze")
		.order("id");

	if (error) {
		throw error;
	}

	return data;
}

export async function getMazeLevel(levelId: number): Promise<MazeLevel> {
	const { data, error } = await supabase
		.from("levels")
		.select("id, name, config")
		.eq("id", levelId)
		.eq("game_key", "maze")
		.single();

	if (error) {
		throw error;
	}

	return parseMazeLevel(data);
}
