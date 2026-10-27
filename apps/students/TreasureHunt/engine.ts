import type { GridPosition } from "@/Games";
import type { TreasureHuntPlace } from "./types";

export const getPlaceIndexAtPosition = (
	places: TreasureHuntPlace[],
	position: GridPosition,
): number =>
	places.findIndex(
		(place) => place.x === position.x && place.y === position.y,
	);
