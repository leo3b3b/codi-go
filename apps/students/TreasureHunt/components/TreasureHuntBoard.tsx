import { UI } from "@codi-go/ui";
import { Codi, GridEntity, GridMap, objectImages } from "@/Games";
import type { GridPosition } from "@/Games";
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
							position: "relative",
							boxSizing: "border-box",
							width: "100%",
							height: "100%",
							padding: 3,
							border: `2px solid ${index < nextPlaceIndex ? "var(--mantine-color-green-6)" : index === nextPlaceIndex ? "var(--mantine-color-violet-6)" : "transparent"}`,
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
						<span
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								minWidth: 16,
								height: 16,
								padding: "0 3px",
								borderRadius: 5,
								background:
									index < nextPlaceIndex
										? "var(--mantine-color-green-6)"
										: "var(--mantine-color-violet-6)",
								color: "white",
								fontSize: 10,
								fontWeight: 700,
								lineHeight: "16px",
								textAlign: "center",
							}}
						>
							{index + 1}
						</span>
					</div>
				</GridEntity>
			))}

			<GridEntity position={playerPosition} animate={moving}>
				<Codi direction={direction} moving={moving} />
			</GridEntity>
		</GridMap>
	</UI.Center>
);
