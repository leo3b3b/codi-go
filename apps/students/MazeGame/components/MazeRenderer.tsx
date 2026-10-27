import { UI } from "@codi-go/ui";
import { Codi, GridEntity, GridMap } from "@/Games";
import type { Command, MazeLevel, Position } from "../types";

interface MazeRendererProps {
	level: MazeLevel;
	playerPosition: Position;
	direction: Command;
	moving: boolean;
}

const Goal = () => (
	<img
		src="/tiles/goal.png"
		alt=""
		draggable={false}
		style={{
			display: "block",
			width: "100%",
			height: "100%",
			objectFit: "contain",
		}}
	/>
);

export const MazeRenderer = ({
	level,
	playerPosition,
	direction,
	moving,
}: MazeRendererProps) => (
	<GridMap tiles={level.tiles}>
		<GridEntity position={level.goal} animate={false}>
			<Goal />
		</GridEntity>

		<GridEntity position={playerPosition} animate={moving}>
			<Codi direction={direction} moving={moving} />
		</GridEntity>
	</GridMap>
);

export const MazeBoard = ({
	level,
	playerPosition,
	direction,
	moving,
}: MazeRendererProps) => (
	<UI.Center w="100%" h={{ base: "auto", lg: "100%" }} style={{ minHeight: 0 }}>
		<MazeRenderer
			level={level}
			playerPosition={playerPosition}
			direction={direction}
			moving={moving}
		/>
	</UI.Center>
);
