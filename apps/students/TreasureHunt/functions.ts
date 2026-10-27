import type { LevelData } from "@/services";
import {
	isGridPosition,
	isGridTiles,
	objectImages,
	type GridPosition,
	type GridTiles,
	type ObjectType,
} from "@/Games";
import type { TreasureHuntLevel, TreasureHuntPlace } from "./types";

const isObjectType = (value: unknown): value is ObjectType =>
	typeof value === "string" && Object.hasOwn(objectImages, value);

const isTreasureHuntPlace = (value: unknown): value is TreasureHuntPlace =>
	typeof value === "object" &&
	value !== null &&
	!Array.isArray(value) &&
	isGridPosition(value) &&
	"object" in value &&
	isObjectType(value.object);

const isTreasureHuntPlaceArray = (value: unknown): value is TreasureHuntPlace[] =>
	Array.isArray(value) && value.length > 0 && value.every(isTreasureHuntPlace);

const isWalkablePosition = (position: GridPosition, tiles: GridTiles) =>
	Number.isInteger(position.x) &&
	Number.isInteger(position.y) &&
	position.x >= 0 &&
	position.y >= 0 &&
	position.y < tiles.length &&
	position.x < tiles[position.y].length &&
	tiles[position.y][position.x] === "floor";

export function parseTreasureHuntLevel({
	id,
	name,
	config,
}: LevelData): TreasureHuntLevel {
	if (
		typeof config !== "object" ||
		config === null ||
		Array.isArray(config) ||
		!("instructions" in config) ||
		typeof config.instructions !== "string" ||
		!config.instructions.trim() ||
		!("tiles" in config) ||
		!isGridTiles(config.tiles) ||
		!("start" in config) ||
		!isGridPosition(config.start) ||
		!("places" in config) ||
		!isTreasureHuntPlaceArray(config.places)
	)
		throw new Error(`Configuração da Caça ao Tesouro inválida: ${name}`);

	const { instructions, tiles, start, places } = config;

	if (!isWalkablePosition(start, tiles))
		throw new Error(`Posição inicial inválida na fase: ${name}`);

	if (
		places.some((place) => !isWalkablePosition(place, tiles)) ||
		new Set(places.map(({ x, y }) => `${x},${y}`)).size !== places.length ||
		places.some(({ x, y }) => x === start.x && y === start.y)
	)
		throw new Error(`Os pontos da Caça ao Tesouro são inválidos: ${name}`);

	return { id, name, instructions, tiles, start, places };
}
