import type { Json } from "@codi-go/supabase";

interface MazeLevelConfig {
	minCommands?: number;
}

interface MazeProgressMetadata {
	number_of_commands?: number;
}

export interface MazeProgressRecord {
	id: number;
	levelId: number;
	levelName: string;
	gameName: string;
	result: "success" | "failure";
	registerTime: string;
	numberOfCommands: number | null;
	minCommands: number | null;
	commandDifference: number | null;
}

function isRecord(value: Json): value is Record<string, Json> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getNumber(value: Json | undefined): number | null {
	return typeof value === "number" ? value : null;
}

export function parseMazeProgress(record: {
	id: number;
	level_id: number;
	result: "success" | "failure";
	metadata: Json;
	register_time: string;
	level: {
		id: number;
		name: string;
		game_key: string;
		config: Json;
		game: {
			name: string;
		};
	};
}): MazeProgressRecord | null {
	if (record.level.game_key !== "maze") {
		return null;
	}

	const metadata: MazeProgressMetadata = isRecord(record.metadata)
		? {
				number_of_commands: getNumber(record.metadata.number_of_commands),
			}
		: {};

	const config: MazeLevelConfig = isRecord(record.level.config)
		? {
				minCommands: getNumber(record.level.config.minCommands) ?? undefined,
			}
		: {};

	const numberOfCommands = metadata.number_of_commands ?? null;
	const minCommands = config.minCommands ?? null;

	return {
		id: record.id,
		levelId: record.level_id,
		levelName: record.level.name,
		gameName: record.level.game?.name ?? record.level.game_key,
		result: record.result,
		registerTime: record.register_time,
		numberOfCommands,
		minCommands,
		commandDifference:
			numberOfCommands !== null && minCommands !== null
				? numberOfCommands - minCommands
				: null,
	};
}
