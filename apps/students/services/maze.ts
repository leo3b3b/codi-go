import { supabase, type Tables } from "@codi-go/supabase";
import { T } from "@/MazeGame";

type LevelRow = Omit<Tables<"levels">, "game_key">;

const isPosition = (value: unknown): value is T.Position =>
	typeof value === "object" &&
	value !== null &&
	"x" in value &&
	"y" in value &&
	typeof value.x === "number" &&
	typeof value.y === "number";

const isTileType = (value: unknown): value is T.TileType =>
	typeof value === "string" && value in T.tileImages;

const isTileRow = (value: unknown): value is T.TileType[] =>
	Array.isArray(value) && value.every(isTileType);

const isTiles = (value: unknown): value is T.TileType[][] =>
	Array.isArray(value) && value.length > 0 && value.every(isTileRow);

function parseMazeLevel(row: LevelRow): T.MazeLevel {
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
	)
		throw new Error(`Configuração de labirinto inválida: ${row.name}`);

	const tiles = config.tiles;
	const firstRowLength = tiles[0].length;

	if (!tiles.every((row) => row.length === firstRowLength))
		throw new Error(
			`O labirinto tem linhas de tamanho inconsistente: ${row.id}`,
		);

	return {
		id: row.id,
		name: row.name,
		tiles,
		start: config.start,
		goal: config.goal,
	};
}

export async function listMazeLevels(): Promise<T.MazeLevelSummary[]> {
	const { data, error } = await supabase
		.from("levels")
		.select("id, name")
		.eq("game_key", "maze")
		.order("id");

	if (error) throw error;
	return data;
}

export async function getMazeLevel(levelId: number): Promise<T.MazeLevel> {
	const { data, error } = await supabase
		.from("levels")
		.select("id, name, config")
		.eq("id", levelId)
		.eq("game_key", "maze")
		.single();

	if (error) throw error;

	return parseMazeLevel(data);
}
