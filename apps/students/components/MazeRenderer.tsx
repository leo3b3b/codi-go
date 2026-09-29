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
			className="block h-full w-full object-contain"
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
		<div
			className={[
				"absolute aspect-square w-[var(--tile-size)]",
				animate && "transition-[left,top] duration-300 ease-in-out",
			]
				.filter(Boolean)
				.join(" ")}
			style={{
				left: `calc(${position.x} * var(--tile-size))`,
				top: `calc(${position.y} * var(--tile-size))`,
			}}
		>
			{children}
		</div>
	);
}

export function MazeRenderer({
	level,
	playerPosition,
	direction,
	moving,
}: MazeRendererProps) {
	return (
		<div
			className="relative"
			style={
				{
					"--tile-size": "64px",
				} as React.CSSProperties
			}
		>
			<div
				className="grid"
				style={{
					gridTemplateColumns: `repeat(${level.tiles[0].length}, var(--tile-size))`,
				}}
			>
				{level.tiles.flatMap((row, y) =>
					row.map((tile, x) => <Tile key={`${x}-${y}`} type={tile} />),
				)}
			</div>

			<div className="absolute inset-0">
				<Entity animate={false} position={level.goal}>
					<Goal />
				</Entity>

				<Entity animate={moving} position={playerPosition}>
					<Codi direction={direction} moving={moving} />
				</Entity>
			</div>
		</div>
	);
}
