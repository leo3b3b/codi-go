import type { LevelData } from "@/services";
import { type ObjectType, objectImages } from "@/Games";

export type KitLevel = {
	id: number;
	name: string;
	instruction: string;
	correctItems: ObjectType[];
	alternatives: ObjectType[];
};

const isObjectType = (value: unknown): value is ObjectType =>
	typeof value === "string" && Object.hasOwn(objectImages, value);

const isObjectTypeArray = (value: unknown): value is ObjectType[] =>
	Array.isArray(value) && value.every(isObjectType);

export function parseKitLevel({ id, name, config }: LevelData): KitLevel {
	if (
		typeof config !== "object" ||
		config === null ||
		Array.isArray(config) ||
		!("instruction" in config) ||
		typeof config.instruction !== "string" ||
		!config.instruction.trim() ||
		!("correctItems" in config) ||
		!isObjectTypeArray(config.correctItems) ||
		config.correctItems.length === 0 ||
		!("alternatives" in config) ||
		!isObjectTypeArray(config.alternatives) ||
		config.alternatives.length === 0
	)
		throw new Error(`Configuração do conjunto inválida: ${name}`);

	const { instruction, correctItems, alternatives } = config;

	if (
		new Set(correctItems).size !== correctItems.length ||
		new Set(alternatives).size !== alternatives.length ||
		alternatives.some((item) => correctItems.includes(item))
	)
		throw new Error(`Os itens da conjunto são inválidos: ${name}`);

	return { id, name, instruction, correctItems, alternatives };
}

export function shuffleObjects(objects: ObjectType[]): ObjectType[] {
	const shuffled = [...objects];

	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	return shuffled;
}
