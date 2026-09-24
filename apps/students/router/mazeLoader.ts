import type { LoaderFunctionArgs } from "react-router";
import { getMazeLevel } from "@/services";

export async function mazeLoader({ params }: LoaderFunctionArgs) {
	const levelId = Number(params.levelId);

	return getMazeLevel(levelId);
}
