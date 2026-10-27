import { UI } from "@codi-go/ui";
import type { GridPosition } from "@/Games";
import { Codi, GridEntity, GridMap, objectImages } from "@/Games";
import type { TreasureHuntLevel } from "../types";

type TreasureHuntBoardProps = {
	level: TreasureHuntLevel;
	playerPosition: GridPosition;
	direction: "up" | "down" | "left" | "right";
	moving: boolean;
	nextPlaceIndex: number;
};

export const TreasureHuntBoard = ({
	level,
	playerPosition,
	direction,
	moving,
	nextPlaceIndex,
}: TreasureHuntBoardProps) => (
	<UI.Center w="100%" h={{ base: "auto", lg: "100%" }} style={{ minHeight: 0 }}>
		<GridMap
			tiles={level.tiles}
			tileSize={`min(64px, calc((100vw - 88px) / ${level.tiles[0].length}))`}
		>
			{level.places.map((place, index) => (
				<GridEntity
					key={`${place.x}-${place.y}`}
					position={place}
					animate={false}
				>
					<div
						style={{
							boxSizing: "border-box",
							width: "100%",
							height: "100%",
							padding: 3,
							border: `2px solid ${
								index < nextPlaceIndex
									? "var(--mantine-color-green-6)"
									: index === nextPlaceIndex
										? "var(--mantine-color-violet-6)"
										: "transparent"
							}`,
							borderRadius: 8,
							background: "rgba(255, 255, 255, 0.72)",
						}}
					>
						<img
							src={objectImages[place.object].src}
							alt={objectImages[place.object].label}
							draggable={false}
							style={{
								width: "100%",
								height: "100%",
								objectFit: "contain",
								opacity: index < nextPlaceIndex ? 0.65 : 1,
							}}
						/>
					</div>
				</GridEntity>
			))}

			<GridEntity position={playerPosition} animate={moving}>
				<Codi direction={direction} moving={moving} />
			</GridEntity>
		</GridMap>
	</UI.Center>
);
