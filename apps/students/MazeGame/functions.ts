import type { LevelData } from "@/services";
import type { MazeLevel, Position, TileType } from "./types";
import { tileImages } from "./types";

const isPosition = (value: unknown): value is Position =>
	typeof value === "object" &&
	value !== null &&
	"x" in value &&
	"y" in value &&
	typeof value.x === "number" &&
	typeof value.y === "number";

const isTileType = (value: unknown): value is TileType =>
	typeof value === "string" && value in tileImages;

const isTileRow = (value: unknown): value is TileType[] =>
	Array.isArray(value) && value.every(isTileType);

const isTiles = (value: unknown): value is TileType[][] =>
	Array.isArray(value) && value.length > 0 && value.every(isTileRow);

export function parseMazeLevel({ id, name, config }: LevelData): MazeLevel {
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
		throw new Error(`Configuração de labirinto inválida: ${name}`);

	const { tiles, start, goal } = config;
	const firstRowLength = tiles[0].length;

	if (!tiles.every((row) => row.length === firstRowLength))
		throw new Error(`O labirinto tem linhas de tamanho inconsistente: ${id}`);

	return { id, name, tiles, start, goal };
}

export const wait = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
