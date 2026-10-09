import { UI } from "@codi-go/ui";
import { Codi } from "@/components";
import type { Command, MazeLevel, Position, TileType } from "@/types";
import { tileImages } from "@/types";

type MazeRendererProps = {
	level: MazeLevel;
	playerPosition: Position;
	direction: Command;
	moving: boolean;
};

function Tile({ type }: { type: TileType }) {
	return (
		<img
			src={tileImages[type]}
			alt=""
			style={{
				width: "var(--tile-size)",
				height: "var(--tile-size)",
			}}
		/>
	);
}

function Goal() {
	return (
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
}

function Entity({
	position,
	animate = true,
	children,
}: {
	position: Position;
	animate: boolean;
	children: React.ReactNode;
}) {
	return (
		<UI.Box
			pos="absolute"
			style={{
				aspectRatio: "1",
				width: "var(--tile-size)",
				left: `calc(${position.x} * var(--tile-size))`,
				top: `calc(${position.y} * var(--tile-size))`,
				...(animate && {
					transition: "left 300ms ease-in-out, top 300ms ease-in-out",
				}),
			}}
		>
			{children}
		</UI.Box>
	);
}

export function MazeRenderer({
	level,
	playerPosition,
	direction,
	moving,
}: MazeRendererProps) {
	return (
		<UI.Box
			pos="relative"
			style={{
				"--tile-size": "64px",
			}}
		>
			<UI.Box
				display="grid"
				style={{
					gridTemplateColumns: `repeat(${level.tiles[0].length}, var(--tile-size))`,
				}}
			>
				{level.tiles.flatMap((row, y) =>
					row.map((tile, x) => <Tile key={`${x}-${y}`} type={tile} />),
				)}
			</UI.Box>

			<UI.Box pos="absolute" inset={0}>
				<Entity animate={false} position={level.goal}>
					<Goal />
				</Entity>

				<Entity animate={moving} position={playerPosition}>
					<Codi direction={direction} moving={moving} />
				</Entity>
			</UI.Box>
		</UI.Box>
	);
}
