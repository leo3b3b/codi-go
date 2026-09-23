import type { MazeLevel, Position, TileType } from "@/types";

type MazeRendererProps = {
	level: MazeLevel;
	playerPosition: Position;
};

const tileClassNames: Record<TileType, string> = {
	floor: "bg-border",
	wall: "bg-gray-700",
};

function Tile({ type }: { type: TileType }) {
	return (
		<div
			className={tileClassNames[type]}
			style={{
				width: "var(--tile-size)",
				height: "var(--tile-size)",
			}}
		/>
	);
}

function Codi() {
	return (
		<div className="absolute inset-2 rounded-full bg-primary">
			{/* temporário; depois entra o asset do Codi */}
		</div>
	);
}

function Goal() {
	return (
		<div className="absolute inset-3 rounded-full bg-green-500">
			{/* temporário; depois entra o asset do objetivo */}
		</div>
	);
}

function Entity({
	position,
	children,
}: {
	position: Position;
	children: React.ReactNode;
}) {
	return (
		<div
			className="absolute aspect-square w-[var(--tile-size)]"
			style={{
				left: `calc(${position.x} * var(--tile-size))`,
				top: `calc(${position.y} * var(--tile-size))`,
			}}
		>
			{children}
		</div>
	);
}

export function MazeRenderer({ level, playerPosition }: MazeRendererProps) {
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
				{level.tiles
					.flatMap((row, y) =>
						row.map((tile, x) => ({
							id: `${x}:${y}`,
							tile,
						})),
					)
					.map(({ id, tile }) => (
						<Tile key={id} type={tile} />
					))}
			</div>

			<div className="absolute inset-0">
				<Entity position={level.goal}>
					<Goal />
				</Entity>

				<Entity position={playerPosition}>
					<Codi />
				</Entity>
			</div>
		</div>
	);
}
