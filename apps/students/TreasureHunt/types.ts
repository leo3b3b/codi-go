import type {
	Feedback,
	GridDirection,
	GridPosition,
	GridTiles,
	ObjectType,
} from "@/Games";

export type TreasureHuntPlace = GridPosition & {
	object: ObjectType;
};

export type TreasureHuntLevel = {
	id: number;
	name: string;
	instructions: string;
	tiles: GridTiles;
	start: GridPosition;
	places: TreasureHuntPlace[];
};

export type TreasureHuntStatus = "playing" | "success" | "failure";

export type TreasureHuntState = {
	playerPosition: GridPosition;
	direction: GridDirection;
	nextPlaceIndex: number;
	status: TreasureHuntStatus;
	feedback: Feedback;
	feedbackMessage: string;
	moves: number;
};
