import type { BoxLevel, ObjectType } from "./types";
import { objectImages } from "./types";

const isObjectType = (value: unknown): value is ObjectType =>
	typeof value === "string" && Object.hasOwn(objectImages, value);

const isObjectTypeArray = (value: unknown): value is ObjectType[] =>
	Array.isArray(value) && value.every(isObjectType);

export function parseBoxLevel(value: unknown): BoxLevel {
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
		!("boxObjects" in config) ||
		!("correctObject" in config) ||
		!("alternatives" in config) ||
		!("explanation" in config) ||
		!isObjectTypeArray(config.boxObjects) ||
		!isObjectType(config.correctObject) ||
		!isObjectTypeArray(config.alternatives) ||
		config.alternatives.includes(config.correctObject) ||
		typeof config.explanation !== "string"
	)
		throw new Error(`Configuração da caixa inválida: ${name}`);

	const { boxObjects, correctObject, alternatives, explanation } = config;

	return {
		id,
		name,
		boxObjects,
		correctObject,
		alternatives,
		explanation,
	};
}
