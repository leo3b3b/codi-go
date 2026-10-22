import { Icon } from "@codi-go/ui";
import * as T from "./types";

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

export function parseMazeLevel(value: unknown): T.MazeLevel {
	if (
		typeof value !== "object" ||
		value === null ||
		!("id" in value) ||
		!("name" in value) ||
		!("config" in value) ||
		typeof value.id !== "number" ||
		typeof value.name !== "string"
	)
		throw new Error("Dados da fase inválidos.");

	const { id, name, config } = value;

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

export const commandIcons: Record<
	T.Command,
	React.ComponentType<{ size?: number; color?: string }>
> = {
	up: Icon.ArrowUp,
	down: Icon.ArrowDown,
	left: Icon.ArrowLeft,
	right: Icon.ArrowRight,
};

export const commands: T.Command[] = ["up", "left", "down", "right"];

export const wait = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
